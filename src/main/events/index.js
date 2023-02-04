import { app, dialog } from 'electron'
import backupEvent from './backup'
import carInfoEvent from './car_info'
import maintainEvent from './maintain'
import goodsEvent from './goods'
import othersEvent from './others'
export default async (db) => {
  try {
    backupEvent()
    carInfoEvent(db)
    maintainEvent(db)
    goodsEvent(db)
    othersEvent()
  } catch (error) {
    await dialog.showErrorBox('系统错误', String(error))
    app.quit()
  }
}
