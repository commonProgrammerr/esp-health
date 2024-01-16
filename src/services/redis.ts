import { ChildProcess, spawn } from "child_process";
import { createWriteStream } from "fs";
import path from "path";
// import util from 'util'



export class RedisServer {
  static process: ChildProcess

  static async startServer() {
    console.log('Iniciando redis-server...')
    const log_stream = createWriteStream(path.resolve('logs', 'redis.log'))
    return new Promise<void>((resolve, reject) => {
      this.process = spawn('/bin/redis-server')
      this.process.stdout.pipe(log_stream)
      this.process.stderr.pipe(log_stream)
      this.process.once('error', reject)
      this.process.once('spawn', resolve)
    })
  }

  static stopServer() {
    this.process.kill()
  }
}