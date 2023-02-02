import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import createWindow from './windows/main'

import db, { initTable } from './db'

// import { carInfoInsert } from './db/car_info'
// import { getName, getCarNo, getCarType, getColor, getMoble, getTyreType } from '../utils/random'
// import { maintainInsert } from './db/maintain'
// import { goodsInsert } from './db/goods'

import setupEvents from './events'

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initTable()
  // new Array(20).fill(1).forEach(() => {
  //   carInfoInsert({
  //     name: getName(),
  //     car_no: getCarNo(),
  //     car_brand_type: getCarType(),
  //     car_color: getColor(),
  //     phone: getMoble(),
  //     tyre_type: getTyreType()
  //   })
  // })
  // new Array(800).fill(1).forEach(() => {
  //   let mileage_now = parseInt(Math.random() * 100000)
  //   maintainInsert({
  //     car_id: Math.ceil(Math.random() * 20),
  //     price: parseInt(Math.random() * 500),
  //     mileage_now,
  //     mileage_next: mileage_now + 10000
  //   })
  // })
  // new Array(800).fill(1).forEach(() => {
  //   let rName = ['轮胎', '电瓶', '座套', '前保险杠', '倒车镜', '行车记录仪', '香水']
  //   goodsInsert({
  //     car_id: Math.ceil(Math.random() * 20),
  //     brand: 'XXX品牌',
  //     type: 'TTTT',
  //     merchant: '南阳汽XXXX车商家',
  //     name: rName[parseInt(Math.random() * rName.length)],
  //     price: parseInt(Math.random() * 500),
  //     sell_price: parseInt(Math.random() * 800)
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
