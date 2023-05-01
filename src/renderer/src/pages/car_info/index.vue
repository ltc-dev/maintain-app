<template>
  <div v-if="route.query.id">
    <div class="back-btn">
      <a-button type="link" @click="goBack">
        <template #icon><rollback-outlined /></template>
        返回
      </a-button>
    </div>
    <Detail></Detail>
  </div>
  <div v-else>
    <div class="search-info">
      <div class="search-item">
        <div class="label">车牌号：</div>
        <a-input
          v-model:value.trim="searchForm.car_no"
          allow-clear
          placeholder="请输入车牌号码"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">车辆型号：</div>
        <a-input
          v-model:value.trim="searchForm.car_brand_type"
          allow-clear
          placeholder="请输入车辆型号"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">车主：</div>
        <a-input
          v-model:value.trim="searchForm.name"
          allow-clear
          placeholder="请输入车主名称"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">电话号码：</div>
        <a-input
          v-model:value.trim="searchForm.phone"
          allow-clear
          placeholder="请输入电话号码"
        ></a-input>
      </div>
      <div class="search-item">
        <div class="label">地址：</div>
        <a-input
          v-model:value.trim="searchForm.address"
          allow-clear
          placeholder="请输入地址"
        ></a-input>
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
            添加车辆信息</a-button
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
      bordered
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
    <edit-modal
      :id="editM.id"
      v-model:visible="editM.visible"
      @success="editModalSuccess"
      @cancel="() => (editM.id = '')"
    ></edit-modal>
  </div>
</template>
<script setup>
import { Modal, message } from 'ant-design-vue'
import editModal from './components/edit-modal.vue'
import Detail from './detail.vue'
const router = useRouter()
const route = useRoute()
const dataSource = ref([])
const searchForm = ref({})
const loading = ref(false)
const editM = reactive({
  visible: false,
  id: 0
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false
})
const columns = [
  { title: '编号', dataIndex: 'id', width: 68 },
  {
    title: '车牌号',
    dataIndex: 'car_no',
    minWidth: 120
  },
  // {
  //   title: '车主',
  //   dataIndex: 'name'
  // },
  {
    title: '车辆型号',
    dataIndex: 'car_brand_type',
    minWidth: 120
  },
  {
    title: '出厂年份',
    dataIndex: 'production_year',
    minWidth: 120
  },
  {
    title: '排量',
    dataIndex: 'displacement',
    minWidth: 120
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    minWidth: 132
  },
  // {
  //   title: '轮胎型号',
  //   dataIndex: 'tyre_type'
  // },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    minWidth: 200
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 240,
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

const delClick = (row) => {
  Modal.confirm({
    title: '确定要删除吗？',
    onOk: async () => {
      let flag = await getCorrelInfo(row.id)
      if (flag) {
        loading.value = true
        const { code, data, msg } = await window.api.carInfo.del({ id: row.id })
        loading.value = false
        if (code == 200) {
          console.log(data)
          getList()
        } else {
          message.error(msg)
        }
      } else {
        Modal.warn({
          title: '请先删除当前车辆下相关联的保养记录或商品记录'
        })
      }
    }
  })
}

const getCorrelInfo = async (id) => {
  loading.value = true
  const maintainInfo = await window.api.maintain.getAllByCarId({
    car_id: id
  })
  const goodsInfo = await window.api.goods.getAllByCarId({
    car_id: id
  })
  loading.value = false
  if (
    (maintainInfo.data && maintainInfo.data.length) ||
    (goodsInfo.data && goodsInfo.data.length)
  ) {
    return false
  }
  return true
}
const detailClick = (row) => {
  router.push({
    query: { id: row.id }
  })
}
const goBack = () => {
  router.back()
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
