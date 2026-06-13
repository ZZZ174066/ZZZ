<template>
  <div class="container-management">
    <el-table :data="groupedContainers" stripe border style="width: 100%">
      <el-table-column
        prop="containerName"
        label="容器名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        label="长/宽/高"
        header-align="center"
        align="center"
      >
        <template #default="{ row }">
          {{ row.length }}/{{ row.width }}/{{ row.height }}
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="容器数量"
        width="100"
        header-align="center"
        align="center"
      />
      <el-table-column label="操作" width="160" header-align="center" align="center">
        <template #default="{ row }">
          <el-button class="action-btn" size="small" @click="editContainer(row)">编辑</el-button>
          <el-button class="action-btn" size="small" @click="deleteContainer(row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑容器' : '添加容器'" width="50%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="容器名称">
          <el-input v-model="form.containerName" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="长">
          <el-input-number v-model="form.length" :min="0" />
        </el-form-item>
        <el-form-item label="宽">
          <el-input-number v-model="form.width" :min="0" />
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="form.height" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveContainer">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'ContainerManagement',
  setup() {
    const containers = ref([])
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const editingKey = ref('')
    const form = ref({
      containerName: '',
      quantity: 1,
      length: 0,
      width: 0,
      height: 0
    })

    const buildKey = (c) => {
      const baseName = String(c.containerName || '').replace(/-\d+$/, '')
      return `${baseName}|${c.length}|${c.width}|${c.height}`
    }

    const groupedContainers = computed(() => {
      const map = new Map()
      containers.value.forEach((c) => {
        const key = buildKey(c)
        const baseName = String(c.containerName || '').replace(/-\d+$/, '')
        const exist = map.get(key)
        if (exist) {
          exist.quantity += 1
        } else {
          map.set(key, {
            key,
            containerName: baseName || c.containerName,
            length: c.length,
            width: c.width,
            height: c.height,
            quantity: 1
          })
        }
      })
      return Array.from(map.values())
    })

    const loadContainers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/containers/list')
        containers.value = response.data.data || []
      } catch (error) {
        ElMessage.error('加载容器列表失败')
      }
    }

    const showAddDialog = () => {
      isEdit.value = false
      form.value = {
        containerName: '',
        quantity: 1,
        length: 0,
        width: 0,
        height: 0
      }
      dialogVisible.value = true
    }

    const editContainer = (row) => {
      const origin = containers.value.find((c) => buildKey(c) === row.key)
      if (!origin) return
      isEdit.value = true
      editingKey.value = row.key
      form.value = {
        ...origin,
        // 编辑时只展示“类别名”，不带 -序号
        containerName: String(row.containerName || '').replace(/-\d+$/, '')
      }
      dialogVisible.value = true
    }

    const saveContainer = async () => {
      try {
        if (isEdit.value) {
          const baseName = String(form.value.containerName || '').trim()
          if (!baseName) {
            ElMessage.warning('请输入容器名称')
            return
          }

          // 同步更新同一类（同名称基底+同尺寸）的所有子容器名称
          const group = containers.value.filter((c) => buildKey(c) === editingKey.value)
          const total = group.length
          // 稳定排序：按 id 升序，保证 -1/-2 对应稳定
          group.sort((a, b) => Number(a.id || 0) - Number(b.id || 0))

          for (let i = 0; i < total; i++) {
            const c = group[i]
            const payload = {
              ...c,
              containerName: total > 1 ? `${baseName}-${i + 1}` : baseName,
              // 同步尺寸/数量（若你在编辑弹窗里改了）
              length: form.value.length,
              width: form.value.width,
              height: form.value.height,
              quantity: form.value.quantity == null ? c.quantity : form.value.quantity
            }
            await axios.put('http://localhost:8080/api/containers/update', payload)
          }
          ElMessage.success('容器更新成功')
        } else {
          const qty = Math.max(1, Number(form.value.quantity || 1))
          const base = { ...form.value }
          delete base.quantity
          for (let i = 1; i <= qty; i++) {
            const payload = {
              ...base,
              containerName: qty > 1 ? `${base.containerName}-${i}` : base.containerName
            }
            await axios.post('http://localhost:8080/api/containers/add', payload)
          }
          ElMessage.success(`容器添加成功（共${qty}个）`)
        }
        dialogVisible.value = false
        loadContainers()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }

    const deleteContainer = async (row) => {
      try {
        const origin = containers.value.find((c) => buildKey(c) === row.key)
        if (!origin) return
        await axios.delete(`http://localhost:8080/api/containers/${origin.id}`)
        ElMessage.success('容器删除成功')
        loadContainers()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      loadContainers()
    })

    return {
      containers,
      groupedContainers,
      dialogVisible,
      isEdit,
      form,
      showAddDialog,
      editContainer,
      saveContainer,
      deleteContainer
    }
  }
}
</script>

<style scoped>
.container-management {
  padding: 0;
}
.container-management :deep(.el-table--border),
.container-management :deep(.el-table__inner-wrapper) {
  border-width: 3px;
  border-color: #000;
}
.container-management :deep(.el-table__header-wrapper th.el-table__cell),
.container-management :deep(.el-table__body-wrapper td.el-table__cell) {
  border-right: 3px solid #000;
}
.container-management :deep(.el-table__body-wrapper tr:last-child td.el-table__cell) {
  border-bottom: 3px solid #000;
}
.container-management :deep(.el-table),
.container-management :deep(.el-table__cell),
.container-management :deep(.el-table th),
.container-management :deep(.el-table td) {
  color: #000;
}
.action-btn {
  background: #a8e6cf;
  color: #000;
  border: 1px solid #000;
}

</style>
