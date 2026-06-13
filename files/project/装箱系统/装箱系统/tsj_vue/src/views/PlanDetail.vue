<template>
  <div class="plan-detail-shell" :class="{ 'plan-detail-shell--embed': embedded }">
    <!-- 左侧：3D 展示区域（全屏时包含工具栏 + 画布 + 底部选中信息） -->
    <div class="left-panel">
      <div id="plan-detail-three-root" class="plan-detail-three-root">
      <div class="canvas-toolbar">
        <div class="canvas-toolbar-buttons">
          <button
            type="button"
            class="btn-toolbar"
            :class="{
              active:
                canvasToolbarMenu === 'playback' || packingPlaybackState !== 'idle'
            }"
            :disabled="uiLocked"
            @click="toggleCanvasToolbarMenu('playback')"
          >
            过程回放
          </button>
          <button
            type="button"
            class="btn-toolbar"
            :class="{ active: canvasToolbarMenu === 'observe' }"
            :disabled="uiLocked"
            @click="toggleCanvasToolbarMenu('observe')"
          >
            观察模式
          </button>
          <button
            type="button"
            class="btn-toolbar"
            :class="{ active: canvasToolbarMenu === 'assist' }"
            :disabled="uiLocked"
            @click="toggleCanvasToolbarMenu('assist')"
          >
            辅助观察
          </button>
          <button
            type="button"
            class="btn-toolbar"
            :class="{ active: sceneFullscreenActive }"
            @click="toggleSceneFullscreen"
          >
            全屏模式
          </button>
        </div>
        <div
          v-if="canvasToolbarMenu === 'playback'"
          class="tab-group canvas-toolbar-sub"
        >
          <button
            type="button"
            class="tab-btn"
            :disabled="
              uiLocked ||
              !packingPlaybackEligible ||
              packingPlaybackTotal === 0
            "
            @click="onPlaybackReplayClick"
          >
            重新播放
          </button>
          <button
            type="button"
            class="tab-btn"
            :disabled="
              uiLocked ||
              !packingPlaybackEligible ||
              packingPlaybackTotal === 0 ||
              packingPlaybackState === 'idle' ||
              packingPlaybackState === 'completed'
            "
            @click="onPlaybackPauseResumeClick"
          >
            {{ playbackPauseResumeLabel }}
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: packingPlaybackReverse }"
            :disabled="
              uiLocked ||
              !packingPlaybackEligible ||
              packingPlaybackTotal === 0
            "
            @click="togglePackingPlaybackReverse"
          >
            倒放模式
          </button>
        </div>
        <div
          v-if="canvasToolbarMenu === 'observe'"
          class="tab-group canvas-toolbar-sub"
        >
          <button
            type="button"
            class="tab-btn"
            :class="{ active: projectionMode === 'orthographic' }"
            :disabled="uiLocked"
            @click="setProjectionMode('orthographic')"
          >
            正交投影
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: projectionMode === 'perspective' }"
            :disabled="uiLocked"
            @click="setProjectionMode('perspective')"
          >
            透视投影
          </button>
        </div>
        <div
          v-if="canvasToolbarMenu === 'assist'"
          class="tab-group canvas-toolbar-sub"
        >
          <button
            type="button"
            class="tab-btn"
            :class="{ active: axisRulerVisible }"
            :disabled="uiLocked"
            @click="toggleAxisRuler"
          >
            坐标轴
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: sceneContextBannerVisible }"
            :disabled="uiLocked"
            @click="toggleSceneContextBanner"
          >
            选中信息
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: wireframeHighlightMode }"
            :disabled="uiLocked"
            @click="toggleWireframeHighlightMode"
          >
            线框模式
          </button>
        </div>
      </div>
      <div class="scene-frame">
        <div
          v-show="sceneContextBannerVisible"
          class="scene-context-banner mint-banner"
        >
          {{ sceneContextBannerText }}
        </div>
        <div id="canvas-container" class="canvas-container"></div>
        <div class="playback-scene-footer">
          <div class="playback-bar playback-bar--labeled">
            <div class="playback-bar-fill" :style="{ width: playbackBarPercent + '%' }"></div>
            <span class="playback-bar-label">{{ playbackBarLabelText }}</span>
          </div>
        </div>
      </div>
      <div v-if="!embedded" class="selected-item-panel">
        <template v-if="selectedItemInContainer">
          <span class="selected-item-name">{{ selectedItemInContainer.name }}</span>
          <span class="selected-item-coord">X: {{ formatSelectedCoord(selectedItemInContainer.posX) }}</span>
          <span class="selected-item-coord">Y: {{ formatSelectedCoord(selectedItemInContainer.posY) }}</span>
          <span class="selected-item-coord">Z: {{ formatSelectedCoord(selectedItemInContainer.posZ) }}</span>
          <span class="selected-item-coord">
            支撑率: {{ formatSelectedSupportRate(selectedItemInContainer.supportRate) }}%
          </span>
        </template>
        <span v-else class="selected-item-empty">未选中物品</span>
      </div>
      </div>
    </div>

    <!-- 右侧：信息面板 -->
    <div class="right-panel">
      <!-- 标签页 -->
      <div class="tab-group">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="tab-btn"
          :class="{ active: currentTab === tab }"
          :disabled="uiLocked"
          @click="!uiLocked && (currentTab = tab)"
        >
          {{ tabLabels[tab] }}
        </button>
      </div>

      <div v-if="currentTab === 'plan'" class="tab-group plan-detail-subtabs">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: planDetailSubTab === 'containers' }"
          :disabled="uiLocked"
          @click="!uiLocked && (planDetailSubTab = 'containers')"
        >
          方案容器细节
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: planDetailSubTab === 'items' }"
          :disabled="uiLocked"
          @click="!uiLocked && (planDetailSubTab = 'items')"
        >
          方案物品细节
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: planDetailSubTab === 'summary' }"
          :disabled="uiLocked"
          @click="!uiLocked && (planDetailSubTab = 'summary')"
        >
          方案详细信息
        </button>
      </div>

      <div class="right-panel-tab-area">
      <!-- 执行过程 -->
      <div v-if="currentTab === 'execution'" class="tab-content execution-panel">
        <div class="exec-body exec-body--stacked">
          <section class="exec-stage-section">
            <div class="exec-section-title">当前阶段</div>
            <div class="exec-phase mono">{{ executionState.phase || '-' }}</div>
            <div class="exec-temperature">
              <span class="exec-temperature__k">退火温度 T：</span>
              <span class="exec-temperature__v mono">{{
                executionState.temperature != null && Number.isFinite(Number(executionState.temperature))
                  ? Number(executionState.temperature).toFixed(4)
                  : '—'
              }}</span>
            </div>
          </section>

          <section class="exec-log-section">
            <div class="exec-section-title exec-section-title--log">事件日志</div>
            <div class="exec-log-list mono">
              <div v-for="(line, idx) in executionState.logs" :key="'log-' + idx" class="exec-log-line">
                {{ line }}
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- 详细信息：子标签切换 容器 / 物品 / 方案概要（表格样式与首页列表一致） -->
      <div v-if="currentTab === 'plan'" class="tab-content plan-info">
        <div v-if="planDetailSubTab === 'containers'" class="plan-info-table-shell">
          <table class="list-data-table plan-info-containers-table">
            <thead>
              <tr>
                <th class="sortable" @click="sortContainers('name', 'string')">
                  <span class="plan-table-th-inner">
                    <span>容器名称</span>
                    <span class="sort-indicator">{{ sortIndicator(containersSort, 'name') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortContainers('filled', 'number')">
                  <span class="plan-table-th-inner">
                    <span>装满</span>
                    <span class="sort-indicator">{{ sortIndicator(containersSort, 'filled') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortContainers('filledItemQty', 'number')">
                  <span class="plan-table-th-inner">
                    <span>物品数量</span>
                    <span class="sort-indicator">{{ sortIndicator(containersSort, 'filledItemQty') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortContainers('fillRate', 'number')">
                  <span class="plan-table-th-inner">
                    <span>填充率</span>
                    <span class="sort-indicator">{{ sortIndicator(containersSort, 'fillRate') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortContainers('avgSupportRate', 'number')">
                  <span class="plan-table-th-inner">
                    <span>平均支撑率</span>
                    <span class="sort-indicator">{{ sortIndicator(containersSort, 'avgSupportRate') }}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="container in sortedContainers"
                :key="container.id"
                :class="{ selected: selectedContainerId === container.id }"
                @click="selectContainer(container.id)"
              >
                <td>{{ container.name }}</td>
                <template v-if="container.isUnloaded">
                  <td>/</td>
                  <td>{{ unloadedItemsCount }}</td>
                  <td>/</td>
                  <td>/</td>
                </template>
                <template v-else>
                  <td>{{ container.filled ? '是' : '否' }}</td>
                  <td>{{ container.filledItemQty }}</td>
                  <td>{{ container.fillRate }}%</td>
                  <td>{{ container.avgSupportRate }}%</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="planDetailSubTab === 'items'" class="plan-info-table-shell">
          <table class="list-data-table plan-info-items-table">
            <thead>
              <tr>
                <th class="sortable" @click="sortItems('name', 'string')">
                  <span class="plan-table-th-inner">
                    <span>物品名称</span>
                    <span class="sort-indicator">{{ sortIndicator(itemsSort, 'name') }}</span>
                  </span>
                </th>
                <th>
                  <span class="plan-table-th-inner"><span>颜色</span></span>
                </th>
                <th class="sortable" @click="sortItems('posX', 'number')">
                  <span class="plan-table-th-inner">
                    <span>X(mm)</span>
                    <span class="sort-indicator">{{ sortIndicator(itemsSort, 'posX') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortItems('posY', 'number')">
                  <span class="plan-table-th-inner">
                    <span>Y(mm)</span>
                    <span class="sort-indicator">{{ sortIndicator(itemsSort, 'posY') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortItems('posZ', 'number')">
                  <span class="plan-table-th-inner">
                    <span>Z(mm)</span>
                    <span class="sort-indicator">{{ sortIndicator(itemsSort, 'posZ') }}</span>
                  </span>
                </th>
                <th class="sortable" @click="sortItems('supportRate', 'number')">
                  <span class="plan-table-th-inner">
                    <span>支撑率</span>
                    <span class="sort-indicator">{{ sortIndicator(itemsSort, 'supportRate') }}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in sortedItemsInContainer"
                :key="item.id"
                :class="{ selected: selectedItemId === item.id }"
                @click="!uiLocked && selectItem(item)"
              >
                <td class="item-name">{{ item.name }}</td>
                <td>
                  <div class="color-box" :style="{ backgroundColor: item.color }"></div>
                </td>
                <td>{{ formatSelectedCoord(item.posX) }}</td>
                <td>{{ formatSelectedCoord(item.posY) }}</td>
                <td>{{ formatSelectedCoord(item.posZ) }}</td>
                <td>{{ item.supportRate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="planDetailSubTab === 'summary'" class="plan-info-summary-shell">
          <div class="info-item">
            <span class="label">名称：</span>
            <span class="value">{{ plan.planName }}</span>
          </div>
          <div class="info-item">
            <span class="label">实际物品数/计划数：</span>
            <span class="value">{{ plan.actualTotalItemQty }}/{{ plan.plannedTotalItemQty }}</span>
          </div>
          <div class="info-item">
            <span class="label">平均支撑率：</span>
            <span class="value">{{ plan.avgItemSupportRate }}%</span>
          </div>
          <div class="info-item">
            <span class="label">实际容器数/计划数：</span>
            <span class="value">{{ plan.actualTotalContainerQty }}/{{ plan.plannedTotalContainerQty }}</span>
          </div>
          <div class="info-item">
            <span class="label">平均填充率：</span>
            <span class="value">{{ plan.avgFilledContainerFillRate }}%</span>
          </div>
          <div class="info-item">
            <span class="label">方案状态：</span>
            <span class="value">{{ formatPlanStatus(plan.planStatus) }}</span>
          </div>
          <div class="info-item">
            <span class="label">是否需要更新：</span>
            <span class="value">{{ plan.needUpdate === 1 ? '是' : '否' }}</span>
          </div>
        </div>
      </div>

      <!-- 特殊需求 -->
      <!-- 导出方案（内联设置） -->
      <div v-if="currentTab === 'export'" class="tab-content export-inline-panel">
        <p class="export-hint">请选择要打包下载的内容（可多选）：</p>
        <label class="export-checkbox-row">
          <input v-model="exportIncludeThreeViewsPng" type="checkbox" :disabled="uiLocked" />
          <span>方案六视图（PNG：主/后/仰/俯/左/右视图，每容器一张）</span>
        </label>
        <label class="export-checkbox-row">
          <input v-model="exportIncludePlanInfoXlsx" type="checkbox" :disabled="uiLocked" />
          <span>方案信息表（XLSX：物品与容器尺寸与数量、特殊需求、装载概况等）</span>
        </label>
        <label class="export-checkbox-row">
          <input v-model="exportIncludePackingDetailXlsx" type="checkbox" :disabled="uiLocked" />
          <span>方案装箱明细（XLSX：各容器实例的详细装箱情况）</span>
        </label>
        <label class="export-checkbox-row">
          <input v-model="exportIncludeUnloadedXlsx" type="checkbox" :disabled="uiLocked" />
          <span>未装载明细（XLSX：未装入容器的物品明细）</span>
        </label>
        <p v-if="exportSelectionEmpty" class="export-warn">请至少选择一项导出内容。</p>
        <div class="export-inline-actions">
          <button
            class="btn"
            type="button"
            :disabled="exportSelectionEmpty || uiLocked"
            @click="confirmExportDownload"
          >
            下载 ZIP
          </button>
        </div>
      </div>

      <div v-if="currentTab === 'requirements'" class="tab-content requirements-panel">
        <div class="requirements-list">
          <div v-for="req in requirements" :key="req.id" class="requirement-item">
            <div class="requirement-content">{{ req.content }}</div>
            <div class="requirement-actions">
              <button
                class="action-btn small"
                type="button"
                :disabled="uiLocked"
                @click.stop="runLlmOptimize(req.id)"
              >
                LLM分析
              </button>
              <button
                class="action-btn small danger"
                type="button"
                :disabled="uiLocked"
                @click.stop="deleteRequirement(req)"
              >
                删除
              </button>
              <span v-if="req.finished" class="status-dot" title="已完成"></span>
            </div>
          </div>
        </div>
        <div class="add-requirement">
          <input
            v-model="newRequirement"
            type="text"
            placeholder="请输入文本"
            class="requirement-input"
            :disabled="uiLocked"
          />
          <button class="btn" type="button" :disabled="uiLocked" @click="addRequirement">添加需求</button>
          <button
            class="btn"
            type="button"
            :disabled="uiLocked || llmLoading"
            @click="runLlmOptimize(null)"
          >
            {{ llmLoading ? '分析中…' : 'LLM优化（全量）' }}
          </button>
        </div>
      </div>

      </div>

      <div class="right-panel-generate-strip exec-footer--row">
        <div class="progress-bar progress-bar--labeled">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          <span class="progress-inside-label">{{ Math.round(progress) }}%</span>
        </div>
        <button class="btn exec-generate-btn" type="button" :disabled="uiLocked" @click="openGenerateDialog">
          生成方案
        </button>
      </div>

      <!-- LLM 分析结果 -->
      <div v-if="llmModalVisible" class="llm-modal-backdrop" @click.self="closeLlmModal">
        <div class="llm-modal">
          <div class="llm-modal-header">LLM 需求理解与方案建议</div>
          <div class="llm-modal-body">
            <p v-if="llmError" class="llm-error">{{ llmError }}</p>
            <template v-else>
              <section v-if="llmResult.requirementUnderstanding" class="llm-section">
                <h4>需求理解</h4>
                <p class="llm-text">{{ llmResult.requirementUnderstanding }}</p>
              </section>
              <section v-if="llmResult.currentPackingAssessment" class="llm-section">
                <h4>当前装箱评估</h4>
                <p class="llm-text">{{ llmResult.currentPackingAssessment }}</p>
              </section>
              <section v-if="llmResult.rawAssistantText" class="llm-section">
                <h4>供算法使用的约束（重新生成时下发）</h4>
                <pre class="llm-json">{{ JSON.stringify(llmResult.packingConstraintsForRegeneration || {}, null, 2) }}</pre>
              </section>
              <section v-if="llmResult.modifiedPlanSummary" class="llm-section">
                <h4>修改方案说明</h4>
                <p class="llm-text">{{ llmResult.modifiedPlanSummary }}</p>
              </section>
              <section v-if="llmResult.recommendedAlgorithm" class="llm-section">
                <h4>推荐算法</h4>
                <p class="llm-text mono">{{ llmResult.recommendedAlgorithm }}</p>
              </section>
              <section v-if="llmResult.constraintNotes?.length" class="llm-section">
                <h4>约束要点</h4>
                <ul class="llm-list">
                  <li v-for="(n, i) in llmResult.constraintNotes" :key="'c-' + i">{{ n }}</li>
                </ul>
              </section>
              <section v-if="llmResult.planEditHints?.length" class="llm-section">
                <h4>计划调整建议</h4>
                <ul class="llm-list">
                  <li v-for="(n, i) in llmResult.planEditHints" :key="'h-' + i">{{ n }}</li>
                </ul>
              </section>
              <section class="llm-section">
                <h4>是否建议重新生成装箱</h4>
                <p class="llm-text">{{ llmResult.needRegeneratePacking ? '是' : '否' }}</p>
              </section>
              <p v-if="llmResult.parseWarning" class="llm-warn">{{ llmResult.parseWarning }}</p>
              <details v-if="llmResult.rawAssistantText" class="llm-raw">
                <summary>原始模型输出</summary>
                <pre>{{ llmResult.rawAssistantText }}</pre>
              </details>
            </template>
          </div>
          <div class="llm-modal-footer">
            <button class="btn secondary" type="button" :disabled="uiLocked" @click="closeLlmModal">关闭</button>
            <button
              class="btn"
              type="button"
              :disabled="uiLocked || regenerateWithConstraintsLoading"
              @click="openRegenerateWithConstraintsDialog"
            >
              {{ regenerateWithConstraintsLoading ? '重新生成中…' : '重新生成' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 底部按钮（独立打开方案页时保留） -->
      <div v-if="!embedded" class="button-group">
        <button class="btn secondary" :disabled="uiLocked" @click="goBack">返回</button>
        <button class="btn secondary" :disabled="uiLocked" @click="openExportDialog">导出方案</button>
      </div>

      <!-- 生成选项 -->
      <div v-if="generateDialogVisible" class="export-modal-backdrop" @click.self="closeGenerateDialog">
        <div class="export-modal">
          <div class="export-modal-header">生成方案</div>
          <div class="export-modal-body">
            <p class="export-hint">
              是否开始生成？
            </p>
          </div>
          <div class="export-modal-footer">
            <button
              class="btn secondary"
              type="button"
              :disabled="generatePlanLoading"
              @click="closeGenerateDialog"
            >
              取消
            </button>
            <button
              class="btn"
              type="button"
              :disabled="generatePlanLoading"
              @click="confirmGeneratePlan"
            >
              开始生成
            </button>
          </div>
        </div>
      </div>

      <!-- 按约束重新生成选项 -->
      <div
        v-if="regenerateDialogVisible"
        class="export-modal-backdrop"
        @click.self="closeRegenerateDialog"
      >
        <div class="export-modal">
          <div class="export-modal-header">按约束重新生成装箱</div>
          <div class="export-modal-body">
            <p class="export-hint">
              是否开始重新生成？
            </p>
          </div>
          <div class="export-modal-footer">
            <button
              class="btn secondary"
              type="button"
              :disabled="uiLocked || regenerateWithConstraintsLoading"
              @click="closeRegenerateDialog"
            >
              取消
            </button>
            <button
              class="btn"
              type="button"
              :disabled="uiLocked || regenerateWithConstraintsLoading"
              @click="regeneratePackingWithLlmConstraints"
            >
              开始生成
            </button>
          </div>
        </div>
      </div>

      <!-- 导出选项 -->
      <div v-if="exportDialogVisible" class="export-modal-backdrop" @click.self="closeExportDialog">
        <div class="export-modal">
          <div class="export-modal-header">导出方案</div>
          <div class="export-modal-body">
            <p class="export-hint">请选择要打包下载的内容（可多选）：</p>
            <label class="export-checkbox-row">
              <input v-model="exportIncludeThreeViewsPng" type="checkbox" :disabled="uiLocked" />
              <span>方案六视图（PNG：主/后/仰/俯/左/右视图，每容器一张）</span>
            </label>
            <label class="export-checkbox-row">
              <input v-model="exportIncludePlanInfoXlsx" type="checkbox" :disabled="uiLocked" />
              <span>方案信息表（XLSX：物品与容器尺寸与数量、特殊需求、装载概况等）</span>
            </label>
            <label class="export-checkbox-row">
              <input v-model="exportIncludePackingDetailXlsx" type="checkbox" :disabled="uiLocked" />
              <span>方案装箱明细（XLSX：各容器实例的详细装箱情况）</span>
            </label>
            <label class="export-checkbox-row">
              <input v-model="exportIncludeUnloadedXlsx" type="checkbox" :disabled="uiLocked" />
              <span>未装载明细（XLSX：未装入容器的物品明细）</span>
            </label>
            <p v-if="exportSelectionEmpty" class="export-warn">请至少选择一项导出内容。</p>
          </div>
          <div class="export-modal-footer">
            <button class="btn secondary" type="button" :disabled="uiLocked" @click="closeExportDialog">取消</button>
            <button
              class="btn"
              type="button"
              :disabled="exportSelectionEmpty || uiLocked"
              @click="confirmExportDownload"
            >
              下载 ZIP
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import * as THREE from 'three'
import {
  createContainerAxisRulerGroup,
  createFatBoxWireframeMesh,
  disposeAxisRulerGroup
} from '@/utils/containerAxisRulerThree.js'
import { toggleFullscreenForElement } from '@/utils/fullscreenToggle.js'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps({
  embedded: { type: Boolean, default: false },
  planId: { type: [String, Number], default: null }
})
const emit = defineEmits(['close', 'workspaceLock'])

const router = useRouter()
const route = useRoute()
const ui = useUiStore()
const API_BASE = 'http://localhost:8080'

function apiErrorMessage(error) {
  const d = error?.response?.data
  if (typeof d === 'string') return d
  if (d?.message) return d.message
  return error?.message || '未知错误'
}

const activePlanId = computed(() => {
  if (props.planId != null && props.planId !== '') return String(props.planId)
  return route.params?.id != null && route.params.id !== '' ? String(route.params.id) : ''
})

const plan = ref({})
const containers = ref([])
const items = ref([])
const requirements = ref([])

const currentTab = ref('execution')
const selectedContainerId = ref(null)
const selectedItemId = ref(null)
/** 线框/透视高亮：非选中物品隐藏，仅突出选中件（原「透视模式」效果） */
const wireframeHighlightMode = ref(false)
/** 场景顶部上下文条（容器/选中物品信息） */
const sceneContextBannerVisible = ref(true)
/** 左侧画布工具栏展开的子菜单：playback | observe | assist | null */
const canvasToolbarMenu = ref(null)
/** 观察模式：正交 / 透视（默认） */
const projectionMode = ref('perspective')
/** 装箱回放是否倒序（卸载式回放） */
const packingPlaybackReverse = ref(false)
/** 是否绘制容器旁坐标刻度尺 */
const axisRulerVisible = ref(true)
const newRequirement = ref('')
const progress = ref(0)

const llmLoading = ref(false)
const llmModalVisible = ref(false)
const llmError = ref('')
const regenerateWithConstraintsLoading = ref(false)
const exportDialogVisible = ref(false)
const exportIncludeThreeViewsPng = ref(true)
const exportIncludePlanInfoXlsx = ref(true)
const exportIncludePackingDetailXlsx = ref(true)
const exportIncludeUnloadedXlsx = ref(true)

const exportSelectionEmpty = computed(
  () =>
    !exportIncludeThreeViewsPng.value &&
    !exportIncludePlanInfoXlsx.value &&
    !exportIncludePackingDetailXlsx.value &&
    !exportIncludeUnloadedXlsx.value
)
const generateDialogVisible = ref(false)
const generatePlanLoading = ref(false)
const regenerateDialogVisible = ref(false)
const llmResult = ref({
  requirementUnderstanding: '',
  currentPackingAssessment: '',
  modifiedPlanSummary: '',
  recommendedAlgorithm: '',
  constraintNotes: [],
  planEditHints: [],
  needRegeneratePacking: false,
  packingConstraintsForRegeneration: {},
  parseWarning: '',
  rawAssistantText: ''
})

// 排序状态（物品表/容器表分别维护）
const itemsSort = ref({ key: null, dir: 'asc', type: 'string' })
const containersSort = ref({ key: null, dir: 'asc', type: 'string' })

const unloadedItemsCount = computed(
  () =>
    items.value.filter((it) => !it.loaded || it.containerInstanceId == null).length
)

const tabs = ['execution', 'plan', 'requirements', 'export']
const tabLabels = {
  execution: '执行过程',
  plan: '详细信息',
  requirements: '添加约束',
  export: '导出方案'
}

/** 详细信息面板：容器表 / 物品表 / 方案概要 */
const planDetailSubTab = ref('containers')

const sceneFullscreenActive = ref(false)

function syncSceneFullscreenActive() {
  const wrap = document.getElementById('plan-detail-three-root')
  const doc = document
  const active = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement
  sceneFullscreenActive.value = !!wrap && active === wrap
}

function toggleSceneFullscreen() {
  const wrap = document.getElementById('plan-detail-three-root')
  toggleFullscreenForElement(wrap)
  requestAnimationFrame(() => syncSceneFullscreenActive())
}

function toggleCanvasToolbarMenu(key) {
  canvasToolbarMenu.value = canvasToolbarMenu.value === key ? null : key
}

function onPlaybackReplayClick() {
  if (executionState.value.running) return
  if (!packingPlaybackEligible.value) {
    ui.showAlert('先选择一个装载完成的容器')
    return
  }
  if (packingPlaybackTotal.value === 0) return
  replayPackingPlayback()
}

function onPlaybackPauseResumeClick() {
  if (executionState.value.running) return
  if (!packingPlaybackEligible.value || packingPlaybackTotal.value === 0) return
  if (packingPlaybackState.value === 'playing') pausePackingPlayback()
  else if (packingPlaybackState.value === 'paused') resumePackingPlayback()
}

const playbackPauseResumeLabel = computed(() => {
  if (packingPlaybackState.value === 'playing') return '暂停'
  if (packingPlaybackState.value === 'paused') return '继续'
  return '暂停/继续'
})

function togglePackingPlaybackReverse() {
  if (packingPlaybackState.value === 'playing') pausePackingPlayback()
  packingPlaybackReverse.value = !packingPlaybackReverse.value
}

function toggleSceneContextBanner() {
  sceneContextBannerVisible.value = !sceneContextBannerVisible.value
}

function toggleWireframeHighlightMode() {
  wireframeHighlightMode.value = !wireframeHighlightMode.value
  refreshScenePreserveView()
}

const COLORS = ['#FF6B6B', '#FF69B4', '#FFD93D', '#6BCB77', '#4D96FF', '#9D84B7']

/** 装箱过程回放：idle | playing | paused | completed */
const packingPlaybackState = ref('idle')
const packingPlaybackStepIndex = ref(0)
let packingPlaybackTimer = null
const PLAYBACK_INTERVAL_MS = 400

const itemsInContainer = computed(() => {
  // items 接口已返回“单个物品明细行”，这里只做颜色映射与容器过滤
  const itemColorMap = new Map()
  let colorIndex = 0

  items.value.forEach((item) => {
    if (!itemColorMap.has(item.itemId)) {
      itemColorMap.set(item.itemId, COLORS[colorIndex % COLORS.length])
      colorIndex++
    }
  })

  // 给同类物品按出现顺序编号：板子-1、板子-2...
  const seq = new Map()
  const mapped = items.value.map((item) => {
    const idx = seq.set(item.itemId, (seq.get(item.itemId) || 0) + 1).get(item.itemId)
    const baseName = item.itemName || `物品-${item.itemId}`
    const z = item.posZ == null ? '-' : Number(item.posZ)
    return {
      ...item,
      id: item.id, // detail id
      itemId: item.itemId,
      name: `${baseName}-${idx}`,
      color: itemColorMap.get(item.itemId),
      posZ: z,
      supportRate: item.supportRate ?? 0
    }
  })

  // 如果选中的是"未装载"容器，显示未装载物品
  const selectedContainer = containers.value.find(c => c.id === selectedContainerId.value)
  if (selectedContainer && selectedContainer.isUnloaded) {
    const unloaded = mapped.filter(it => !it.loaded || it.containerInstanceId == null)
    return unloaded
  }

  // 否则只显示当前容器实例中的物品
  const inContainer = mapped.filter(it => it.containerInstanceId === selectedContainerId.value)
  return inContainer
})

const packingPlaybackList = computed(() => {
  const selectedContainer = containers.value.find(c => c.id === selectedContainerId.value)
  if (!selectedContainer || selectedContainer.isUnloaded || selectedContainer.isVirtual) return []
  const list = itemsInContainer.value.filter(
    (it) => it.loaded && it.posX != null && it.posY != null && it.posZ != null && it.posZ !== '-'
  )
  return sortPlaybackOrder(list)
})

const packingPlaybackTotal = computed(() => packingPlaybackList.value.length)
const packingPlaybackEligible = computed(() => packingPlaybackList.value.length > 0)

function playbackVisibleCountForStep(step) {
  const total = packingPlaybackTotal.value
  if (total <= 0) return 0
  if (!packingPlaybackReverse.value) return Math.min(step, total)
  return Math.max(0, total - step)
}

const playbackVisibleNow = computed(() => {
  if (packingPlaybackState.value === 'idle') return 0
  return playbackVisibleCountForStep(packingPlaybackStepIndex.value)
})
const playbackBarPercent = computed(() => {
  const t = packingPlaybackTotal.value
  if (!t) return 0
  return Math.min(100, (playbackVisibleNow.value / t) * 100)
})

const playbackBarLabelText = computed(() => {
  if (!packingPlaybackEligible.value || packingPlaybackTotal.value === 0) return '— / —'
  return `${playbackVisibleNow.value} / ${packingPlaybackTotal.value}`
})
const selectedItemInContainer = computed(() => itemsInContainer.value.find(item => item.id === selectedItemId.value) || null)

const sceneContextBannerText = computed(() => {
  if (executionState.value.running && executionState.value.currentContainerDims) {
    const d = executionState.value.currentContainerDims
    const n = executionState.value.currentContainerName || '—'
    return `装箱进行中 · ${n} · 长 ${d.lengthMm}mm × 宽 ${d.widthMm}mm × 高 ${d.heightMm}mm`
  }
  const sc = containers.value.find((c) => c.id === selectedContainerId.value)
  if (!sc) return '—'
  if (sc.isUnloaded || sc.isVirtual) {
    const list = itemsInContainer.value
    if (list.length === 1) {
      const it = list[0]
      return `${it.name} · 长 ${it.lengthMm ?? '—'}mm × 宽 ${it.widthMm ?? '—'}mm × 高 ${it.heightMm ?? '—'}mm`
    }
    if (list.length > 1) {
      return `未装载/预览 · 共 ${list.length} 件（可在列表或场景中选中单件查看尺寸与坐标）`
    }
    return '未装载 · 暂无物品'
  }
  const packed = itemsInContainer.value.filter(
    (it) => it.loaded && it.posX != null && it.posY != null && it.posZ != null
  )
  if (packed.length === 0) {
    return `${sc.name} · 长 ${sc.lengthMm ?? '—'}mm × 宽 ${sc.widthMm ?? '—'}mm × 高 ${sc.heightMm ?? '—'}mm（空箱）`
  }
  const sel = selectedItemInContainer.value
  if (sel) {
    const sr = formatSelectedSupportRate(sel.supportRate)
    return `${sel.name} · 长 ${sel.lengthMm ?? '—'}mm × 宽 ${sel.widthMm ?? '—'}mm × 高 ${sel.heightMm ?? '—'}mm · 坐标 X ${formatSelectedCoord(sel.posX)} Y ${formatSelectedCoord(sel.posY)} Z ${formatSelectedCoord(sel.posZ)} · 支撑率 ${sr}%`
  }
  return `${sc.name} · 长 ${sc.lengthMm ?? '—'}mm × 宽 ${sc.widthMm ?? '—'}mm × 高 ${sc.heightMm ?? '—'}mm · 填充率 ${sc.fillRate ?? 0}% · 平均支撑率 ${sc.avgSupportRate ?? 0}%`
})

function formatSelectedCoord(value) {
  if (value == null || value === '-') return '-'
  const n = Number(value)
  return Number.isFinite(n) ? n : value
}

function formatSelectedSupportRate(value) {
  if (value == null || value === '-') return '-'
  const n = Number(value)
  return Number.isFinite(n) ? n : value
}

function sortPlaybackOrder(list) {
  return [...list].sort((a, b) => {
    const az = Number(a.posZ) || 0
    const bz = Number(b.posZ) || 0
    if (az !== bz) return az - bz
    const ay = Number(a.posY) || 0
    const by = Number(b.posY) || 0
    if (ay !== by) return ay - by
    const ax = Number(a.posX) || 0
    const bx = Number(b.posX) || 0
    if (ax !== bx) return ax - bx
    return (a.id || 0) - (b.id || 0)
  })
}

function stopPackingPlaybackTimerOnly() {
  if (packingPlaybackTimer != null) {
    clearTimeout(packingPlaybackTimer)
    packingPlaybackTimer = null
  }
}

function stopPackingPlayback() {
  stopPackingPlaybackTimerOnly()
  packingPlaybackState.value = 'idle'
  packingPlaybackStepIndex.value = 0
}

function clearSelectedItem() {
  selectedItemId.value = null
  if (!scene) return
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.userData && child.userData.itemFullId !== undefined) {
      const originalColor = child.userData.originalColor
      if (originalColor) {
        child.material.color.copy(originalColor)
        child.material.emissive.copy(originalColor)
      }
    }
  })
  applyPerspectiveMaterials()
}

const ITEM_MESH_METALNESS = 0.1
const ITEM_MESH_ROUGHNESS = 0.6
const ITEM_MESH_EMISSIVE_INTENSITY = 0.2

function applyPerspectiveMaterials() {
  if (!scene) return
  const on = wireframeHighlightMode.value
  const sel = selectedItemId.value
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    if (!child.userData || child.userData.itemFullId === undefined) return
    const mat = child.material
    const id = child.userData.itemFullId
    // MeshStandardMaterial 在 opacity=0 时 emissive 仍会显色，透视时必须关自发光
    if (on && (sel == null || id !== sel)) {
      mat.transparent = true
      mat.opacity = 0
      mat.depthWrite = false
      mat.color.setHex(0x000000)
      mat.emissive.setHex(0x000000)
      mat.emissiveIntensity = 0
      mat.metalness = 0
      mat.roughness = 1
    } else {
      mat.transparent = false
      mat.opacity = 1
      mat.depthWrite = true
      mat.metalness = ITEM_MESH_METALNESS
      mat.roughness = ITEM_MESH_ROUGHNESS
      mat.emissiveIntensity = ITEM_MESH_EMISSIVE_INTENSITY
      if (sel != null && id === sel) {
        mat.color.setHex(0xffffff)
        mat.emissive.setHex(0xffffff)
      } else {
        const oc = child.userData.originalColor
        if (oc) {
          mat.color.copy(oc)
          mat.emissive.copy(oc)
        }
      }
    }
  })
}

function refreshScenePreserveView() {
  if (!scene || !camera || !renderer) return
  const camPos = camera.position.clone()
  const rx = scene.rotation.x
  const ry = scene.rotation.y
  const rz = scene.rotation.z
  clearSceneMeshesAndRedraw()
  camera.position.copy(camPos)
  scene.rotation.set(rx, ry, rz)
}

function toggleAxisRuler() {
  axisRulerVisible.value = !axisRulerVisible.value
  refreshScenePreserveView()
}

function redrawPlaybackFrame(visibleCount) {
  if (!scene) return
  clearSceneMeshesAndRedraw({ packedItemsLimit: visibleCount })
}

function schedulePackingPlaybackTick() {
  stopPackingPlaybackTimerOnly()
  packingPlaybackTimer = setTimeout(() => {
    packingPlaybackTimer = null
    if (packingPlaybackState.value !== 'playing') return
    const total = packingPlaybackTotal.value
    const next = packingPlaybackStepIndex.value + 1
    if (next > total) {
      packingPlaybackState.value = 'completed'
      packingPlaybackStepIndex.value = total
      clearSceneMeshesAndRedraw()
      return
    }
    packingPlaybackStepIndex.value = next
    redrawPlaybackFrame(playbackVisibleCountForStep(next))
    schedulePackingPlaybackTick()
  }, PLAYBACK_INTERVAL_MS)
}

function pausePackingPlayback() {
  if (packingPlaybackState.value !== 'playing') return
  stopPackingPlaybackTimerOnly()
  packingPlaybackState.value = 'paused'
}

function resumePackingPlayback() {
  if (packingPlaybackState.value !== 'paused') return
  packingPlaybackState.value = 'playing'
  schedulePackingPlaybackTick()
}

function replayPackingPlayback() {
  if (executionState.value.running) return
  if (packingPlaybackTotal.value === 0) return
  stopPackingPlaybackTimerOnly()
  packingPlaybackState.value = 'playing'
  packingPlaybackStepIndex.value = 0
  redrawPlaybackFrame(playbackVisibleCountForStep(0))
  schedulePackingPlaybackTick()
}

function sortIndicator(sortStateRef, key) {
  const s = sortStateRef.value
  if (!s || s.key !== key) return ''
  return s.dir === 'asc' ? '▲' : '▼'
}

function toggleSort(sortStateRef, key, type) {
  const s = sortStateRef.value
  if (s.key === key) {
    sortStateRef.value = { key, dir: s.dir === 'asc' ? 'desc' : 'asc', type }
  } else {
    sortStateRef.value = { key, dir: 'asc', type }
  }
}

function sortItems(key, type) {
  if (uiLocked.value) return
  toggleSort(itemsSort, key, type)
}

function sortContainers(key, type) {
  if (uiLocked.value) return
  toggleSort(containersSort, key, type)
}

function normalizeNumber(v) {
  if (v == null) return Number.NEGATIVE_INFINITY
  if (v === '-') return Number.NEGATIVE_INFINITY
  const n = Number(v)
  return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY
}

function normalizeString(v) {
  return (v == null ? '' : String(v)).toLowerCase()
}

function compare(a, b, type) {
  if (type === 'number') {
    const na = normalizeNumber(a)
    const nb = normalizeNumber(b)
    if (na === nb) return 0
    return na < nb ? -1 : 1
  }
  const sa = normalizeString(a)
  const sb = normalizeString(b)
  if (sa === sb) return 0
  return sa < sb ? -1 : 1
}

const sortedItemsInContainer = computed(() => {
  const list = itemsInContainer.value.slice()
  const s = itemsSort.value
  if (!s || !s.key) return list
  const dirMul = s.dir === 'asc' ? 1 : -1
  return list.sort((x, y) => dirMul * compare(x?.[s.key], y?.[s.key], s.type))
})

const sortedContainers = computed(() => {
  const raw = containers.value.slice()
  const unloadedIdx = raw.findIndex((c) => c.isUnloaded || c.id === -2)
  let unloadedRow = null
  let rest = raw
  if (unloadedIdx >= 0) {
    unloadedRow = raw[unloadedIdx]
    rest = raw.filter((_, i) => i !== unloadedIdx)
  }
  const s = containersSort.value
  let sortedRest = rest
  if (s && s.key) {
    const dirMul = s.dir === 'asc' ? 1 : -1
    sortedRest = rest.slice().sort((x, y) => dirMul * compare(x?.[s.key], y?.[s.key], s.type))
  }
  return unloadedRow ? [...sortedRest, unloadedRow] : sortedRest
})

onMounted(async () => {
  const planId = activePlanId.value
  if (planId) await loadPlanDetail(planId)
  initThreeJS()
  syncSceneFullscreenActive()
})

watch(
  () => activePlanId.value,
  async (id, prev) => {
    if (!id) return
    if (prev === undefined || id === prev) return
    stopPackingPlayback()
    await loadPlanDetail(id)
    refreshScene()
  }
)

onBeforeUnmount(() => {
  stopPackingPlayback()
  if (canvasResizeObserver) {
    canvasResizeObserver.disconnect()
    canvasResizeObserver = null
  }
  if (canvasResizeObsRaf != null) {
    cancelAnimationFrame(canvasResizeObsRaf)
    canvasResizeObsRaf = null
  }
})

let progressTimer = null

let scene, camera, renderer
let canvasResizeObserver = null
let canvasResizeObsRaf = null

const executionState = ref({
  running: false,
  phase: '',
  currentContainerInstanceId: null,
  currentContainerName: '',
  currentContainerDims: null, // { lengthMm,widthMm,heightMm }
  placed: [], // { id,itemId,x,y,z,lengthMm,widthMm,heightMm,color }
  placedCount: 0,
  temperature: null,
  outer: null,
  logs: []
})

const uiLocked = computed(
  () =>
    generatePlanLoading.value ||
    regenerateWithConstraintsLoading.value ||
    executionState.value.running
)

watch(
  () => uiLocked.value,
  (locked) => {
    if (props.embedded) emit('workspaceLock', locked)
  },
  { immediate: true }
)

function readCanvasContainerSize() {
  const el = document.getElementById('canvas-container')
  if (!el) return { width: 1, height: 1 }
  const r = el.getBoundingClientRect()
  return {
    width: Math.max(1, Math.floor(r.width)),
    height: Math.max(1, Math.floor(r.height))
  }
}

const ORTHO_FRUSTUM_SIZE = 4.5

function createCameraForProjection(width, height) {
  const aspect = width / Math.max(1, height)
  if (projectionMode.value === 'perspective') {
    return new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  }
  const h = ORTHO_FRUSTUM_SIZE
  const w = h * aspect
  return new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000)
}

function updateCameraProjectionShape(width, height) {
  if (!camera) return
  const aspect = width / Math.max(1, height)
  if (camera.isPerspectiveCamera) {
    camera.aspect = aspect
  } else if (camera.isOrthographicCamera) {
    const h = ORTHO_FRUSTUM_SIZE
    const w = h * aspect
    camera.left = -w / 2
    camera.right = w / 2
    camera.top = h / 2
    camera.bottom = -h / 2
  }
  camera.updateProjectionMatrix()
}

function setProjectionMode(mode) {
  if (projectionMode.value === mode) return
  projectionMode.value = mode
  if (!renderer) return
  const oldPos = camera ? camera.position.clone() : new THREE.Vector3(0, 0, 8)
  const { width, height } = readCanvasContainerSize()
  camera = createCameraForProjection(width, height)
  camera.position.copy(oldPos)
  if (camera.isOrthographicCamera) {
    camera.zoom = 1
  }
  updateCameraProjectionShape(width, height)
}

function initThreeJS() {
  const container = document.getElementById('canvas-container')
  if (!container) return

  const { width: cw, height: ch } = readCanvasContainerSize()

  // 场景设置
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // 相机设置（默认透视投影，与「观察模式」一致）
  camera = createCameraForProjection(cw, ch)
  camera.position.set(0, 0, 8)
  updateCameraProjectionShape(cw, ch)

  // 渲染器设置（updateStyle: false，由 CSS 控制 canvas 铺满容器，避免退出全屏后残留超大 px 宽度撑破 flex）
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(cw, ch, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild(renderer.domElement)

  if (canvasResizeObserver) {
    canvasResizeObserver.disconnect()
    canvasResizeObserver = null
  }
  canvasResizeObserver = new ResizeObserver(() => {
    if (canvasResizeObsRaf != null) return
    canvasResizeObsRaf = requestAnimationFrame(() => {
      canvasResizeObsRaf = null
      onWindowResize()
    })
  })
  canvasResizeObserver.observe(container)

  // 灯光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  // 绘制演示容器框
  drawDemoContainer()

  // 鼠标控制
  setupMouseControls()

  // 窗口大小调整
  window.addEventListener('resize', onWindowResize)

  const onFullscreenChange = () => {
    syncSceneFullscreenActive()
    requestAnimationFrame(() => {
      onWindowResize()
      requestAnimationFrame(() => onWindowResize())
    })
    setTimeout(() => onWindowResize(), 80)
    setTimeout(() => onWindowResize(), 240)
    setTimeout(() => onWindowResize(), 500)
  }
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)

  // 动画循环
  animate()
}

function addEdges(mesh, geometry) {
  // 为物品添加黑色边框线
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
    color: 0x000000, 
    linewidth: 4,
    fog: false
  }))
  mesh.add(line)
}

function drawDemoContainer(options = {}) {
  // 非播放态的首次渲染：物品数量多时一次性绘制会明显卡顿
  // 播放态会显式传 packedItemsLimit（从 0 逐步增长），因此这里只给“默认值”
  const packedItemsLimit = (typeof options.packedItemsLimit === 'number') ? options.packedItemsLimit : 250
  // 生成过程中：固定展示“当前正在装载的容器”与实时放置状态
  if (executionState.value.running && executionState.value.currentContainerDims) {
    const dims = executionState.value.currentContainerDims
    drawRealContainer({
      lengthMm: dims.lengthMm,
      widthMm: dims.widthMm,
      heightMm: dims.heightMm
    })
    drawExecutionPlacements()
    applyPerspectiveMaterials()
    return
  }

  const selectedContainer = containers.value.find(c => c.id === selectedContainerId.value)
  if (!selectedContainer) {
    applyPerspectiveMaterials()
    return
  }

  // 如果是"未装载"容器，横向排列物品
  if (selectedContainer.isUnloaded) {
    drawUnloadedItems(packedItemsLimit)
  }
  // 如果是虚拟容器，直接堆放物品
  else if (selectedContainer.isVirtual) {
    drawVirtualContainerItems(packedItemsLimit)
  }
  // 如果是真实容器，绘制容器框
  else {
    drawRealContainer(selectedContainer)
    drawPackedItemsInRealContainer(selectedContainer, packedItemsLimit)
  }
  applyPerspectiveMaterials()
}

function drawExecutionPlacements() {
  const dims = executionState.value.currentContainerDims
  if (!dims) return

  // 容器尺寸（mm -> cm）
  const Lcm = (dims.lengthMm || 400) / 100
  const Wcm = (dims.widthMm || 200) / 100
  const Hcm = (dims.heightMm || 300) / 100

  // 与 drawRealContainer 保持一致的缩放
  const viewportWidth = 6
  const viewportHeight = 4
  const padding = 0.5
  let scale = 1
  if (Lcm > 0 && Hcm > 0) {
    scale = Math.min((viewportWidth - padding) / Lcm, (viewportHeight - padding) / Hcm)
  }

  const L = Lcm * scale
  const W = Wcm * scale
  const H = Hcm * scale

  executionState.value.placed.forEach((it) => {
    const l = ((Number(it.lengthMm) || 0) / 100) * scale
    const w = ((Number(it.widthMm) || 0) / 100) * scale
    const h = ((Number(it.heightMm) || 0) / 100) * scale
    if (!l || !w || !h) return

    const xMm = Number(it.x) || 0
    const yMm = Number(it.y) || 0
    const zMm = Number(it.z) || 0

    const x = (xMm / 100) * scale
    const z = (yMm / 100) * scale
    const y = (zMm / 100) * scale

    const geom = new THREE.BoxGeometry(l, h, w)
    const colorValue = typeof it.color === 'string' ? it.color : '#000000'
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorValue),
      emissive: new THREE.Color(colorValue),
      emissiveIntensity: 0.2,
      metalness: 0.1,
      roughness: 0.6
    })
    const mesh = new THREE.Mesh(geom, mat)
    addEdges(mesh, geom)
    if (it.id != null) mesh.userData.itemFullId = it.id
    mesh.userData.originalColor = new THREE.Color(colorValue)

    // 坐标：以容器中心为原点，将 (0,0,0) 对齐到容器左下前角
    mesh.position.x = -L / 2 + x + l / 2
    mesh.position.z = -W / 2 + z + w / 2
    mesh.position.y = -H / 2 + y + h / 2

    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
  })
}

function drawRealContainer(container) {
  // 使用容器的实际尺寸（单位：mm，转换为 cm 显示）
  let containerWidth = (container.lengthMm || 400) / 100
  let containerHeight = (container.heightMm || 300) / 100
  let containerDepth = (container.widthMm || 200) / 100

  // 计算缩放因子，确保容器不会超出视图
  const viewportWidth = 6
  const viewportHeight = 4
  const padding = 0.5

  let scale = 1
  if (containerWidth > 0 && containerHeight > 0) {
    scale = Math.min(
      (viewportWidth - padding) / containerWidth,
      (viewportHeight - padding) / containerHeight
    )
  }

  // 应用缩放
  containerWidth *= scale
  containerHeight *= scale
  containerDepth *= scale

  // 容器的顶点
  const vertices = new Float32Array([
    // 前面
    -containerWidth / 2, -containerHeight / 2, containerDepth / 2,
    containerWidth / 2, -containerHeight / 2, containerDepth / 2,
    containerWidth / 2, containerHeight / 2, containerDepth / 2,
    -containerWidth / 2, containerHeight / 2, containerDepth / 2,
    // 后面
    -containerWidth / 2, -containerHeight / 2, -containerDepth / 2,
    containerWidth / 2, -containerHeight / 2, -containerDepth / 2,
    containerWidth / 2, containerHeight / 2, -containerDepth / 2,
    -containerWidth / 2, containerHeight / 2, -containerDepth / 2,
  ])

  // 容器的边
  const indices = new Uint16Array([
    // 前面
    0, 1, 1, 2, 2, 3, 3, 0,
    // 后面
    4, 5, 5, 6, 6, 7, 7, 4,
    // 连接前后
    0, 4, 1, 5, 2, 6, 3, 7,
  ])

  const rw0 = renderer ? Math.max(1, renderer.domElement.clientWidth) : 800
  const rh0 = renderer ? Math.max(1, renderer.domElement.clientHeight) : 600
  const wireframe = createFatBoxWireframeMesh(
    vertices,
    indices,
    0x000000,
    4.5,
    new THREE.Vector2(rw0, rh0)
  )
  scene.add(wireframe)

  // 添加半透明的容器面
  const boxGeometry = new THREE.BoxGeometry(containerWidth, containerHeight, containerDepth)
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.1,
    wireframe: false,
  })
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
  boxMesh.castShadow = true
  boxMesh.receiveShadow = true
  scene.add(boxMesh)

  // 添加底面
  const floorGeometry = new THREE.PlaneGeometry(containerWidth, containerDepth)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -containerHeight / 2
  floor.receiveShadow = true
  scene.add(floor)

  if (axisRulerVisible.value && renderer) {
    const rw = Math.max(1, renderer.domElement.clientWidth)
    const rh = Math.max(1, renderer.domElement.clientHeight)
    const lengthMmVal = Number(container.lengthMm) || 400
    const widthMmVal = Number(container.widthMm) || 200
    const heightMmVal = Number(container.heightMm) || 300
    const ruler = createContainerAxisRulerGroup({
      origin: new THREE.Vector3(-containerWidth / 2, -containerHeight / 2, -containerDepth / 2),
      lengthWorld: containerWidth,
      widthWorld: containerDepth,
      heightWorld: containerHeight,
      lengthMm: lengthMmVal,
      widthMm: widthMmVal,
      heightMm: heightMmVal,
      labelScale: Math.max(containerWidth, containerHeight, containerDepth) * 0.056,
      resolution: new THREE.Vector2(rw, rh),
      gap: 0
    })
    scene.add(ruler)
  }
}

function drawPackedItemsInRealContainer(container, maxItems) {
  let list = itemsInContainer.value.filter(it => it.loaded && it.posX != null && it.posY != null && it.posZ != null)
  if (typeof maxItems === 'number' && maxItems >= 0) {
    list = sortPlaybackOrder(list).slice(0, maxItems)
  }
  if (!list.length) return

  // 容器尺寸（mm -> cm）
  const Lcm = (container.lengthMm || 400) / 100
  const Wcm = (container.widthMm || 200) / 100
  const Hcm = (container.heightMm || 300) / 100

  // 与 drawRealContainer 保持一致的缩放
  const viewportWidth = 6
  const viewportHeight = 4
  const padding = 0.5
  let scale = 1
  if (Lcm > 0 && Hcm > 0) {
    scale = Math.min((viewportWidth - padding) / Lcm, (viewportHeight - padding) / Hcm)
  }

  const L = Lcm * scale
  const W = Wcm * scale
  const H = Hcm * scale

  list.forEach((it) => {
    const swap = it.swapLengthWidth === 1
    const lMm = swap ? it.widthMm : it.lengthMm
    const wMm = swap ? it.lengthMm : it.widthMm
    const hMm = it.heightMm
    if (!lMm || !wMm || !hMm) return

    const l = (lMm / 100) * scale
    const w = (wMm / 100) * scale
    const h = (hMm / 100) * scale

    const xMm = Number(it.posX)
    const yMm = Number(it.posY)
    const zMm = Number(it.posZ)

    const x = (xMm / 100) * scale
    const z = (yMm / 100) * scale
    const y = (zMm / 100) * scale

    const geom = new THREE.BoxGeometry(l, h, w)
    const colorValue = typeof it.color === 'string' ? it.color : '#000000'
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorValue),
      emissive: new THREE.Color(colorValue),
      emissiveIntensity: 0.2,
      metalness: 0.1,
      roughness: 0.6
    })
    const mesh = new THREE.Mesh(geom, mat)
    mesh.userData.itemFullId = it.id
    mesh.userData.originalColor = new THREE.Color(colorValue)
    addEdges(mesh, geom)

    // 坐标：以容器中心为原点，将 (0,0,0) 对齐到容器左下前角
    mesh.position.x = -L / 2 + x + l / 2
    mesh.position.z = -W / 2 + z + w / 2
    mesh.position.y = -H / 2 + y + h / 2

    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
  })
}

function drawVirtualContainerItems(maxItems) {
  // 虚拟容器：直接堆放物品，删除间隔

  const list = (typeof maxItems === 'number' && maxItems >= 0)
    ? itemsInContainer.value.slice(0, maxItems)
    : itemsInContainer.value

  // 计算总体尺寸
  let totalWidth = 0
  let totalHeight = 0
  let totalDepth = 0

  list.forEach((item, index) => {
    totalWidth = Math.max(totalWidth, (item.lengthMm / 100) * ((index % 3) + 1))
    totalHeight += item.heightMm / 100
    totalDepth = Math.max(totalDepth, (item.widthMm / 100) * (Math.floor(index / 3) + 1))
  })

  // 计算缩放因子
  const viewportWidth = 6
  const viewportHeight = 4
  const padding = 0.5

  let scale = 1
  if (totalWidth > 0 && totalHeight > 0) {
    scale = Math.min(
      (viewportWidth - padding) / totalWidth,
      (viewportHeight - padding) / totalHeight
    )
  }

  let yOffset = 0

  list.forEach((item, index) => {
    const itemGeometry = new THREE.BoxGeometry(
      (item.lengthMm / 100) * scale,
      (item.heightMm / 100) * scale,
      (item.widthMm / 100) * scale
    )

    // 将十六进制颜色转换为 Three.js 颜色
    const colorValue = typeof item.color === 'string' ? item.color : '#000000'
    const itemMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorValue),
      emissive: new THREE.Color(colorValue),
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.4
    })

    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial)

    // 保存物品信息到 userData，用于后续选中效果
    itemMesh.userData.itemFullId = item.id
    itemMesh.userData.originalColor = new THREE.Color(colorValue)

    // 添加黑色边框
    addEdges(itemMesh, itemGeometry)

    // 堆放方式：按 Y 轴叠放，3 列排列
    itemMesh.position.y = yOffset + ((item.heightMm / 100) * scale) / 2
    itemMesh.position.x = (index % 3 - 1) * ((item.lengthMm / 100) * scale)
    itemMesh.position.z = Math.floor(index / 3) * ((item.widthMm / 100) * scale)

    itemMesh.castShadow = true
    itemMesh.receiveShadow = true
    scene.add(itemMesh)

    // 更新 Y 偏移（紧贴着摆放，无间隔）
    yOffset += (item.heightMm / 100) * scale
  })

  // 添加地面
  const floorGeometry = new THREE.PlaneGeometry(10, 10)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.5
  floor.receiveShadow = true
  scene.add(floor)
}

function drawUnloadedItems(maxItems) {
  // "未装载"容器：相同类型的物品堆叠，按底面积大小从中间向两边排列

  // 按物品类型分组
  const groupedItems = new Map()
  const list = (typeof maxItems === 'number' && maxItems >= 0)
    ? itemsInContainer.value.slice(0, maxItems)
    : itemsInContainer.value

  list.forEach((item) => {
    if (!groupedItems.has(item.itemId)) {
      groupedItems.set(item.itemId, [])
    }
    groupedItems.get(item.itemId).push(item)
  })

  const groups = Array.from(groupedItems.entries())

  // 计算每组的底面积（使用第一个物品的底面积）
  const groupAreas = groups.map(([_, itemGroup]) => {
    const item = itemGroup[0]
    return (item.lengthMm / 100) * (item.widthMm / 100)
  })

  // 创建索引数组并按底面积排序（从大到小）
  const sortedIndices = Array.from({ length: groups.length }, (_, i) => i)
    .sort((a, b) => groupAreas[b] - groupAreas[a])

  // 计算每组的宽度
  const groupWidths = groups.map(([_, itemGroup]) => itemGroup[0].lengthMm / 100)

  // 计算总体尺寸
  let totalWidth = 0
  let maxHeight = 0

  groups.forEach((group, groupIndex) => {
    totalWidth += groupWidths[groupIndex]

    let groupHeight = 0
    group[1].forEach((item) => {
      groupHeight += item.heightMm / 100
    })
    maxHeight = Math.max(maxHeight, groupHeight)
  })

  // 计算缩放因子
  const viewportWidth = 6
  const viewportHeight = 4
  const padding = 0.5

  let scale = 1
  if (totalWidth > 0) {
    scale = Math.min(
      (viewportWidth - padding) / totalWidth,
      (viewportHeight - padding) / maxHeight
    )
  }

  // 从中间向两侧排列，计算每组的 X 位置
  const positions = new Array(groups.length)
  let rightX = 0
  let leftX = 0

  for (let i = 0; i < sortedIndices.length; i++) {
    const originalIndex = sortedIndices[i]

    if (i % 2 === 0) {
      // 右侧
      positions[originalIndex] = rightX
      rightX += groupWidths[originalIndex] * scale
    } else {
      // 左侧
      leftX -= groupWidths[originalIndex] * scale
      positions[originalIndex] = leftX
    }
  }

  // 绘制物品
  groups.forEach(([itemId, itemGroup], groupIndex) => {
    let yOffset = 0
    const xPos = positions[groupIndex]

    itemGroup.forEach((item) => {
      const itemGeometry = new THREE.BoxGeometry(
        (item.lengthMm / 100) * scale,
        (item.heightMm / 100) * scale,
        (item.widthMm / 100) * scale
      )

      // 将十六进制颜色转换为 Three.js 颜色
      const colorValue = typeof item.color === 'string' ? item.color : '#000000'
      const itemMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorValue),
        emissive: new THREE.Color(colorValue),
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.4
      })

      const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial)

      // 保存物品信息到 userData，用于后续选中效果
      itemMesh.userData.itemFullId = item.id
      itemMesh.userData.originalColor = new THREE.Color(colorValue)

      // 添加黑色边框
      addEdges(itemMesh, itemGeometry)

      // 从中心向两侧排列，紧贴着摆放
      itemMesh.position.x = xPos + ((item.lengthMm / 100) * scale) / 2
      itemMesh.position.y = yOffset + ((item.heightMm / 100) * scale) / 2
      itemMesh.position.z = 0

      itemMesh.castShadow = true
      itemMesh.receiveShadow = true
      scene.add(itemMesh)

      // 更新 Y 偏移（紧贴着摆放，无间隔）
      yOffset += (item.heightMm / 100) * scale
    })
  })

  // 添加地面
  const floorGeometry = new THREE.PlaneGeometry(20, 10)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.5
  floor.receiveShadow = true
  scene.add(floor)
}

function setupMouseControls() {
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // 鼠标控制
  renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // 只响应左键
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }
  })

  renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging && e.buttons === 1) { // 左键拖动：旋转
      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      scene.rotation.y += deltaX * 0.01
      scene.rotation.x += deltaY * 0.01

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }
  })

  renderer.domElement.addEventListener('mouseup', (e) => {
    // 只在没有拖动时才检测点击
    const deltaX = Math.abs(e.clientX - previousMousePosition.x)
    const deltaY = Math.abs(e.clientY - previousMousePosition.y)

    isDragging = false

    // 如果移动距离太大，说明是拖动而不是点击
    if (deltaX > 5 || deltaY > 5) {
      return
    }

    // 检测点击的物品
    if (e.button === 0) {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // 获取所有 Mesh 对象（只获取物品，不获取地面）
      const meshes = []
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && 
            child.userData && 
            child.userData.itemFullId !== undefined &&
            child.geometry instanceof THREE.BoxGeometry) {
          meshes.push(child)
        }
      })

      const intersects = raycaster.intersectObjects(meshes, false)

      if (intersects.length > 0) {
        // 遍历交集，找到第一个有 itemFullId 的物品
        let selectedMesh = null
        for (let i = 0; i < intersects.length; i++) {
          const obj = intersects[i].object
          if (obj.userData && obj.userData.itemFullId !== undefined) {
            selectedMesh = obj
            break
          }
        }

        if (selectedMesh) {
          const itemFullId = selectedMesh.userData.itemFullId

          // 在物品列表中找到对应的物品并选中
          const selectedItem = itemsInContainer.value.find(item => item.id === itemFullId)

          if (selectedItem) {
            selectItem(selectedItem)
          }
        } else {
          clearSelectedItem()
        }
      }
    }
  })

  renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false
  })

  // 滚轮缩放
  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault()
    const zoomSpeed = 0.3
    if (camera.isOrthographicCamera) {
      const factor = e.deltaY > 0 ? 0.92 : 1.08
      camera.zoom = Math.max(0.25, Math.min(6, camera.zoom * factor))
      camera.updateProjectionMatrix()
      return
    }
    if (e.deltaY > 0) {
      camera.position.z += zoomSpeed
    } else {
      camera.position.z -= zoomSpeed
    }
    camera.position.z = Math.max(2, Math.min(20, camera.position.z))
  })

  // 双击空白：仅在回放模式下暂停/继续（不再双击全屏）
  renderer.domElement.addEventListener('dblclick', (e) => {
    e.preventDefault()
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(scene.children, true)
    const hitItem = hits.some(
      (h) => h.object.userData && h.object.userData.itemFullId !== undefined
    )
    if (hitItem) return
    if (packingPlaybackState.value === 'playing') {
      pausePackingPlayback()
      return
    }
    if (packingPlaybackState.value === 'paused') {
      resumePackingPlayback()
    }
  })

  // 键盘方向键控制平移
  window.addEventListener('keydown', (e) => {
    const moveSpeed = 0.2

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault()
        camera.position.y += moveSpeed
        break
      case 'ArrowDown':
        e.preventDefault()
        camera.position.y -= moveSpeed
        break
      case 'ArrowLeft':
        e.preventDefault()
        camera.position.x -= moveSpeed
        break
      case 'ArrowRight':
        e.preventDefault()
        camera.position.x += moveSpeed
        break
    }
  })
}

function onWindowResize() {
  const container = document.getElementById('canvas-container')
  if (!container || !renderer || !camera) return

  const { width, height } = readCanvasContainerSize()

  updateCameraProjectionShape(width, height)
  renderer.setSize(width, height, false)
  if (scene) {
    scene.traverse((obj) => {
      if (obj.material && obj.material.resolution) {
        obj.material.resolution.set(width, height)
      }
    })
  }
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

async function loadPlanDetail(planId) {
  if (planId == null || planId === '') return
  try {
    // 方案详情加载：并行请求减少等待时间
    const [planRes, containersRes, itemsRes, reqRes] = await Promise.all([
      axios.get(`${API_BASE}/api/plans/${planId}`),
      axios.get(`${API_BASE}/api/plans/${planId}/containers`),
      axios.get(`${API_BASE}/api/plans/${planId}/items`),
      axios.get(`${API_BASE}/api/plans/${planId}/requirements`)
    ])

    plan.value = planRes.data || {}

    // 加载容器列表
    const realContainers = (containersRes.data || []).map(c => ({
      id: c.id,
      containerId: c.containerId,
      name: c.name || c.containerName || '容器',
      containerName: c.containerName || '容器',
      filled: c.filled || 0,
      filledItemQty: c.filledItemQty || 0,
      fillRate: c.fillRate || 0,
      avgSupportRate: c.avgSupportRate || 0,
      lengthMm: c.lengthMm,
      widthMm: c.widthMm,
      heightMm: c.heightMm
    }))

    containers.value = realContainers

    // 加载物品列表
    if (itemsRes.data) {
      items.value = itemsRes.data.map((row) => ({
        id: row.id,
        itemId: row.itemId,
        itemName: row.itemName,
        loaded: row.loaded === 1,
        containerInstanceId: row.containerInstanceId ?? null,
        containerName: row.containerName || '未分配',
        layerIndex: row.layerIndex ?? null,
        posX: row.posX ?? null,
        posY: row.posY ?? null,
        posZ: row.posZ ?? null,
        swapLengthWidth: row.swapLengthWidth ?? 0,
        supportRate: row.supportRate ?? 0,
        lengthMm: row.lengthMm,
        widthMm: row.widthMm,
        heightMm: row.heightMm
      }))
    }

    // 仍有未装入容器的物品时，在列表末尾追加虚拟行「未装载」（仅展示用；装箱完成后表示尚未装入的物品）
    const hasUnloadedItems = items.value.some(
      (it) => !it.loaded || it.containerInstanceId == null
    )
    if (hasUnloadedItems) {
      containers.value = [
        ...containers.value,
        {
          id: -2,
          name: '未装载',
          containerName: '未装载',
          filled: 0,
          filledItemQty: 0,
          fillRate: 0,
          avgSupportRate: 0,
          isUnloaded: true
        }
      ]
    }

    // 默认选中第一个容器（「未装载」仅在末尾出现，此处为首个真实容器）
    if (containers.value.length > 0) {
      selectedContainerId.value = containers.value[0].id
    }

    requirements.value = Array.isArray(reqRes.data) ? reqRes.data : []
  } catch (error) {
    console.error('加载方案详情失败：', error)
    ui.showAlert('加载方案详情失败：' + apiErrorMessage(error))
  }
}

function clearSceneMeshesAndRedraw(drawDemoOptions = {}) {
  if (!scene) return
  const axisRoots = []
  scene.traverse((child) => {
    if (child.userData && child.userData.isAxisRulerRoot) axisRoots.push(child)
  })
  axisRoots.forEach((g) => {
    scene.remove(g)
    disposeAxisRulerGroup(g)
  })

  const objectsToRemove = []
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
      if (child !== scene) objectsToRemove.push(child)
    }
  })
  objectsToRemove.forEach(obj => {
    scene.remove(obj)
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
      else obj.material.dispose()
    }
  })
  drawDemoContainer(drawDemoOptions)
  if (selectedItemId.value) {
    const selectedItem = itemsInContainer.value.find(item => item.id === selectedItemId.value)
    if (selectedItem) selectItem(selectedItem)
    else applyPerspectiveMaterials()
  } else {
    applyPerspectiveMaterials()
  }
}

function refreshScene() {
  stopPackingPlayback()
  if (!scene) return
  clearSceneMeshesAndRedraw()
}

function selectContainer(containerId) {
  stopPackingPlayback()
  clearSelectedItem()
  selectedContainerId.value = containerId
  if (scene) {
    clearSceneMeshesAndRedraw()
  }
}

function selectItem(item) {
  if (!item) {
    clearSelectedItem()
    return
  }
  if (selectedItemId.value === item.id) {
    clearSelectedItem()
    return
  }
  selectedItemId.value = item.id

  // 更新场景中物品的颜色
  if (scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData && child.userData.itemFullId !== undefined) {
        // 如果是选中的物品，变成白色
        if (child.userData.itemFullId === item.id) {
          child.material.color.setHex(0xffffff)
          child.material.emissive.setHex(0xffffff)
        } else {
          // 其他物品恢复原色
          const originalColor = child.userData.originalColor
          if (originalColor) {
            child.material.color.copy(originalColor)
            child.material.emissive.copy(originalColor)
          }
        }
      }
    })
    applyPerspectiveMaterials()
  }
}

async function addRequirement() {
  if (uiLocked.value) return
  const text = newRequirement.value.trim()
  if (!text) return
  try {
    const planId = activePlanId.value
    await axios.post(`${API_BASE}/api/plans/${planId}/requirements`, { content: text })
    newRequirement.value = ''
    await loadPlanDetail(planId)
  } catch (error) {
    console.error('添加需求失败', error)
    ui.showAlert('添加需求失败：' + apiErrorMessage(error))
  }
}

async function deleteRequirement(req) {
  if (uiLocked.value) return
  if (!req?.id) return
  if (!(await ui.showConfirm('确定删除该需求？'))) return
  try {
    const planId = activePlanId.value
    await axios.delete(`${API_BASE}/api/plans/${planId}/requirements/${req.id}`)
    requirements.value = requirements.value.filter((r) => r.id !== req.id)
    await loadPlanDetail(planId)
  } catch (error) {
    console.error('删除需求失败', error)
    ui.showAlert('删除需求失败：' + apiErrorMessage(error))
  }
}

function closeLlmModal() {
  llmModalVisible.value = false
  llmError.value = ''
}

/**
 * @param {number|null} focusRequirementId 传入则只分析该条；null 表示分析本方案全部需求
 */
async function runLlmOptimize(focusRequirementId) {
  if (uiLocked.value) return
  const planId = activePlanId.value
  llmLoading.value = true
  llmError.value = ''
  llmResult.value = {
    requirementUnderstanding: '',
    currentPackingAssessment: '',
    modifiedPlanSummary: '',
    recommendedAlgorithm: '',
    constraintNotes: [],
    planEditHints: [],
    needRegeneratePacking: false,
    packingConstraintsForRegeneration: {},
    parseWarning: '',
    rawAssistantText: ''
  }
  llmModalVisible.value = true
  try {
    const body = focusRequirementId != null ? { focusRequirementId } : {}
    const res = await axios.post(`${API_BASE}/api/plans/${planId}/llm/optimize-requirements`, body)
    const data = res.data || {}
    if (!data.success) {
      llmError.value = data.message || 'LLM 调用失败'
      return
    }
    llmResult.value = {
      requirementUnderstanding: data.requirementUnderstanding || '',
      currentPackingAssessment: data.currentPackingAssessment || '',
      modifiedPlanSummary: data.modifiedPlanSummary || '',
      recommendedAlgorithm: data.recommendedAlgorithm || '',
      constraintNotes: Array.isArray(data.constraintNotes) ? data.constraintNotes : [],
      planEditHints: Array.isArray(data.planEditHints) ? data.planEditHints : [],
      needRegeneratePacking: !!data.needRegeneratePacking,
      packingConstraintsForRegeneration:
        data.packingConstraintsForRegeneration && typeof data.packingConstraintsForRegeneration === 'object'
          ? data.packingConstraintsForRegeneration
          : {},
      parseWarning: data.parseWarning || '',
      rawAssistantText: data.rawAssistantText || ''
    }
    await loadPlanDetail(planId)
  } catch (error) {
    console.error('LLM 优化失败', error)
    llmError.value =
      error.response?.data?.message || error.message || '网络或服务器错误'
  } finally {
    llmLoading.value = false
  }
}

function defaultAlgorithmPromptValue() {
  const r = (llmResult.value.recommendedAlgorithm || '').toLowerCase()
  if (r.includes('fill')) return '2'
  if (r.includes('regular')) return '1'
  return '1'
}

/**
 * 使用 LLM 返回的 packingConstraintsForRegeneration 调用后端重新装箱。
 */
function openRegenerateWithConstraintsDialog() {
  if (uiLocked.value || regenerateWithConstraintsLoading.value) return
  regenerateDialogVisible.value = true
}

function closeRegenerateDialog() {
  if (regenerateWithConstraintsLoading.value) return
  regenerateDialogVisible.value = false
}

async function regeneratePackingWithLlmConstraints() {
  const pc = llmResult.value.packingConstraintsForRegeneration
  if (!pc || typeof pc !== 'object') {
    ui.showAlert('当前没有可下发的装箱约束对象，请先运行「LLM 优化」并确保模型返回 packingConstraintsForRegeneration。')
    return
  }
  try {
    const planId = activePlanId.value
    // 点击“开始生成”后立即关闭弹窗，避免用户误点其它操作
    regenerateDialogVisible.value = false
    progress.value = 0
    regenerateWithConstraintsLoading.value = true
    await runGenerateStream(planId, 'auto', { packingConstraintsForRegeneration: pc })
    await loadPlanDetail(planId)
    progress.value = 100
  } catch (error) {
    console.error('按约束重新生成失败:', error)
    ui.showAlert('按约束重新生成失败: ' + apiErrorMessage(error))
    progress.value = 0
  } finally {
    regenerateWithConstraintsLoading.value = false
  }
}

function openGenerateDialog() {
  if (uiLocked.value) return
  generateDialogVisible.value = true
}

function closeGenerateDialog() {
  if (generatePlanLoading.value) return
  generateDialogVisible.value = false
}

async function confirmGeneratePlan() {
  const planId = activePlanId.value
  generateDialogVisible.value = false
  generatePlanLoading.value = true
  progress.value = 0

  try {
    await runGenerateStream(planId, 'auto', {})
    await loadPlanDetail(planId)
    progress.value = 100
  } catch (error) {
    console.error('生成方案失败:', error)
    ui.showAlert('生成方案失败: ' + apiErrorMessage(error))
    progress.value = 0
  } finally {
    generatePlanLoading.value = false
  }
}

const IMPORTED_ITEM_PREFIX = '__IMPORTED_ITEM__'
const IMPORTED_CONTAINER_PREFIX = '__IMPORTED_CONTAINER__'

function stripImportedItemPrefix(name) {
  if (name == null || typeof name !== 'string') return name || ''
  return name.startsWith(IMPORTED_ITEM_PREFIX) ? name.slice(IMPORTED_ITEM_PREFIX.length) : name
}

function stripImportedContainerPrefix(name) {
  if (name == null || typeof name !== 'string') return name || ''
  return name.startsWith(IMPORTED_CONTAINER_PREFIX)
    ? name.slice(IMPORTED_CONTAINER_PREFIX.length)
    : name
}

function pushExecLog(line) {
  const logs = executionState.value.logs
  logs.unshift(line)
}

function resetExecutionState() {
  executionState.value.running = true
  executionState.value.phase = '准备数据'
  executionState.value.currentContainerInstanceId = null
  executionState.value.currentContainerName = ''
  executionState.value.currentContainerDims = null
  executionState.value.placed = []
  executionState.value.placedCount = 0
  executionState.value.outer = null
  executionState.value.temperature = null
  executionState.value.logs = []
}

async function runGenerateStream(planId, algorithm, body) {
  stopPackingPlayback()
  // 生成过程中固定在“执行过程”界面
  currentTab.value = 'execution'
  resetExecutionState()
  refreshScene()

  const url = `${API_BASE}/api/plans/${planId}/generate-packing-v3-stream?algorithm=${encodeURIComponent(algorithm)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  })
  if (!res.ok || !res.body) {
    throw new Error(`流式生成失败：HTTP ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  const containerNameMap = new Map()
  containers.value.forEach((c) => {
    if (c?.id == null) return
    const id = c.id
    containerNameMap.set(id, c.name)
    containerNameMap.set(Number(id), c.name)
  })

  function phaseNameToCn(name) {
    switch (name) {
      case 'prepare':
        return '准备数据'
      case 'packing_start':
        return '开始装箱'
      case 'sequential_annealing':
        return '序贯编码退火'
      case 'assembly_replay':
        return '装配回放'
      case 'simulated_annealing':
        return '模拟退火搜索'
      case 'construct_final':
        return '构造最终方案'
      case 'fill_priority_search':
        return '填充率优先 · 多方案择优'
      case 'fill_priority_replay':
        return '填充率优先 · 装配回放'
      case 'error':
        return '发生错误'
      case 'done':
        return '完成'
      default:
        return name || '-'
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const parts = buffer.split('\n\n')
    buffer = parts.pop() || ''

    for (const part of parts) {
      const lines = part.split('\n').map(s => s.trim()).filter(Boolean)
      const dataLine = lines.find(l => l.startsWith('data:'))
      if (!dataLine) continue
      const jsonStr = dataLine.replace(/^data:\s*/, '')
      let ev = null
      try { ev = JSON.parse(jsonStr) } catch { continue }

      if (ev.type === 'temperature') {
        if (ev.value != null) executionState.value.temperature = Number(ev.value)
      } else if (ev.type === 'phase') {
        const phaseCn = phaseNameToCn(ev.name)
        executionState.value.phase = phaseCn
        if (ev.outer != null) executionState.value.outer = Number(ev.outer)
        if (ev.temperature != null) executionState.value.temperature = Number(ev.temperature)
        // 阶段日志去重：同阶段仅保留一行，更新时覆盖
        const logs = executionState.value.logs
        const phasePrefix = '阶段：'
        const phaseLine = `${phasePrefix}${phaseCn}${ev.outer != null ? `（迭代 ${ev.outer}）` : ''}`
        const idx = logs.findIndex(l => typeof l === 'string' && l.startsWith(phasePrefix))
        if (idx >= 0) {
          logs[idx] = phaseLine
        } else {
          pushExecLog(phaseLine)
        }
      } else if (ev.type === 'container_start') {
        executionState.value.currentContainerInstanceId = ev.containerInstanceId
        executionState.value.currentContainerDims = {
          lengthMm: Number(ev.lengthMm) || 0,
          widthMm: Number(ev.widthMm) || 0,
          heightMm: Number(ev.heightMm) || 0
        }
        const cid = ev.containerInstanceId
        const fromStream =
          ev.containerName != null && String(ev.containerName).trim() !== ''
            ? stripImportedContainerPrefix(String(ev.containerName).trim())
            : ''
        const fromMap =
          containerNameMap.get(cid) ??
          containerNameMap.get(Number(cid)) ??
          ''
        executionState.value.currentContainerName =
          fromStream || fromMap || `容器-${cid}`
        executionState.value.placed = []
        executionState.value.placedCount = 0
        pushExecLog(`容器开始：${executionState.value.currentContainerName}`)
        refreshScene()
      } else if (ev.type === 'place') {
        // 颜色按 itemId 稳定分配（尽量与列表一致）
        const color = COLORS[Math.abs(Number(ev.itemId || 0)) % COLORS.length]
        executionState.value.placed.push({
          id: `rt-${executionState.value.placedCount + 1}`,
          itemId: ev.itemId,
          itemName: ev.itemName || '',
          x: ev.x,
          y: ev.y,
          z: ev.z,
          lengthMm: ev.lengthMm,
          widthMm: ev.widthMm,
          heightMm: ev.heightMm,
          color
        })
        executionState.value.placedCount++
        const itemLabel = stripImportedItemPrefix(ev.itemName || '') || `ID=${ev.itemId}`
        pushExecLog(
          `放置物品：${itemLabel}，坐标(${Number(ev.x).toFixed(1)},${Number(ev.y).toFixed(1)},${Number(ev.z).toFixed(1)})`
        )
        progress.value = Math.min(90, progress.value + 1)
        refreshScene()
      } else if (ev.type === 'container_end') {
        pushExecLog(`容器结束：已放置 ${ev.placedCount} 件`)
      } else if (ev.type === 'error') {
        pushExecLog(`错误：${ev.message || ''}`)
        executionState.value.phase = '失败'
        executionState.value.running = false
        throw new Error(ev.message || '装箱失败')
      } else if (ev.type === 'done') {
        pushExecLog(`完成：${ev.success ? '成功' : '失败'}，装入 ${ev.packedCount ?? '-'} 件`)
        executionState.value.phase = ev.success ? '已完成' : '失败'
        executionState.value.running = false
        if (!ev.success) throw new Error('装箱失败')
      }
    }
  }
  executionState.value.running = false
}

function openExportDialog() {
  if (uiLocked.value) return
  exportIncludeThreeViewsPng.value = true
  exportIncludePlanInfoXlsx.value = true
  exportIncludePackingDetailXlsx.value = true
  exportIncludeUnloadedXlsx.value = true
  exportDialogVisible.value = true
}

function closeExportDialog() {
  if (uiLocked.value) return
  exportDialogVisible.value = false
}

async function confirmExportDownload() {
  if (uiLocked.value) return
  if (exportSelectionEmpty.value) return
  exportDialogVisible.value = false
  await runExportZip(
    exportIncludeThreeViewsPng.value,
    exportIncludePlanInfoXlsx.value,
    exportIncludePackingDetailXlsx.value,
    exportIncludeUnloadedXlsx.value
  )
}

async function runExportZip(
  includeThreeViewsPng,
  includePlanInfoXlsx,
  includePackingDetailXlsx,
  includeUnloadedXlsx
) {
  const planId = activePlanId.value
  try {
    const res = await axios.get(`${API_BASE}/api/plans/${planId}/export-zip`, {
      responseType: 'blob',
      params: {
        includeThreeViewsPng,
        includePlanInfoXlsx,
        includePackingDetailXlsx,
        includeUnloadedXlsx
      }
    })
    const trimmedName =
      plan.value?.planName != null ? String(plan.value.planName).trim() : ''
    const name =
      trimmedName !== ''
        ? `${sanitizeDownloadName(trimmedName)}.zip`
        : `方案_${planId}.zip`
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出失败', error)
    ui.showAlert(
      '导出失败：' + (error.response?.status === 404 ? '方案不存在' : apiErrorMessage(error))
    )
  }
}

function sanitizeDownloadName(s) {
  return String(s).replace(/[\\/:*?"<>|]/g, '_').trim() || 'plan'
}

function goBack() {
  if (props.embedded) emit('close')
  else router.back()
}

function formatPlanStatus(status) {
  const statusMap = {
    0: '未开始',
    1: '容器不足',
    2: '物品不足'
  }
  return statusMap[status] || '未知'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.plan-detail-shell {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

.plan-detail-shell--embed {
  display: contents;
}

.plan-detail-shell--embed .left-panel,
.plan-detail-shell--embed .right-panel {
  min-height: 0;
  height: 100%;
  max-height: 100%;
}

.plan-detail-shell--embed .left-panel {
  border-radius: 14px;
  border: 1px solid #000;
  margin: 0;
  padding: 12px;
  background: #fff;
  box-shadow: var(--ui-shadow-md);
}

.plan-detail-shell--embed .right-panel {
  border: 1px solid #000;
  border-radius: 14px;
  padding: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--ui-shadow-md);
}

.plan-detail-shell--embed .plan-detail-three-root {
  min-height: 0;
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #000;
  padding: 16px;
  min-height: 0;
  box-shadow: var(--ui-shadow-sm);
}

.plan-detail-three-root {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.plan-detail-three-root:fullscreen,
.plan-detail-three-root:-webkit-full-screen {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: #fff;
}

.plan-detail-three-root:fullscreen .canvas-toolbar,
.plan-detail-three-root:-webkit-full-screen .canvas-toolbar {
  flex-shrink: 0;
}

.plan-detail-three-root:fullscreen .scene-frame,
.plan-detail-three-root:-webkit-full-screen .scene-frame {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.plan-detail-three-root:fullscreen .canvas-container,
.plan-detail-three-root:-webkit-full-screen .canvas-container {
  flex: 1;
  min-height: 0;
}

.plan-detail-three-root:fullscreen .selected-item-panel,
.plan-detail-three-root:-webkit-full-screen .selected-item-panel {
  flex-shrink: 0;
}

.canvas-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
}

.canvas-toolbar-buttons {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 6px;
  width: 100%;
}

.canvas-toolbar .tab-group.canvas-toolbar-sub {
  margin-bottom: 0;
}

.canvas-toolbar .tab-btn {
  min-height: 32px;
}

.btn-toolbar {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #000;
  border-radius: 10px;
  background: #fff;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ui-shadow-sm);
}

.btn-toolbar:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-toolbar.secondary {
  background: #fff;
}

.btn-toolbar.active {
  background: #a8e6cf;
  color: #000;
}

.scene-frame {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scene-context-banner {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 8px;
  z-index: 2;
  margin-bottom: 0;
  padding: 8px 12px;
  border: 1px solid #000;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.45;
  color: #000;
  pointer-events: none;
}

.scene-context-banner.mint-banner {
  background: #a8e6cf;
  box-shadow: var(--ui-shadow-sm);
}

.canvas-container {
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
  box-shadow: var(--ui-shadow-sm);
}

.playback-scene-footer {
  flex-shrink: 0;
  margin-top: 10px;
  padding: 0 2px;
}

.playback-bar--labeled {
  position: relative;
  width: 100%;
  min-width: 0;
  height: var(--ui-add-btn-height, 32px);
  border: 1px solid #000;
  border-radius: var(--ui-add-btn-radius, 10px);
  background: #f0f0f0;
  overflow: hidden;
}

.playback-bar-fill {
  height: 100%;
  background: #7dd3a8;
  transition: width 0.25s ease;
}

.playback-bar-label {
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

.canvas-container :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.selected-item-panel {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #000;
  border-radius: 10px;
  background: #f5f5f5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  min-height: 52px;
  box-shadow: var(--ui-shadow-sm);
}

.selected-item-title {
  font-size: 13px;
  font-weight: 400;
  color: #222;
}

.selected-item-name {
  font-size: 13px;
  font-weight: 400;
  color: #111;
}

.selected-item-coord,
.selected-item-empty {
  font-size: 14px;
  color: #333;
}

/* 右侧面板 */
.right-panel {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
  box-shadow: var(--ui-shadow-sm);
}

.right-panel-tab-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 0;
}

.tab-group {
  display: flex;
  align-items: stretch;
  gap: 6px;
  width: 100%;
  margin-bottom: 12px;
}

.tab-btn {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 6px;
  border-radius: 10px;
  border: 1px solid #000;
  background: #ffffff;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ui-shadow-sm);
}

.tab-btn:disabled,
.tab-btn.active:disabled {
  background: #fff !important;
  color: #bfbfbf !important;
  border-color: #d9d9d9 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  opacity: 1;
}

.tab-btn.active {
  background: #a8e6cf;
  color: #000;
}

.tab-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 10px;
  border: 1px solid #000;
  border-radius: 12px;
  padding: 0;
  background: #fff;
  box-shadow: var(--ui-shadow-sm);
}

.tab-content.plan-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plan-info-table-shell {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.plan-info-summary-shell {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 与 Home 左侧 .table-wrapper .list-data-table 对齐：字号、行高、边框、斑马纹、选中色 */
.plan-info .list-data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.plan-info .plan-info-containers-table th:nth-child(1),
.plan-info .plan-info-containers-table td:nth-child(1) {
  width: 30%;
}

.plan-info .plan-info-containers-table th:nth-child(2),
.plan-info .plan-info-containers-table td:nth-child(2) {
  width: 10%;
}

.plan-info .plan-info-containers-table th:nth-child(3),
.plan-info .plan-info-containers-table td:nth-child(3),
.plan-info .plan-info-containers-table th:nth-child(4),
.plan-info .plan-info-containers-table td:nth-child(4),
.plan-info .plan-info-containers-table th:nth-child(5),
.plan-info .plan-info-containers-table td:nth-child(5) {
  width: 20%;
}

/* 物品表 6 列：与 Home 六列表宽一致 */
.plan-info .plan-info-items-table th:nth-child(1),
.plan-info .plan-info-items-table td:nth-child(1) {
  width: 25%;
}

.plan-info .plan-info-items-table th:nth-child(2),
.plan-info .plan-info-items-table td:nth-child(2),
.plan-info .plan-info-items-table th:nth-child(3),
.plan-info .plan-info-items-table td:nth-child(3),
.plan-info .plan-info-items-table th:nth-child(4),
.plan-info .plan-info-items-table td:nth-child(4),
.plan-info .plan-info-items-table th:nth-child(5),
.plan-info .plan-info-items-table td:nth-child(5) {
  width: 12%;
}

.plan-info .plan-info-items-table th:nth-child(6),
.plan-info .plan-info-items-table td:nth-child(6) {
  width: 17%;
}

.plan-info .list-data-table thead {
  background: #a8e6cf;
}

.plan-info .list-data-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #a8e6cf;
  font-size: 11px;
  font-weight: 400;
  height: 34px;
  padding: 0;
  text-align: center;
  vertical-align: middle;
}

/* 表头：flex 居中；可排序列左右 padding 对称，避免为箭头留右空白时标题视觉偏左 */
.plan-info .list-data-table thead th .plan-table-th-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 34px;
  box-sizing: border-box;
  padding: 0 4px;
  line-height: 1.2;
}

.plan-info .list-data-table thead th.sortable .plan-table-th-inner {
  padding: 0 15px 0 15px;
}

.plan-info .list-data-table thead th.sortable {
  cursor: pointer;
}

.plan-info .list-data-table th,
.plan-info .list-data-table td {
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  padding: 4px 4px;
  text-align: center;
  vertical-align: middle;
  font-size: 11px;
  font-weight: 400;
  height: 30px;
}

/* 表头不参与 max-width:0，避免与左侧列表相比列标题挤压错位；数据行规则与 Home 一致 */
.plan-info .list-data-table thead th:not(:last-child) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-info .list-data-table tbody td:not(:last-child) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
}

.plan-info .list-data-table td:last-child {
  overflow: visible;
  white-space: nowrap;
  max-width: none;
  padding-left: 3px;
  padding-right: 3px;
}

.plan-info .list-data-table th:last-child,
.plan-info .list-data-table td:last-child {
  border-right: 0;
}

.plan-info .list-data-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.plan-info .list-data-table tbody tr:last-child td {
  border-bottom: 1px solid #000;
}

.plan-info .list-data-table tbody tr.selected {
  background: #a8e6cf !important;
  color: #000;
}

.plan-info .list-data-table tbody tr.selected td {
  border-right-color: #000;
  border-top-color: #000;
}

.plan-info .list-data-table tbody tr.selected td:last-child {
  border-right: 0;
}

.plan-info .list-data-table thead th.sortable .sort-indicator {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.plan-info .list-data-table .sort-indicator {
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
}

.plan-info .list-data-table .color-box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.execution-panel {
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.right-panel-generate-strip.exec-footer--row {
  flex-shrink: 0;
  margin-top: 0;
  padding: 0 2px;
  border-top: none;
  padding-top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.exec-footer--row .exec-generate-btn.btn {
  flex-shrink: 0;
  height: var(--ui-add-btn-height, 32px);
  min-width: 72px;
  padding: 0 6px;
  border-radius: var(--ui-add-btn-radius, 10px);
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  background: #7dd3a8;
  color: #000;
  border: 1px solid #000;
  box-shadow: var(--ui-shadow-sm);
}

.progress-bar--labeled {
  flex: 1;
  min-width: 0;
  height: var(--ui-add-btn-height, 32px);
  position: relative;
  border: 1px solid #000;
  border-radius: var(--ui-add-btn-radius, 10px);
  overflow: hidden;
  background: #f0f0f0;
}

.progress-fill {
  height: 100%;
  background: #7dd3a8;
  transition: width 0.3s;
}

.progress-bar--labeled .progress-fill {
  position: relative;
  z-index: 0;
}

.progress-inside-label {
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

.export-inline-panel {
  padding: 14px;
  font-size: 13px;
}

.export-inline-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.exec-body--stacked {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exec-stage-section {
  flex-shrink: 0;
  padding: 0 0 4px;
  background: transparent;
}

.exec-log-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0 4px;
  background: transparent;
}

.exec-section-title {
  font-weight: 400;
  margin: 0 0 10px;
  font-size: 13px;
  color: #111;
  padding-bottom: 0;
}

.exec-section-title--log {
  margin-bottom: 10px;
}

.exec-phase {
  border: 1px solid #000;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f7f7f7;
  margin-bottom: 12px;
  font-size: 12px;
}

.exec-kv {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  font-size: 12px;
  margin-bottom: 12px;
}

.exec-kv .k {
  font-weight: 400;
}

.exec-kv .v {
  font-weight: 400;
}

.exec-temperature {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #000;
  border-radius: 8px;
  background: #f0faf4;
  font-size: 12px;
}

.exec-temperature__k {
  font-weight: 400;
  color: #222;
  flex-shrink: 0;
}

.exec-temperature__v {
  font-weight: 400;
  color: #111;
}

.exec-log-list {
  flex: 1;
  min-height: 120px;
  max-height: 320px;
  overflow: auto;
  background: #fff;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 8px;
  font-size: 11px;
  line-height: 1.5;
}

.exec-log-line {
  white-space: pre-wrap;
  word-break: break-all;
}

.mono {
  font-family: ui-monospace, monospace;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  display: inline-block;
  width: 14px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  margin-left: 4px;
}

.plan-info .list-data-table tbody tr {
  cursor: pointer;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
  border-radius: 4px;
  margin: 0 auto;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  min-height: 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 10px;
  font-size: 13px;
  background: #fff;
}

.info-item .label {
  font-weight: 400;
  min-width: 120px;
}

.info-item .value {
  text-align: right;
  flex: 1;
}

.requirements-panel {
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-height: 0;
}

.requirements-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
}

.requirement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #000;
  border-radius: 10px;
  margin-bottom: 6px;
  font-size: 12px;
  background: #fff;
}

.requirement-content {
  flex: 1;
  word-break: break-all;
}

.requirement-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 4px 10px;
  border: 1px solid #000;
  border-radius: 10px;
  background: #a8e6cf;
  color: #000;
  cursor: pointer;
  font-size: 11px;
  font-weight: 400;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.action-btn.small {
  padding: 2px 8px;
  min-width: 45px;
  height: 26px;
  font-size: 10px;
}

.action-btn.danger {
  background: #ff4444;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #7dd3a8;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.add-requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.requirement-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #000;
  border-radius: 10px;
  font-size: 13px;
  height: 34px;
  outline: none;
}

.requirement-input:focus {
  background: #f9f9f9;
}

.progress-section {
  margin-bottom: 12px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  height: var(--ui-add-btn-height, 32px);
  padding: 0 6px;
  border-radius: var(--ui-add-btn-radius, 10px);
  border: 1px solid #000;
  background: #a8e6cf;
  color: #000;
  font-size: var(--ui-add-btn-font-size, 12px);
  cursor: pointer;
  min-width: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--ui-add-btn-font-weight, 400);
  box-shadow: var(--ui-shadow-sm);
}

.btn.secondary {
  background: #fff;
  color: #000;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.llm-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.llm-modal {
  width: min(640px, 100%);
  max-height: min(85vh, 720px);
  background: #fff;
  border: 1px solid #000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--ui-shadow-lg);
}

.llm-modal-header {
  background: #a8e6cf;
  color: #000;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border-bottom: 1px solid #000;
}

.llm-modal-body {
  padding: 14px 16px;
  overflow-y: auto;
  flex: 1;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.llm-modal-footer {
  padding: 10px 16px;
  border-top: 1px solid #000;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

.export-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  padding: 16px;
}

.export-modal {
  width: min(480px, 100%);
  background: #fff;
  border: 1px solid #000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--ui-shadow-lg);
}

.export-modal-header {
  background: #a8e6cf;
  color: #000;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border-bottom: 1px solid #000;
}

.export-modal-body {
  padding: 16px;
  font-size: var(--ui-add-btn-font-size, 12px);
  font-weight: var(--ui-add-btn-font-weight, 400);
  line-height: 1.55;
}

.export-hint {
  margin-bottom: 12px;
  color: #333;
}

.export-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.export-checkbox-row input {
  margin-top: 3px;
  flex-shrink: 0;
}

.export-warn {
  margin-top: 8px;
  color: #a60;
  font-size: 12px;
  font-weight: 400;
}

.export-modal-footer {
  padding: 10px 16px;
  border-top: 1px solid #000;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.llm-section {
  margin-bottom: 14px;
}

.llm-section h4 {
  font-size: var(--ui-add-btn-font-size, 12px);
  margin-bottom: 6px;
  font-weight: var(--ui-add-btn-font-weight, 400);
}

.llm-text {
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.llm-text.mono {
  font-family: ui-monospace, monospace;
}

.llm-list {
  margin: 0;
  padding-left: 18px;
  line-height: 1.5;
}

.llm-error {
  color: #c00;
  font-weight: 400;
}

.llm-warn {
  color: #a60;
  font-size: 12px;
  margin-top: 8px;
}

.llm-raw {
  margin-top: 12px;
  font-size: 12px;
}

.llm-raw pre {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 8px;
  background: #f7f7f7;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.llm-json {
  margin: 0;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 8px;
  background: #f7f7f7;
  font-size: 12px;
  max-height: 160px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: ui-monospace, monospace;
}

</style>

