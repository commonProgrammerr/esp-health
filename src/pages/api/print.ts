// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { printEti1015 } from '@/services/print'
import { existsSync, createReadStream, createWriteStream, lstatSync, rmSync } from 'node:fs';
import path from 'path'
import { getDataSource } from '@/data-source';
import { Device } from '@/models';
import { DeviceStatus, EventType } from '@/utils/enums';
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

      // const event_repo = manager.getRepository('events')
      const device_repo = manager.getRepository(Device)
      const device = await device_repo.findOneOrFail({
        where: { id }, relations: {
          events: true
        }
      })

      if (
        device.status !== DeviceStatus.REDY &&
        device.status !== DeviceStatus.PRINTED)
        throw new InvalidDeviceStatus()

      // const event = event_repo.create({ device, type: EventType.PRINT })

      device.ticket_path = ticket_path;
      device.ticket_downloads++;
      device.status = DeviceStatus.PRINTED;

      const result = await manager.createQueryBuilder()
        .insert().into('events').values({
          type: EventType.PRINT,
        }).execute()

      device.events.push({
        id: result.identifiers[0].id
      } as any)

      await device.save()

      if (has_cached_file) {
        createReadStream(ticket_path).pipe(res);
      } else {
        await printEti1015(id!, async doc => {
          doc.pipe(createWriteStream(ticket_path))
          doc.pipe(res)
        })

        if (existsSync(ticket_path) && lstatSync(ticket_path).size < 20 * 1024) {
          rmSync(ticket_path)
        }
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
  message: string;
  constructor() {
    super("Invalid Device status");
    this.message = "Invalid Device status"
  }
}