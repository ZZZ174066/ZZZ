<template>
  <div class="admin-container">
    <!-- 顶部标题栏 -->
    <div class="admin-header">
      <h1 class="header-title">管理员控制台</h1>
      <div v-if="isMaintenanceMode" class="maintenance-indicator">
        <el-icon><warning /></el-icon>
        <span>维护模式已开启</span>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="admin-main">
      <!-- 左侧菜单 -->
      <div class="admin-sidebar">
        <div class="menu-item" :class="{ active: currentView === 'dashboard' }" @click="handleMenuSelect('dashboard')">
          <el-icon><grid /></el-icon>
          <span>系统用户</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'courses' }" @click="handleMenuSelect('courses')">
          <el-icon><reading /></el-icon>
          <span>课程信息</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'exams' }" @click="handleMenuSelect('exams')">
          <el-icon><document /></el-icon>
          <span>考试管理</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'settings' }" @click="handleMenuSelect('settings')">
          <el-icon><setting /></el-icon>
          <span>系统设置</span>
        </div>
      </div>
       <!-- 内容区域 -->
       <div class="admin-content">
        <!-- 系统用户 -->
        <AdminMain v-if="currentView === 'dashboard'" />
       <!-- 课程信息 -->
       <AdminCourses v-if="currentView === 'courses'" />
       <!-- 考试管理 -->
       <AdminExamManagement v-if="currentView === 'exams'" />
       <!-- 系统设置 -->
       <AdminSetting v-if="currentView === 'settings'" @logout="handleLogout" @maintenance-mode-changed="handleMaintenanceModeChanged" />
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { 
  Grid, 
  Setting,
  Reading,
  Document,
  Warning
} from '@element-plus/icons-vue'
import AdminMain from './admin-main.vue'
import AdminCourses from './admin-courses.vue'
import AdminExamManagement from './admin-exam-management.vue'
import AdminSetting from './admin-setting.vue'
// 负责管理四个子模块：系统用户、课程信息、考试管理、系统设置
export default {
  name: 'AdminPanel',
  components: {
    Grid,
    Setting,
    Reading,
    Document,
    Warning,
    AdminMain,
    AdminCourses,
    AdminExamManagement,
    AdminSetting
  },
  data() {
    return {
      currentView: 'dashboard',
      isMaintenanceMode: false,
      maintenanceCheckTimer: null
    }
  },
  mounted() {
    this.startMaintenanceCheck()
  },
  beforeUnmount() {
    this.stopMaintenanceCheck()
  },
  methods: {
    /**
     * 处理菜单选择事件
     * @param {string} index - 菜单项索引（dashboard/courses/exams/settings）
     */
    handleMenuSelect(index) {
      this.currentView = index
    },
    // 处理子组件的退出登录事件
    handleLogout() {
      this.$router.push({ name: 'Login' })
      ElMessage.success('已退出登录')
    },
    // 处理维护模式状态改变事件
    handleMaintenanceModeChanged(isMaintenanceMode) {
      // 立即更新状态，无需等待定时检查
      this.isMaintenanceMode = isMaintenanceMode
    },
    // 开始维护模式检测
    startMaintenanceCheck() {
      // 立即检查一次
      this.checkMaintenanceMode()
      // 每3秒检查一次维护模式状态（提高检测频率）
      this.maintenanceCheckTimer = setInterval(async () => {
        await this.checkMaintenanceMode()
      }, 3000)
    },
    // 停止维护模式检测
    stopMaintenanceCheck() {
      if (this.maintenanceCheckTimer) {
        clearInterval(this.maintenanceCheckTimer)
        this.maintenanceCheckTimer = null
      }
    },
    // 检查维护模式状态（管理员只需要更新状态指示器）
    async checkMaintenanceMode() {
      try {
        const response = await axios.get('http://localhost:8080/api/user/getMaintenanceMode')
        this.isMaintenanceMode = response.data.maintenanceMode
      } catch (error) {
        console.error('检查维护模式状态失败:', error)
      }
    }
  }
}
</script>
<style scoped>
/* 整体容器 */
.admin-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}
/* 顶部标题栏 */
.admin-header {
  background: #ffffff;
  border-bottom: 3px solid #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  height: 70px;
  box-sizing: border-box;
}
.header-title {
  margin: 0;
  color: #000000;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex: 1;
}
.maintenance-indicator {
  display: flex;
  align-items: center;
  background: #ff4444;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 68, 68, 0.3);
  animation: pulse 2s infinite;
}
.maintenance-indicator .el-icon {
  margin-right: 6px;
  font-size: 16px;
}
@keyframes pulse {
  0% { box-shadow: 0 4px 10px rgba(255, 68, 68, 0.3); }
  50% { box-shadow: 0 6px 15px rgba(255, 68, 68, 0.6); }
  100% { box-shadow: 0 4px 10px rgba(255, 68, 68, 0.3); }
}
/* 主体内容区域 */
.admin-main {
  display: flex;
  flex: 1;
  height: calc(100vh - 70px);
}
/* 左侧菜单栏 */
.admin-sidebar {
  width: 200px;
  background: #ffffff;
  border-right: 2px solid #000000;
  padding: 0;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #000000;
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  transition: background-color 0.3s;
}
.menu-item:hover {
  background-color: #f0f0f0;
}
.menu-item.active {
  background-color: #000000;
  color: #ffffff;
}
.menu-item .el-icon {
  margin-right: 12px;
  font-size: 24px;
}
/* 内容区域 */
.admin-content {
  flex: 1;
  background: #ffffff;
  padding: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>