// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { printEti1015 } from '@/utils/print'
import { existsSync, statSync, createReadStream, rmSync } from 'node:fs';
import path from 'path'
import { fromPath } from 'pdf2pic';

const base_path = process.env.PRINTS_DIR_PATH as string


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | Error>
) {
  try {
    const url = new URL(`localhost:3000${req.url}`)

    const id = url.searchParams.get("id")
    const size = url.searchParams.get("size")
    const filePath = path.resolve(base_path, `${id}.pdf`)
    const savePath = path.join(base_path, id + '.jpeg')
    if (!existsSync(filePath))
      await printEti1015(id!, size ? {
        fontSize: Number(size)
      } : undefined)

    const image = await fromPath(filePath, {
      savePath
    }).bulk(1, { responseType: 'image' });

    const stat = statSync(savePath)


    console.log(image)
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': stat.size
    });

    const readStream = createReadStream(savePath);

    readStream.pipe(res)

  } catch (error) {
    console.error(error)
    res.status(500).json(error as Error)
  }


}



