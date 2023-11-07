// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from "next";
import { Server } from 'socket.io'
import path from "node:path";
import Tail from '@logdna/tail-file'
import { exec } from "node:child_process";
import { findFile } from "@/utils/findFile";

const base_path = process.env.LOGS_DIR_PATH as string;

export default async function Handler(
  req: NextApiRequest,
  res: any
) {
  try {
    if (res.socket.server.io) {
      res.end();
      return;
    }
    const ids = await findFile(String(req.query.id), base_path)
    const [id] = ids
    console.log(req.query.id, ids, id)
    const filePath = id && path.join(base_path, id)

    const io = new Server(res.socket.server)
    io.on("connection", (socket) => {
      const clientId = socket.id;

      console.log(`A client connected. ID: ${clientId}`);
      io.emit("client-new", clientId);

      exec(`tail -n 10 ${filePath}`, (error, stdout, stderr) => {
        stdout.split('\n').forEach(line =>
          socket.emit('line', stdout)
        )
        // if (stderr || error)
        //   console.error(stderr, error)
      })

      const tail = new Tail(filePath)

      tail.start()
        .catch(err => {
          const { message } = err as Error;
          console.error(err)
          res.status(500).send(message);
        })
        .then(() => {
          tail.on('truncated', data => console.log(data))
          tail.on('data', (data: Buffer) => {
            const text = data.toString('utf-8')
            console.log(text)
            socket.emit('line', text)
          })

          socket.on("disconnect", () => {
            console.log("A client disconnected.");
            tail.quit()
          });
        })
    });

    res.socket.server.io = io;
    res.end();

  } catch (error) {
    const { message } = error as Error;
    res.status(500).send(message);
  }
}