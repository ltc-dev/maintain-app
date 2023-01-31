import {
  createTable,
  getAll,
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

export const getMaintainList = getAll('maintain')

export const getListByCarId = getAllBy('maintain', 'car_id')

export const maintainInsert = insert('maintain')

export const maintainGetTotal = getTotal('maintain')

export const maintainGetOne = getOneById('maintain')

export const maintainUpdate = updateOneById('maintain')

export const maintainDel = delById('maintain')
