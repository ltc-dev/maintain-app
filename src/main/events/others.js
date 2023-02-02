import { ipcMain } from 'electron'
import stroe from '../store'

const storeEvent = () => {
  ipcMain.handle('store', async (event, args) => {
    const { type, key, value } = args
    if (type == 'set') {
      stroe.set(key, value)
    } else if (type == 'get') {
      return stroe.get(key)
    }
  })
}

export default () => {
  storeEvent()
}
