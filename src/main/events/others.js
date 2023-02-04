import { ipcMain, app, dialog } from 'electron'
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
  ipcMain.handle('db', async (event, args) => {
    const { type } = args
    if (type == 'switch') {
      const result = await dialog.showOpenDialog({
        title: '请选择文件夹',
        properties: ['openDirectory']
      })
      if (!result.canceled) {
        let destDir = result.filePaths[0]
        stroe.set('dbPath', destDir)
        dialog.showMessageBoxSync({
          message: '数据库切换成功！重启应用后生效'
        })
        app.relaunch()
        app.exit()
      }
    }
  })
}
