import { BrowserWindow, Menu, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// import { getName, getMoble, getCarNo } from '../../utils/index'
const hasPath = '#/lock'
function createWindow() {
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

  // 是否加锁
  win.webContents.executeJavaScript(`localStorage.getItem('lock')`, true).then((res) => {
    if (res) {
      try {
        let lock = JSON.parse(res) || {}
        if (lock.openLock) {
          lock.locking = true
          win.webContents.executeJavaScript(
            `localStorage.setItem('lock','${JSON.stringify(lock)}')`,
            true
          )
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
  win.on('ready-to-show', async () => {
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}${hasPath}`)
  } else {
    win.loadURL(`file://${join(__dirname, `../renderer/index.html${hasPath}`)}`)
  }
  return win
}
export default createWindow
