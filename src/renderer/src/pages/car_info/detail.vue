<template>
  <div class="detail">
    <div class="base-info">
      <a-spin :spinning="baseInfoLoading" tip="加载中...">
        <a-descriptions
          :column="2"
          :content-style="{ 'font-size': '14px', color: '#666' }"
          :label-style="{ 'font-weight': 'bold' }"
          title="车辆基本信息"
        >
          <a-descriptions-item label="车牌号码">{{ baseInfo.car_no || '--' }}</a-descriptions-item>
          <a-descriptions-item label="车主姓名">{{ baseInfo.name || '--' }}</a-descriptions-item>
          <a-descriptions-item label="电话号码">{{ baseInfo.phone || '--' }}</a-descriptions-item>
          <a-descriptions-item label="轮胎型号">{{
            baseInfo.tyre_type || '--'
          }}</a-descriptions-item>
          <a-descriptions-item label="车辆型号">{{
            baseInfo.car_brand_type || '--'
          }}</a-descriptions-item>
          <a-descriptions-item label="车辆颜色">
            {{ baseInfo.car_color || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="家庭地址">
            {{ baseInfo.address || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="备注信息">
            {{ baseInfo.remark || '--' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </div>
    <div class="maintain-box">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane :key="1">
          <template #tab>
            <span>
              <insurance-two-tone></insurance-two-tone>
              保养记录
            </span>
          </template>
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :loading="loading"
            size="small"
            :scroll="{ x: 800 }"
            @change="pageChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key == 'action'">
                <a-button type="link" @click="eidtMaintainClick(record)">编辑</a-button>
                <a-button type="link" danger @click="delClick(record)">删除</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="商品记录">
          <GoodsList :car-id="id"></GoodsList>
        </a-tab-pane>
        <template #rightExtra>
          <a-button v-if="activeKey == 1" type="primary" @click="eidtMaintainClick"
            ><template #icon><plus-outlined /></template>添加保养记录</a-button
          >
        </template>
      </a-tabs>
    </div>
    <edit-modal
      :id="editM.id"
      v-model:visible="editM.visible"
      :car-no="editM.carNo"
      :car-id="id"
      @success="editModalSuccess"
      @cancel="() => (editM.id = '')"
    ></edit-modal>
  </div>
</template>
<script setup>
import { Modal, message } from 'ant-design-vue'
import editModal from '../maintain/components/edit-modal.vue'
import GoodsList from './components/goods-list.vue'

const route = useRoute()
const id = route.query.id
const loading = ref(false)
const baseInfoLoading = ref(false)
const baseInfo = ref({})
const activeKey = ref(1)
const getDetail = async () => {
  baseInfoLoading.value = true
  const { code, data, msg } = await window.api.carInfo.getOne({
    id
  })
  baseInfoLoading.value = false
  if (code == 200) {
    baseInfo.value = data
    editM.carNo = baseInfo.value.car_no
  } else {
    message.error(msg)
  }
}
getDetail()
const dataSource = ref([])

const editM = reactive({
  visible: false,
  id: 0,
  carNo: ''
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false
})
const columns = [
  {
    title: '创建时间',
    dataIndex: 'create_time',
    minWidth: 200
  },
  {
    title: '当前里程',
    dataIndex: 'mileage_now'
  },
  {
    title: '下次保养里程',
    dataIndex: 'mileage_next'
  },
  {
    title: '机油类型',
    dataIndex: 'oil_type'
  },
  {
    title: '是否送滤芯',
    dataIndex: 'give_filter',
    customRender: ({ text }) => (text == 1 ? '是' : '否')
  },
  {
    title: '价格',
    dataIndex: 'price'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const getList = async () => {
  loading.value = true
  const { code, data } = await window.api.maintain.getAllByCarId({
    car_id: id
  })
  loading.value = false
  if (code == 200) {
    console.log(data)
    dataSource.value = data || []
    pagination.total = dataSource.value.length
  }
}

getList()
const pageChange = ({ current }) => {
  pagination.current = current
}

const eidtMaintainClick = (row) => {
  if (row && row.id) {
    editM.id = row.id
  } else {
    editM.id = ''
  }
  editM.visible = true
}

const editModalSuccess = () => {
  editM.id = ''
  getList()
}

const delClick = (row) => {
  Modal.confirm({
    title: '确定要删除吗？',
    onOk: async () => {
      loading.value = true
      const { code, data, msg } = await window.api.maintain.del({ id: row.id })
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
.detail {
  & > div {
    border-radius: 4px;
    background-color: #fff;
  }
  .base-info {
    padding: 12px 20px;
    margin-bottom: 12px;
  }
  .maintain-box {
    padding: 0 20px;
    .maintain-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 18px;
        font-weight: bold;
        margin: 0 12px;
      }
    }
  }
}
</style>
