<template>
  <div class="app-shell home-shell">
    <div class="app-header">板状物品装箱系统</div>

    <div class="main-workspace">
      <aside class="col-list">
        <div class="toolbar">
          <div class="list-top-row">
            <button
              type="button"
              class="list-top-btn"
              :class="{ active: currentTab === 'items' }"
              :disabled="workspaceGenerationLocked"
              @click="switchTab('items')"
            >
              物品列表
            </button>
            <button
              type="button"
              class="list-top-btn"
              :class="{ active: currentTab === 'containers' }"
              :disabled="workspaceGenerationLocked"
              @click="switchTab('containers')"
            >
              容器列表
            </button>
            <button
              type="button"
              class="list-top-btn"
              :class="{ active: currentTab === 'plans' }"
              :disabled="workspaceGenerationLocked"
              @click="switchTab('plans')"
            >
              方案列表
            </button>
            <button
              type="button"
              class="list-top-btn"
              :disabled="workspaceGenerationLocked"
              @click="handleAdd"
            >
              添加
            </button>
          </div>
        </div>

        <div class="table-wrapper">
      <!-- 物品列表 -->
      <table v-show="currentTab === 'items'" class="list-data-table">
        <thead>
          <tr>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('items', 'itemName', 'string')"
            >
              物品名称
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('items', 'lengthMm', 'number')"
            >
              长度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('items', 'widthMm', 'number')"
            >
              宽度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('items', 'heightMm', 'number')"
            >
              高度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('items', 'quantity', 'number')"
            >
              数量/个
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedItems.length === 0">
            <td class="empty-text" colspan="6">暂无物品数据</td>
          </tr>
          <tr v-for="item in sortedItems" :key="item.itemId">
            <td>{{ item.itemName }}</td>
            <td>{{ item.lengthMm }}</td>
            <td>{{ item.widthMm }}</td>
            <td>{{ item.heightMm }}</td>
            <td>{{ item.quantity }}</td>
            <td>
              <button
                class="action-btn edit"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click.stop="openEditItem(item)"
              >
                编辑
              </button>
              <button
                class="action-btn danger"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click.stop="deleteItem(item.itemId)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 容器列表 -->
      <table v-show="currentTab === 'containers'" class="list-data-table">
        <thead>
          <tr>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('containers', 'containerName', 'string')"
            >
              容器名称
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('containers', 'lengthMm', 'number')"
            >
              长度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('containers', 'widthMm', 'number')"
            >
              宽度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('containers', 'heightMm', 'number')"
            >
              高度(mm)
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('containers', 'quantity', 'number')"
            >
              数量/个
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedContainers.length === 0">
            <td class="empty-text" colspan="6">暂无容器数据</td>
          </tr>
          <tr v-for="c in sortedContainers" :key="c.containerId">
            <td>{{ c.containerName }}</td>
            <td>{{ c.lengthMm }}</td>
            <td>{{ c.widthMm }}</td>
            <td>{{ c.heightMm }}</td>
            <td>{{ c.quantity }}</td>
            <td>
              <button
                class="action-btn edit"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click.stop="openEditContainer(c)"
              >
                编辑
              </button>
              <button
                class="action-btn danger"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click.stop="deleteContainer(c.containerId)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 方案列表 -->
      <table v-show="currentTab === 'plans'" class="plans-table list-data-table">
        <thead>
          <tr>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('plans', 'planName', 'string')"
            >
              方案名称
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('plans', 'planStatus', 'number')"
            >
              方案状态
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('plans', 'itemRate', 'ratioItems')"
            >
              物品装载率
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('plans', 'avgFilledContainerFillRate', 'number')"
            >
              平均填充率
            </th>
            <th
              class="sortable"
              :class="{ 'sortable--disabled': workspaceGenerationLocked }"
              @click="sortTable('plans', 'avgItemSupportRate', 'number')"
            >
              平均支撑率
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedPlans.length === 0">
            <td class="empty-text" colspan="6">暂无方案数据</td>
          </tr>
          <tr
            v-for="p in sortedPlans"
            :key="p.planId"
            class="plan-row"
            :class="{
              'plan-row--selected': selectedPlanId === p.planId,
              'plan-row--locked': workspaceGenerationLocked
            }"
            @click="togglePlanSelection(p)"
          >
            <td>{{ p.planName }}</td>
            <td>{{ formatPlanStatus(p.planStatus) }}</td>
            <td>{{ calcRate(p.actualTotalItemQty, p.plannedTotalItemQty) }}</td>
            <td>
              {{ p.avgFilledContainerFillRate == null ? '-' : `${p.avgFilledContainerFillRate}%` }}
            </td>
            <td>
              {{ p.avgItemSupportRate == null ? '-' : `${p.avgItemSupportRate}%` }}
            </td>
            <td @click.stop>
              <button
                class="action-btn edit"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click="openEditPlan(p)"
              >
                编辑
              </button>
              <button
                class="action-btn danger"
                type="button"
                :disabled="workspaceGenerationLocked"
                @click="deletePlan(p.planId)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
        </div>
      </aside>

      <template v-if="workspacePlanId">
        <PlanDetail
          :key="workspacePlanId"
          :plan-id="workspacePlanId"
          embedded
          @close="onWorkspaceClose"
          @workspace-lock="workspaceGenerationLocked = $event"
        />
      </template>
      <template v-else>
        <div class="col-scene-placeholder">
          <div class="ph-banner">—</div>
          <div class="ph-canvas">3D 场景展示</div>
        </div>
        <div class="col-info-placeholder">
          <p class="ph-hint">选择左侧方案后，将在此显示执行过程、详细信息、约束与导出。</p>
        </div>
      </template>
    </div>

    <!-- 弹出框 -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div
        class="modal"
        :class="{ 'modal-small': modalType !== 'plan', 'modal--plan': modalType === 'plan' }"
      >
        <div class="modal-header">{{ modalTitle }}</div>

        <!-- 添加/编辑物品 -->
        <div v-if="modalType === 'item'" class="modal-body">
          <div class="form-row">
            <label>名称：</label>
            <input
              v-model="itemForm.itemName"
              type="text"
              placeholder="请输入物品名称"
            />
          </div>
          <div class="form-row dual-row">
            <label>长度：</label>
            <input
              v-model.number="itemForm.lengthMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
            <span class="sub-label">宽度：</span>
            <input
              v-model.number="itemForm.widthMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
          </div>
          <div class="form-row dual-row">
            <label>高度：</label>
            <input
              v-model.number="itemForm.heightMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
            <span class="sub-label">数量：</span>
            <input
              v-model.number="itemForm.quantity"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit unit-count">个</span>
          </div>
        </div>

        <!-- 添加/编辑容器 -->
        <div v-else-if="modalType === 'container'" class="modal-body">
          <div class="form-row">
            <label>名称：</label>
            <input
              v-model="containerForm.containerName"
              type="text"
              placeholder="请输入容器名称"
            />
          </div>
          <div class="form-row dual-row">
            <label>长度：</label>
            <input
              v-model.number="containerForm.lengthMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
            <span class="sub-label">宽度：</span>
            <input
              v-model.number="containerForm.widthMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
          </div>
          <div class="form-row dual-row">
            <label>高度：</label>
            <input
              v-model.number="containerForm.heightMm"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit">mm</span>
            <span class="sub-label">数量：</span>
            <input
              v-model.number="containerForm.quantity"
              class="inline-input"
              type="number"
              min="1"
            />
            <span class="unit unit-count">个</span>
          </div>
        </div>

        <!-- 添加方案 -->
        <div v-else-if="modalType === 'plan'" class="modal-body">
          <div class="form-row">
            <label>名称：</label>
            <input
              v-model="planForm.planName"
              type="text"
              placeholder="请输入方案名称"
            />
          </div>

          <div class="plan-mode-switch">
            <button
              type="button"
              class="mode-btn"
              :class="{ active: planCreateMode === 'manual' }"
              @click="planCreateMode = 'manual'"
            >
              手动选择
            </button>
            <button
              type="button"
              class="mode-btn"
              :class="{ active: planCreateMode === 'import' }"
              @click="planCreateMode = 'import'"
            >
              导入订单
            </button>
          </div>

          <div v-if="planCreateMode === 'manual'" class="plan-selection-grid">
            <div class="selection-column">
              <div class="helper-text">选择物品：</div>
              <div class="chips-container">
                <div class="chips-header">
                  <input
                    v-model="planItemKeyword"
                    type="text"
                    placeholder="请输入文本"
                  />
                  <div class="quantity-input-wrapper chips-header-actions">
                    <button type="button" class="chips-search-btn" @click="filterPlanItems">
                      搜索
                    </button>
                    <span class="chips-header-unit-spacer" aria-hidden="true">个</span>
                  </div>
                </div>
                <div class="chips-list">
                  <div
                    v-for="item in filteredPlanItems"
                    :key="item.itemId"
                    class="tag-row"
                  >
                    <button
                      type="button"
                      class="tag-button tag-button--plan-fill"
                      :class="{ selected: !!planForm.items[item.itemId] }"
                      :style="{ '--tag-fill-pct': planItemFillPercent(item) + '%' }"
                      @click="togglePlanItem(item)"
                    >
                      <span class="tag-button-label">{{ item.itemName }}</span>
                    </button>
                    <div class="quantity-input-wrapper">
                      <input
                        v-if="planForm.items[item.itemId]"
                        v-model.number="planForm.items[item.itemId].quantity"
                        type="number"
                        min="1"
                        :max="item.quantity || 999999"
                        @input="limitQuantity('item', item)"
                      />
                      <span v-if="planForm.items[item.itemId]">个</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="selection-column">
              <div class="helper-text">选择容器：</div>
              <div class="chips-container">
                <div class="chips-header">
                  <input
                    v-model="planContainerKeyword"
                    type="text"
                    placeholder="请输入文本"
                  />
                  <div class="quantity-input-wrapper chips-header-actions">
                    <button type="button" class="chips-search-btn" @click="filterPlanContainers">
                      搜索
                    </button>
                    <span class="chips-header-unit-spacer" aria-hidden="true">个</span>
                  </div>
                </div>
                <div class="chips-list">
                  <div
                    v-for="c in filteredPlanContainers"
                    :key="c.containerId"
                    class="tag-row"
                  >
                    <button
                      type="button"
                      class="tag-button tag-button--plan-fill"
                      :class="{ selected: !!planForm.containers[c.containerId] }"
                      :style="{ '--tag-fill-pct': planContainerFillPercent(c) + '%' }"
                      @click="togglePlanContainer(c)"
                    >
                      <span class="tag-button-label">{{ c.containerName }}</span>
                    </button>
                    <div class="quantity-input-wrapper">
                      <input
                        v-if="planForm.containers[c.containerId]"
                        v-model.number="planForm.containers[c.containerId].quantity"
                        type="number"
                        min="1"
                        :max="c.quantity || 999999"
                        @input="limitQuantity('container', c)"
                      />
                      <span v-if="planForm.containers[c.containerId]">个</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="import-order-panel">
            <div class="helper-text">导入方式：</div>
            <div class="import-mode-row">
              <label class="inline-radio">
                <input
                  v-model="orderImportMode"
                  type="radio"
                  value="text"
                />
                <span>直接输入文本</span>
              </label>
              <label class="inline-radio">
                <input
                  v-model="orderImportMode"
                  type="radio"
                  value="file"
                />
                <span>上传 txt / xlsx</span>
              </label>
            </div>

            <div v-if="orderImportMode === 'text'" class="form-row import-text-row">
              <textarea
                v-model="orderImportText"
                class="order-textarea"
                placeholder="请粘贴订单文本，包含物品、容器、数量等信息"
              />
            </div>

            <div v-else class="form-row import-file-row">
              <input
                type="file"
                accept=".txt,.xlsx,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                @change="onOrderFileChange"
              />
              <span class="file-hint">{{ orderImportFileName || '未选择文件' }}</span>
            </div>

          </div>
        </div>

        <div v-if="modalType === 'plan'" class="modal-divider">
          <div class="submit-progress submit-progress--labeled">
            <div class="submit-progress__fill" :style="{ width: submitProgress + '%' }"></div>
            <span class="submit-progress__inside-label">{{ Math.round(submitProgress) }}%</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">取消</button>
          <button class="btn" @click="submitModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import { useAppStore } from '../stores/appStore'
import { useUiStore } from '../stores/uiStore'
import PlanDetail from './PlanDetail.vue'

const appStore = useAppStore()
const ui = useUiStore()

function apiErrorMessage(error) {
  const d = error?.response?.data
  if (typeof d === 'string') return d
  if (d?.message) return d.message
  return error?.message || '未知错误'
}

/** 主界面内嵌方案工作区（中栏+右栏） */
const workspacePlanId = ref(null)
/** 内嵌方案页：生成/装箱流进行中，锁定左侧列表与方案切换（由 PlanDetail 同步） */
const workspaceGenerationLocked = ref(false)
/** 左侧方案列表选中（与 workspace 同步；再次点击同一行取消） */
const selectedPlanId = ref(null)
/** 编辑方案弹窗内：仅展示方案原有物品/容器模板 ID */
const editPlanItemIdSet = ref(/** @type {Set<number>} */ (new Set()))
const editPlanContainerIdSet = ref(/** @type {Set<number>} */ (new Set()))
const planPickItemIds = ref(/** @type {Set<number>} */ (new Set()))
const planPickContainerIds = ref(/** @type {Set<number>} */ (new Set()))

// ==================== 常量配置 ====================
const API_BASE = 'http://localhost:8080'
const TABS = {
  ITEMS: 'items',
  CONTAINERS: 'containers',
  PLANS: 'plans'
}
const MODAL_TYPES = {
  ITEM: 'item',
  CONTAINER: 'container',
  PLAN: 'plan'
}
const PLAN_STATUS = {
  NOT_STARTED: 0,
  CONTAINER_INSUFFICIENT: 1,
  ITEM_INSUFFICIENT: 2
}

// ==================== 状态管理 ====================
const currentTab = ref(appStore.currentTab)
const items = ref([])
const containers = ref([])
const plans = ref([])

const sortState = reactive({
  table: currentTab.value || TABS.ITEMS,
  key: null,
  type: null,
  direction: 'asc'
})

const showModal = ref(false)
const modalType = ref(MODAL_TYPES.ITEM)
const modalTitle = ref('')
const editId = ref(null)
const submitProgress = ref(0)
let submitProgressTimer = null

const itemForm = reactive({
  itemName: '',
  lengthMm: null,
  widthMm: null,
  heightMm: null,
  quantity: null
})

const containerForm = reactive({
  containerName: '',
  lengthMm: null,
  widthMm: null,
  heightMm: null,
  quantity: null
})

const planForm = reactive({
  planName: '',
  items: {},
  containers: {}
})

const planItemKeyword = ref('')
const planContainerKeyword = ref('')
const planCreateMode = ref('manual')
const orderImportMode = ref('text')
const orderImportText = ref('')
const orderImportFile = ref(null)
const orderImportFileName = ref('')

// ==================== 计算属性 ====================
const filteredPlanItems = computed(() => {
  let list = items.value || []
  if (
    modalType.value === MODAL_TYPES.PLAN &&
    editId.value &&
    editPlanItemIdSet.value.size > 0
  ) {
    list = list.filter((i) => i?.itemId != null && editPlanItemIdSet.value.has(Number(i.itemId)))
  } else if (
    modalType.value === MODAL_TYPES.PLAN &&
    !editId.value &&
    planCreateMode.value === 'manual'
  ) {
    // 新建方案 · 手动选择：不展示订单导入自动生成的物品模板
    list = list.filter((i) => !i?.orderImported)
  }
  if (!planItemKeyword.value) return list
  return list.filter((i) => i.itemName?.includes(planItemKeyword.value))
})

const filteredPlanContainers = computed(() => {
  let list = containers.value || []
  if (
    modalType.value === MODAL_TYPES.PLAN &&
    editId.value &&
    editPlanContainerIdSet.value.size > 0
  ) {
    list = list.filter((c) => c?.containerId != null && editPlanContainerIdSet.value.has(Number(c.containerId)))
  } else if (
    modalType.value === MODAL_TYPES.PLAN &&
    !editId.value &&
    planCreateMode.value === 'manual'
  ) {
    // 新建方案 · 手动选择：不展示订单导入自动生成的容器模板
    list = list.filter((c) => !c?.orderImported)
  }
  if (!planContainerKeyword.value) return list
  return list.filter((c) => c.containerName?.includes(planContainerKeyword.value))
})

/** 左侧表格：未选方案时仅非订单导入项；选中方案时仅该方案 plan_item / plan_container 中的模板 */
const tableItems = computed(() => {
  const all = items.value || []
  if (selectedPlanId.value) {
    const ids = planPickItemIds.value
    return all.filter((i) => i?.itemId != null && ids.has(Number(i.itemId)))
  }
  return all.filter((i) => !i?.orderImported)
})

const tableContainers = computed(() => {
  const all = containers.value || []
  if (selectedPlanId.value) {
    const ids = planPickContainerIds.value
    return all.filter((c) => c?.containerId != null && ids.has(Number(c.containerId)))
  }
  return all.filter((c) => !c?.orderImported)
})

const sortedItems = computed(() => sortList(tableItems.value, TABS.ITEMS))
const sortedContainers = computed(() => sortList(tableContainers.value, TABS.CONTAINERS))
const sortedPlans = computed(() => sortList(plans.value, TABS.PLANS))

// ==================== 工具函数 ====================
const NAME_KEY_BY_TAB = {
  [TABS.ITEMS]: 'itemName',
  [TABS.CONTAINERS]: 'containerName',
  [TABS.PLANS]: 'planName'
}

function defaultSortByName(list, tableName) {
  const nameKey = NAME_KEY_BY_TAB[tableName]
  if (!nameKey || !list.length) return [...list]
  return [...list].sort((a, b) => {
    const va = a[nameKey] ?? ''
    const vb = b[nameKey] ?? ''
    return String(va).localeCompare(String(vb), 'zh-Hans-u-co-pinyin', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

function sortList(list, tableName) {
  const onThisTab = sortState.table === tableName
  const hasUserSort = onThisTab && sortState.key
  if (hasUserSort) {
    return [...list].sort((a, b) => compareByType(a, b, sortState))
  }
  return defaultSortByName(list, tableName)
}

function compareByType(a, b, state) {
  const dir = state.direction === 'asc' ? 1 : -1
  let va, vb

  // 特殊处理方案表的比率计算
  if (state.table === TABS.PLANS) {
    if (state.type === 'ratioItems') {
      va = (a.actualTotalItemQty || 0) / (a.plannedTotalItemQty || 1)
      vb = (b.actualTotalItemQty || 0) / (b.plannedTotalItemQty || 1)
    } else if (state.type === 'ratioContainers') {
      va = (a.actualTotalContainerQty || 0) / (a.plannedTotalContainerQty || 1)
      vb = (b.actualTotalContainerQty || 0) / (b.plannedTotalContainerQty || 1)
    } else {
      va = a[state.key]
      vb = b[state.key]
    }
  } else {
    va = a[state.key]
    vb = b[state.key]
  }

  // 处理 null 值
  if (va == null && vb == null) return 0
  if (va == null) return dir
  if (vb == null) return -dir

  // 数字排序
  if (['number', 'ratioItems', 'ratioContainers'].includes(state.type)) {
    const na = Number(va)
    const nb = Number(vb)
    return na === nb ? 0 : (na > nb ? dir : -dir)
  }

  // 字符串排序（支持中文拼音）
  return String(va).localeCompare(String(vb), 'zh-Hans-u-co-pinyin', {
    numeric: true,
    sensitivity: 'base'
  }) * dir
}

function formatPlanStatus(status) {
  const statusMap = {
    [PLAN_STATUS.CONTAINER_INSUFFICIENT]: '容器不足',
    [PLAN_STATUS.ITEM_INSUFFICIENT]: '物品不足',
    [PLAN_STATUS.NOT_STARTED]: '未开始'
  }
  return statusMap[status] || '未开始'
}

function calcRate(actual, planned) {
  if (!planned) return '-'
  return `${Math.round(((actual || 0) * 100) / planned)}%`
}

function resetForm(type) {
  const formDefaults = {
    itemName: '',
    containerName: '',
    lengthMm: null,
    widthMm: null,
    heightMm: null,
    quantity: null,
    planName: '',
    items: {},
    containers: {}
  }
  
  if (type === MODAL_TYPES.ITEM) {
    Object.assign(itemForm, formDefaults)
  } else if (type === MODAL_TYPES.CONTAINER) {
    Object.assign(containerForm, formDefaults)
  } else if (type === MODAL_TYPES.PLAN) {
    Object.assign(planForm, { planName: '', items: {}, containers: {} })
    editPlanItemIdSet.value = new Set()
    editPlanContainerIdSet.value = new Set()
    planItemKeyword.value = ''
    planContainerKeyword.value = ''
    planCreateMode.value = 'manual'
    orderImportMode.value = 'text'
    orderImportText.value = ''
    orderImportFile.value = null
    orderImportFileName.value = ''
  }
}

// ==================== API 请求 ====================
async function loadItems(keyword = '') {
  const url = keyword 
    ? `${API_BASE}/api/items?keyword=${encodeURIComponent(keyword)}`
    : `${API_BASE}/api/items`
  const { data } = await axios.get(url)
  items.value = data || []
}

async function loadContainers(keyword = '') {
  const url = keyword
    ? `${API_BASE}/api/containers?keyword=${encodeURIComponent(keyword)}`
    : `${API_BASE}/api/containers`
  const { data } = await axios.get(url)
  containers.value = data || []
}

async function loadPlans(keyword = '') {
  const url = keyword
    ? `${API_BASE}/api/plans?keyword=${encodeURIComponent(keyword)}`
    : `${API_BASE}/api/plans`
  const { data } = await axios.get(url)
  plans.value = data || []
}

async function saveItem() {
  const { itemName, lengthMm, widthMm, heightMm, quantity } = itemForm
  if (!itemName || !lengthMm || !widthMm || !heightMm || !quantity) {
    throw new Error('请填写完整的物品信息')
  }
  
  const url = editId.value 
    ? `${API_BASE}/api/items/${editId.value}`
    : `${API_BASE}/api/items`
  const method = editId.value ? 'put' : 'post'
  
  await axios[method](url, itemForm)
  await loadItems()
}

async function saveContainer() {
  const { containerName, lengthMm, widthMm, heightMm, quantity } = containerForm
  if (!containerName || !lengthMm || !widthMm || !heightMm || !quantity) {
    throw new Error('请填写完整的容器信息')
  }
  
  const url = editId.value
    ? `${API_BASE}/api/containers/${editId.value}`
    : `${API_BASE}/api/containers`
  const method = editId.value ? 'put' : 'post'
  
  await axios[method](url, containerForm)
  await loadContainers()
}

async function savePlan() {
  if (!planForm.planName) {
    throw new Error('请填写方案名称')
  }

  if (planCreateMode.value === 'import') {
    await savePlanByImport(!!editId.value)
    await loadPlans()
    await loadItems()
    await loadContainers()
    if (editId.value && selectedPlanId.value === editId.value) {
      await loadPlanPickIds(editId.value)
    }
    return
  }

  const itemsArr = Object.entries(planForm.items).map(([id, v]) => ({
    itemId: Number(id),
    quantity: v.quantity
  }))
  
  const containersArr = Object.entries(planForm.containers).map(([id, v]) => ({
    containerId: Number(id),
    quantity: v.quantity
  }))
  
  if (!itemsArr.length) throw new Error('请至少选择一个物品')
  if (!containersArr.length) throw new Error('请至少选择一个容器')
  
  const payload = {
    planName: planForm.planName,
    plannedTotalItemQty: itemsArr.reduce((sum, it) => sum + it.quantity, 0),
    plannedTotalContainerQty: containersArr.reduce((sum, it) => sum + it.quantity, 0),
    needUpdate: 0,
    items: itemsArr,
    containers: containersArr
  }
  
  if (editId.value) {
    // 编辑模式：更新方案
    await axios.put(`${API_BASE}/api/plans/${editId.value}`, payload)
  } else {
    // 新增模式：创建方案
    await axios.post(`${API_BASE}/api/plans`, payload)
  }
  
  await loadPlans()
}

async function savePlanByImport(replaceExisting = false) {
  const rid = replaceExisting && editId.value ? editId.value : null
  let orderText = ''
  if (orderImportMode.value === 'text') {
    orderText = orderImportText.value.trim()
  } else {
    if (!orderImportFile.value) {
      throw new Error('请先选择 txt 或 xlsx 文件')
    }
    const fileName = (orderImportFile.value.name || '').toLowerCase()
    const isXlsx = fileName.endsWith('.xlsx')
    if (isXlsx) {
      const formData = new FormData()
      formData.append('file', orderImportFile.value)
      if (planForm.planName?.trim()) {
        formData.append('planName', planForm.planName.trim())
      }
      if (rid != null) {
        formData.append('replacePlanId', String(rid))
      }
      const { data } = await axios.post(`${API_BASE}/api/plans/import-order-file`, formData)
      if (!data?.success) {
        throw new Error(data?.message || '订单导入失败')
      }
      const unresolvedItems = Array.isArray(data?.parsed?.unresolvedItems) ? data.parsed.unresolvedItems : []
      const unresolvedContainers = Array.isArray(data?.parsed?.unresolvedContainers) ? data.parsed.unresolvedContainers : []
      if (unresolvedItems.length || unresolvedContainers.length) {
        ui.showAlert(
          `订单已导入，但有未匹配项：\n` +
            `${unresolvedItems.length ? `未匹配物品：${unresolvedItems.join('，')}\n` : ''}` +
            `${unresolvedContainers.length ? `未匹配容器：${unresolvedContainers.join('，')}` : ''}`
        )
      }
      return
    }
    orderText = await orderImportFile.value.text()
    orderText = String(orderText || '').trim()
  }
  if (!orderText) {
    throw new Error('订单文本不能为空')
  }

  // 统一走 JSON 接口，避免后端未重启时 multipart 路由不存在导致 405。
  const payload = {
    orderText,
    planName: planForm.planName.trim(),
    ...(rid != null ? { replacePlanId: rid } : {})
  }
  const { data } = await axios.post(`${API_BASE}/api/plans/import-order`, payload)
  if (!data?.success) {
    throw new Error(data?.message || '订单导入失败')
  }
  const unresolvedItems = Array.isArray(data?.parsed?.unresolvedItems) ? data.parsed.unresolvedItems : []
  const unresolvedContainers = Array.isArray(data?.parsed?.unresolvedContainers) ? data.parsed.unresolvedContainers : []
  if (unresolvedItems.length || unresolvedContainers.length) {
    ui.showAlert(
      `订单已导入，但有未匹配项：\n` +
        `${unresolvedItems.length ? `未匹配物品：${unresolvedItems.join('，')}\n` : ''}` +
        `${unresolvedContainers.length ? `未匹配容器：${unresolvedContainers.join('，')}` : ''}`
    )
  }
}

async function deleteItem(id) {
  if (!(await ui.showConfirm('确认删除该物品吗？'))) return
  try {
    await axios.delete(`${API_BASE}/api/items/${id}`)
    await loadItems()
  } catch (e) {
    ui.showAlert(apiErrorMessage(e))
  }
}

async function deleteContainer(id) {
  if (!(await ui.showConfirm('确认删除该容器吗？'))) return
  try {
    await axios.delete(`${API_BASE}/api/containers/${id}`)
    await loadContainers()
  } catch (e) {
    ui.showAlert(apiErrorMessage(e))
  }
}

async function deletePlan(id) {
  if (!(await ui.showConfirm('确认删除该方案吗？'))) return
  await axios.delete(`${API_BASE}/api/plans/${id}`)
  if (selectedPlanId.value === id) {
    selectedPlanId.value = null
    planPickItemIds.value = new Set()
    planPickContainerIds.value = new Set()
    workspacePlanId.value = null
  }
  await loadPlans()
}

function onWorkspaceClose() {
  workspacePlanId.value = null
  workspaceGenerationLocked.value = false
}

watch(workspacePlanId, (id) => {
  if (!id) workspaceGenerationLocked.value = false
})

// ==================== 事件处理 ====================
function switchTab(tab) {
  if (workspaceGenerationLocked.value) return
  currentTab.value = tab
  appStore.setCurrentTab(tab)
  sortState.table = tab
  sortState.key = null
  sortState.type = null
  sortState.direction = 'asc'
  const loaders = {
    [TABS.ITEMS]: loadItems,
    [TABS.CONTAINERS]: loadContainers,
    [TABS.PLANS]: loadPlans
  }
  loaders[tab]?.()
}

function sortTable(table, key, type) {
  if (workspaceGenerationLocked.value) return
  if (sortState.table === table && sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc'
  } else {
    Object.assign(sortState, { table, key, type, direction: 'asc' })
  }
}

async function handleAdd() {
  if (workspaceGenerationLocked.value) return
  editId.value = null

  const modalConfig = {
    [TABS.ITEMS]: { type: MODAL_TYPES.ITEM, title: '添加物品' },
    [TABS.CONTAINERS]: { type: MODAL_TYPES.CONTAINER, title: '添加容器' },
    [TABS.PLANS]: { type: MODAL_TYPES.PLAN, title: '添加方案' }
  }

  const config = modalConfig[currentTab.value]
  modalType.value = config.type
  modalTitle.value = config.title
  resetForm(config.type)
  if (config.type === MODAL_TYPES.PLAN) {
    try {
      await Promise.all([loadItems(), loadContainers()])
    } catch {
      /* 列表拉取失败时仍打开弹窗，避免阻断操作 */
    }
  }
  showModal.value = true
}

function openEditItem(item) {
  modalType.value = MODAL_TYPES.ITEM
  modalTitle.value = '编辑物品'
  editId.value = item.itemId
  Object.assign(itemForm, item)
  showModal.value = true
}

function openEditContainer(c) {
  modalType.value = MODAL_TYPES.CONTAINER
  modalTitle.value = '编辑容器'
  editId.value = c.containerId
  Object.assign(containerForm, c)
  showModal.value = true
}

async function openEditPlan(plan) {
  modalType.value = MODAL_TYPES.PLAN
  modalTitle.value = '编辑方案'
  editId.value = plan.planId
  planCreateMode.value = 'manual'

  try {
    // 加载方案“计划选择”的物品和容器（含数量）
    const [itemsRes, containersRes] = await Promise.all([
      axios.get(`${API_BASE}/api/plans/${plan.planId}/plan-items`),
      axios.get(`${API_BASE}/api/plans/${plan.planId}/plan-containers`)
    ])

    editPlanItemIdSet.value = new Set(
      (itemsRes.data || []).map((row) => Number(row.itemId)).filter((n) => !Number.isNaN(n))
    )
    editPlanContainerIdSet.value = new Set(
      (containersRes.data || []).map((row) => Number(row.containerId)).filter((n) => !Number.isNaN(n))
    )

    // 重置表单
    planForm.planName = plan.planName
    planForm.items = {}
    planForm.containers = {}

    // 填充已选择的物品
    if (itemsRes.data) {
      itemsRes.data.forEach(item => {
        planForm.items[item.itemId] = { quantity: item.itemQty }
      })
    }

    // 填充已选择的容器
    if (containersRes.data) {
      containersRes.data.forEach(container => {
        planForm.containers[container.containerId] = { quantity: container.containerQty }
      })
    }

    planItemKeyword.value = ''
    planContainerKeyword.value = ''
    showModal.value = true
  } catch (error) {
    editId.value = null
    editPlanItemIdSet.value = new Set()
    editPlanContainerIdSet.value = new Set()
    ui.showAlert('加载方案详情失败：' + apiErrorMessage(error))
  }
}

async function loadPlanPickIds(planId) {
  try {
    const [ir, cr] = await Promise.all([
      axios.get(`${API_BASE}/api/plans/${planId}/plan-items`),
      axios.get(`${API_BASE}/api/plans/${planId}/plan-containers`)
    ])
    const iids = new Set(
      (ir.data || []).map((r) => Number(r.itemId)).filter((n) => !Number.isNaN(n))
    )
    const cids = new Set(
      (cr.data || []).map((r) => Number(r.containerId)).filter((n) => !Number.isNaN(n))
    )
    planPickItemIds.value = iids
    planPickContainerIds.value = cids
  } catch {
    planPickItemIds.value = new Set()
    planPickContainerIds.value = new Set()
  }
}

async function togglePlanSelection(plan) {
  if (workspaceGenerationLocked.value) return
  if (!plan?.planId) return
  const id = plan.planId
  if (selectedPlanId.value === id) {
    selectedPlanId.value = null
    planPickItemIds.value = new Set()
    planPickContainerIds.value = new Set()
    workspacePlanId.value = null
    return
  }
  selectedPlanId.value = id
  workspacePlanId.value = id
  await loadPlanPickIds(id)
}

function closeModal() {
  showModal.value = false
  submitProgress.value = 0
  editId.value = null
  editPlanItemIdSet.value = new Set()
  editPlanContainerIdSet.value = new Set()
  if (submitProgressTimer) {
    clearInterval(submitProgressTimer)
    submitProgressTimer = null
  }
}

function onOrderFileChange(event) {
  const file = event?.target?.files?.[0] || null
  if (file) {
    const name = (file.name || '').toLowerCase()
    const ok = name.endsWith('.txt') || name.endsWith('.xlsx')
    if (!ok) {
      ui.showAlert('仅支持 .txt 或 .xlsx 文件')
      event.target.value = ''
      orderImportFile.value = null
      orderImportFileName.value = ''
      return
    }
  }
  orderImportFile.value = file
  orderImportFileName.value = file ? file.name : ''
}

async function submitModal() {
  try {
    submitProgress.value = 0
    if (submitProgressTimer) clearInterval(submitProgressTimer)
    submitProgressTimer = setInterval(() => {
      if (submitProgress.value < 90) submitProgress.value += 4
    }, 250)

    const savers = {
      [MODAL_TYPES.ITEM]: saveItem,
      [MODAL_TYPES.CONTAINER]: saveContainer,
      [MODAL_TYPES.PLAN]: savePlan
    }
    await savers[modalType.value]?.()
    submitProgress.value = 100
    showModal.value = false
    editId.value = null
    editPlanItemIdSet.value = new Set()
    editPlanContainerIdSet.value = new Set()
  } catch (e) {
    submitProgress.value = 0
    ui.showAlert(apiErrorMessage(e) || e?.message || '操作失败')
  } finally {
    if (submitProgressTimer) {
      clearInterval(submitProgressTimer)
      submitProgressTimer = null
    }
  }
}

function limitQuantity(type, obj) {
  const entry = type === 'item' 
    ? planForm.items[obj.itemId]
    : planForm.containers[obj.containerId]
  
  if (!entry) return
  
  const max = obj.quantity || 999999
  entry.quantity = Math.max(1, Math.min(entry.quantity, max))
}

/** 方案弹窗标签底色：已选数量占模板库存上限的比例 0～100（未选为 0） */
function planItemFillPercent(item) {
  const row = planForm.items[item.itemId]
  if (!row) return 0
  const max = Math.max(1, Number(item.quantity) || 999999)
  const q = Math.min(max, Math.max(0, Number(row.quantity) || 0))
  return Math.round((q / max) * 100)
}

function planContainerFillPercent(c) {
  const row = planForm.containers[c.containerId]
  if (!row) return 0
  const max = Math.max(1, Number(c.quantity) || 999999)
  const q = Math.min(max, Math.max(0, Number(row.quantity) || 0))
  return Math.round((q / max) * 100)
}

function togglePlanItem(item) {
  if (planForm.items[item.itemId]) {
    delete planForm.items[item.itemId]
  } else {
    planForm.items[item.itemId] = { quantity: 1 }
  }
}

function togglePlanContainer(c) {
  if (planForm.containers[c.containerId]) {
    delete planForm.containers[c.containerId]
  } else {
    planForm.containers[c.containerId] = { quantity: 1 }
  }
}

function filterPlanItems() {
  // 计算属性已自动过滤
}

function filterPlanContainers() {
  // 计算属性已自动过滤
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await Promise.all([loadItems(), loadContainers(), loadPlans()])
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-shell {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 16px 40px 32px;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  border: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-shell {
  border: 1px solid #000;
  border-radius: 18px;
  background: #f4f4f4;
  padding: 14px 18px 18px;
  box-shadow: var(--ui-shadow-md);
}

.main-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  flex: 1;
  min-height: 0;
  align-items: stretch;
}

.col-list {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #fff;
  border: 1px solid #000;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--ui-shadow-md);
}

.col-scene-placeholder,
.col-info-placeholder {
  min-width: 0;
  min-height: 0;
  background: #fff;
  border: 1px solid #000;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-shadow: var(--ui-shadow-md);
}

.ph-banner {
  background: #a8e6cf;
  color: #000;
  font-weight: 400;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #000;
  margin-bottom: 10px;
  box-shadow: var(--ui-shadow-sm);
}

.ph-canvas {
  flex: 1;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 12px;
  background: #fafafa;
  color: #555;
  font-size: 13px;
  font-weight: 400;
  box-shadow: var(--ui-shadow-sm);
}

.ph-hint {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin: auto 8px;
  text-align: center;
}

.plan-row {
  cursor: pointer;
}

.plan-row--selected {
  background: #a8e6cf !important;
}

.app-header {
  background: #a8e6cf;
  color: #000;
  padding: 16px 24px;
  border-radius: 14px;
  border: 1px solid #000;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: center;
  box-shadow: var(--ui-shadow-md);
}

.toolbar {
  padding: 10px 12px;
  background: #fff;
}

.list-top-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
  width: 100%;
}

.list-top-btn {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 6px;
  border-radius: 10px;
  border: 1px solid #000;
  background: #fff;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ui-shadow-sm);
}

.list-top-btn.active {
  background: #a8e6cf;
  color: #000;
}

/* 与方案详情页 Tab 禁用一致：浅灰字、浅灰边、白底 */
.list-top-btn:disabled,
.list-top-btn.active:disabled {
  background: #fff !important;
  color: #bfbfbf !important;
  border-color: #d9d9d9 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  opacity: 1;
}

.sortable--disabled {
  cursor: not-allowed !important;
  color: #bfbfbf !important;
}

.plan-row--locked {
  cursor: not-allowed;
}

.table-wrapper .action-btn:disabled {
  background: #fff !important;
  color: #bfbfbf !important;
  border-color: #d9d9d9 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  opacity: 1;
}

.table-wrapper .action-btn.edit:disabled {
  background: #fff !important;
  color: #bfbfbf !important;
  border-color: #d9d9d9 !important;
}

.table-wrapper .action-btn.danger:disabled {
  background: #fff !important;
  color: #bfbfbf !important;
  border-color: #d9d9d9 !important;
}

.btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background: #a8e6cf;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  min-width: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ui-shadow-sm);
}

.btn.secondary {
  background: #fff;
  color: #000;
}

/* 弹窗内「确定」：淡绿底（与列表「编辑」一致） */
.modal-footer .btn:not(.secondary) {
  background: #a8e6cf;
  color: #000;
  border-color: #000;
}

.table-wrapper {
  border-top: 1px solid #000;
  overflow: auto;
  background: #fff;
  flex: 1;
  min-height: 0;
}

.plans-table thead {
  background: #a8e6cf;
}

.table-wrapper .list-data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table-wrapper .list-data-table th:nth-child(1),
.table-wrapper .list-data-table td:nth-child(1) {
  width: 25%;
}

.table-wrapper .list-data-table th:nth-child(2),
.table-wrapper .list-data-table td:nth-child(2),
.table-wrapper .list-data-table th:nth-child(3),
.table-wrapper .list-data-table td:nth-child(3),
.table-wrapper .list-data-table th:nth-child(4),
.table-wrapper .list-data-table td:nth-child(4),
.table-wrapper .list-data-table th:nth-child(5),
.table-wrapper .list-data-table td:nth-child(5) {
  width: 12%;
}

.table-wrapper .list-data-table th:nth-child(6),
.table-wrapper .list-data-table td:nth-child(6) {
  width: 17%;
}

.table-wrapper .list-data-table th:nth-child(7),
.table-wrapper .list-data-table td:nth-child(7) {
  width: 8%;
}

.table-wrapper .list-data-table th:nth-child(8),
.table-wrapper .list-data-table td:nth-child(8) {
  width: 20%;
}

.table-wrapper .list-data-table thead {
  background: #a8e6cf;
}

.table-wrapper .list-data-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #a8e6cf;
  font-size: 11px;
  font-weight: 400;
  height: 34px;
}

.table-wrapper .list-data-table th,
.table-wrapper .list-data-table td {
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  padding: 4px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 400;
  height: 30px;
}

.table-wrapper .list-data-table th:not(:last-child),
.table-wrapper .list-data-table td:not(:last-child) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
}

.table-wrapper .list-data-table td:last-child {
  overflow: visible;
  white-space: nowrap;
  max-width: none;
  padding-left: 3px;
  padding-right: 3px;
}

.table-wrapper .list-data-table th:last-child,
.table-wrapper .list-data-table td:last-child {
  border-right: 0;
}

.table-wrapper .list-data-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.table-wrapper .list-data-table tbody tr:last-child td {
  border-bottom: 1px solid #000;
}

.empty-text {
  text-align: center;
  padding: 12px 0;
  font-size: 11px;
  font-weight: 400;
  color: #777;
}

.sortable {
  cursor: pointer;
}

.table-wrapper .action-btn {
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid #000;
  background: #a8e6cf;
  color: #000;
  font-size: 10px;
  font-weight: 400;
  cursor: pointer;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  box-shadow: var(--ui-shadow-sm);
}

.action-btn.edit {
  background: #a8e6cf;
  color: #000;
  border-color: #000;
}

.action-btn.danger {
  background: #e85d5d;
  color: #fff;
  border-color: #000;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(800px, 96vw);
  max-height: 85vh;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #000;
  box-shadow: var(--ui-shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal.modal--plan {
  width: min(560px, 92vw);
  max-height: 68vh;
}

.modal.modal-small {
  width: min(380px, 94vw);
}

.modal-header {
  background: #a8e6cf;
  color: #000;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border-bottom: 1px solid #000;
}

/* 物品/容器弹窗：正文仍与「添加」同字号 */
.modal.modal-small .modal-header {
  font-size: 14px;
  font-weight: 400;
  padding: 7px 12px;
}

.modal.modal-small .modal-body {
  padding: 10px 14px 8px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal.modal-small .form-row {
  margin-bottom: 6px;
  gap: 4px;
}

.modal.modal-small .form-row label {
  width: 52px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal.modal-small .form-row.dual-row {
  grid-template-columns: 52px minmax(0, 1fr) 26px 52px minmax(0, 1fr) 26px;
  column-gap: 6px;
}

.modal.modal-small .form-row.dual-row .sub-label {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal.modal-small .form-row input[type='text'],
.modal.modal-small .form-row input[type='number'] {
  height: var(--ui-add-btn-height, 32px);
  padding: 2px 8px;
  border-radius: var(--ui-add-btn-radius, 10px);
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal.modal-small .form-row .inline-input {
  flex: 0 0 68px;
}

.modal.modal-small .unit,
.modal.modal-small .unit-count {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal.modal-small .modal-footer {
  padding: 8px 0 10px;
  gap: 10px;
}

.modal.modal-small .modal-footer .btn {
  height: var(--ui-add-btn-height, 32px);
  min-width: 72px;
  padding: 0 6px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  border-radius: var(--ui-add-btn-radius, 10px);
}

.modal.modal-small .modal-footer .btn.secondary {
  background: #fff;
  color: #000;
}

.modal-body {
  padding: 14px 24px 10px;
  font-size: 14px;
  overflow-y: auto;
  flex: 1;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 6px;
}

.form-row.dual-row {
  display: grid;
  grid-template-columns: 60px 1fr 40px 60px 1fr 40px;
  column-gap: 8px;
  align-items: center;
}

.form-row.dual-row .inline-input {
  width: 100%;
}

.form-row.dual-row .unit {
  width: auto;
  margin: 0;
  text-align: left;
}

.form-row.dual-row .sub-label {
  width: auto;
  text-align: right;
}

.form-row label {
  width: 60px;
  flex-shrink: 0;
}

.form-row input[type='text'],
.form-row input[type='number'] {
  flex: 1;
  height: 34px;
  padding: 4px 6px;
  border-radius: 10px;
  border: 1px solid #000;
  font-size: 14px;
  min-width: 0;
}

.form-row .inline-input {
  flex: 0 0 140px;
}

.form-row .unit {
  margin-left: 2px;
  margin-right: 8px;
}

.sub-label {
  width: 60px;
  display: inline-block;
  text-align: right;
}

.unit {
  width: 30px;
  display: inline-block;
  text-align: left;
}

.unit-count {
  width: 20px;
}

.modal-divider {
  border-top: 1px solid #000;
  padding: 8px 24px;
}

.submit-progress--labeled {
  position: relative;
  width: 100%;
  height: var(--ui-add-btn-height, 32px);
  border: 1px solid #000;
  border-radius: var(--ui-add-btn-radius, 10px);
  overflow: hidden;
  background: #f0f0f0;
}

.submit-progress__fill {
  height: 100%;
  background: #7dd3a8;
  transition: width 0.25s linear;
}

.submit-progress__inside-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  color: #111;
  pointer-events: none;
  z-index: 1;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.95);
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 10px 0 16px;
}

.helper-text {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  color: #555;
  margin-bottom: 6px;
}

.plan-mode-switch {
  display: inline-flex;
  gap: 8px;
  margin-bottom: 10px;
}

.mode-btn {
  height: var(--ui-add-btn-height, 32px);
  padding: 0 12px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  cursor: pointer;
  box-shadow: var(--ui-shadow-sm);
}

.mode-btn.active {
  background: #a8e6cf;
  color: #000;
}

.import-order-panel {
  border: 1px solid #000;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
}

.import-mode-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.inline-radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.import-text-row,
.import-file-row {
  margin-bottom: 8px;
}

.order-textarea {
  width: 100%;
  min-height: 180px;
  resize: vertical;
  border: 1px solid #000;
  border-radius: var(--ui-add-btn-radius, 10px);
  padding: 8px 10px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  box-shadow: var(--ui-shadow-sm);
}

.file-hint {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  color: #666;
}

.chips-container {
  border: 1px solid #000;
  border-radius: 10px;
  padding: 8px 6px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--ui-shadow-sm);
}

.chips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-bottom: 6px;
}

.chips-header input {
  flex: 1;
  min-width: 0;
  height: var(--ui-add-btn-height, 32px);
  padding: 0 10px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  box-shadow: var(--ui-shadow-sm);
}

.chips-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.tag-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  margin: 4px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--ui-shadow-sm);
}

.tag-button.selected {
  background: #a8e6cf;
  color: #000;
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  gap: 8px;
}

.tag-row .tag-button {
  flex: 1;
  min-width: 0;
  margin: 0;
}

.quantity-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  min-width: 90px;
  justify-content: flex-end;
}

.quantity-input-wrapper input {
  width: 70px;
  height: var(--ui-add-btn-height, 32px);
  padding: 2px 6px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  text-align: center;
  box-sizing: border-box;
}

.quantity-input-wrapper span {
  width: 20px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.plan-selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 10px;
}

.selection-column {
  display: flex;
  flex-direction: column;
}

/* 方案弹窗：紧凑布局 */
.modal--plan .modal-header {
  font-size: 16px;
  font-weight: 400;
  padding: 8px 14px;
}

.modal--plan .modal-body {
  padding: 8px 12px 6px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .form-row {
  margin-bottom: 6px;
}

.modal--plan .form-row label {
  width: 52px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .form-row input[type='text'],
.modal--plan .form-row input[type='number'] {
  height: var(--ui-add-btn-height, 32px);
  padding: 2px 8px;
  border-radius: var(--ui-add-btn-radius, 10px);
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .helper-text {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  margin-bottom: 2px;
}

.modal--plan .chips-header {
  margin-bottom: 4px;
}

.modal--plan .plan-mode-switch {
  gap: 6px;
  margin-bottom: 8px;
}

.modal--plan .mode-btn {
  height: var(--ui-add-btn-height, 32px);
  padding: 0 10px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  border-radius: var(--ui-add-btn-radius, 10px);
}

.modal--plan .chips-header input {
  height: var(--ui-add-btn-height, 32px);
  padding: 0 8px;
  border-radius: var(--ui-add-btn-radius, 10px);
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .chips-container {
  --ui-add-btn-height: 26px;
  padding: 5px 4px;
  max-height: 168px;
}

.modal--plan .chips-header-actions .chips-header-unit-spacer {
  visibility: hidden;
  user-select: none;
  width: auto;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .chips-header-actions .chips-search-btn {
  width: 52px;
  flex: 0 0 52px;
  box-sizing: border-box;
  height: var(--ui-add-btn-height, 32px);
  padding: 0 4px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  background: #a8e6cf;
  color: #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ui-shadow-sm);
}

.modal--plan .tag-button.tag-button--plan-fill {
  position: relative;
  overflow: hidden;
  padding: 2px 8px;
  margin: 1px 0;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  border-radius: var(--ui-add-btn-radius, 10px);
  min-height: var(--ui-add-btn-height, 32px);
  line-height: 1.2;
  background: #fff;
}

.modal--plan .tag-button.tag-button--plan-fill.selected {
  background: #fff;
}

.modal--plan .tag-button.tag-button--plan-fill::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--tag-fill-pct, 0%);
  max-width: 100%;
  background: #a8e6cf;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
}

.modal--plan .tag-button.tag-button--plan-fill .tag-button-label {
  position: relative;
  z-index: 1;
}

.modal--plan .tag-row {
  margin-top: 0;
  gap: 6px;
}

.modal--plan .quantity-input-wrapper {
  min-width: 72px;
}

.modal--plan .quantity-input-wrapper input {
  width: 52px;
  height: var(--ui-add-btn-height, 32px);
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  border-radius: var(--ui-add-btn-radius, 10px);
  padding: 2px 4px;
}

.modal--plan .quantity-input-wrapper span {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  width: auto;
}

.modal--plan .plan-selection-grid {
  gap: 8px;
  margin-top: 6px;
}

.modal--plan .import-order-panel {
  padding: 8px;
  margin-top: 8px;
}

.modal--plan .import-mode-row {
  gap: 14px;
  margin-bottom: 8px;
}

.modal--plan .inline-radio {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .order-textarea {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  min-height: 96px;
  padding: 6px 8px;
}

.modal--plan .file-hint {
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.modal--plan .modal-divider {
  padding: 4px 12px;
}

.modal--plan .modal-footer {
  padding: 6px 0 8px;
  gap: 10px;
}

.modal--plan .modal-footer .btn {
  height: var(--ui-add-btn-height, 32px);
  min-width: 72px;
  padding: 0 6px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  border-radius: var(--ui-add-btn-radius, 10px);
}

.modal--plan .modal-footer .btn.secondary {
  background: #fff;
  color: #000;
}
</style>

