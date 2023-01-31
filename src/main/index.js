import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import createWindow from './windows/main'

import db, { initTable } from './db'

// import { carInfoInsert } from './db/car_info'
// import { getName, getCarNo, getCarType, getColor, getMoble, getTyreType } from '../utils/random'
// import { maintainInsert } from './db/maintain'

import setupEvents from './events'

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initTable()
  // new Array(30).fill(1).forEach(() => {
  //   carInfoInsert({
  //     name: getName(),
  //     car_no: getCarNo(),
  //     car_brand_type: getCarType(),
  //     car_color: getColor(),
  //     phone: getMoble(),
  //     tyre_type: getTyreType()
  //   })
  // })
  // new Array(1000).fill(1).forEach(() => {
  //   let mileage_now = parseInt(Math.random() * 100000)
  //   maintainInsert({
  //     car_id: Math.ceil(Math.random() * 100),
  //     price: parseInt(Math.random() * 500),
  //     mileage_now,
  //     mileage_next: mileage_now + 10000
  //   })
  // })

  setupEvents()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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
