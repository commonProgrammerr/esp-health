import { DataSource } from 'typeorm'

import Entities from './entities'
import path from 'path'

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.resolve("/home/scorel/Documents/esp-health/cache/database/dev.sqlite"),
  entities: Entities,
  synchronize: true
})