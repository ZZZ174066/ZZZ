<template>
  <div class="item-management">
    <el-table :data="items" stripe border style="width: 100%">
      <el-table-column
        prop="itemName"
        label="物品名称"
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
        label="物品数量"
        width="100"
        header-align="center"
        align="center"
      />
      <el-table-column label="操作" width="160" header-align="center" align="center">
        <template #default="{ row }">
          <el-button class="action-btn" size="small" @click="editItem(row)">编辑</el-button>
          <el-button class="action-btn" size="small" @click="deleteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑物品' : '添加物品'" width="50%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="物品名称">
          <el-input v-model="form.itemName" />
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
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveItem">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'ItemManagement',
  setup() {
    const items = ref([])
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const form = ref({
      itemName: '',
      length: 0,
      width: 0,
      height: 0,
      quantity: 1
    })

    const loadItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/items/list')
        items.value = response.data.data || []
      } catch (error) {
        ElMessage.error('加载物品列表失败')
      }
    }

    const showAddDialog = () => {
      isEdit.value = false
      form.value = {
        itemName: '',
        length: 0,
        width: 0,
        height: 0,
        quantity: 1
      }
      dialogVisible.value = true
    }

    const editItem = (row) => {
      isEdit.value = true
      form.value = { ...row }
      dialogVisible.value = true
    }

    const saveItem = async () => {
      try {
        if (isEdit.value) {
          await axios.put('http://localhost:8080/api/items/update', form.value)
          ElMessage.success('物品更新成功')
        } else {
          await axios.post('http://localhost:8080/api/items/add', form.value)
          ElMessage.success('物品添加成功')
        }
        dialogVisible.value = false
        loadItems()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }

    const deleteItem = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/api/items/${id}`)
        ElMessage.success('物品删除成功')
        loadItems()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      loadItems()
    })

    return {
      items,
      dialogVisible,
      isEdit,
      form,
      showAddDialog,
      editItem,
      saveItem,
      deleteItem
    }
  }
}
</script>

<style scoped>
.item-management {
  padding: 0;
}
.item-management :deep(.el-table--border),
.item-management :deep(.el-table__inner-wrapper) {
  border-width: 3px;
  border-color: #000;
}
.item-management :deep(.el-table__header-wrapper th.el-table__cell),
.item-management :deep(.el-table__body-wrapper td.el-table__cell) {
  border-right: 3px solid #000;
}
.item-management :deep(.el-table__body-wrapper tr:last-child td.el-table__cell) {
  border-bottom: 3px solid #000;
}
.item-management :deep(.el-table),
.item-management :deep(.el-table__cell),
.item-management :deep(.el-table th),
.item-management :deep(.el-table td) {
  color: #000;
}
.action-btn {
  background: #a8e6cf;
  color: #000;
  border: 1px solid #000;
}
</style>
