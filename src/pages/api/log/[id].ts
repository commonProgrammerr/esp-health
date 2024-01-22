import { exec } from "node:child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDeviceRepository } from '@/data-source';


export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    const id = String(req.query.id)
    const { lines } = req.query
    const repo = await getDeviceRepository()
    const { log_path } = await repo.findOneByOrFail({ id })

    res.status(200).send(await new Promise<string>((resolve, reject) => {
      exec(`tail -n ${lines || 10} ${log_path}`, (error, stdout, stderr) => {
        if (stderr)
          console.error(stderr)

        if (error)
          reject(error)

        resolve(stdout)
      })
    }))

  } catch (error) {
    const { message } = error as Error;
    res.status(500).send(message);
  }
}