import dbUtils from './utils'
export default (db) => {
  const { createTable, getAll, insert, getTotal, getOneById, updateOneById, delById, getAllBy } =
    dbUtils(db)
  return {
    // 创建车辆信息表
    createCarUsersTable() {
      return createTable(`
        CREATE TABLE IF NOT EXISTS car_infos(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT, --车主名称
          phone TEXT, --电话号码
          address TEXT, --地址
          car_no TEXT, --车牌号码
          car_color TEXT, --车辆颜色
          car_brand_type TEXT, --车辆品牌及型号
          tyre_type TEXT, --轮胎型号
          remark TEXT, --备注
          create_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')), --创建时间
          update_time TIMESTAMP DEFAULT (DATETIME('now', 'localtime')) -- 更新时间
        )
      `)
    },
    getCarInfoList: getAll('car_infos'),
    carInfoInsert: insert('car_infos'),
    carInfoGetTotal: getTotal('car_infos'),
    carInfoGetOne: getOneById('car_infos'),
    carInfoUpdate: updateOneById('car_infos'),
    carInfoDel: delById('car_infos'),
    getByCarno: getAllBy('car_infos', 'car_no')
  }
}
