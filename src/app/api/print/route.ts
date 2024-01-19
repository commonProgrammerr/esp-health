// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { printEti1015 } from '@/services/print'
import { existsSync, createReadStream, createWriteStream } from 'node:fs';
import path from 'path'
import { getDataSource } from '@/data-source';
import { AppEvent, Device } from '@/models';
import { EventType } from '@/models/app_event';
import { DeviceStatus } from '@/utils/enums';
import { MailerService, mailOptions } from '@/services/mailer';

const base_path = process.env.PRINTS_DIR_PATH as string


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | Error>
) {
  try {
    const url = new URL(`localhost:3000${req.url}`)

    const id = url.searchParams.get("id")
    const ticket_path = path.resolve(base_path, `${id}.pdf`)
    const has_cached_file = existsSync(ticket_path)

    const source = await getDataSource()
    await source.transaction(async manager => {

      const event_repo = manager.getRepository(AppEvent)
      const device_repo = manager.getRepository(Device)

      const device = await device_repo.findOneByOrFail({ id })

      if (device.status !== DeviceStatus.REDY)
        throw new InvalidDeviceStatus()

      const event = event_repo.create({ device, type: EventType.PRINT })

      device.ticket_path = ticket_path;
      device.ticket_downloads++;

      MailerService.addToQueue(mailOptions)

      const device_save = device_repo.save(device)
      const event_save = event_repo.save(event)

      await device_save
      await event_save

      if (has_cached_file) {
        createReadStream(ticket_path).pipe(res);
      } else {
        await printEti1015(id!, async doc => {
          doc.pipe(createWriteStream(ticket_path))
          doc.pipe(res)
        })
      }
    })

  } catch (error) {
    console.error(error)
    if (error instanceof InvalidDeviceStatus) {
      res.status(403).json({ message: (error as InvalidDeviceStatus).message } as Error)
    } else {
      res.status(500).json(error as Error)

    }
  }
}


class InvalidDeviceStatus extends Error {
  constructor() {
    super("Invalid Device status");
    this.message = "Invalid Device status"
  }
}