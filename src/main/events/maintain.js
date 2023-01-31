import { ipcMain } from 'electron'
import {
  getMaintainList,
  maintainInsert,
  maintainGetTotal,
  maintainGetOne,
  maintainUpdate,
  maintainDel,
  getListByCarId
} from '../db/maintain'

export default () => {
  ipcMain.handle('maintain', async (event, args) => {
    const { type, params } = args
    let result = {
      code: 200,
      data: {},
      msg: '请求成功'
    }
    try {
      switch (type) {
        case 'getAll':
          {
            result.data = {
              list: getMaintainList(params),
              ...maintainGetTotal(params)
            }
          }
          break
        case 'getAllByCarId':
          {
            result.data = {
              list: getListByCarId(params)
            }
          }
          break
        case 'getOneById':
          {
            result.data = maintainGetOne(params)
          }
          break
        case 'insert':
          {
            result.data = maintainInsert(params)
          }
          break
        case 'update':
          {
            result.data = maintainUpdate(params)
          }
          break
        case 'delById':
          {
            result.data = maintainDel(params)
          }
          break

        default:
          break
      }
    } catch (error) {
      result = {
        code: 500,
        msg: String(error)
      }
    }
    return result
  })
}
