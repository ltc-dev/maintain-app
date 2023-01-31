import backupEvent from './backup'
import carInfoEvent from './car_info'
import maintainEvent from './maintain'
export default () => {
  backupEvent()
  carInfoEvent()
  maintainEvent()
}
