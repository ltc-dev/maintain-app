<template>
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
        <a-input v-model:value="searchForm.name" allow-clear placeholder="请输入车主名称"></a-input>
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
        <div class="label">地址：</div>
        <a-input v-model:value="searchForm.address" allow-clear placeholder="请输入地址"></a-input>
      </div>
      <div class="search-item">
        <div class="btn">
          <a-button type="primary" :loading="loading" @click="search">查询</a-button>
        </div>
        <div class="btn">
          <a-button type="primary" ghost :loading="loading" @click="reset">重置</a-button>
        </div>
        <div class="btn">
          <a-button danger :loading="loading" @click="addClick">添加车辆信息</a-button>
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
          <a-button type="link" @click="editClick(record)">编辑</a-button>
          <a-button type="link" danger @click="delClick(record)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { Modal } from 'ant-design-vue'
const dataSource = ref([])
const searchForm = ref({})
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false
})
const columns = [
  { title: '编号', dataIndex: 'id' },
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
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    minWidth: 200
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
const getList = async () => {
  loading.value = true
  const { code, data } = await window.api.carInfo.getAll({
    ...searchForm.value,
    current: pagination.current,
    pageSize: pagination.pageSize
  })
  loading.value = false
  if (code == 200) {
    dataSource.value = data.list
    pagination.total = data.total
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

const editClick = (row) => {
  console.log(row)
}

const addClick = () => {}

const delClick = (row) => {
  Modal.confirm({
    title: '确定要删除吗？',
    onOk: async () => {
      const { code, data } = await window.api.carInfo.del({ id: row.id })
      if (code == 200) {
        console.log(data)
        getList()
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
