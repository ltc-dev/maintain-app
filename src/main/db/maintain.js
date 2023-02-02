import { dialog } from 'electron'

import db from './index'
import {
  createTable,
  insert,
  getTotal,
  getOneById,
  updateOneById,
  delById,
  getAllBy
} from './utils'

// 创建车辆信息表
export function createMaintainTable() {
  return createTable(`
  CREATE TABLE IF NOT EXISTS maintain(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER, --车辆信息表ID
    mileage_now TEXT, --当前里程
    mileage_next TEXT, --下次保养里程
    oil_type TEXT, --机油类型
    price REAL, --价格
    give_filter INTEGER DEFAULT 0, --赠送滤芯：0否，1是
    remark TEXT, --备注
    create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')), --创建时间
    update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')) -- 更新时间
  )
`)
}

export const getMaintainList = (params = {}) => {
  let query = (params = {}, c = '*') => {
    const { current = 1, pageSize = 10, car_no, startTime, endTime, ...others } = params
    if (car_no) {
      others['c.car_no'] = car_no
    }
    let keys = Object.keys(others)
    keys.forEach((k) => {
      if (typeof others[k] == 'string') {
        others[k] = `'%${others[k]}%'`
      }
    })
    let whereStr = keys.length
      ? `where${keys
          .map((k) => {
            return ` ${k} like ${others[k]} `
          })
          .join('and')} `
      : ''
    console.log(whereStr)
    if (startTime && endTime) {
      if (whereStr) {
        whereStr = whereStr + `and m.create_time BETWEEN '${startTime}' AND '${endTime}' `
      } else {
        whereStr = `where m.create_time BETWEEN '${startTime}' AND '${endTime}' `
      }
    }
    console.log(whereStr)
    const start = (current - 1) * pageSize
    try {
      if (c === '*') {
        return db
          .prepare(
            `select c.car_no,m.* from maintain m LEFT JOIN car_infos c ON m.car_id=c.id ${whereStr}order by m.create_time desc  limit ${start}, ${pageSize}`
          )
          .all()
      } else {
        return db
          .prepare(
            `select ${c} from maintain m LEFT JOIN car_infos c ON m.car_id=c.id ${whereStr}order by m.create_time desc `
          )
          .get()
      }
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
  return {
    list: query(params),
    ...query(params, 'count(*) as total')
  }
}

export const getListByCarId = getAllBy('maintain', 'car_id')

export const maintainInsert = insert('maintain')

export const maintainGetTotal = getTotal('maintain')

export const maintainGetOne = getOneById('maintain')

export const maintainUpdate = updateOneById('maintain')

export const maintainDel = delById('maintain')
