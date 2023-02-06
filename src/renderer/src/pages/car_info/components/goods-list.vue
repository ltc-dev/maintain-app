<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    bordered
    :pagination="pagination"
    :loading="loading"
    size="small"
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
    dis-jump
    @cancel="detailMCancel"
  ></DetailModal>
</template>

<script setup>
import DetailModal from '../../goods/components/detail-modal.vue'
const props = defineProps({
  carId: [Number, String]
})
const dataSource = ref([])
const loading = ref(false)
const detailM = reactive({
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
  {
    title: '进货时间',
    dataIndex: 'purchase_time',
    minWidth: 200
  },
  {
    title: '商品名称',
    dataIndex: 'name'
  },
  {
    title: '品牌',
    dataIndex: 'brand'
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
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
const getList = async () => {
  loading.value = true
  const { code, data } = await window.api.goods.getAllByCarId({
    car_id: props.carId
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

const detailClick = (row) => {
  detailM.id = row.id
  detailM.visible = true
}
const detailMCancel = () => {
  detailM.id = 0
}
</script>
