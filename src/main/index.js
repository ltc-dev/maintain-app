import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import createMainWindow from './windows/main'
import createLoadingWindow from './windows/loading'

import db, { initTable } from './db'

// import insertData from './insertData'

import setupEvents from './events'

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initTable()
  // insertData()

  setupEvents()
  const loading = createLoadingWindow(() => createMainWindow(loading))

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  db.close()
})
