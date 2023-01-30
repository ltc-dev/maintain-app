import { ipcMain, dialog, app } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { formatDate } from '../../utils'

function copyFiles(srcDir, destDir) {
  //读取源文件地址的所有文件和文件格式
  fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
    if (!err) {
      for (let file of files) {
        //判断是否为文件夹类型
        if (file.isDirectory()) {
          const srcFile = join(srcDir, file.name)
          const destFile = join(destDir, file.name)
          //同步创建文件夹
          fs.mkdirSync(destFile, (err) => {
            console.log(err)
          })
          copyFiles(srcFile, destFile)
        } else {
          const srcFile1 = join(srcDir, file.name)
          const destFile1 = join(destDir, file.name)
          if (fs.existsSync(destFile1)) {
            console.log('已经存在相同文件，无需复制')
            continue
          }
          fs.copyFileSync(srcFile1, destFile1)
          console.log('复制成功')
        }
      }
    }
  })
}
export default () => {
  ipcMain.handle('backup', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: '请选择文件夹',
        properties: ['openDirectory']
      })
      if (!result.canceled) {
        let srcDir = join(app.getPath('userData'), './data')
        let dirDate = formatDate(new Date(), 'YYYY_MM_DD')
        let destDir = join(result.filePaths[0], dirDate)
        if (fs.existsSync(destDir)) {
          throw '文件已存在,请检查'
        } else {
          fs.mkdirSync(destDir)
          copyFiles(srcDir, destDir)
        }
        return destDir
      }
    } catch (error) {
      dialog.showErrorBox('备份失败', String(error))
    }
  })
}
