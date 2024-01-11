// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open, rename } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { formatDate } from '@/utils/formatDate'
import { getDeviceRepository, getEventRepository } from '@/data-source'
import { DevicesController } from '@/controllers/devices'
import { EventType } from '@/models/app_event'
import { device_status } from '@/models/device'


const base_path = process.env.LOGS_DIR_PATH

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let log_file: FileHandle | undefined = undefined
  try {
    if (req.method !== 'POST') {
      res.status(400).send('Invalid method')
    }
    const event_repo = await getEventRepository()
    const device_repo = await getDeviceRepository()

    const { mac, pass_number, test_number } = req.headers;
    let log_path = path.join(String(base_path), `${mac}.log`)

    const device = await DevicesController.findOrCreate({
      device_id: String(mac)
    }, {
      log_path,
      device_id: String(mac)
    })

    const event = event_repo.create({
      device,
      type: EventType.LOG,
      description: req.body
    })

    device.events_number++;

    if (pass_number && test_number && test_number === pass_number)
      device.status = device_status.REDY
    else
      device.status = device_status.BROKEN

    log_file = await open(log_path, 'a+')

    device_repo.save(device)
    event_repo.save(event)

    for (let line of String(req.body).split('\n')) {
      await log_file?.write(`${formatDate(new Date())}: ${line}\n`)
    }

    log_file?.close()
    res.status(200).send(formatDate(new Date()))
  } catch (error) {
    const { message } = error as Error
    // console.log(error)
    res.status(500).send(message)
  } finally {
    log_file?.close()
  }
}
