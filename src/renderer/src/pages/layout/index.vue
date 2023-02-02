<template>
  <div class="layout">
    <div class="header">
      <div class="logo" @click="setLock">斌子汽车维修保养中心</div>
      <div
        v-for="tab in tabs"
        :key="tab"
        class="header-item"
        :class="activeTab == tab.id ? 'active' : ''"
        @click="tabChange(tab)"
      >
        {{ tab.name }}
      </div>
      <div>
        <a-button
          v-if="lockModal.openLock"
          type="primary"
          ghost
          shape="circle"
          size="large"
          @click="lockClick"
        >
          <template #icon><lock-outlined /></template>
        </a-button>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
    <a-modal
      v-model:visible="lockModal.visible"
      title="设置"
      :after-close="setModalClose"
      @ok="lockModalOk"
    >
      <div class="modal-row">
        <div class="label">系统锁：</div>
        <a-switch
          v-model:checked="lockModal.openLock"
          checked-children="开"
          un-checked-children="关"
        />
      </div>
      <div v-if="lockModal.openLock" class="modal-row">
        <div class="label">密码：</div>
        <a-input-password
          v-model:value="lockModal.password"
          size="large"
          placeholder="请输入密码"
        />
      </div>
      <div class="modal-row">
        <div class="label">数据备份：</div>
        <a-button type="primary" :loading="backupLoading" @click="backupClick">备份</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue'
import { setLocalItem } from '../../../../utils/storage'

const tabs = [
  { name: '车辆信息', path: '/car_info', id: 0 },
  { name: '保养记录', path: '/maintain', id: 1 },
  { name: '货物信息', path: '/goods', id: 2 }
]
const router = useRouter()
const route = useRoute()
const activeTab = ref(0)
const backupLoading = ref(false)

const tabChange = (tab) => {
  router.push(tab.path)
}

const activeTabChage = () => {
  tabs.some((tab) => {
    if (tab.path == route.path) {
      activeTab.value = tab.id
      return true
    }
  })
}
activeTabChage()

const lockModal = reactive({
  visible: false,
  openLock: false,
  password: ''
})
const getLock = async () => {
  const lock = await window.api.store({ type: 'get', key: 'lock' })
  lockModal.openLock = lock.openLock
  lockModal.password = lock.password
}
getLock()

const lockModalOk = () => {
  const { openLock, password = '' } = lockModal
  if (!password) {
    return message.error('请输入密码才能开启系统锁！！！')
  } else {
    window.api.store({
      type: 'set',
      key: 'lock',
      value: {
        openLock,
        password
      }
    })
    router.push('/lock')
  }
  lockModal.visible = false
}

const setModalClose = () => {
  getLock()
}
const setLock = () => {
  lockModal.visible = true
}
const lockClick = () => {
  setLocalItem('lockPath', route.path)
  router.push('/lock')
}
const backupClick = async () => {
  backupLoading.value = true
  const res = await window.api.backup()
  backupLoading.value = false
  if (res) {
    Modal.success({
      title: `备份成功，备份数据路径：${res}`
    })
  }
}
watch(() => route.path, activeTabChage)
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  background-color: #744ec4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  .logo {
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }
  .header-item {
    color: #fff;
    margin: 0 20px;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    border: 1px solid #fff;
    border-radius: 4px;
    &:hover {
      background-color: #8776b1;
      color: #fff;
    }
  }
  .active {
    background-color: #8776b1;
    color: #fff;
    border-color: #8776b1;
    font-weight: 700;
  }
}
.layout {
  height: 100vh;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  .container {
    padding: 12px;
    flex: 1;
    overflow: auto;
    background-color: rgba(115, 78, 196, 0.1);
  }
}
.modal-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  .label {
    width: 100px;
    flex-shrink: 0;
    text-align: right;
  }
}
</style>
