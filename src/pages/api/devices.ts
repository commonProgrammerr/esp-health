import { getDeviceRepository } from '@/data-source'
import { Device } from '@/models';
import type { IDevicesRequest } from '@/@types';
import { DeviceStatus, status_texts } from '@/utils/enums';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Device[] | Error>
) {
  try {

    const {
      page_number,
      page_size,
      filter
    } = req.body as IDevicesRequest

    const repo = await getDeviceRepository()

    const devices = await repo.find({
      cache: {
        id: JSON.stringify(req.body),
        milliseconds: 600000
      },
      // select: {
      //   id: true,
      //   updated_at: true,
      //   status: true
      // },
      where: (filter?.status === undefined || filter?.status === ' ') ? ([
        { status: DeviceStatus.BROKEN },
        { status: DeviceStatus.NEW },
        { status: DeviceStatus.REDY },
        { status: DeviceStatus.NOT_REGISTERED },
      ]) : filter.status === 'all' ? undefined : ({
        status: Number(filter.status),
      }),
      order: {
        updated_at: 'DESC'
      }
    })

    res.status(200).json(devices)
  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}
