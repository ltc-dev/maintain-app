import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import createMainWindow from './windows/main'
import createLoadingWindow from './windows/loading'

import initDB from './db'

import setupEvents from './events'

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  const db = await initDB()
  setupEvents(db)
  createLoadingWindow((loading) => createMainWindow(loading))

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
  app.on('quit', () => {
    db && db.close()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
