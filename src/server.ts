import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { AppDataSource } from './data-source'
import { MailerService } from './services/mailer'
import { RedisServer } from './services/redis'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('Iniciando database...')
AppDataSource.initialize().then(async db => {
  console.log(db.options.database, 'iniciado com sucesso!')

  console.log('Sincronizando...')
  await db.synchronize()
  console.log('Done!')

  console.log('Iniciando servidor...')

  app.prepare().then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true)

        if (parsedUrl.path !== '/api/socket')
          await handle(req, res, parsedUrl)

      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })

    server.once('error', (err) => {
      console.error(err)
      process.exit(1)
    })

    server.listen(port, () => {
      RedisServer.startServer().then(() => {
        MailerService.start()
        console.log(`> Ready on http://${hostname}:${port}`)
      })
    })
  })
}).catch(error => console.error(error))