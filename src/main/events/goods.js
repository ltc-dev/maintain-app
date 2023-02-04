import { ipcMain } from 'electron'
import goodsTable from '../db/goods'

export default (db) => {
  const { getGoodsList, goodsInsert, goodsDel, goodsUpdate, goodsGetOne, getListByCarId } =
    goodsTable(db)
  ipcMain.handle('goods', async (event, args) => {
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
            result.data = getGoodsList(params)
          }
          break
        case 'getOneById':
          {
            result.data = goodsGetOne(params)
          }
          break
        case 'insert':
          {
            result.data = goodsInsert(params)
          }
          break
        case 'update':
          {
            result.data = goodsUpdate(params)
          }
          break
        case 'delById':
          {
            result.data = goodsDel(params)
          }
          break
        case 'getAllByCarId':
          {
            result.data = getListByCarId(params)
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
