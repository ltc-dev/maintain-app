import { ipcMain } from 'electron'
import {
  getCarInfoList,
  carInfoInsert,
  carInfoDel,
  carInfoUpdate,
  carInfoGetOne,
  getByCarno
} from '../db/car_info'

export default () => {
  ipcMain.handle('car_info', async (event, args) => {
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
            result.data = getCarInfoList(params)
          }
          break
        case 'getOneById':
          {
            result.data = carInfoGetOne(params)
          }
          break
        case 'insert':
          {
            result.data = carInfoInsert(params)
          }
          break
        case 'update':
          {
            result.data = carInfoUpdate(params)
          }
          break
        case 'delById':
          {
            result.data = carInfoDel(params)
          }
          break
        case 'getByCarno':
          {
            result.data = getByCarno(params)
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
