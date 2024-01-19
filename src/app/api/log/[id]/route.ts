import Tail from '@logdna/tail-file'
import { Server } from 'socket.io'
import { exec } from "node:child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDeviceRepository } from '@/data-source';
import { Socket } from 'socket.io-client';
import { io } from '@/services/websocket';


let watches = {

}

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {


    const id = String(req.query.id)
    const { lines } = req.query
    const repo = await getDeviceRepository()
    const { log_path } = await repo.findOneByOrFail({ id })

    const tail = new Tail(log_path)
    await tail.start()
    tail?.on('truncated', data => console.log(data))


    io.on("connection", (socket) => {
      tail?.on('data', (data: Buffer) => {
        console.log(data.toString('utf-8'))
        socket.emit('line', data.toString('utf-8'))
      })

      // socket.on("disconnect", () => {
      //   socket.fetchSockets().then(sockets => {
      //     if (sockets.length <= 0) {
      //       tail?.quit()
      //       tail?.emit('close')
      //     }
      //   })
      // });
    });

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