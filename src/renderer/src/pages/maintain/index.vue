<template>
  <div>
    <div class="search-info">
      <div class="search-item">
        <div class="label">车牌号码：</div>
        <a-input
          v-model:value="searchForm.car_no"
          allow-clear
          placeholder="请输入车牌号码"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">机油类型：</div>
        <a-input
          v-model:value="searchForm.oil_type"
          allow-clear
          placeholder="请输入机油类型"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">保养时间：</div>
        <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" />
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
      :scroll="{ x: 800 }"
      @change="pageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'action'">
          <a-button type="link" @click="detailClick(record)">详情</a-button>
        </template>
      </template>
    </a-table>
    <DetailModal
      :id="detailM.id"
      v-model:visible="detailM.visible"
      :car-no="detailM.carNo"
      @cancel="detailMCancel"
    ></DetailModal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue'
import DetailModal from './components/detail-modal.vue'
import moment from 'moment'

const dataSource = ref([])
const searchForm = ref({})
const loading = ref(false)
const detailM = reactive({
  visible: false,
  carNo: '',
  id: 0
})
const dateRange = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false
})
const columns = [
  { title: '编号', dataIndex: 'id', width: 72 },
  {
    title: '车牌号码',
    dataIndex: 'car_no',
    minWidth: 120
  },
  {
    title: '保养时间',
    dataIndex: 'time',
    minWidth: 200
  },
  {
    title: '当前里程',
    dataIndex: 'mileage_now'
  },
  {
    title: '下次保养里程',
    dataIndex: 'mileage_next',
    minWidth: 200
  },
  {
    title: '是否送滤芯',
    dataIndex: 'give_filter',
    customRender: ({ text }) => (text == 1 ? '是' : '否')
  },
  {
    title: '机油类型',
    dataIndex: 'oil_type',
    minWidth: 200
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
const getList = async () => {
  console.log(dateRange.value)
  let startTime
  let endTime
  if (dateRange.value && dateRange.value.length) {
    startTime = moment(dateRange.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment(dateRange.value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  }
  loading.value = true
  const { code, data, msg } = await window.api.maintain.getAll({
    ...searchForm.value,
    startTime,
    endTime,
    current: pagination.current,
    pageSize: pagination.pageSize
  })
  loading.value = false
  if (code == 200) {
    console.log(data.list)
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
  dateRange.value = []
  search()
}
getList()
const pageChange = ({ current, pageSize }) => {
  pagination.current = current
  pagination.pageSize = pageSize
  getList()
}

const detailClick = (row) => {
  detailM.id = row.id
  detailM.carNo = row.car_no
  detailM.visible = true
}
const detailMCancel = () => {
  detailM.id = 0
  detailM.carNo = ''
}
</script>

<style lang="less" scoped>
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
