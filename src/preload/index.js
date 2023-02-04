import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export function baseCRUD(name) {
  return {
    getAll(params) {
      return ipcRenderer.invoke(name, { type: 'getAll', params })
    },
    getOne(params) {
      return ipcRenderer.invoke(name, { type: 'getOneById', params })
    },
    insert(params) {
      return ipcRenderer.invoke(name, { type: 'insert', params })
    },
    update(params) {
      console.log(params)
      return ipcRenderer.invoke(name, { type: 'update', params })
    },
    del(params) {
      return ipcRenderer.invoke(name, { type: 'delById', params })
    }
  }
}

let maintain = {
  ...baseCRUD('maintain'),
  getAllByCarId(params) {
    return ipcRenderer.invoke('maintain', { type: 'getAllByCarId', params })
  }
}

let carInfo = {
  ...baseCRUD('car_info'),
  getByCarno(params) {
    return ipcRenderer.invoke('car_info', { type: 'getByCarno', params })
  }
}

let goods = {
  ...baseCRUD('goods'),
  getAllByCarId(params) {
    return ipcRenderer.invoke('goods', { type: 'getAllByCarId', params })
  }
}

const store = (params) => {
  return ipcRenderer.invoke('store', params)
}
const db = {
  backup() {
    return ipcRenderer.invoke('backup')
  },
  switch() {
    return ipcRenderer.invoke('db', { type: 'switch' })
  }
}
// Custom APIs for renderer
const api = {
  carInfo,
  maintain,
  goods,
  db,
  store
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
