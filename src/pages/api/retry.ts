import { getDeviceRepository } from '@/data-source'
import { Device } from '@/models';
import type { IDevicesRequest } from '@/@types';
import { DeviceStatus, status_texts } from '@/utils/enums';
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios';
import path from 'node:path';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const { id } = req.body as any

    const repo = await getDeviceRepository()
    const device = await repo.findOneByOrFail({ id: String(id) })

    if (device.status === DeviceStatus.NOT_REGISTERED) {
      await axios.post(path.join(process.env.TRIAL_API_URL, 'device-trial/hardware'),
        {
          token: process.env.TRIAL_API_TOKEN,
          serialCode: id,
        }
      )
      device.status = device.ticket_downloads ? DeviceStatus.PRINTED : DeviceStatus.REDY

      await repo.save(device)
    } else {
      res.status(400).send('')
      return
    }

    res.status(200).send('')
  } catch (error) {
    if (error instanceof AxiosError) {
      const {
        data,
        headers,
        status,
        statusText
      } = error.response
      console.error({
        data,
        headers,
        status,
        statusText
      })
    } else
      console.error(error)
    res.status(500).json(error as Error)
  }


}
