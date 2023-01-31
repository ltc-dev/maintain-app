<template>
  <a-modal
    :visible="props.visible"
    :title="modalTitle"
    :after-close="afterClose"
    :width="680"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="editFrom" :label-col="{ span: 6 }">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="车牌号码"
            name="car_no"
            :rules="[{ required: true, message: '请输入车牌号码' }]"
          >
            <a-input v-model:value="editFrom.car_no" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车主姓名" name="name">
            <a-input v-model:value="editFrom.name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号码" name="phone">
            <a-input v-model:value="editFrom.phone" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="轮胎型号" name="tyre_type">
            <a-input v-model:value="editFrom.tyre_type" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车辆型号" name="car_brand_type">
            <a-input v-model:value="editFrom.car_brand_type" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车辆颜色" name="car_color">
            <a-input v-model:value="editFrom.car_color" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="家庭住址" name="address" :label-col="{ span: 3 }">
            <a-input v-model:value="editFrom.address" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" name="remark" :label-col="{ span: 3 }">
            <a-textarea v-model:value="editFrom.remark" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue'
const props = defineProps({
  visible: Boolean,
  id: [Number, String]
})
const editFrom = ref({
  car_no: '',
  name: '',
  phone: '',
  address: '',
  tyre_type: '',
  car_color: '',
  car_brand_type: '',
  remark: ''
})
const emit = defineEmits(['update:visible', 'success', 'cancel'])
const formRef = ref()

const modalTitle = computed(() => `${props.id ? '编辑' : '添加'} 车辆信息`)
const getDetail = async () => {
  if (props.id) {
    loading.value = true
    const { code, data, msg } = await window.api.carInfo.getOne({ id: props.id })
    loading.value = false
    if (code == 200) {
      editFrom.value = data
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
    const values = await formRef.value.validateFields()
    if (props.id) {
      editAction(values)
    } else {
      addAction(values)
    }
  } catch (error) {
    console.error(error)
  }
}

const editAction = async (values) => {
  loading.value = true
  const { code, msg } = await window.api.carInfo.update({ ...values, id: props.id })
  loading.value = false
  if (code == 200) {
    emit('success')
    handleCancel()
  } else {
    message.error(msg)
  }
}
const addAction = async (values) => {
  loading.value = true
  const { code, msg } = await window.api.carInfo.insert({ ...values })
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
  emit('cancel')
  formRef.value.resetFields()
}
</script>