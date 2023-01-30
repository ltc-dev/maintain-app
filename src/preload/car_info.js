import { ipcRenderer } from 'electron'
export default {
  getAll(params) {
    return ipcRenderer.invoke('car_info', { type: 'getAll', params })
  },
  del(params) {
    return ipcRenderer.invoke('car_info', { type: 'delById', params })
  }
}
