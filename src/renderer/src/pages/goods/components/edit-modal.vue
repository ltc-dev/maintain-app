<template>
  <a-modal
    :visible="props.visible"
    title="商品信息"
    :after-close="afterClose"
    :width="680"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="editFrom" :label-col="{ span: 6 }">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="车牌号码" name="name">
            {{ carinfoM.carNo }}
            <a-button type="primary" size="small" @click="correlationClick">关联车辆</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="商品名称" name="name">
            <a-input v-model:value.trim="editFrom.name" placeholder="请输入商品名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="商品品牌" name="brand">
            <a-input v-model:value.trim="editFrom.brand" placeholder="请输入商品品牌" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="商品型号" name="type">
            <a-input v-model:value.trim="editFrom.type" placeholder="请输入商品名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="进货时间" name="purchase_time">
            <a-date-picker
              v-model:value="editFrom.purchase_time"
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择进货时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="供货商" name="merchant">
            <a-input v-model:value.trim="editFrom.merchant" placeholder="请输入商品名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="进价" name="price">
            <a-input v-model:value.trim="editFrom.price" placeholder="请输入进价" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="售价" name="sell_price">
            <a-input v-model:value.trim="editFrom.sell_price" placeholder="请输入售价" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" name="remark" :label-col="{ span: 3 }">
            <a-textarea v-model:value.trim="editFrom.remark" placeholder="请输入备注信息" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <CarinfoModal
      v-model:visible="carinfoM.visible"
      v-model:selectId="carinfoM.selectId"
    ></CarinfoModal>
  </a-modal>
</template>
<script setup>
import { watch } from 'vue'
import { message } from 'ant-design-vue'
import moment from 'moment'
import CarinfoModal from './carinfo-modal.vue'

const props = defineProps({
  visible: Boolean,
  id: [Number, String]
})
const editFrom = ref({
  car_id: '',
  name: '',
  brand: '',
  type: '',
  merchant: '',
  price: '',
  sell_price: '',
  purchase_time: moment().format('YYYY-MM-DD HH:mm:ss'),
  remark: ''
})

const emit = defineEmits(['update:visible', 'success', 'cancel'])
const formRef = ref()
const loading = ref(false)
const carinfoM = reactive({
  visible: false,
  selectId: 0,
  carNo: ''
})

const getDetail = async () => {
  if (props.id) {
    loading.value = true
    const { code, data, msg } = await window.api.goods.getOne({ id: props.id })
    loading.value = false
    if (code == 200) {
      editFrom.value = data
      await getCar(data.car_id)
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
const handleOk = async () => {
  try {
    await formRef.value.validateFields()
    console.log(editFrom.value)
    if (props.id) {
      editAction(editFrom.value)
    } else {
      addAction(editFrom.value)
    }
  } catch (error) {
    console.error(error)
  }
}

const editAction = async (values) => {
  loading.value = true
  const { code, msg } = await window.api.goods.update({
    ...values,
    id: props.id,
    car_id: editFrom.car_id
  })
  loading.value = false
  if (code == 200) {
    emit('success')
    handleCancel()
  } else {
    message.error(msg)
  }
}
const addAction = async (values) => {
  console.log(values)
  loading.value = true
  const { code, msg } = await window.api.goods.insert({ ...values })
  loading.value = false
  if (code == 200) {
    emit('success')
    handleCancel()
  } else {
    message.error(msg)
  }
}
const handleCancel = () => {
  emit('update:visible', false)
}
const afterClose = () => {
  carinfoM.carNo = ''
  emit('cancel')
  formRef.value.resetFields()
}
const correlationClick = () => {
  carinfoM.visible = true
  carinfoM.selectId = editFrom.value.car_id
}

const getCar = async (id) => {
  if (id) {
    const { code, data, msg } = await window.api.carInfo.getOne({ id })
    if (code == 200) {
      console.log(data)
      if (data) {
        carinfoM.carNo = data.car_no
      }
    } else {
      message.error(msg)
    }
  }
}
watch(
  () => carinfoM.visible,
  async () => {
    if (!carinfoM.visible) {
      await getCar(carinfoM.selectId)
      editFrom.car_id = carinfoM.selectId
      carinfoM.selectId = 0
      carinfoM.visible = false
    }
  }
)
</script>

<style lang="less" scoped>
.ant-picker {
  width: 100%;
}
</style>
