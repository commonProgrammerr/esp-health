// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { findFile } from '@/utils/findFile';
import type { NextApiRequest, NextApiResponse } from 'next'
import { existsSync } from 'node:fs';
import { lstat, readdir } from 'node:fs/promises';
import path from 'path';

const base_path = process.env.LOGS_DIR_PATH as string
const pdf_base_path = process.env.LOGS_DIR_PATH as string

interface Device {
  mac: string
  date?: Date
  status: string
}

interface Data {
  date: string
  devices: Device[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {

    let devices: Device[] = []
    const {
      page,
      page_size,
      all
    } = req.headers
    const _page = page ? (Number(page) - 1) : 0
    const _page_size = page_size ? Number(page_size) : 10
    const files = (await readdir(base_path)).filter(file => all || file.endsWith('.pass'));
    const start = _page * _page_size

    for (let i = start; i < start + _page_size && i < files.length; i++) {
      const mac = files[i]
        .replace('.log', '')
        .replace('.pass', '')

      const log_path = path.join(base_path, files[i])
      const pdf_path = path.join(pdf_base_path, mac + '.pdf')
      const stat = lstat(log_path);


      const status = files[i].includes('.pass') ? existsSync(pdf_path) ? 'OK' : 'Impresso' : 'Defeito'

      devices = [...devices, {
        mac,
        date: (await stat).mtime,
        status
      }]

    };

    res.status(200).json({
      devices,
      date: (new Date().toISOString())
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}
