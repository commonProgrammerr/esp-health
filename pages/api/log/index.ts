// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open, rename } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const base_path = process.env.LOGS_DIR_PATH

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let log_file: FileHandle | undefined = undefined
  try {
    if (req.method !== 'POST') {
      res.status(400).send('invalid method')
    }

    const { mac, pass_number, test_number } = req.headers;
    let log_path = path.join(String(base_path), `${mac}.log`)

    if (pass_number === test_number) {
      if (existsSync(log_path))
        await rename(log_path, log_path + '.pass')
      log_path = log_path + '.pass'
    }
    else if (existsSync(log_path + '.pass')) {
      await rename(log_path + '.pass', log_path)
    }
    log_file = await open(log_path, 'a+')

    for (let line of String(req.body).split('\n')) {
      await log_file?.write(`${(new Date()).toISOString()}: ${line}\n`)
    }

    log_file?.close()
    const now = new Date();
    res.status(200).send(`${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`)
  } catch (error) {
    const { message } = error as Error
    res.status(500).send(message)
  } finally {
    log_file?.close()
  }
}
