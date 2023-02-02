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
export function createGoodsTable() {
  return createTable(`
  CREATE TABLE IF NOT EXISTS goods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER, --车辆信息表ID
    name TEXT, --商品名称
    brand TEXT, --品牌
    type TEXT, -- 型号
    merchant TEXT, --商家
    price REAL, --进价
    sell_price REAL, --售价
    remark TEXT, --备注
    purchase_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')), -- 进货时间
    create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')), --创建时间
    update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')) -- 更新时间
  )
`)
}

export const getGoodsList = (params) => {
  let query = (params = {}, c = '*') => {
    const { current = 1, pageSize = 10, startTime, endTime, ...others } = params
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
    if (startTime && endTime) {
      if (whereStr) {
        whereStr = whereStr + `and purchase_time BETWEEN '${startTime}' AND '${endTime}' `
      } else {
        whereStr = `where purchase_time BETWEEN '${startTime}' AND '${endTime}' `
      }
    }
    const start = (current - 1) * pageSize
    try {
      if (c === '*') {
        return db
          .prepare(
            `select ${c} from goods ${whereStr}order by create_time desc  limit ${start}, ${pageSize}`
          )
          .all()
      } else {
        return db.prepare(`select ${c} from goods ${whereStr}order by create_time desc`).get()
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

export const getListByCarId = getAllBy('goods', 'car_id')

export const goodsInsert = insert('goods')

export const goodsGetTotal = getTotal('goods')

export const goodsGetOne = getOneById('goods')

export const goodsUpdate = updateOneById('goods')

export const goodsDel = delById('goods')
