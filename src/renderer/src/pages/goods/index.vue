<template>
  <div>
    <div class="search-info">
      <div class="search-item">
        <div class="label">货物名称：</div>
        <a-input v-model:value="searchForm.name" allow-clear placeholder="请输入货物名称"></a-input>
      </div>
      <div class="search-item">
        <div class="label">货物品牌：</div>
        <a-input
          v-model:value="searchForm.brand"
          allow-clear
          placeholder="请输入货物品牌"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">货物型号：</div>
        <a-input v-model:value="searchForm.type" allow-clear placeholder="请输入货物型号"></a-input>
      </div>
      <div class="search-item">
        <div class="label">时间范围：</div>
        <a-range-picker
          v-model:value="dateRange"
          value-format="YYYY-MM-DD"
          placeholder="请选择时间范围"
        />
      </div>
      <div class="search-item">
        <div class="btn">
          <a-button type="primary" :loading="loading" @click="search">查询</a-button>
        </div>
        <div class="btn">
          <a-button type="primary" ghost :loading="loading" @click="reset">重置</a-button>
        </div>
        <div class="btn">
          <a-button danger :loading="loading" @click="() => editClick()">
            <template #icon><plus-outlined /></template>
            添加商品信息</a-button
          >
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
          <a-button type="link" @click="editClick(record)">编辑</a-button>
          <a-button type="link" danger @click="delClick(record)">删除</a-button>
        </template>
      </template>
    </a-table>
    <DetailModal
      :id="detailM.id"
      v-model:visible="detailM.visible"
      @cancel="detailMCancel"
    ></DetailModal>
    <EditModal
      :id="editM.id"
      v-model:visible="editM.visible"
      @success="editModalSuccess"
      @cancel="editModalCancel"
    ></EditModal>
  </div>
</template>
<script setup>
import { message, Modal } from 'ant-design-vue'
import DetailModal from './components/detail-modal.vue'
import EditModal from './components/edit-modal.vue'
import moment from 'moment'

const dataSource = ref([])
const searchForm = ref({})
const loading = ref(false)
const detailM = reactive({
  visible: false,
  id: 0
})
const editM = reactive({
  visible: false,
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
    title: '商品名称',
    dataIndex: 'name'
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    minWidth: 200
  },
  {
    title: '型号',
    dataIndex: 'type'
  },
  {
    title: '供货商',
    dataIndex: 'merchant'
  },
  {
    title: '进货时间',
    dataIndex: 'purchase_time',
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
  const { code, data, msg } = await window.api.goods.getAll({
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
  detailM.visible = true
}
const detailMCancel = () => {
  detailM.id = 0
}

const editClick = (row) => {
  if (row && row.id) {
    editM.id = row.id
  } else {
    editM.id = ''
  }
  editM.visible = true
}
const editModalSuccess = () => {
  editM.id = ''
  search()
}

const editModalCancel = () => {
  editM.id = ''
}

const delClick = (row) => {
  Modal.confirm({
    title: '确定要删除吗？',
    onOk: async () => {
      loading.value = true
      const { code, data, msg } = await window.api.goods.del({ id: row.id })
      loading.value = false
      if (code == 200) {
        console.log(data)
        getList()
      } else {
        message.error(msg)
      }
    }
  })
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
