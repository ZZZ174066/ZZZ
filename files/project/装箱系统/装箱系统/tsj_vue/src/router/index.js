import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/plan/:id',
      name: 'PlanDetail',
      component: () => import('../views/PlanDetail.vue'),
    },
  ],
})

export default router