import { dialog } from 'electron'

import db from './index'
// 创建表
export function createTable(sql) {
  try {
    return db.exec(sql)
  } catch (error) {
    console.error(error)
    dialog.showErrorBox('系统错误', String(error))
  }
}

// 获取多行数据
export function getAll(table) {
  return (params = {}) => {
    console.log(222, params)
    const { current = 1, pageSize = 10, ...others } = params
    let keys = Object.keys(others)
    keys.forEach((k) => {
      if (typeof others[k] == 'string') {
        others[k] = `'%${params[k].split('').join('%')}%'`
      }
    })
    const whereStr = keys.length
      ? `where${keys
          .map((k) => {
            return ` ${k} like ${others[k]} `
          })
          .join('and')} `
      : ''
    const start = (current - 1) * pageSize
    // return `select * from car_users ${whereStr}order by create_time limit ${start}, ${pageSize}`
    try {
      const result = db
        .prepare(
          `select * from ${table} ${whereStr}order by create_time limit ${start}, ${pageSize}`
        )
        .all()
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}

// 插入数据
export function insert(table) {
  return (params = {}) => {
    let keys = Object.keys(params)
    try {
      const result = db
        .prepare(
          `insert into ${table} 
        (${keys.join(',')}) 
        values 
        (${keys.map((k) => '@' + k).join(',')})`
        )
        .run(params)
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}

// 获取数据总量
export function getTotal(table) {
  return (params = {}) => {
    const { current, pageSize, ...others } = params
    console.log(current, pageSize)
    let keys = Object.keys(others)
    keys.forEach((k) => {
      if (typeof others[k] == 'string') {
        others[k] = `'%${params[k].split('').join('%')}%'`
      }
    })
    const whereStr = keys.length
      ? `where${keys
          .map((k) => {
            return ` ${k} like ${others[k]} `
          })
          .join('and')} `
      : ''
    // return `select count(*) as total from car_users ${whereStr}`
    try {
      const result = db.prepare(`select count(*) as total from ${table} ${whereStr}`).get()
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}

export function getOneById(table) {
  return (params = {}) => {
    try {
      const result = db.prepare(`select * from ${table} where id=@id`).get(params)
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}

export function updateOneById(table) {
  return (params = {}) => {
    if (!params.id) throw '请传id参数'
    let keys = Object.keys(params)
    try {
      const result = db
        .prepare(`update ${table} set ${keys.map((k) => `${k}=@${k}`)} where id=@id`)
        .run(params)
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}

export function delById(table) {
  return (params = {}) => {
    if (!params.id) throw '请传id参数'
    try {
      const result = db.prepare(`delete from ${table} where id=@id`).run(params)
      return result
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  }
}
