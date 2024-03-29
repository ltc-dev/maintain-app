import { BrowserWindow, dialog, Menu, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import stroe from '../store'

// import { getName, getMoble, getCarNo } from '../../utils/index'
const lock = stroe.get('lock')
let hashPath = lock.openLock ? '/lock' : '/car_info'
function createWindow(loading) {
  // Create the browser window.
  const win = new BrowserWindow({
    // width: 500,
    width: 1000,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  win.on('ready-to-show', async () => {
    if (loading) {
      loading.hide()
      loading.close()
    }
    win.show()
  })
  const menu = Menu.buildFromTemplate([
    {
      label: '帮助',
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
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  try {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${hashPath}`)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), {
        hash: hashPath
      })
    }
  } catch (error) {
    dialog.showErrorBox('error', String(error))
  }
  return win
}
export default createWindow
