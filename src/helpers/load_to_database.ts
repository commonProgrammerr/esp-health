import { copyFile, readdir } from "fs/promises";
import { getDataSource } from "../data-source";
import { Device } from "../models";
import { DeviceStatus } from "../utils/enums";
import { existsSync, lstatSync } from "fs";
import path from "path";

const logs_folder = path.resolve(process.argv[2])
const tickets_folder = path.resolve(process.argv[3])

const logs_dest = path.resolve('cache', 'logs')
const tickets_dest = path.resolve('cache', 'pdf')

getDataSource().then(async db => {
  const sync = db.synchronize()
  const devices_list = readdir(logs_folder)
  await sync

  db.transaction(async manager => {
    const repo = manager.getRepository(Device)
    for (const file of await devices_list) {

      const id = file.replace('.log', '').replace('.pass', '')
      const lstat = lstatSync(path.join(logs_folder, file))
      console.log('inseting', file, lstat.birthtime)

      const device = repo.create({
        id,
        status: file.endsWith('.pass')
          ? existsSync(path.join(tickets_folder, `${id}.pdf`)) ? DeviceStatus.PRINTED :
            DeviceStatus.REDY
          : lstat.size
            ? DeviceStatus.NEW
            : DeviceStatus.BROKEN,

        log_path: path.join(logs_dest, `${id}.log`),
        ticket_downloads: existsSync(path.join(tickets_folder, `${id}.pdf`)) ? 1 : 0,
        ticket_path: path.join(tickets_dest, `${id}.pdf`),
        updated_at: lstat.ctime,
        created_at: dates[id] || lstat.birthtime
      })
      copyFile(path.join(logs_folder, file), device.log_path)
      if (device.ticket_downloads > 0)
        copyFile(path.join(tickets_folder, `${id}.pdf`), device.ticket_path)
      device.save()

    }
  })
})

const dates = {
  '70041DFA4B54': '2024-01-04T17:13Z',
  '70041DFA4B5E': '2024-01-15T14:20Z',
  '70041DFA4B62': '2024-01-04T17:48Z',
  '70041DFA4B64': '2024-01-04T16:44Z',
  '70041DFA4BE8': '2023-12-11T17:54Z',
  '70041DFA4C66': '2023-12-01T18:19Z',
  '70041DFA4C8E': '2023-12-13T11:05Z',
  '70041DFA4C94': '2024-01-15T11:11Z',
  '70041DFA4C9C': '2023-11-17T17:49Z',
  '70041DFA4CA4': '2023-11-17T18:14Z',
  '70041DFA4CC4': '2023-11-17T18:11Z',
  '70041DFA4CF2': '2023-12-12T17:14Z',
  '70041DFA4D1C': '2023-11-17T18:33Z',
  '70041DFA4D38': '2024-01-15T13:58Z',
  '70041DFA4D6E': '2024-01-16T12:58Z',
  '70041DFA4D9E': '2024-01-04T16:45Z',
  '70041DFA4E46': '2023-11-17T17:53Z',
  '70041DFA4EE6': '2023-11-17T18:12Z',
  '70041DFA4F10': '2024-01-04T16:02Z',
  '70041DFA4F56': '2023-11-17T18:23Z',
  '70041DFA4F86': '2023-11-22T18:36Z',
  '70041DFA5008': '2023-11-17T18:26Z',
  '70041DFA5024': '2023-11-17T18:08Z',
  '70041DFA5054': '2023-11-17T18:45Z',
  '70041DFA514C': '2024-01-16T12:56Z',
  '70041DFA517E': '2024-01-15T14:37Z',
  '70041DFA5186': '2023-12-01T19:24Z',
  '70041DFA521E': '2024-01-04T17:15Z',
  '70041DFA5248': '2023-12-14T18:13Z',
  '70041DFA524A': '2024-01-15T18:27Z',
  '70041DFA524C': '2023-12-01T18:01Z',
  '70041DFA5260': '2023-11-22T18:28Z',
  '70041DFA527E': '2023-11-17T18:52Z',
  '70041DFA529A': '2023-12-11T13:52Z',
  '70041DFA52A8': '2023-11-17T18:48Z',
  '70041DFA52E8': '2023-11-17T18:31Z',
  '70041DFA539A': '2024-01-15T14:03Z',
  '70041DFA53B0': '2024-01-15T11:14Z',
  '70041DFA53D6': '2023-11-17T18:47Z',
  '70041DFA541E': '2024-01-04T16:00Z',
  '70041DFA5450': '2023-12-13T19:54Z',
  '70041DFAA882': '2023-11-17T18:44Z',
  '70041DFAA8AA': '2024-01-04T17:49Z'
}
