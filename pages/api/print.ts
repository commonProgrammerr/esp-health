// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { printEti1015 } from '@/utils/print'
import { existsSync, readFileSync, statSync, createReadStream } from 'node:fs';
import path from 'path'

const base_path = process.env.LOGS_DIR_PATH as string


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | Error>
) {
  try {
    const url = new URL(`localhost:3000${req.url}`)

    const id = url.searchParams.get("id")
    const filePath = path.resolve(base_path, `${id}.pdf`)

    if (!existsSync(filePath))
      await printEti1015(id!)

    const stat = statSync(filePath)
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size
    });

    const readStream = createReadStream(filePath);

    readStream.pipe(res)

  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}

