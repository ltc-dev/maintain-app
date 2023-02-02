import backupEvent from './backup'
import carInfoEvent from './car_info'
import maintainEvent from './maintain'
import goodsEvent from './goods'
import othersEvent from './others'
export default () => {
  backupEvent()
  carInfoEvent()
  maintainEvent()
  goodsEvent()
  othersEvent()
}
