<template>
  <div class="packing-main">
    <div class="top-bar">
      <div class="top-bar-inner">
        <span class="title">板状物品分层装箱优化系统</span>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">物品列表</span>
          <button class="header-add-btn" @click="handleAddItem">添加物品</button>
        </div>
        <div class="panel-body">
          <ItemManagement ref="itemRef" />
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">容器列表</span>
          <button class="header-add-btn" @click="handleAddContainer">添加容器</button>
        </div>
        <div class="panel-body">
          <ContainerManagement ref="containerRef" />
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">方案列表</span>
          <button class="header-add-btn" @click="handleCreatePlan">创建方案</button>
        </div>
        <div class="panel-body">
          <PackingPlans ref="planRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ItemManagement from './ItemManagement.vue'
import ContainerManagement from './ContainerManagement.vue'
import PackingPlans from './PackingPlans.vue'

export default {
  name: 'PackingMain',
  components: {
    ItemManagement,
    ContainerManagement,
    PackingPlans
  },
  setup() {
    const itemRef = ref(null)
    const containerRef = ref(null)
    const planRef = ref(null)

    const handleAddItem = () => {
      itemRef.value && itemRef.value.showAddDialog && itemRef.value.showAddDialog()
    }

    const handleAddContainer = () => {
      containerRef.value && containerRef.value.showAddDialog && containerRef.value.showAddDialog()
    }

    const handleCreatePlan = () => {
      planRef.value && planRef.value.showCreateDialog && planRef.value.showCreateDialog()
    }

    return {
      itemRef,
      containerRef,
      planRef,
      handleAddItem,
      handleAddContainer,
      handleCreatePlan
    }
  }
}
</script>

<style scoped>
.packing-main {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  color: #000000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
}

.top-bar {
  border: 3px solid #000;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.top-bar-inner {
  background: #a8e6cf;
  color: #000;
  padding: 10px 0;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}

.content {
  flex: 1;
  display: flex;
  gap: 16px;
}

.panel {
  flex: 1;
  border: 3px solid #000;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-header {
  background: #a8e6cf;
  color: #000;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}

.panel-body {
  flex: 1;
  background: #fff;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.header-add-btn {
  background: #fff;
  color: #000;
  border: 1px solid #fff;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}

</style>
