// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { IDevicesRequest, IDevicesResponse } from '@/types';
import { StatusTypes } from '@/utils/enums';
import type { NextApiRequest, NextApiResponse } from 'next'
import { existsSync, lstatSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'path';

const base_path = process.env.LOGS_DIR_PATH as string
const pdf_base_path = process.env.PRINTS_DIR_PATH as string


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IDevicesResponse | Error>
) {
  try {

    const {
      page_number,
      page_size,
      filter
    } = req.body as IDevicesRequest

    const devices = (await readdir(base_path)).map(file => {

      const log_path = path.join(base_path, file)
      const stat = lstatSync(log_path);
      const isPass = file.endsWith('.pass')
      if (filter?.pass_only && !isPass)
        return false

      const mac = file
        .replace('.log', '')
        .replace('.pass', '')
      const pdf_path = path.join(pdf_base_path, mac + '.pdf')

      const status = isPass ? existsSync(pdf_path) ? StatusTypes.PRINTED : StatusTypes.OK : StatusTypes.FAIL

      if ((filter?.nstatus && status === filter.status) || (filter?.status && filter?.status !== status))
        return false

      return {
        mac,
        date: stat.mtime,
        status
      }


    }).filter(Boolean) as any;

    res.status(200).json({
      devices,
      date: (new Date().toISOString())
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}
