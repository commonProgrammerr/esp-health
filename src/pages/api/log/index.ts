// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open } from 'node:fs/promises'
import path from 'node:path'
import { formatDate } from '@/utils/formatDate'
import { getDataSource, getEventRepository } from '@/data-source'
import { Server } from 'socket.io'
// import { DevicesController } from '@/controllers/devices'
import { Device } from '@/models'
import { DeviceStatus, EventType } from '@/utils/enums'
import { MailerService } from '@/services/mailer'
import axios, { AxiosError } from 'axios'
import { TrialAPIResponseFail, TrialAPIResponseOk } from '@/@types'
import { Console, error } from 'node:console'

const base_path = process.env.LOGS_DIR_PATH

function updateStatus(total, pass, device: Device) {

  let event_type: EventType = EventType.LOG

  if (pass === total) {
    event_type = EventType.APROVED
    device.status = DeviceStatus.REDY
  }
  else
    device.status = DeviceStatus.BROKEN

  return event_type
}

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
        where: { id, log_path }, relations: { events: true }
      }) || device_repo.create({ id, log_path, events_number: 0, events: [] })

      const result = await manager.createQueryBuilder()
        .insert().into('events').values({
          type: updateStatus(test_number, pass_number, device),
          description: req.body
        }).execute()

      device.events.push({
        id: result.identifiers[0].id
      } as any)

      device.events_number++;

      const logs = String(req.body).split('\n').map(line => `${formatDate(new Date())}: ${line}\n`)
      if (req.body) {
        for (let line of logs)
          websocket.to(id).emit('line', line)
      }

      log_file = await open(log_path, 'a+')

      await device_repo.save(device)

      for (let line of String(req.body).split('\n')) {
        await log_file?.write(`${formatDate(new Date())}: ${line}\n`)
      }

      log_file?.close()
    })

    const { data, status } = await (axios.post<TrialAPIResponseOk>(path.join(process.env.TRIAL_API_URL, `/device-trial/hardware`), {
      token: process.env.TRIAL_API_TOKEN,
      id: id
    }).then(async (res) => {

      const events_repo = await getEventRepository()
      const [events, total] = await events_repo.findAndCount({
        where: {
          type: EventType.APROVED,
          device: { id }
        }
      })

      if (total === 1) {
        console.log(`ID habilitado: ${id}`)
        MailerService.addToQueue({
          from: "naoresponda@tronst.com.br",
          to: process.env.MAIL_RECIPIES,
          subject: `ID habilitado: ${id}`, // Subject line
          text: id,
        })
      }
      return res
    })
      .catch((error: AxiosError) => {
        const {
          data,
          headers,
          config,
          status,
          statusText
        } = error.response
        console.error(`Erro de cadastro [${id}]`)
        MailerService.addToQueue({
          from: "naoresponda@tronst.com.br",
          to: process.env.MAIL_RECIPIES,
          subject: `Erro de cadastro [${id}]`, // Subject line
          text: `Falha ao cadastrar dipositivo ${id} no sistema. \n\n\n\nresposta do servidor: ${Buffer.from(JSON.stringify({
            data,
            headers,
            config,
            status,
            statusText
          })).toString('base64')}`,
        })
        return error.response
      }))


    res.status(200).send(formatDate(new Date()))
  } catch (error) {

    const { message } = error as Error
    res.status(500).send(message)

    console.log(error)
  } finally {
    log_file?.close()
  }
}
