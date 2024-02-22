// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FileHandle, open } from 'node:fs/promises'
import path from 'node:path'
import { formatDate } from '@/utils/formatDate'
import { getDataSource, getDeviceRepository, getEventRepository } from '@/data-source'
import { Server } from 'socket.io'
// import { DevicesController } from '@/controllers/devices'
import { Device } from '@/models'
import { DeviceStatus, EventType } from '@/utils/enums'
import { MailerService } from '@/services/mailer'
import axios, { AxiosError } from 'axios'
import { TrialAPIResponseFail, TrialAPIResponseOk } from '@/@types'
import { Console, error } from 'node:console'

const base_path = process.env.LOGS_DIR_PATH

function updateStatus(total, pass, device: Device) {

  let event_type: EventType = EventType.LOG

  if (pass === total) {
    event_type = EventType.APROVED
    device.status = device.ticket_downloads >= 1 ? DeviceStatus.PRINTED : DeviceStatus.REDY
  }
  else
    device.status = DeviceStatus.BROKEN

  return event_type
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let log_file: FileHandle | undefined = undefined
  try {
    if (req.method !== 'POST') {
      return res.status(400).send('Invalid method')
    }

    const { mac, pass_number, test_number } = req.headers;
    const id = String(mac)

    let log_path = path.join(String(base_path), `${mac}.log`)


    const source = await getDataSource()
    await source.transaction(async manager => {
      const websocket = (req.socket as any).websocket as Server
      const device_repo = manager.getRepository(Device)

      const device = await device_repo.findOne({
        where: { id, log_path }, relations: { events: true }
      }) || device_repo.create({ id, log_path, events_number: 0, events: [] })

      const result = await manager.createQueryBuilder()
        .insert().into('events').values({
          type: updateStatus(test_number, pass_number, device),
          description: req.body
        }).execute()

      device.events.push({
        id: result.identifiers[0].id
      } as any)

      device.events_number++;

      const logs = String(req.body).split('\n').map(line => `${formatDate(new Date())}: ${line}\n`)
      if (req.body) {
        for (let line of logs)
          websocket.to(id).emit('line', line)
      }

      log_file = await open(log_path, 'a+')

      device.status !== DeviceStatus.BROKEN && await (axios.post<TrialAPIResponseOk>(path.join(process.env.TRIAL_API_URL, `/device-trial/hardware`), {
        token: process.env.TRIAL_API_TOKEN,
        serialCode: id
      })
        .then(async (res) => {
          console.log(`ID habilitado: ${id}`)
          MailerService.addToQueue({
            from: "naoresponda@tronst.com.br",
            to: process.env.MAIL_RECIPIES,
            subject: `ID habilitado: ${id}`, // Subject line
            text: id,
          })
        })
        .catch(async (error: AxiosError) => {
          device.status = DeviceStatus.NOT_REGISTERED;
          console.error(`Erro de cadastro: ${id}`)
          return error.response
        }))

      await device_repo.save(device)

      for (let line of String(req.body).split('\n')) {
        await log_file?.write(`${formatDate(new Date())}: ${line}\n`)
      }

      log_file?.close()
    })

    res.status(200).send(formatDate(new Date()))
  } catch (error) {

    const { message } = error as Error
    res.status(500).send(message)

    console.log(error)
  } finally {
    log_file?.close()
  }
}

const jso = { "data": { "statusCode": 400, "message": ["serialCode must be a string"], "error": "Bad Request" }, "headers": { "x-powered-by": "Express", "vary": "Origin", "access-control-allow-credentials": "true", "access-control-expose-headers": "Content-Disposition", "content-type": "application/json; charset=utf-8", "etag": "W/\"52-5qFYeP9SLYmNsDtDK0kCCn9r+sw\"", "x-cloud-trace-context": "67f758f473a84e1362c9f695bde96b76;o=1", "date": "Thu, 22 Feb 2024 14:16:44 GMT", "server": "Google Frontend", "content-length": "82", "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000" }, "config": { "transitional": { "silentJSONParsing": true, "forcedJSONParsing": true, "clarifyTimeoutError": false }, "adapter": ["xhr", "http"], "transformRequest": [null], "transformResponse": [null], "timeout": 0, "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN", "maxContentLength": -1, "maxBodyLength": -1, "env": {}, "headers": { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "User-Agent": "axios/1.6.0", "Content-Length": "68", "Accept-Encoding": "gzip, compress, deflate, br" }, "method": "post", "url": "https:/dev-tronst-autolaundry-m3tnmz4beq-uc.a.run.app/v1/device-trial/hardware", "data": "{\"token\":\"f6bfb4a7-d432-4544-a85a-05b670907ad8\",\"id\":\"70041DFA4AB6\"}" }, "status": 400, "statusText": "Bad Request" }