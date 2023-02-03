<template>
  <div class="lock">
    <div class="center-box">
      <div class="lock-img">
        <img src="../../assets/lock.svg" alt="" />
      </div>
      <div class="row">
        <a-input-password
          v-model:value.trim="password"
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
        <a-button type="primary" block size="large" :loading="loading" shape="round" @click="submit"
          >确定</a-button
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue'
import { getLocalItem } from '../../../../utils/storage'
const password = ref('')
const loading = ref(false)
const router = useRouter()
const submit = async () => {
  loading.value = true
  const lock = await window.api.store({ type: 'get', key: 'lock' })
  loading.value = false
  if (password.value == lock.password) {
    router.push(getLocalItem('lockPath') || '/car_info')
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
    padding-bottom: 80px;
    .lock-img {
      width: 320px;
      margin-bottom: 32px;
    }
    .row {
      margin-bottom: 20px;
    }
  }
}
</style>
