import { BrowserWindow, Menu } from 'electron'
import { join } from 'path'

export default (callBack = () => {}) => {
  const win = new BrowserWindow({
    show: false,
    frame: false,
    width: 200,
    height: 200,
    resizable: false,
    transparent: true
  })
  const menu = Menu.buildFromTemplate([
    {
      label: '斌子汽车保养中心',
      submenu: [
        {
          label: '打开调试窗口',
          role: 'toggleDevTools'
        },
        {
          label: '隐藏窗口',
          role: 'hide'
        },
        {
          label: '刷新页面',
          role: 'reload'
        },
        {
          label: '复制',
          role: 'copy'
        },
        {
          label: '粘贴',
          role: 'paste'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
  win.once('show', callBack)
  win.loadFile(join(__dirname, '../../resources/loading.html'))
  win.show()
  return win
}
