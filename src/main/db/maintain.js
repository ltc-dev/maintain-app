import { createTable, getAll, insert, getTotal, getOneById, updateOneById, delById } from './utils'
// 创建车辆信息表
export function createMaintainTable() {
  return createTable(`
  CREATE TABLE IF NOT EXISTS maintain(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER COMMENT '车辆信息表ID',
    give_filter INTEGER COMMENT '赠送滤芯：0否，1是',
    mileage_now TEXT COMMENT '当前里程',
    mileage_next TEXT COMMENT '下次保养里程',
    pirce REAL COMMENT '价格',
    remark TEXT COMMENT '备注',
    create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
    update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
  )
`)
}

export const getMaintainList = getAll('maintain')

export const maintainInsert = insert('maintain')

export const maintainGetTotal = getTotal('maintain')

export const maintainGetOne = getOneById('maintain')

export const maintainUpdate = updateOneById('maintain')

export const maintainDel = delById('maintain')
