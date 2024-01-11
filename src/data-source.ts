import { DataSource } from 'typeorm'
import fs from 'fs'

import { Device, AppEvent } from './models'

import path from 'path'

const api_cache_path = path.resolve('.', 'cache')
const database = process.env.NODE_ENV === 'production' ? 'prod.sqlite' : "dev.sqlite"

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
  logger: 'file'
})


export const getDeviceRepository = async () => {
  if (AppDataSource.isInitialized)
    return AppDataSource.getRepository(Device)
  else
    return (await AppDataSource.initialize()).getRepository(Device)
}

export const getEventRepository = async () => {
  if (AppDataSource.isInitialized)
    return AppDataSource.getRepository(AppEvent)
  else
    return (await AppDataSource.initialize()).getRepository(AppEvent)
}