import Database from 'better-sqlite3'
import { app, dialog } from 'electron'
import { join } from 'path'
import fs from 'fs'

import { createCarUsersTable } from './car_info'
import { createGoodsTable } from './goods'
import { createMaintainTable } from './maintain'

function initDB() {
  try {
    let filePath = join(app.getPath('userData'), './local_db/')
    if (!fs.existsSync(filePath)) {
      console.log(filePath)
      fs.mkdir(filePath, (err) => {
        if (err) throw err
      })
    }

    const db = new Database(join(filePath, './data.db'), {
      verbose: console.log
    })
    return db
  } catch (error) {
    console.error(error)
    dialog.showErrorBox('系统错误', String(error))
  }
}

const db = initDB()

export function initTable() {
  createCarUsersTable(db)
  createGoodsTable(db)
  createMaintainTable(db)
}

export default db
