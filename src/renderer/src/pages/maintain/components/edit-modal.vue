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
          <a-form-item label="当前里程" name="mileage_now">
            <a-input v-model:value.trim="editFrom.mileage_now" placeholder="请输入当前里程" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="下次里程" name="mileage_next">
            <a-input v-model:value.trim="editFrom.mileage_next" placeholder="请输入下次里程" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="机油类型" name="oil_type">
            <a-input v-model:value.trim="editFrom.oil_type" placeholder="请输入机油类型" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="赠送滤芯" name="give_filter">
            <a-select v-model:value="editFrom.give_filter" placeholder="请选择">
              <a-select-option :value="0">否</a-select-option>
              <a-select-option :value="1">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="价格" name="price" placeholder="请输入价格">
            <a-input v-model:value.trim="editFrom.price" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="保养时间" name="time">
            <a-date-picker
              v-model:value="editFrom.time"
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择保养时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" name="remark" :label-col="{ span: 3 }">
            <a-textarea v-model:value.trim="editFrom.remark" placeholder="请输入备注信息" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue'
import moment from 'moment'
const props = defineProps({
  visible: Boolean,
  id: [Number, String],
  carId: [Number, String],
  carNo: String
})
const editFrom = ref({
  mileage_now: '',
  mileage_next: '',
  oil_type: '',
  give_filter: 0,
  price: '',
  remark: '',
  time: moment().format('YYYY-MM-DD HH:mm:ss'),
  car_id: props.carId
})
const emit = defineEmits(['update:visible', 'success', 'cancel'])
const formRef = ref()
const loading = ref(false)

const modalTitle = computed(() => {
  return `${props.id ? '编辑' : '添加'} ${props.carNo} 保养记录`
})
const getDetail = async () => {
  if (props.id) {
    loading.value = true
    const { code, data, msg } = await window.api.maintain.getOne({ id: props.id })
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
  const { code, msg } = await window.api.maintain.update({ ...values, id: props.id })
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
  const { code, msg } = await window.api.maintain.insert({ ...values })
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

<style lang="less" scoped></style>
