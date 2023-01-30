import { createTable, getAll, insert, getTotal, getOneById, updateOneById, delById } from './utils'
// 创建车辆信息表
export function createCarUsersTable() {
  return createTable(`
  CREATE TABLE IF NOT EXISTS car_infos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT COMMENT '车主名称',
    phone TEXT COMMENT '电话号码',
    address TEXT COMMENT '地址',
    car_no TEXT COMMENT '车牌号码',
    car_color TEXT COMMENT '车辆颜色',
    remark TEXT COMMENT '备注',
    create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
    update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
  )
`)
}

export const getCarInfoList = getAll('car_infos')

export const carInfoInsert = insert('car_infos')

export const carInfoGetTotal = getTotal('car_infos')

export const carInfoGetOne = getOneById('car_infos')

export const carInfoUpdate = updateOneById('car_infos')

export const carInfoDel = delById('car_infos')
