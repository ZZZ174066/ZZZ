import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/admin.vue'),
      meta: { requiresAuth: true, allowedUserTypes: [1] }
    },
    {
      path: '/student',
      name: 'Student',
      component: () => import('../views/student.vue'),
      meta: { requiresAuth: true, allowedUserTypes: [3] }
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: () => import('../views/teacher.vue'),
      meta: { requiresAuth: true, allowedUserTypes: [2] }
    },
    // 可以在这里添加新的路由配置
  ],
})

// 路由守卫：检查维护模式和用户权限
router.beforeEach(async (to, from, next) => {
  // 如果是登录页面，直接放行
  if (to.name === 'Login') {
    next()
    return
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    try {
      // 检查维护模式状态
      const maintenanceRes = await axios.get('http://localhost:8080/api/user/getMaintenanceMode')
      const isMaintenanceMode = maintenanceRes.data.maintenanceMode

      // 获取当前用户信息
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}')
      
      if (isMaintenanceMode) {
        // 如果是维护模式，只允许管理员访问
        if (!currentUser.id || currentUser.userType !== 1) {
          ElMessage.warning('系统正在维护中，您已被强制退出登录')
          // 清理本地存储
          localStorage.removeItem('currentUser')
          sessionStorage.removeItem('currentUser')
          next({ name: 'Login' })
          return
        }
      }

      // 检查用户类型权限
      if (to.meta.allowedUserTypes && !to.meta.allowedUserTypes.includes(currentUser.userType)) {
        ElMessage.error('您没有权限访问此页面')
        next({ name: 'Login' })
        return
      }

      next()
    } catch (error) {
      console.error('路由守卫检查失败:', error)
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router