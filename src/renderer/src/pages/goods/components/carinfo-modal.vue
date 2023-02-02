<template>
  <a-modal
    :visible="props.visible"
    title="关联车辆信息"
    :width="680"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div>
      <div class="search-info">
        <div class="search-item">
          <div class="label">车牌号：</div>
          <a-input
            v-model:value="searchForm.car_no"
            allow-clear
            placeholder="请输入车牌号码"
          ></a-input>
        </div>
        <div class="search-item">
          <div class="label">车主：</div>
          <a-input
            v-model:value="searchForm.name"
            allow-clear
            placeholder="请输入车主名称"
          ></a-input>
        </div>
        <div class="search-item">
          <div class="label">电话号码：</div>
          <a-input
            v-model:value="searchForm.phone"
            allow-clear
            placeholder="请输入电话号码"
          ></a-input>
        </div>
        <div class="search-item">
          <div class="btn">
            <a-button type="primary" :loading="loading" @click="search">查询</a-button>
          </div>
          <div class="btn">
            <a-button type="primary" ghost :loading="loading" @click="reset">重置</a-button>
          </div>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        size="small"
        :row-selection="{
          onChange: onChange,
          selectedRowKeys: selectedRowIds,
          type: 'radio'
        }"
        @change="pageChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key == 'action'">
            <a-button type="link" @click="editClick(record)">编辑</a-button>
            <a-button type="link" @click="detailClick(record)">详情</a-button>
            <a-button type="link" danger @click="delClick(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue'
const props = defineProps({
  visible: Boolean,
  selectId: [Number, String]
})
const emit = defineEmits(['update:visible', 'update:selectId'])
const loading = ref(false)
const searchForm = ref({})
const dataSource = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false
})
const columns = [
  {
    title: '车主',
    dataIndex: 'name'
  },
  {
    title: '车牌号',
    dataIndex: 'car_no',
    minWidth: 120
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    minWidth: 132
  },
  {
    title: '轮胎型号',
    dataIndex: 'tyre_type'
  }
]
const getList = async () => {
  loading.value = true
  const { code, data, msg } = await window.api.carInfo.getAll({
    ...searchForm.value,
    current: pagination.current,
    pageSize: pagination.pageSize
  })
  loading.value = false
  if (code == 200) {
    dataSource.value = data.list
    pagination.total = data.total
  } else {
    message.error(msg)
  }
}

const search = () => {
  pagination.current = 1
  getList()
}
const reset = () => {
  searchForm.value = {}
  search()
}
getList()
const pageChange = ({ current, pageSize }) => {
  pagination.current = current
  pagination.pageSize = pageSize
  getList()
}

const selectedRowIds = computed(() => [props.selectId])
const onChange = (ids) => {
  emit('update:selectId', ids[0])
}
const handleOk = () => {
  emit('update:selectId', selectedRowIds.value[0])
  handleCancel()
}
const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style lang="less" scoped>
.ant-btn-sm {
  height: 22px;
}
.search-info {
  display: flex;
  flex-wrap: wrap;
  .search-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .label {
      width: 100px;
      flex-shrink: 0;
      text-align: right;
    }
    .btn {
      margin-left: 24px;
    }
  }
}
</style>
