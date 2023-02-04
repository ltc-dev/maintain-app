import { dialog } from 'electron'
import moment from 'moment'

export default (db) => ({
  // 创建表
  createTable(sql) {
    try {
      return db.exec(sql)
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('系统错误', String(error))
    }
  },
  // 获取多行数据
  getAll(table) {
    let query = (params = {}, c = '*') => {
      const { current = 1, pageSize = 10, ...others } = params
      let keys = Object.keys(others)
      keys.forEach((k) => {
        if (typeof others[k] == 'string') {
          others[k] = `'%${others[k]}%'`
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
      try {
        if (c === '*') {
          return db
            .prepare(
              `select ${c} from ${table} ${whereStr}order by create_time desc  limit ${start}, ${pageSize}`
            )
            .all()
        } else {
          return db.prepare(`select ${c} from ${table} ${whereStr}order by create_time desc`).get()
        }
      } catch (error) {
        console.error(error)
        dialog.showErrorBox('系统错误', String(error))
      }
    }
    return (params = {}) => ({
      list: query(params),
      ...query(params, 'count(*) as total')
    })
  },

  // 插入数据
  insert(table) {
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
  },

  // 获取数据总量
  getTotal(table) {
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
  },

  getOneById(table) {
    return (params = {}) => {
      try {
        const result = db.prepare(`select * from ${table} where id=@id`).get(params)
        return result
      } catch (error) {
        console.error(error)
        dialog.showErrorBox('系统错误', String(error))
      }
    }
  },

  updateOneById(table) {
    return (params = {}) => {
      params = { ...params, update_time: moment().format('YYYY-MM-DD HH:mm:ss') }
      const { id, ...other } = params
      if (!id) throw '请传id参数'
      let keys = Object.keys({ ...other })
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
  },

  delById(table) {
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
  },

  getAllBy(table, key) {
    return (params = {}) => {
      const { current, pageSize = 10, ...others } = params
      let limtPage = ''
      let start = 0
      if (current) {
        start = (current - 1) * pageSize
        return ` limit ${start}, ${pageSize}`
      }
      try {
        const result = db
          .prepare(
            `select * from ${table} where ${key}=@${key} order by create_time desc${limtPage}`
          )
          .all(others)
        return result
      } catch (error) {
        console.error(error)
        dialog.showErrorBox('系统错误', String(error))
      }
    }
  }
})
