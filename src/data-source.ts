import { DataSource, EntityTarget, FileLogger, Repository } from 'typeorm'
import fs from 'fs'

import { Device, AppEvent } from './models'

import path from 'path'

const api_cache_path = path.resolve('.', 'cache')
const database = process.env.NODE_ENV === 'production' ? 'prod.sqlite' : "dev.sqlite"
const logPath = path.join('logs', 'database.log')

const LOGS_DIR_PATH = path.join(api_cache_path, 'logs')
const PRINTS_DIR_PATH = path.join(api_cache_path, 'pdf')
const DATABASE_PATH = path.join(api_cache_path, "database", database)


if (!fs.existsSync(LOGS_DIR_PATH)) {
  fs.mkdirSync(LOGS_DIR_PATH, { recursive: true })
}

if (!fs.existsSync(PRINTS_DIR_PATH)) {
  fs.mkdirSync(PRINTS_DIR_PATH)
}

if (!fs.existsSync(path.join(api_cache_path, "database"))) {
  fs.mkdirSync(path.join(api_cache_path, "database"))
}

if (!fs.existsSync(DATABASE_PATH)) {
  fs.writeFileSync(DATABASE_PATH, "")
}

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: DATABASE_PATH,
  // entities: [path.join(__dirname, 'models/*.{j, t}s')],
  entities: [
    // User,
    AppEvent,
    Device
  ],
  // synchronize: true,
  logging: true,
  logger: new FileLogger(true, { logPath })
})

export async function getDataSource(source: DataSource = AppDataSource) {
  if (source.isInitialized)
    return Promise.resolve(source)
  else
    return source.initialize()
}

async function loadRepo<T>(target: EntityTarget<T>) {
  const source = await getDataSource()
  return source.getRepository(target)

}

export const getDeviceRepository = async () => loadRepo(Device)
export const getEventRepository = async () => loadRepo(AppEvent)
