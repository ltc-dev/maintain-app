import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@renderer/pages/layout/index.vue'),
      children: [
        {
          path: 'car_info',
          component: () => import('@renderer/pages/car_info/index.vue')
        },
        {
          path: 'maintain',
          component: () => import('@renderer/pages/maintain/index.vue')
        },
        {
          path: 'goods',
          component: () => import('@renderer/pages/goods/index.vue')
        }
      ]
    },
    {
      path: '/lock',
      component: () => import('@renderer/pages/lock/index.vue')
    }
  ]
})
// const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  console.log(to, from)
  next()
})

export default router
