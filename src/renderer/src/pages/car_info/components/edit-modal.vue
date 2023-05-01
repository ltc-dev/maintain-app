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
            <a-input v-model:value.trim="editFrom.car_no" placeholder="请输入车牌号码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车主姓名" name="name">
            <a-input v-model:value.trim="editFrom.name" placeholder="请输入车主姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号码" name="phone">
            <a-input v-model:value.trim="editFrom.phone" placeholder="请输入手机号码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车辆型号" name="car_brand_type">
            <a-input v-model:value.trim="editFrom.car_brand_type" placeholder="请输入车辆型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="出厂年份" name="production_year">
            <a-input
              v-model:value.trim="editFrom.production_year"
              placeholder="请输入出厂年份"
              suffix="年"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排量" name="displacement">
            <a-input
              v-model:value.trim="editFrom.displacement"
              suffix="T"
              placeholder="请输入排量"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="机油容量" name="capacity">
            <a-input
              v-model:value.trim="editFrom.capacity"
              suffix="L"
              placeholder="请输入机油容量"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="机滤型号" name="filter_type">
            <a-input v-model:value.trim="editFrom.filter_type" placeholder="请输入机滤型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="轮胎型号" name="tyre_type">
            <a-input v-model:value.trim="editFrom.tyre_type" placeholder="请输入轮胎型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车辆颜色" name="car_color">
            <a-input v-model:value.trim="editFrom.car_color" placeholder="请输入车辆颜色" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="家庭住址" name="address" :label-col="{ span: 3 }">
            <a-input v-model:value.trim="editFrom.address" placeholder="请输入家庭住址" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" name="remark" :label-col="{ span: 3 }">
            <a-textarea v-model:value="editFrom.remark" placeholder="请输入备注" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref } from 'vue'
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
  production_year: '',
  displacement: '',
  remark: ''
})
const emit = defineEmits(['update:visible', 'success', 'cancel'])
const formRef = ref({})
const loading = ref(false)

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
  let e = await hasCarInfo(values.car_no)
  if (e) {
    return message.error(e)
  }
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
  loading.value = false
  emit('cancel')
  formRef.value.resetFields()
}

const hasCarInfo = async (carNo) => {
  loading.value = true
  const { code, data = [] } = await window.api.carInfo.getByCarno({ car_no: carNo })
  loading.value = false
  if (code == 200) {
    if (data.length) {
      return '车辆信息已存在'
    }
  } else {
    return '系统错误，请稍后再试'
  }
}
</script>
