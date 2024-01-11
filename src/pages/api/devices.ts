import { getDeviceRepository } from '@/data-source'
import { device_status } from '@/models/device';
import type { IDevicesRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
  try {

    const {
      page_number,
      page_size,
      filter
    } = req.body as IDevicesRequest
    // let source: DataSource

    // if (AppDataSource.isInitialized)
    //   source = AppDataSource
    // else
    //   source = 
    // console.log(source.isInitialized)
    // const database = 
    // console.log(database.isInitialized)

    const repo = await getDeviceRepository()

    const devices = await repo.find({
      cache: {
        id: JSON.stringify(req.body),
        milliseconds: 600000
      },
      select: {
        id: true,
        device_id: true,
        updated_at: true,
        status: true
      },
      where: filter && {
        status: filter.pass_only ? device_status.REDY : device_status[filter.status],
      },
      order: {
        updated_at: 'DESC'
      }
    })

    res.status(200).json({
      devices,
      date: (new Date().toISOString())
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}
