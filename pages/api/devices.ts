// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { lstat, readdir } from 'node:fs/promises';
import path from 'path';

const base_path = process.env.LOGS_DIR_PATH as string

interface Device {
  mac: string
  chipID?: string
  date?: Date
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
      page_size
    } = req.headers
    const _page = page ? (Number(page) - 1) : 0
    const _page_size = page_size ? Number(page_size) : 10
    const files = (await readdir(base_path)).filter(file => file.endsWith('.pass'));
    const start = _page * _page_size

    for (let i = start; i < start + _page_size && i < files.length; i++) {
      const stat = lstat(files[i]);

      const [mac, chipID] = files[i]
        .replace('.log', '')
        .replace('.pass', '')
        .split('-')

      devices = [...devices, {
        mac,
        chipID,
        date: (await stat).mtime
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
