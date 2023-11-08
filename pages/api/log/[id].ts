import Tail from '@logdna/tail-file'
import path from "node:path";

import { Server } from 'socket.io'
import { exec } from "node:child_process";
import { findFile } from "@/utils/findFile";
import type { NextApiRequest, NextApiResponse } from "next";

const base_path = process.env.LOGS_DIR_PATH as string;

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

    const ids = await findFile(String(req.query.id), base_path)
    const [id] = ids
    const filePath = id && path.join(base_path, id)
    _server = server
    const io = new Server(server)

    console.log(req.query.id, ids, id)

    io.on("connection", (socket) => {
      const clientId = socket.id;

      console.log(`A client connected. ID: ${clientId}`);
      socket.emit("client-new", clientId);

      exec(`tail -n 10 ${filePath}`, (error, stdout, stderr) => {
        if (stderr || error)
          console.error(stderr, error)

        stdout.split('\n').forEach(line =>
          socket.emit('line', line + '\n')
        )
      })

      const tail = new Tail(filePath)

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