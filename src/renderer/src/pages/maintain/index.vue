<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="pagination">
      <template #action>
        <a-button type="link">编辑</a-button>
      </template>
    </a-table>
  </div>
</template>
<script setup>
const dataSource = reactive([{}])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const columns = [
  {
    title: '车主',
    dataIndex: 'car_name'
  },
  {
    title: '车牌号',
    dataIndex: 'car_no',
    key: 'address'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
</script>
