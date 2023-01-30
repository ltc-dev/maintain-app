import { ipcMain } from 'electron'
import { getCarInfoList, carInfoGetTotal, carInfoInsert, carInfoDel } from '../db/car_info'

import backupEvent from './backup'
export default () => {
  backupEvent()
  ipcMain.handle('car_info', async (event, args) => {
    const { type, params } = args
    let result = {
      code: 200,
      data: {},
      message: '请求成功'
    }
    switch (type) {
      case 'getAll':
        {
          result.data = {
            list: getCarInfoList(params),
            ...carInfoGetTotal(params)
          }
        }
        break
      case 'insert':
        {
          result.data = carInfoInsert(params)
        }
        break
      case 'delById':
        {
          result.data = carInfoDel(params)
        }
        break

      default:
        break
    }
    return result
  })
}
