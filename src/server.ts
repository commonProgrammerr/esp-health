import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { AppDataSource } from './data-source'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('Iniciando database...')

AppDataSource.initialize().then(db => {
  console.log(db.options.database, 'iniciado com sucesso!')
  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true)

        await handle(req, res, parsedUrl)

      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })
      .once('error', (err) => {
        console.error(err)
        process.exit(1)
      })
      .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
      })
  })
})