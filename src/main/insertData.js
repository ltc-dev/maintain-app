import { carInfoInsert } from './db/car_info'
import { getName, getCarNo, getCarType, getColor, getMoble, getTyreType } from '../utils/random'
import { maintainInsert } from './db/maintain'
import { goodsInsert } from './db/goods'
export default () => {
  new Array(20).fill(1).forEach(() => {
    carInfoInsert({
      name: getName(),
      car_no: getCarNo(),
      car_brand_type: getCarType(),
      car_color: getColor(),
      phone: getMoble(),
      tyre_type: getTyreType()
    })
  })
  new Array(800).fill(1).forEach(() => {
    let mileage_now = parseInt(Math.random() * 100000)
    maintainInsert({
      car_id: Math.ceil(Math.random() * 20),
      price: parseInt(Math.random() * 500),
      mileage_now,
      mileage_next: mileage_now + 10000
    })
  })
  new Array(800).fill(1).forEach(() => {
    let rName = ['轮胎', '电瓶', '座套', '前保险杠', '倒车镜', '行车记录仪', '香水']
    goodsInsert({
      car_id: Math.ceil(Math.random() * 20),
      brand: 'XXX品牌',
      type: 'TTTT',
      merchant: '南阳汽XXXX车商家',
      name: rName[parseInt(Math.random() * rName.length)],
      price: parseInt(Math.random() * 500),
      sell_price: parseInt(Math.random() * 800)
    })
  })
}
