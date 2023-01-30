import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/antd.less' // 引入官方提供的 less 样式入口文件
import '@renderer/assets/css/styles.less'

// 引入pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 注册pinia持久化插件
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(pinia).mount('#app')
