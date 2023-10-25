// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { open, rename } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const base_path = process.env.LOGS_DIR_PATH

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let log_file
  try {
    if (req.method !== 'POST') {
      res.status(400).send('invalid method')
    }

    const { mac, chip_id, pass_number, test_number } = req.headers;
    const log_path = `${base_path}/${mac}-${chip_id}.log`

    log_file = await open(log_path, 'a+')
    log_file.write(req.body + '\n')

    if (pass_number === test_number) {
      log_file.close()
      await rename(log_path, log_path + '.pass')
    } else if (existsSync(log_path + '.pass')) {
      await rename(log_path + '.pass', log_path)
    }
    res.status(200).send('')
  } catch (error) {
    const { message } = error as Error
    res.status(500).send(message)
  } finally {
    log_file?.close()
  }

}
