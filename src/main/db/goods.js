import { createTable, getAll, insert, getTotal, getOneById, updateOneById, delById } from './utils'
// 创建车辆信息表
export function createGoodsTable() {
  return createTable(`
  CREATE TABLE IF NOT EXISTS goods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT COMMENT '商品名称',
    brand TEXT COMMENT '品牌',
    merchant TEXT COMMENT '商家',
    price REAL COMMENT '进价',
    sell_price REAL COMMENT '售价',
    remark TEXT COMMENT '备注',
    create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
    update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
  )
`)
}

export const getGoodsList = getAll('goods')

export const goodsInsert = insert('goods')

export const goodsGetTotal = getTotal('goods')

export const goodsGetOne = getOneById('goods')

export const goodsUpdate = updateOneById('goods')

export const goodsDel = delById('goods')
