import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior(to, from, savedPosition) {
  //   return { top: 0 }
  // },
  routes: []
})

export const dynamicRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'workflow',
    meta: { title: '流程', permissionId: '100' },
    redirect: '/workflow/edit',
    icon: '#icon-approve',
    children: [{ path: '/workflow/edit', component: () => import('@/views/workflow/WorkFlowView.vue'), meta: { title: '流程编辑器', permission: '100001' }, hidden: true }]
  }
]
