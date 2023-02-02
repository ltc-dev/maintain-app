import backupEvent from './backup'
import carInfoEvent from './car_info'
import maintainEvent from './maintain'
import goodsEvent from './goods'
export default () => {
  backupEvent()
  carInfoEvent()
  maintainEvent()
  goodsEvent()
}
