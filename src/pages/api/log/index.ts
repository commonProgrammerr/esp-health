// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open } from 'node:fs/promises'
import path from 'node:path'
import { formatDate } from '@/utils/formatDate'
import { getDataSource } from '@/data-source'
import { Server } from 'socket.io'
// import { DevicesController } from '@/controllers/devices'
import { Device } from '@/models'
import { DeviceStatus, EventType } from '@/utils/enums'
import { MailerService } from '@/services/mailer'

const base_path = process.env.LOGS_DIR_PATH

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let log_file: FileHandle | undefined = undefined
  try {
    if (req.method !== 'POST') {
      return res.status(400).send('Invalid method')
    }

    const { mac, pass_number, test_number } = req.headers;
    const id = String(mac)

    let log_path = path.join(String(base_path), `${mac}.log`)


    const source = await getDataSource()
    await source.transaction(async manager => {
      const websocket = (req.socket as any).websocket as Server
      const device_repo = manager.getRepository(Device)

      const device = await device_repo.findOne({
        where: { id, log_path }, relations: {
          events: true
        }
      }) || device_repo.create({ id, log_path, events_number: 0, events: [] })

      const result = await manager.createQueryBuilder()
        .insert().into('events').values({
          type: EventType.LOG,
          description: req.body
        }).execute()

      device.events.push({
        id: result.identifiers[0].id
      } as any)

      const logs = String(req.body).split('\n').map(line => `${formatDate(new Date())}: ${line}\n`)


      if (req.body) {
        for (let line of logs)
          websocket.to(id).emit('line', line)
      }

      device.events_number++;

      if (pass_number && test_number && test_number === pass_number)
        device.status = DeviceStatus.REDY
      else
        device.status = DeviceStatus.BROKEN

      if (device.status === DeviceStatus.REDY) {
        MailerService.addToQueue({
          from: process.env.MAIL_USER,
          to: process.env.MAIL_RECIPIES,
          subject: `ID habilitado: ${device.id}`, // Subject line
          text: device.id
        })
      }

      log_file = await open(log_path, 'a+')

      await device_repo.save(device)

      for (let line of String(req.body).split('\n')) {
        await log_file?.write(`${formatDate(new Date())}: ${line}\n`)
      }

      log_file?.close()
      res.status(200).send(formatDate(new Date()))
    })
  } catch (error) {
    const { message } = error as Error
    console.log(error)
    res.status(500).send(message)
  } finally {
    log_file?.close()
  }
}
