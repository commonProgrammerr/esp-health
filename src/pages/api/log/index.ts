// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open } from 'node:fs/promises'
import path from 'node:path'
import { formatDate } from '@/utils/formatDate'
import { getDataSource } from '@/data-source'
// import { DevicesController } from '@/controllers/devices'
import { AppEvent, EventType } from '@/models/app_event'
import { Device } from '@/models'
import { DeviceStatus } from '@/utils/enums'
import { websocket, sendLog, websocket_server, roons, getRonns, websocket_handle } from '@/services/websocket'

import { Server } from 'socket.io'

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

      const event_repo = manager.getRepository(AppEvent)
      const device_repo = manager.getRepository(Device)

      const device = await device_repo.findOneBy({ id, log_path }) || device_repo.create({ id, log_path, events_number: 0 })

      const event = event_repo.create({
        device,
        type: EventType.LOG,
        description: req.body
      })

      if (event.description) {
        // console.log('new event', getRonns())
        websocket_handle.emit(id, event.description)
      }

      device.events_number++;

      if (pass_number && test_number && test_number === pass_number)
        device.status = DeviceStatus.REDY
      else
        device.status = DeviceStatus.BROKEN

      log_file = await open(log_path, 'a+')

      await device_repo.save(device)
      await event_repo.save(event)

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
