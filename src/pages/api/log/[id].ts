import Tail from '@logdna/tail-file'
import { Server } from 'socket.io'
import { exec } from "node:child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDeviceRepository } from '@/data-source';


let _server: any

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { server } = res.socket as any

    if (server?.io) {
      res.end();
      return;
    }

    const repo = await getDeviceRepository()
    const { log_path } = await repo.findOneByOrFail({ id: String(req.query.id) })
    _server = server
    const io = new Server(server)

    io.on("connection", (socket) => {
      const client_id = socket.id;
      console.log(`A client connected. ID: ${client_id}`);
      socket.emit("client-new", client_id);

      exec(`tail -n 10 ${log_path}`, (error, stdout, stderr) => {
        if (stderr || error)
          console.error(stderr, error)

        stdout.split('\n').forEach(line =>
          socket.emit('line', line + '\n')
        )
      })

      const tail = new Tail(log_path)

      tail.start()
        .catch(err => {
          const { message } = err as Error;
          console.error(err)
          res.status(500).send(message);
        })
        .then(() => {

          tail?.on('truncated', data => console.log(data))
          tail?.on('data', (data: Buffer) => {
            const text = data.toString('utf-8')
            console.log(text)
            socket.emit('line', text)
          })


          socket.on("disconnect", () => {
            console.log("A client disconnected.");
            tail?.quit()
            tail?.emit('close')
            if (_server) {
              delete _server.io
              _server = undefined
            }
          });
        })

    });

    server.io = io;

    res.end()
  } catch (error) {
    const { message } = error as Error;
    res.status(500).send(message);
  }
}