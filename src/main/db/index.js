import Database from 'better-sqlite3'
import { dialog, app } from 'electron'
import { join } from 'path'
import fs from 'fs'

import stroe from '../store'

import carUsersTable from './car_info'
import goodsTable from './goods'
import maintainTable from './maintain'

export async function setupDBPath() {
  let dbPath = stroe.get('dbPath')
  if (!dbPath) {
    dialog.showMessageBoxSync({
      message: '首次使用请选择数据库存放位置',
      type: 'info'
    })
    const result = await dialog.showOpenDialog({
      title: '请选择数据库存放位置',
      properties: ['openDirectory']
    })
    if (!result.canceled) {
      dbPath = join(result.filePaths[0], 'local_db')
      stroe.set('dbPath', dbPath)
    } else {
      throw '获取数据库路径失败！！！'
    }
  }
  return dbPath
}

function initTable(db) {
  if (db) {
    carUsersTable(db).createCarUsersTable()
    goodsTable(db).createGoodsTable()
    maintainTable(db).createMaintainTable()
  }
}

export default async function initDB() {
  try {
    let filePath = await setupDBPath()
    if (filePath) {
      if (!fs.existsSync(filePath)) {
        console.log(filePath)
        fs.mkdir(filePath, (err) => {
          if (err) throw err
        })
      }
      const db = new Database(join(filePath, './data.db'), {
        verbose: console.log
      })
      initTable(db)
      return db
    }
  } catch (error) {
    console.error(error)
    await dialog.showErrorBox('系统错误', String(error))
    app.quit()
  }
}
