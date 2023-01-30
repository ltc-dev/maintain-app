<template>
  <div class="lock">
    <div v-if="lock.locking" class="center-box">
      <div class="row">
        <a-input-password
          v-model:value="password"
          size="large"
          placeholder="请输入密码"
          @pressEnter="submit"
        >
          <template #prefix>
            <user-outlined type="user" />
          </template>
        </a-input-password>
      </div>
      <div class="row">
        <a-button type="primary" block size="large" shape="round" @click="submit">确定</a-button>
      </div>
    </div>
    <a-spin v-else size="large" tip="加载中..."> </a-spin>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue'
import { getLocalItem, setLocalItem } from '../../../../utils/storage'
const password = ref('')
const lock = getLocalItem('lock') || {}
const router = useRouter()
console.log(lock)
if (!lock.locking) {
  router.push(lock.path || '/car_info')
}
console.log(lock)
const submit = () => {
  console.log(password, lock.password)
  if (password.value == lock.password) {
    setLocalItem('lock', {
      ...lock,
      locking: false
    })
    router.push(lock.path || '/car_info')
  } else {
    message.error('密码错误！请重新输入')
  }
}
</script>

<style lang="less" scoped>
.lock {
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .center-box {
    .row {
      margin-bottom: 20px;
    }
  }
}
</style>
