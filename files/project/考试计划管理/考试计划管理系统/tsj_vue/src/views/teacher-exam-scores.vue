<template>
  <div class="teacher-exam-scores">
    <!-- 学科筛选按钮组 -->
    <div class="filters-container">
      <div 
        v-for="subject in teacherSubjects" 
        :key="subject"
        class="filter-card" 
        :class="{ black: selectedSubject === subject, white: selectedSubject !== subject }" 
        @click="selectSubject(subject)"
      >
        <div class="filter-icon">
          <el-icon><reading /></el-icon>
        </div>
        <div class="filter-content">
          <div class="filter-label">{{ subject }}</div>
        </div>
      </div>
    </div>

    <!-- 成绩表格区域 -->
    <div class="grades-table-container" v-if="selectedSubject">
      <div class="content-header">
        <h1 class="subject-title">学生成绩表</h1>
        <div class="action-buttons">
          <button class="action-btn refresh" @click="refreshData" :disabled="loading">刷新</button>
          <button class="action-btn export" @click="exportExcel">导出</button>
        </div>
      </div>
      
      <!-- 固定表头 -->
      <div class="table-header-fixed">
        <table class="grades-table header-table">
          <thead>
            <tr>
              <th style="width: 15%;">学号</th>
              <th style="width: 25%;">学生姓名</th>
              <th style="width: 20%;">学生成绩</th>
              <th style="width: 40%;">操作</th>
            </tr>
          </thead>
        </table>
      </div>
      
      <!-- 可滚动表格内容 -->
      <div class="table-body-scrollable">
        <table class="grades-table body-table">
          <tbody>
            <tr v-for="student in studentGrades" :key="student.studentId">
              <td style="width: 15%;">{{ student.studentNumber }}</td>
              <td style="width: 25%;">{{ student.studentName }}</td>
              <td style="width: 20%;">
                <span v-if="student.grade !== null" class="grade-score">{{ student.grade }}</span>
                <span v-else class="no-grade">未录入</span>
              </td>
              <td style="width: 40%;">
                <div class="action-buttons-group">
                  <button class="action-btn edit" @click="editGrade(student)">编辑</button>
                  <button 
                    v-if="student.hasAppeal" 
                    class="action-btn appeal-btn" 
                    @click="viewAppeal(student)"
                  >
                    申诉
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="studentGrades.length === 0">
              <td colspan="4" class="no-data">暂无学生成绩数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 空状态显示 -->
    <div v-else class="empty-state">
      <div class="empty-content">
        <el-icon class="empty-icon"><document /></el-icon>
        <h2>请选择学科查看成绩表</h2>
        <p>从上方选择您要管理成绩的学科</p>
      </div>
    </div>

    <!-- 成绩编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑成绩"
      width="500px"
      :show-close="false"
    >
      <div class="form-content-wrapper">
        <el-form :model="editForm" :rules="gradeRules" ref="gradeFormRef" label-width="100px">
          <el-form-item label="学号">
            <el-input v-model="editForm.studentNumber" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input v-model="editForm.studentName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="科目">
            <el-input v-model="selectedSubject" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="成绩" prop="grade">
            <el-input-number
              v-model="editForm.grade"
              :min="0"
              :max="100"
              :precision="1"
              placeholder="请输入成绩（0-100）"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="action-btn cancel" @click="editDialogVisible = false">取消</button>
          <button class="action-btn save" @click="saveGrade" :disabled="saving">确定</button>
        </div>
      </template>
    </el-dialog>

    <!-- 申诉查看弹窗 -->
    <el-dialog
      v-model="appealDialogVisible"
      title="学生申诉"
      width="500px"
      :show-close="false"
      @close="closeAppealDialog"
    >
      <div class="appeal-form">
        <div class="form-item student-info-row">
          <div class="student-field">
            <label>学生学号:</label>
            <span class="readonly-field">{{ appealData.studentNumber }}</span>
          </div>
          <div class="student-field">
            <label>学生姓名:</label>
            <span class="readonly-field">{{ appealData.studentName }}</span>
          </div>
        </div>
        <div class="form-item">
          <label>申诉时间:</label>
          <span class="readonly-field">{{ appealData.appealTime }}</span>
        </div>
        <div class="form-item">
          <label>申诉理由:</label>
          <div class="readonly-field appeal-reason">{{ appealData.reason }}</div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <button class="action-btn reject" @click="handleAppeal('rejected')">驳回</button>
          <button class="action-btn approve" @click="handleAppeal('approved')">同意</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Document,
  Reading
} from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import axios from 'axios'

export default {
  name: 'TeacherExamScores',
  components: {
    Document,
    Reading
  },
  props: {
    selectedSubject: {
      type: String,
      default: null
    }
  },
  setup(props) {
    // 响应式数据
    const teacherId = ref(null) // 从父组件获取
    const teacherSubjects = ref([])
    const selectedSubject = ref('')
    const studentGrades = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const editDialogVisible = ref(false)
    const appealDialogVisible = ref(false)
    
    const editForm = reactive({
      studentId: '',
      studentNumber: '',
      studentName: '',
      grade: null
    })

    const appealData = reactive({
      studentId: '',
      studentNumber: '',
      studentName: '',
      courseName: '',
      reason: '',
      appealTime: '',
      status: '',
      teacherResponse: '',
      responseTime: ''
    })

    const responseForm = reactive({
      teacherResponse: ''
    })

    const appealsList = ref([])

    const gradeRules = {
      grade: [
        { required: true, message: '请输入成绩', trigger: 'blur' },
        { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间', trigger: 'blur' }
      ]
    }

    // API 基础URL
    const API_BASE_URL = 'http://localhost:8080/api'

    // 获取教师ID的方法
    const getCurrentTeacherId = () => {
      // 首先尝试从Vue路由参数获取
      const route = getCurrentInstance()?.appContext.config.globalProperties.$route
      const routeUserId = route?.query?.userId
      if (routeUserId) {
        return routeUserId
      }
      
      // 然后尝试从URL参数获取
      const urlParams = new URLSearchParams(window.location.search)
      const urlUserId = urlParams.get('userId')
      if (urlUserId) {
        return urlUserId
      }
      
      // 最后尝试从localStorage获取
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        return currentUser.id
      } catch {
        return null
      }
    }

    // 获取教师教授且已考试的学科列表
    const getTeacherSubjects = async () => {
      const currentTeacherId = getCurrentTeacherId()
      if (!currentTeacherId) {
        ElMessage.error('无法获取教师信息，请重新登录')
        return
      }
      
      teacherId.value = currentTeacherId
      
      try {
        loading.value = true
        console.log('正在获取教师ID为', teacherId.value, '的学科列表...')
        const response = await axios.get(`${API_BASE_URL}/grades/getTeacherExaminedSubjects/${teacherId.value}`)
        
        if (response.data.success) {
          teacherSubjects.value = response.data.data
          console.log('获取到的学科列表:', teacherSubjects.value)
          
          if (teacherSubjects.value.length > 0) {
            // 只有在没有预选学科时才设置默认学科
            if (!props.selectedSubject && !selectedSubject.value) {
              selectedSubject.value = teacherSubjects.value[0]
              await getStudentGrades()
            }
          } else {
            ElMessage.warning('该教师暂无已考试的学科')
          }
        } else {
          ElMessage.error(response.data.message || '获取学科列表失败')
          console.error('API返回错误:', response.data)
        }
      } catch (error) {
        console.error('获取学科列表失败:', error)
        ElMessage.error('网络错误，请检查连接: ' + error.message)
        
        // 添加测试数据以便调试
        console.log('使用测试数据...')
        teacherSubjects.value = [
          '毛泽东思想和中国特色社会主义理论体系概论',
          '形势与政策Ⅰ',
          '形势与政策Ⅱ'
        ]
        if (teacherSubjects.value.length > 0) {
          selectedSubject.value = teacherSubjects.value[0]
          // 添加测试学生数据
          studentGrades.value = [
            { studentId: '2021001', studentName: '张三', grade: 85.5 },
            { studentId: '2021002', studentName: '李四', grade: null },
            { studentId: '2021003', studentName: '王五', grade: 92.0 }
          ]
        }
      } finally {
        loading.value = false
      }
    }

    // 获取指定学科的学生成绩
    const getStudentGrades = async () => {
      if (!selectedSubject.value) return
      
      try {
        loading.value = true
        const response = await axios.get(`${API_BASE_URL}/grades/getStudentGradesBySubject`, {
          params: { subject: selectedSubject.value }
        })
        if (response.data.success) {
          // 获取申诉数据并合并
          await loadAppealsData()
          
          // 为每个学生添加申诉状态
          const gradesWithAppeals = response.data.data.map(student => ({
            ...student,
            hasAppeal: checkStudentHasAppeal(student.studentId)
          }))
          
          studentGrades.value = gradesWithAppeals
        } else {
          ElMessage.error(response.data.message || '获取成绩数据失败')
        }
      } catch (error) {
        console.error('获取成绩数据失败:', error)
        ElMessage.error('网络错误，请检查连接')
      } finally {
        loading.value = false
      }
    }

    // 选择学科
    const selectSubject = async (subject) => {
      selectedSubject.value = subject
      await getStudentGrades()
    }

    // 编辑成绩
    const editGrade = (row) => {
      editForm.studentId = row.studentId
      editForm.studentNumber = row.studentNumber
      editForm.studentName = row.studentName
      editForm.grade = row.grade
      editDialogVisible.value = true
    }

    // 保存成绩
    const saveGrade = async () => {
      // 表单验证
      const gradeFormRef = document.querySelector('[ref="gradeFormRef"]')
      if (gradeFormRef && gradeFormRef.validate) {
        const valid = await gradeFormRef.validate()
        if (!valid) return
      }

      if (editForm.grade === null || editForm.grade === undefined) {
        ElMessage.warning('请输入成绩')
        return
      }

      try {
        saving.value = true
        const response = await axios.put(`${API_BASE_URL}/grades/updateStudentSubjectGrade`, {
          studentId: editForm.studentId,
          subject: selectedSubject.value,
          grade: editForm.grade
        })
        
        if (response.data.success) {
          ElMessage.success('成绩更新成功')
          editDialogVisible.value = false
          await getStudentGrades()
        } else {
          ElMessage.error(response.data.message || '成绩更新失败')
        }
      } catch (error) {
        console.error('成绩更新失败:', error)
        ElMessage.error('网络错误，请检查连接')
      } finally {
        saving.value = false
      }
    }

    // 刷新数据
    const refreshData = async () => {
      await getStudentGrades()
      ElMessage.success('数据已刷新')
    }

    // 导出Excel
    const exportExcel = () => {
      if (!studentGrades.value.length) {
        ElMessage.warning('没有数据可导出')
        return
      }

      // 准备Excel数据
      const excelData = studentGrades.value.map(row => ({
        '学号': row.studentNumber,
        '学生姓名': row.studentName,
        '学生成绩': row.grade !== null ? row.grade : '未录入'
      }))

      // 创建工作簿
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // 设置列宽
      ws['!cols'] = [
        { width: 15 },
        { width: 20 },
        { width: 15 }
      ]

      XLSX.utils.book_append_sheet(wb, ws, selectedSubject.value)
      
      // 导出文件
      const fileName = `${selectedSubject.value}_成绩表_${new Date().toLocaleDateString()}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      ElMessage.success('Excel文件已导出')
    }

    // 申诉相关方法
    // 加载申诉数据
    const loadAppealsData = async () => {
      if (!selectedSubject.value) return
      
      try {
        // 根据课程名称获取课程ID
        const courseResponse = await axios.get(`${API_BASE_URL}/course/getCourse`)
        const courses = courseResponse.data
        const currentCourse = courses.find(course => course.courseName === selectedSubject.value)
        
        if (!currentCourse) return
        
        const response = await axios.get(`${API_BASE_URL}/appeal/getAppealsByCourseId/${currentCourse.courseId}`)
        if (response.data.success) {
          appealsList.value = response.data.data || []
        }
      } catch (error) {
        console.error('加载申诉数据失败:', error)
        appealsList.value = []
      }
    }

    // 检查学生是否有申诉
    const checkStudentHasAppeal = (studentId) => {
      return appealsList.value.some(appeal => appeal.studentId == studentId)
    }

    // 查看申诉
    const viewAppeal = async (student) => {
      const appeal = appealsList.value.find(appeal => appeal.studentId == student.studentId)
      if (!appeal) {
        ElMessage.error('未找到申诉记录')
        return
      }

      // 填充申诉数据
      Object.assign(appealData, {
        studentId: student.studentId,
        studentNumber: student.studentNumber,
        studentName: student.studentName,
        courseName: selectedSubject.value,
        reason: appeal.reason,
        appealTime: appeal.appealTime,
        status: appeal.status,
        teacherResponse: appeal.teacherResponse || '',
        responseTime: appeal.responseTime || ''
      })

      // 清空回复表单
      responseForm.teacherResponse = ''
      
      appealDialogVisible.value = true
    }

    // 处理申诉（同意/驳回）
    const handleAppeal = async (status) => {
      try {
        // 删除申诉记录
        const response = await axios.delete(`${API_BASE_URL}/appeal/deleteAppeal/${appealData.studentId}/${await getCourseIdByName(appealData.courseName)}`)

        if (response.data.success) {
          const statusText = status === 'approved' ? '同意' : '驳回'
          ElMessage.success(`申诉已${statusText}并删除`)
          closeAppealDialog()
          // 重新加载数据
          await getStudentGrades()
        } else {
          ElMessage.error(response.data.message || '处理失败')
        }
      } catch (error) {
        console.error('处理申诉失败:', error)
        ElMessage.error('处理申诉失败')
      }
    }

    // 关闭申诉弹窗
    const closeAppealDialog = () => {
      appealDialogVisible.value = false
      Object.assign(appealData, {
        studentId: '',
        studentNumber: '',
        studentName: '',
        courseName: '',
        reason: '',
        appealTime: '',
        status: '',
        teacherResponse: '',
        responseTime: ''
      })
      responseForm.teacherResponse = ''
    }

    // 根据课程名称获取课程ID
    const getCourseIdByName = async (courseName) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course/getCourse`)
        const courses = response.data
        const course = courses.find(c => c.courseName === courseName)
        return course ? course.courseId : null
      } catch (error) {
        console.error('获取课程ID失败:', error)
        return null
      }
    }

    // 获取申诉状态样式类
    const getStatusClass = (status) => {
      switch (status) {
        case 'approved': return 'status-approved'
        case 'rejected': return 'status-rejected'
        case 'pending': return 'status-pending'
        default: return ''
      }
    }

    // 获取申诉状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'approved': return '已同意'
        case 'rejected': return '已驳回'
        case 'pending': return '待处理'
        default: return '未知'
      }
    }

    // 组件挂载时初始化
    // 处理传入的学科选择
    const handleSelectedSubject = async (subject) => {
      if (!subject) return
      
      console.log('处理传入的学科:', subject)
      console.log('当前学科列表:', teacherSubjects.value)
      
      // 确保学科列表已加载
      let attempts = 0
      const maxAttempts = 5
      
      while (teacherSubjects.value.length === 0 && attempts < maxAttempts) {
        console.log(`等待学科列表加载... 尝试 ${attempts + 1}/${maxAttempts}`)
        await new Promise(resolve => setTimeout(resolve, 200))
        attempts++
      }
      
      if (teacherSubjects.value.length === 0) {
        console.warn('学科列表加载失败，尝试重新加载')
        await getTeacherSubjects()
      }
      
      // 检查传入的学科是否在可用学科列表中
      if (teacherSubjects.value.includes(subject)) {
        console.log(`成功匹配学科: ${subject}`)
        selectedSubject.value = subject
        await getStudentGrades()
      } else {
        console.warn(`传入的学科 "${subject}" 不在教师可教学科列表中`)
        console.log('可用学科列表:', teacherSubjects.value)
        ElMessage.warning(`学科 "${subject}" 不在您的教学范围内`)
      }
    }

    // 监听props.selectedSubject的变化
    watch(() => props.selectedSubject, async (newSubject, oldSubject) => {
      console.log('Watch触发:', { newSubject, oldSubject })
      if (newSubject && newSubject !== oldSubject) {
        await handleSelectedSubject(newSubject)
      }
    }, { immediate: false }) // 改为false，避免在初始化时执行

    onMounted(async () => {
      console.log('组件挂载，加载学科列表')
      await getTeacherSubjects()
      
      // 如果有传入的学科参数，在学科列表加载完成后处理
      if (props.selectedSubject) {
        console.log('检测到传入的学科参数:', props.selectedSubject)
        await handleSelectedSubject(props.selectedSubject)
      }
    })

    return {
      teacherId,
      teacherSubjects,
      selectedSubject,
      studentGrades,
      loading,
      saving,
      editDialogVisible,
      appealDialogVisible,
      editForm,
      appealData,
      responseForm,
      gradeRules,
      selectSubject,
      editGrade,
      saveGrade,
      refreshData,
      exportExcel,
      viewAppeal,
      handleAppeal,
      closeAppealDialog,
      getStatusClass,
      getStatusText
    }
  }
}
</script>

<style scoped>
.teacher-exam-scores {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 统一筛选器容器 */
.filters-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
}

/* 统一筛选卡片 */
.filter-card {
  flex: 1;
  min-width: 200px;
  height: 80px;
  border: 2px solid #000000;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  padding: 15px;
}

.filter-card.black {
  background-color: #000000;
  color: #ffffff;
}

.filter-card.white {
  background-color: #ffffff;
  color: #000000;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

.filter-icon {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.filter-label {
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
  text-align: left;
}

/* 成绩表格容器 */
.grades-table-container {
  margin-top: 0px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 2px solid #000000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

/* 内容头部 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #ffffff;
  color: #000000;
  border-bottom: 2px solid #000000;
}

.subject-title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #000000;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

/* 固定表头 */
.table-header-fixed {
  flex-shrink: 0;
  border-bottom: 2px solid #000000;
  overflow: hidden;
  background: #000000;
}

.table-body-scrollable {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

.table-body-scrollable::-webkit-scrollbar {
  display: none;
}

.header-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border: none;
  table-layout: fixed;
}

.body-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border: none;
  table-layout: fixed;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.grades-table th,
.grades-table td {
  padding: 12px 15px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  line-height: 1.1;
}

.grades-table th {
  background-color: #000000;
  color: #ffffff;
  font-weight: bold;
  height: 50px;
  border-right: 1px solid #ffffff;
}

.grades-table th:last-child {
  border-right: none;
}

.grades-table td {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
}

.grades-table td:last-child {
  border-right: none;
}

.grades-table tbody tr {
  height: 50px;
}

.grades-table tbody tr:nth-child(even) {
  background-color: #f8f8f8;
}

.grades-table tbody tr:hover {
  background-color: #e8e8e8;
}

.grade-score {
  font-weight: bold;
  color: #000000;
}

.no-grade {
  color: #666666;
  font-style: italic;
}

.no-data {
  color: #666666 !important;
  font-style: italic;
}

/* 操作按钮 */
.action-btn {
  padding: 8px 16px;
  border: 2px solid #000000;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  min-width: 80px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #000000 !important;
  color: #ffffff !important;
}

.action-btn:active {
  background: #000000 !important;
  color: #ffffff !important;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.refresh {
  background: #ffffff;
  border-color: #000000;
  color: #000000;
}

.action-btn.export {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.action-btn.edit {
  background: #ffffff;
  border-color: #000000;
  color: #000000;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.empty-content {
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  color: #ddd;
}

.empty-content h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.empty-content p {
  font-size: 16px;
  color: #999;
}

/* 弹窗样式 */
:deep(.el-dialog) {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
}

:deep(.el-dialog__header) {
  background: #000000;
  color: #ffffff;
  padding: 15px 30px;
  border-radius: 12px;
  margin: -5px -5px -5px -5px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

:deep(.el-dialog__title) {
  color: #ffffff;
  font-weight: bold;
  font-size: 22px;
  text-align: center;
  width: 100%;
}

:deep(.el-dialog__body) {
  padding: 17px 30px 0px 30px;
  background: #ffffff;
  margin-top: -5px;
  position: relative;
  z-index: 5;
}

.form-content-wrapper {
  border: 2px solid #000000;
  border-radius: 12px;
  padding: 20px;
  background: #ffffff;
  margin-bottom: 10px;
  margin-left: -30px;
  margin-right: -30px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0px;
}

:deep(.el-form-item__label) {
  color: #000000;
  font-weight: bold;
}

:deep(.el-input__wrapper) {
  border: 2px solid #000000;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f5f5;
  border-color: #cccccc;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #999999;
}

:deep(.el-input-number) {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 0px 30px 5px 30px;
}

.action-btn.save {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.action-btn.cancel {
  background: #ffffff;
  border-color: #000000;
  color: #000000;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-card {
    min-width: auto;
    height: 60px;
  }
  
  .content-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
}

/* 申诉相关样式 */
.action-buttons-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.action-btn.appeal-btn {
  background: #ffffff;
  color: #ff0000;
  border: 2px solid #ff0000;
  font-weight: bold;
}

.action-btn.appeal-btn:hover {
  background: #ff0000 !important;
  color: #ffffff !important;
  border-color: #ff0000 !important;
}

.action-btn.appeal-btn:active {
  background: #ff0000 !important;
  color: #ffffff !important;
  border-color: #ff0000 !important;
}

.appeal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.readonly-field {
  padding: 8px 12px;
  background: #f5f5f5;
  border: 2px solid #000000;
  border-radius: 4px;
  color: #000000;
  font-size: 16px;
}

.readonly-field.appeal-reason {
  min-height: 150px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 学生信息同行显示样式 */
.student-info-row {
  flex-direction: row !important;
  gap: 20px;
}

.student-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.student-field label {
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.action-btn.approve {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.action-btn.approve:hover {
  background: #333333 !important;
  border-color: #333333 !important;
}

.action-btn.approve:active {
  background: #333333 !important;
  border-color: #333333 !important;
}

.action-btn.reject {
  background: #ffffff;
  color: #ff0000;
  border: 2px solid #ff0000;
}

.action-btn.reject:hover {
  background: #ff0000 !important;
  color: #ffffff !important;
  border-color: #ff0000 !important;
}

.action-btn.reject:active {
  background: #ff0000 !important;
  color: #ffffff !important;
  border-color: #ff0000 !important;
}

.status-approved {
  color: #28a745;
  font-weight: bold;
}

.status-rejected {
  color: #dc3545;
  font-weight: bold;
}

.status-pending {
  color: #ffc107;
  font-weight: bold;
}

:deep(.el-textarea .el-textarea__inner) {
  border: 2px solid #000000;
  border-radius: 4px;
  font-size: 14px;
  color: #000000;
  font-family: inherit;
  resize: none;
}

:deep(.el-textarea .el-textarea__inner:focus) {
  border-color: #000000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

/* 教师申诉弹窗样式 - 与学生界面保持一致 */
:deep(.el-dialog) {
  border: 3px solid #000000;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
}

:deep(.el-dialog__header) {
  background: #000000;
  color: #ffffff;
  padding: 15px 30px;
  border-radius: 12px;
  margin: 10px 10px 0 10px;
  text-align: center;
}

:deep(.el-dialog__title) {
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
  background: #ffffff;
}

.dialog-footer {
  display: flex;
  gap: 15px;
  padding: 0px 30px 5px 30px;
  background: #ffffff;
  border-radius: 0 0 9px 9px;
  justify-content: flex-end;
  margin-top: -15px;
}
</style>
