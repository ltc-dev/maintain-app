<template>
  <a-modal
    :visible="props.visible"
    title="商品详情"
    :after-close="afterClose"
    :width="680"
    :confirm-loading="loading"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <a-descriptions :column="2">
      <a-descriptions-item label="车牌号码">
        <a-button v-if="editFrom.car_id && carNo" type="link" size="small" @click="goCarInfo">
          {{ carNo }}
          <template #icon>
            <car-two-tone />
          </template>
        </a-button>
        <span v-else>暂未关联车辆信息</span>
      </a-descriptions-item>
      <a-descriptions-item label="商品名称">{{ editFrom.name || '--' }}</a-descriptions-item>
      <a-descriptions-item label="商品品牌">{{ editFrom.brand || '--' }}</a-descriptions-item>
      <a-descriptions-item label="商品型号">{{ editFrom.type || '--' }}</a-descriptions-item>
      <a-descriptions-item label="进货时间">{{
        editFrom.purchase_time || '--'
      }}</a-descriptions-item>
      <a-descriptions-item label="供货商">{{ editFrom.merchant || '--' }}</a-descriptions-item>
      <a-descriptions-item label="进价" @click="triggerPrice('price')">
        <span v-if="showPrice.price">
          {{ editFrom.price || '--' }}
        </span>
        <span v-else> **** </span>
        <a-button type="link" size="small" @click="triggerPrice('price')">
          查看
          <template #icon>
            <eye-outlined />
          </template>
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item label="售价" @click="triggerPrice('sell_price')">
        <span v-if="showPrice.sell_price">
          {{ editFrom.sell_price || '--' }}
        </span>
        <span v-else> **** </span>
        <a-button type="link" size="small" @click="triggerPrice('sell_price')">
          查看
          <template #icon>
            <eye-outlined />
          </template>
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ editFrom.remark || '--' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue'
const props = defineProps({
  visible: Boolean,
  id: [Number, String],
  disJump: Boolean
})
const editFrom = ref({})
const emit = defineEmits(['update:visible', 'success', 'cancel'])
const loading = ref(false)
const router = useRouter()
const showPrice = reactive({
  price: false,
  sell_price: false
})

const carNo = ref('')
const getDetail = async () => {
  if (props.id) {
    loading.value = true
    const { code, data, msg } = await window.api.goods.getOne({ id: props.id })
    loading.value = false
    if (code == 200) {
      editFrom.value = data
      getCar(data.car_id)
    } else {
      message.error(msg)
    }
  }
}
watch(
  () => props.visible,
  (v) => v && getDetail()
)
getDetail()

const handleCancel = () => {
  emit('update:visible', false)
}
const afterClose = () => {
  showPrice.price = false
  showPrice.sell_price = false
  emit('cancel')
}
const goCarInfo = () => {
  console.log(props.disJump)
  if (!props.disJump) {
    router.push({
      path: '/car_info',
      query: {
        id: editFrom.value.car_id
      }
    })
  }
}
const triggerPrice = (key) => {
  showPrice[key] = !showPrice[key]
}

const getCar = async (id) => {
  if (id) {
    const { code, data, msg } = await window.api.carInfo.getOne({ id })
    if (code == 200) {
      if (data) {
        carNo.value = data.car_no
      }
    } else {
      message.error(msg)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-btn-sm {
  height: 22px;
}
</style>
