<template>
  <a-modal
    :visible="props.visible"
    title="详情"
    :after-close="afterClose"
    :width="680"
    :confirm-loading="loading"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <a-descriptions title="保养详情" :column="2">
      <a-descriptions-item label="车牌号码">
        <a-button v-if="editFrom.car_id && props.carNo" type="link" size="small" @click="goCarInfo">
          {{ props.carNo }}
          <template #icon>
            <car-two-tone />
          </template>
        </a-button>
        <span v-else>--</span>
      </a-descriptions-item>
      <a-descriptions-item label="保养时间">{{ editFrom.time || '--' }}</a-descriptions-item>
      <a-descriptions-item label="机油类型">{{ editFrom.oil_type || '--' }}</a-descriptions-item>
      <a-descriptions-item label="赠送滤芯">{{
        isGive[editFrom.give_filter] || '--'
      }}</a-descriptions-item>
      <a-descriptions-item label="当前里程">{{ editFrom.mileage_now || '--' }}</a-descriptions-item>
      <a-descriptions-item label="下次里程">{{
        editFrom.mileage_next || '--'
      }}</a-descriptions-item>
      <a-descriptions-item label="价格" @click="triggerPrice">
        <span v-if="showPrice">
          {{ editFrom.price || '--' }}
        </span>
        <span v-else> **** </span>
        <a-button type="link" size="small" @click="triggerPrice">
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
  carNo: String
})
const editFrom = ref({})
const emit = defineEmits(['update:visible', 'success', 'cancel'])
const loading = ref(false)
const router = useRouter()
const showPrice = ref(false)

const isGive = {
  0: '否',
  1: '是'
}

const getDetail = async () => {
  if (props.id) {
    loading.value = true
    const { code, data, msg } = await window.api.maintain.getOne({ id: props.id })
    loading.value = false
    if (code == 200) {
      editFrom.value = data
      console.log(data)
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
  emit('cancel')
}
const goCarInfo = () => {
  router.push({
    path: '/car_info',
    query: {
      id: editFrom.value.car_id
    }
  })
}
const triggerPrice = () => {
  showPrice.value = !showPrice.value
}
</script>

<style lang="less" scoped>
.ant-btn-sm {
  height: 22px;
}
</style>
