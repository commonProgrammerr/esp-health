// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { existsSync, createReadStream, statSync } from "node:fs";
import path from "node:path";

const base_path = process.env.LOGS_DIR_PATH as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const id = String(req.query.id);
    const filePath = id && path.join(base_path, id.includes('.log') ? id : id + '.log')

    if (!filePath || !existsSync(filePath)) {
      res.status(404).send('')
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/log',
      'Content-Length': statSync(filePath).size
    });

    const readStream = createReadStream(filePath);

    readStream.pipe(res);
  } catch (error) {
    const { message } = error as Error;
    res.status(500).send(message);
  }
}
