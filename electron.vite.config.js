import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// 自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-import.d.js',
        eslintrc: {
          enabled: true
        },
        resolvers: [AntDesignVueResolver()]
      }),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: true, resolveIcons: true })]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#2ac7d5',
            'link-color': '#2ac7d5',
            'border-radius-base': '2px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
})
