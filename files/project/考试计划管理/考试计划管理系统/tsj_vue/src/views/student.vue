<template>
  <div class="student-container">
    <!-- 顶部标题栏 -->
    <div class="student-header">
      <h1 class="header-title">欢迎您，{{ studentInfo.realName || studentInfo.username }}！</h1>
    </div>
    <!-- 主体内容区域 -->
    <div class="student-main">
      <!-- 左侧菜单 -->
      <div class="student-sidebar">
        <div class="menu-item" :class="{ active: currentView === 'major-plan' }" @click="handleMenuSelect('major-plan')">
          <el-icon><document /></el-icon>
          <span>课程报名</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'exam-plan' }" @click="handleMenuSelect('exam-plan')">
          <el-icon><calendar /></el-icon>
          <span>考试计划</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'exam-results' }" @click="handleMenuSelect('exam-results')">
          <el-icon><data-analysis /></el-icon>
          <span>考试成绩</span>
        </div>
        <div class="menu-item" :class="{ active: currentView === 'service-center' }" @click="handleMenuSelect('service-center')">
          <el-icon><service /></el-icon>
          <span>服务中心</span>
          </div>
        <div class="menu-item" :class="{ active: currentView === 'personal-info' }" @click="handleMenuSelect('personal-info')">
          <el-icon><user /></el-icon>
          <span>个人信息</span>
        </div>
      </div>
       <!-- 内容区域 -->
       <div class="student-content">
         <!-- 课程报名 -->
         <StudentMajorPlan v-if="currentView === 'major-plan'" />
        
        <!-- 考试计划 -->
        <StudentExamPlan v-if="currentView === 'exam-plan'" />
        
        <!-- 考试成绩 -->
        <StudentExamResults v-if="currentView === 'exam-results'" />
        
        <!-- 服务中心 -->
        <StudentServiceCenter v-if="currentView === 'service-center'" />
        
        <!-- 个人信息 -->
        <StudentInformation 
          v-if="currentView === 'personal-info'" 
          :studentInfo="studentInfo"
          @profile-updated="handleProfileUpdated"
          @logout="handleLogout"
            />
          </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { 
  Document, 
  Calendar,
  DataAnalysis,
  Service,
  User
} from '@element-plus/icons-vue'
import StudentMajorPlan from './student-major-plan.vue'
import StudentExamPlan from './student-exam-plan.vue'
import StudentExamResults from './student-exam-results.vue'
import StudentServiceCenter from './student-service-center.vue'
import StudentInformation from './student-information.vue'

// 负责管理五个子模块：课程报名、考试计划、考试成绩、服务中心、个人信息
export default {
  name: 'StudentPanel',
  components: {
    Document,
    Calendar,
    DataAnalysis,
    Service,
    User,
    StudentMajorPlan,
    StudentExamPlan,
    StudentExamResults,
    StudentServiceCenter,
    StudentInformation
  },
  data() {
    return {
      currentView: 'major-plan',
      studentInfo: {
        id: null, 
        username: '', 
        realName: '', 
        phone: '', 
        email: '', 
        password: '',
        userType: null,
        avatar: '', 
        onlineStatus: 0
      },
      maintenanceCheckTimer: null
    }
  },
  mounted() {
    this.initStudentData()
    this.startMaintenanceCheck()
  },
  beforeUnmount() {
    this.stopMaintenanceCheck()
  },
  methods: {
    // 初始化学生数据，从路由参数中获取用户ID并加载数据
    async initStudentData() {
      const userId = this.$route.query.userId 
      if (userId) {
        await this.loadStudentProfile(userId)
      }
    },
    // 通过用户ID从后端加载学生信息
    async loadStudentProfile(userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/getUserById/${userId}`)
        if (response.data && response.data.success) {
          const userData = response.data.data || response.data.user
          this.studentInfo = {
            id: userData.id,
            username: userData.username,
            realName: userData.realName,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            userType: userData.userType,
            avatar: userData.avatar,
            onlineStatus: userData.onlineStatus
          }
        }
      } catch (error) {
        console.error('加载学生信息失败:', error)
      }
    },
    /**
     * 处理菜单选择事件
     * @param {string} index - 菜单项索引
     */
    handleMenuSelect(index) {
      this.currentView = index
    },
    // 处理子组件的退出登录事件
    handleLogout() {
      this.$router.push({ name: 'Login' })
      ElMessage.success('已退出登录')
    },
    // 处理子组件的个人信息更新事件
    handleProfileUpdated(updatedInfo) {
      // 更新本地数据
      if (updatedInfo.realName !== undefined) {
        this.studentInfo.realName = updatedInfo.realName
      }
      if (updatedInfo.phone !== undefined) {
        this.studentInfo.phone = updatedInfo.phone
      }
      if (updatedInfo.email !== undefined) {
        this.studentInfo.email = updatedInfo.email
      }
      if (updatedInfo.password !== undefined) {
        this.studentInfo.password = updatedInfo.password
      }
      if (updatedInfo.avatar !== undefined) {
        this.studentInfo.avatar = updatedInfo.avatar
      }
      if (updatedInfo.id !== undefined) {
        this.studentInfo.id = updatedInfo.id
      }
      if (updatedInfo.username !== undefined) {
        this.studentInfo.username = updatedInfo.username
      }
      if (updatedInfo.userType !== undefined) {
        this.studentInfo.userType = updatedInfo.userType
      }
      if (updatedInfo.onlineStatus !== undefined) {
        this.studentInfo.onlineStatus = updatedInfo.onlineStatus
      }
      // 更新本地存储的用户信息
      this.updateLocalUserInfo()
    },
    // 更新本地存储的用户信息，同步更新localStorage和sessionStorage中的用户数据
    updateLocalUserInfo() {
      try {
        const updatedUserInfo = {
          id: this.studentInfo.id,
          username: this.studentInfo.username,
          realName: this.studentInfo.realName,
          phone: this.studentInfo.phone,
          email: this.studentInfo.email,
          userType: this.studentInfo.userType,
          avatar: this.studentInfo.avatar,
          onlineStatus: this.studentInfo.onlineStatus
        }
        // 更新localStorage
        if (localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUserInfo))
        }
        // 更新sessionStorage
        if (sessionStorage.getItem('currentUser')) {
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUserInfo))
        }
      } catch (error) {
        console.error('更新本地用户信息失败:', error)
      }
    },
    // 开始维护模式检测
    startMaintenanceCheck() {
      // 每5秒检查一次维护模式状态
      this.maintenanceCheckTimer = setInterval(async () => {
        await this.checkMaintenanceMode()
      }, 5000)
    },
    // 停止维护模式检测
    stopMaintenanceCheck() {
      if (this.maintenanceCheckTimer) {
        clearInterval(this.maintenanceCheckTimer)
        this.maintenanceCheckTimer = null
      }
    },
    // 检查维护模式状态
    async checkMaintenanceMode() {
      try {
        const response = await axios.get('http://localhost:8080/api/user/getMaintenanceMode')
        if (response.data.maintenanceMode) {
          // 系统进入维护模式，强制退出
          this.stopMaintenanceCheck()
          ElMessage.warning('系统已进入维护模式，您将被强制退出登录')
          
          // 清理本地存储
          localStorage.removeItem('currentUser')
          sessionStorage.removeItem('currentUser')
          
          // 跳转到登录页面
          setTimeout(() => {
            this.$router.push({ name: 'Login' })
          }, 2000)
        }
      } catch (error) {
        console.error('检查维护模式状态失败:', error)
      }
    }
  }
}
</script>

<style scoped>
/* 整体容器 */
.student-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}
/* 顶部标题栏 */
.student-header {
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
/* 主体内容区域 */
.student-main {
  display: flex;
  flex: 1;
  height: calc(100vh - 70px);
}
/* 左侧菜单栏 */
.student-sidebar {
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
.student-content {
  flex: 1;
  background: #ffffff;
  padding: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
