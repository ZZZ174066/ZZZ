<template>
  <div class="packing-plans">
    <el-table :data="plans" stripe border style="width: 100%">
      <el-table-column
        prop="planName"
        label="方案名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="status"
        label="方案状态"
        width="120"
        header-align="center"
        align="center"
      >
        <template #default="{ row }">
          {{ getStatusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" header-align="center" align="center">
        <template #default="{ row }">
          <el-button class="action-btn" size="small" @click="viewPlan(row.id)">查看</el-button>
          <el-button class="action-btn" size="small" @click="editPlan(row)">编辑</el-button>
          <el-button class="action-btn" size="small" @click="deletePlan(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="创建装箱方案" width="70%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="方案名称">
          <el-input v-model="form.planName" />
        </el-form-item>
      </el-form>

      <div class="pick-row">
        <div class="pick-col">
          <el-divider content-position="left">选择物品（并输入数量）</el-divider>
          <el-table
            :data="items"
            stripe
            size="small"
            height="260"
            style="width: 100%"
            @selection-change="onItemsSelectionChange"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column prop="itemName" label="物品名称" min-width="140" />
            <el-table-column label="选择数量" width="140">
              <template #default="{ row }">
                <el-input-number v-model="row.pickQty" :min="1" :max="row.quantity || 999999" size="small" />
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pick-col">
          <el-divider content-position="left">选择容器</el-divider>
          <el-table
            :data="containers"
            stripe
            size="small"
            height="260"
            style="width: 100%"
            @selection-change="onContainersSelectionChange"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column prop="containerName" label="容器名称" min-width="160" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createPlan">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'PackingPlans',
  setup() {
    const router = useRouter()
    const plans = ref([])
    const dialogVisible = ref(false)
    const items = ref([])
    const containers = ref([])
    const selectedItems = ref([])
    const selectedContainers = ref([])
    const form = ref({
      planName: '',
      planDescription: '',
      algorithmType: 'HEURISTIC'
    })
    const isEditPlan = ref(false)

    const loadPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/packing/plan/list')
        plans.value = response.data.data || []
      } catch (error) {
        ElMessage.error('加载方案列表失败')
      }
    }

    const loadItemsAndContainers = async () => {
      try {
        const [itemsRes, containersRes] = await Promise.all([
          axios.get('http://localhost:8080/api/items/list'),
          axios.get('http://localhost:8080/api/containers/list')
        ])
        items.value = (itemsRes.data.data || []).map((it) => ({
          ...it,
          pickQty: Math.max(1, Math.min(Number(it.quantity || 1), 999999))
        }))
        containers.value = containersRes.data.data || []
      } catch (e) {
        ElMessage.error('加载物品/容器列表失败')
      }
    }

    const showCreateDialog = () => {
      isEditPlan.value = false
      form.value = {
        planName: '',
        planDescription: '',
        algorithmType: 'HEURISTIC'
      }
      selectedItems.value = []
      selectedContainers.value = []
      loadItemsAndContainers()
      dialogVisible.value = true
    }

    const onItemsSelectionChange = (rows) => {
      selectedItems.value = rows || []
    }

    const onContainersSelectionChange = (rows) => {
      selectedContainers.value = rows || []
    }

    const createPlan = async () => {
      try {
        if (!form.value.planName) {
          ElMessage.warning('请输入方案名称')
          return
        }
        if (!selectedItems.value.length) {
          ElMessage.warning('请至少选择一个物品')
          return
        }
        if (!selectedContainers.value.length) {
          ElMessage.warning('请至少选择一个容器')
          return
        }

        const planPayload = {
          ...form.value,
          status: 'DRAFT',
          totalItems: 0,
          containersUsed: 0,
          createdBy: 'system'
        }

        const reqPayload = {
          plan: planPayload,
          items: selectedItems.value.map((r) => ({ itemId: r.id, quantity: Number(r.pickQty || 1) })),
          containers: selectedContainers.value.map((r) => ({ containerId: r.id, quantity: 1 }))
        }

        try {
          await axios.post('http://localhost:8080/api/packing/plan/createWithSelection', reqPayload)
        } catch (e) {
          // 兼容旧后端：若未实现新接口，则降级到原接口（但本次选择不会生效）
          await axios.post('http://localhost:8080/api/packing/plan/create', planPayload)
          ElMessage.warning('后端未启用“按选择创建方案”，本次选择未生效（已按基础信息创建方案）')
        }

        ElMessage.success('方案创建成功')
        dialogVisible.value = false
        loadPlans()
      } catch (error) {
        ElMessage.error('创建失败')
      }
    }

    const optimizePlan = async (id) => {
      // 保留函数以兼容旧逻辑，但不再在列表里直接使用
      try {
        const response = await axios.post('http://localhost:8080/api/packing/optimize', { planId: id })
        ElMessage.success('优化完成，填充率: ' + response.data.fillRate.toFixed(2) + '%')
        loadPlans()
      } catch (error) {
        ElMessage.error('优化失败')
      }
    }

    const viewPlan = (id) => {
      // 跳转到3D展示页面，并传递方案ID（history 模式下不要用 hash）
      router.push({ path: '/packing/visualization', query: { planId: String(id) } })
    }

    const deletePlan = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/api/packing/plan/${id}`)
        ElMessage.success('方案删除成功')
        loadPlans()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    }

    const editPlan = (row) => {
      // 目前后端仅支持更新状态/统计信息，这里先只允许修改名称/描述作为前端展示，
      // 不直接持久化，避免破坏后端字段含义。
      isEditPlan.value = true
      form.value = {
        planName: row.planName || '',
        planDescription: row.planDescription || '',
        algorithmType: 'HEURISTIC'
      }
      selectedItems.value = []
      selectedContainers.value = []
      dialogVisible.value = true
      ElMessage.info('当前版本仅支持修改方案名称和描述，保存后需重新创建/优化方案以生效。')
    }

    const getStatusType = (status) => {
      const typeMap = {
        'DRAFT': 'info',
        'OPTIMIZING': 'warning',
        'COMPLETED': 'success',
        'FAILED': 'danger'
      }
      return typeMap[status] || 'info'
    }

    const getStatusLabel = (status) => {
      const map = {
        'DRAFT': '草稿',
        'OPTIMIZING': '优化中',
        'COMPLETED': '已完成',
        'FAILED': '失败'
      }
      return map[status] || status || ''
    }

    onMounted(() => {
      loadPlans()
    })

    return {
      plans,
      dialogVisible,
      items,
      containers,
      form,
      isEditPlan,
      showCreateDialog,
      onItemsSelectionChange,
      onContainersSelectionChange,
      createPlan,
      optimizePlan,
      viewPlan,
      deletePlan,
      editPlan,
      getStatusType,
      getStatusLabel
    }
  }
}
</script>

<style scoped>
.packing-plans {
  padding: 0;
}
.packing-plans :deep(.el-table--border),
.packing-plans :deep(.el-table__inner-wrapper) {
  border-width: 3px;
  border-color: #000;
}
.packing-plans :deep(.el-table__header-wrapper th.el-table__cell),
.packing-plans :deep(.el-table__body-wrapper td.el-table__cell) {
  border-right: 3px solid #000;
}
.packing-plans :deep(.el-table__body-wrapper tr:last-child td.el-table__cell) {
  border-bottom: 3px solid #000;
}
.packing-plans :deep(.el-table),
.packing-plans :deep(.el-table__cell),
.packing-plans :deep(.el-table th),
.packing-plans :deep(.el-table td) {
  color: #000;
}
.action-btn {
  background: #a8e6cf;
  color: #000;
  border: 1px solid #000;
}

.pick-row {
  display: flex;
  gap: 16px;
}

.pick-col {
  flex: 1;
  min-width: 0;
}
</style>
