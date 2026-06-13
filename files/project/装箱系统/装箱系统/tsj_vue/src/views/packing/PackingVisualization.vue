<template>
  <div class="packing-visualization">
    <div class="result-frame">
      <!-- 顶部标签栏：常规方案 / LLM方案 + 方案选择 -->
      <div class="top-tabs">
        <div class="tab-group">
          <button
            class="tab-button"
            :class="{ active: activeResultType === 'regular' }"
            @click="activeResultType = 'regular'"
          >
            常规方案
          </button>
        </div>

        <div v-if="isOptimizing" class="progress-inline">
          <el-progress :percentage="optimizeProgress" :stroke-width="8" :indeterminate="true" />
        </div>

        <div class="top-actions">
          <el-select
            v-model="algorithmType"
            size="small"
            style="width: 140px"
            :disabled="isOptimizing"
            @change="onAlgorithmTypeChange"
          >
            <el-option label="常规算法" value="HEURISTIC" />
            <el-option label="常规算法2" value="HEURISTIC_V2" />
          </el-select>
          <button class="tab-button" :disabled="isOptimizing" @click="generateRegularPlan">
            {{ isOptimizing ? '方案生成中...' : '生成方案' }}
          </button>
          <!-- LLM 算法暂未实现，这里先不提供入口 -->
          <button class="tab-button" :disabled="isOptimizing" @click="exportImage">
            导出方案
          </button>
          <button class="tab-button" :disabled="isOptimizing" @click="goBack">
            返回
          </button>
        </div>
      </div>

      <!-- 中间区域：左侧结果展示 + 右侧两个信息框 -->
      <div class="middle-row">
        <div class="left-panel">
          <div class="layer-buttons">
            <button
              class="layer-btn"
              :class="{ active: selectedLayer === 0 }"
              @click="selectedLayer = 0; renderCurrentPlan(false)"
            >
              全部层
            </button>
            <button
              v-for="layer in availableLayers"
              :key="layer"
              class="layer-btn"
              :class="{ active: selectedLayer === layer }"
              @click="selectedLayer = layer; renderCurrentPlan(false)"
            >
              {{ formatLayerLabel(layer) }}
            </button>
          </div>
          <div class="result-box">
            <div id="canvas" class="canvas"></div>
          </div>
        </div>

        <div class="right-panel">
          <div class="info-box">
            <div class="info-box-header">物品信息</div>
            <div class="info-box-body">
              <div v-if="selectedDetail">
                <p>物品名称：{{ selectedDetail.itemName || selectedDetail.itemId }}</p>
                <p>物品长宽高(mm)：{{ selectedDetail.itemLength }}/{{ selectedDetail.itemWidth }}/{{ selectedDetail.itemHeight }}</p>
                <p>当前层数：{{ selectedDetail.layerNumber || 1 }}</p>
                <p>当前物品支撑率：{{ Number(selectedDetail.supportRate || 0).toFixed(1) }}%</p>
              </div>
              <div v-else>
                <p>请选择一个物品</p>
              </div>
            </div>
          </div>

          <div class="info-box">
            <div class="info-box-header">方案信息</div>
            <div class="info-box-body" v-if="currentPlan">
              <p>方案名称：{{ currentPlan.planName }}</p>
              <p>总物品数：{{ currentPlan.totalItems || 0 }}</p>
              <p>全局填充率：{{ (currentPlan.fillRate || 0).toFixed(2) }}%</p>
              <p>
                当前容器：
                <el-select
                  v-model="activeContainerId"
                  placeholder="容器"
                  size="small"
                  style="width: 120px"
                  @change="onContainerChange"
                >
                  <el-option
                    v-for="opt in containerOptions"
                    :key="opt.id"
                    :label="opt.name"
                    :value="opt.id"
                  />
                </el-select>
              </p>
              <p v-if="activeContainerInfo">
                当前容器尺寸(mm)：{{ activeContainerInfo.length }}/{{ activeContainerInfo.width }}/{{ activeContainerInfo.height }}
              </p>
              <p>当前容器填充率：{{ currentContainerFillRate.toFixed(2) }}%</p>
            </div>
            <div v-else class="info-box-body">
              <p>请选择一个装箱方案</p>
            </div>
          </div>

          <div class="bottom-section">
            <div class="bottom-header">物品支撑率明细</div>
            <div class="bottom-table">
              <el-table
                v-if="currentPlan && (currentPlan.details || []).length"
                :data="detailRows"
                size="small"
                height="200"
                style="width: 100%"
                highlight-current-row
                @row-click="onDetailRowClick"
              >
                <el-table-column label="颜色" width="80" header-align="center" align="center">
                  <template #default="{ row }">
                    <div :style="{ width: '18px', height: '18px', border: '1px solid #000', background: row.colorCss, margin: '0 auto' }"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="itemName" label="物品名称" min-width="120" header-align="center" align="center" />
                <el-table-column prop="containerName" label="容器" width="120" header-align="center" align="center" />
                <el-table-column prop="layerNumber" label="层数" width="80" header-align="center" align="center" />
                <el-table-column label="支撑率" width="120" header-align="center" align="center">
                  <template #default="{ row }">
                    {{ row.supportRate.toFixed(1) }}%
                  </template>
                </el-table-column>
              </el-table>
              <div v-else class="no-data">
                <p>暂无明细（请先执行方案生成）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import {
  createContainerAxisRulerGroup,
  createFatBoxWireframeMesh,
  disposeAxisRulerGroup
} from '@/utils/containerAxisRulerThree.js'
import { toggleFullscreenForElement } from '@/utils/fullscreenToggle.js'

export default {
  name: 'PackingVisualization',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const plans = ref([])
    const selectedPlanId = ref(null)
    const currentPlan = ref(null)
    const detailRows = ref([])
    const containerIdList = ref([])
    const containerOptions = ref([])
    const containerIdx = ref(0)
    const activeContainerId = ref(null)
    const highlightedDetailId = ref(null)
    const availableLayers = ref([])
    const selectedLayer = ref(0) // 0 表示全部层
    const activeResultType = ref('regular')
    const hasRegularResult = ref(false)
    const algorithmType = ref('HEURISTIC')

    const onAlgorithmTypeChange = async () => {
      // 切换算法类型时，尝试加载该算法对应的明细（若未生成则会为空/回退）
      await reloadCurrentPlan()
    }
    const isOptimizing = ref(false)
    const optimizeProgress = ref(0)
    let progressTimer = null
    let scene, camera, renderer
    let animationId = null
    let planGroup = null
    let resizeHandler = null
    const cameraTarget = new THREE.Vector3(0, 0, 0)
    const dragState = { isDragging: false, lastX: 0, lastY: 0 }
    let pointerDownHandler = null
    let pointerMoveHandler = null
    let pointerUpHandler = null
    let wheelHandler = null
    let clickHandler = null
    let dblclickHandler = null
    let fullscreenChangeHandler = null
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const clickableMeshes = []
    // key: `${category}::${itemId}` -> hex color（在一个会话内缓存，保证同一物品颜色稳定）
    const itemColorMap = new Map()

    const getColorForDetail = (d, fallbackKey) => {
      const palette = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0xff69b4] // 红/黄/绿/蓝/紫/粉
      const categoryKey = String(d.itemCategory || '未分类')
      const itemIdKey = String(d.itemId ?? fallbackKey)
      const colorKey = `${categoryKey}::${itemIdKey}`

      let baseColor = itemColorMap.get(colorKey)
      if (!baseColor) {
        // 使用稳定的字符串哈希，保证同一物品在整个方案中颜色固定
        let hash = 0
        const fullKey = `${categoryKey}#${itemIdKey}`
        for (let i = 0; i < fullKey.length; i++) {
          hash = (hash * 31 + fullKey.charCodeAt(i)) >>> 0
        }
        const idx = hash % palette.length
        baseColor = palette[idx]
        itemColorMap.set(colorKey, baseColor)
      }
      return baseColor
    }

    const loadPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/packing/plan/list')
        plans.value = response.data.data || []
        if (plans.value.length > 0 && !selectedPlanId.value) {
          selectedPlanId.value = plans.value[0].id
        }
        return plans.value
      } catch (error) {
        console.error('加载方案列表失败:', error)
        return []
      }
    }

    const initThreeJS = () => {
      const container = document.getElementById('canvas')
      if (!container || container.clientWidth === 0) {
        setTimeout(initThreeJS, 200)
        return
      }

      try {
        // 清空容器
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }

        // 场景设置
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)
        planGroup = new THREE.Group()
        planGroup.name = 'planGroup'
        scene.add(planGroup)

        // 相机设置
        const width = container.clientWidth
        const height = container.clientHeight
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
        camera.position.set(800, 600, 800)
        camera.lookAt(0, 0, 0)

        // 渲染器设置
        renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        container.appendChild(renderer.domElement)

        // 鼠标左键拖拽旋转视角
        pointerDownHandler = (event) => {
          if (event.button !== 0) return
          dragState.isDragging = true
          dragState.lastX = event.clientX
          dragState.lastY = event.clientY
        }
        pointerMoveHandler = (event) => {
          if (!dragState.isDragging) return
          const dx = event.clientX - dragState.lastX
          const dy = event.clientY - dragState.lastY
          dragState.lastX = event.clientX
          dragState.lastY = event.clientY
          const deltaAzimuth = -dx * 0.005
          const deltaPolar = -dy * 0.003
          orbitCamera({ deltaAzimuth, deltaPolar })
        }
        pointerUpHandler = () => {
          dragState.isDragging = false
        }
        const canvasEl = renderer.domElement
        canvasEl.addEventListener('mousedown', pointerDownHandler)
        window.addEventListener('mousemove', pointerMoveHandler)
        window.addEventListener('mouseup', pointerUpHandler)

        // 鼠标滚轮缩放视角
        wheelHandler = (event) => {
          if (!camera) return
          event.preventDefault()
          const delta = event.deltaY || 0
          const factor = delta > 0 ? 1.1 : 0.9 // 向下滚动放大视野（缩小图），向上滚动缩小视野（放大图）
          const offset = camera.position.clone().sub(cameraTarget)
          offset.multiplyScalar(factor)
          camera.position.copy(cameraTarget.clone().add(offset))
          camera.lookAt(cameraTarget)
        }
        canvasEl.addEventListener('wheel', wheelHandler, { passive: false })

        // 点击方块选中对应物品
        clickHandler = (event) => {
          if (!camera || !clickableMeshes.length) return
          const rect = canvasEl.getBoundingClientRect()
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

          raycaster.setFromCamera(mouse, camera)
          const intersects = raycaster.intersectObjects(clickableMeshes, false)
          if (!intersects.length) return

          const first = intersects[0].object
          const detailId = first.userData.detailId
          if (detailId == null) return

          const row = detailRows.value.find((r) => r.detailId === detailId)
          if (!row) return

          // 复用表格行点击逻辑，高亮三维方块并更新右侧信息
          onDetailRowClick(row)
        }
        canvasEl.addEventListener('click', clickHandler)

        dblclickHandler = (event) => {
          if (!camera || !scene) return
          event.preventDefault()
          const rect = canvasEl.getBoundingClientRect()
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
          raycaster.setFromCamera(mouse, camera)
          const hits = raycaster.intersectObjects(scene.children, true)
          const hitItem = hits.some(
            (h) => h.object.userData && h.object.userData.detailId != null
          )
          if (hitItem) return
          toggleFullscreenForElement(container)
        }
        canvasEl.addEventListener('dblclick', dblclickHandler)

        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
        directionalLight.position.set(500, 500, 500)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        // 不再添加三维坐标轴，避免干扰视觉效果

        // 动画循环
        const animate = () => {
          animationId = requestAnimationFrame(animate)
          renderer.render(scene, camera)
        }
        animate()

        // 处理窗口大小变化
        resizeHandler = () => {
          const newWidth = container.clientWidth
          const newHeight = container.clientHeight
          camera.aspect = newWidth / newHeight
          camera.updateProjectionMatrix()
          renderer.setSize(newWidth, newHeight)
          if (planGroup) {
            planGroup.traverse((obj) => {
              if (obj.material && obj.material.resolution) {
                obj.material.resolution.set(newWidth, newHeight)
              }
            })
          }
        }
        window.addEventListener('resize', resizeHandler)

        fullscreenChangeHandler = () => requestAnimationFrame(resizeHandler)
        document.addEventListener('fullscreenchange', fullscreenChangeHandler)
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler)

        // 初始化后绘制当前方案（若已选择）
        renderCurrentPlan()
      } catch (error) {
        console.error('Three.js初始化失败:', error)
      }
    }

    const clearPlanGroup = () => {
      if (!planGroup) return
      clickableMeshes.length = 0
      const toRemove = [...planGroup.children]
      toRemove.forEach((obj) => {
        planGroup.remove(obj)
        if (obj.userData && obj.userData.isAxisRulerRoot) {
          disposeAxisRulerGroup(obj)
          return
        }
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose && m.dispose())
          else obj.material.dispose && obj.material.dispose()
        }
      })
    }

    const fitCameraToObject = (object3d) => {
      if (!camera || !object3d) return
      const box = new THREE.Box3().setFromObject(object3d)
      if (box.isEmpty()) return
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)
      cameraTarget.copy(center)

      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = (camera.fov * Math.PI) / 180
      let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2))
      cameraZ *= 1.6

      camera.position.set(center.x + cameraZ, center.y + cameraZ * 0.6, center.z + cameraZ)
      camera.lookAt(cameraTarget)
      camera.updateProjectionMatrix()
    }

    const renderCurrentPlan = (shouldFitCamera = true) => {
      if (!scene || !planGroup) return
      clearPlanGroup()

      const details = currentPlan.value?.details || []
      if (!currentPlan.value || details.length === 0) {
        detailRows.value = []
        containerIdList.value = []
        containerOptions.value = []
        containerIdx.value = 0
        activeContainerId.value = null
        availableLayers.value = []
        drawEmptyContainerHint()
        return
      }

      // 仅展示一个容器：默认展示第一个，点击按钮可切换
      // 同时维护容器名称和尺寸信息，供下拉和尺寸展示使用
      const containerMap = new Map()
      details.forEach((d) => {
        const rawId = d.containerId ?? 'unknown'
        const key = String(rawId)
        if (!containerMap.has(key)) {
          containerMap.set(key, {
            id: key,
            rawId,
            name: d.containerName || `容器${key}`,
            length: Number(d.containerLength || 0) || 0,
            width: Number(d.containerWidth || 0) || 0,
            height: Number(d.containerHeight || 0) || 0
          })
        }
      })
      const normalizedIds = Array.from(containerMap.keys()).sort((a, b) => {
        const na = Number(a)
        const nb = Number(b)
        if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb
        return a.localeCompare(b)
      })
      containerIdList.value = normalizedIds
      containerOptions.value = normalizedIds.map((id) => containerMap.get(id))
      if (containerIdx.value < 0) containerIdx.value = 0
      if (containerIdx.value >= normalizedIds.length) containerIdx.value = 0
      if (!activeContainerId.value) {
        activeContainerId.value = normalizedIds[containerIdx.value]
      }
      const baseDetails = details.filter((d) => String(d.containerId ?? 'unknown') === String(activeContainerId.value))

      const layerSet = new Set()
      baseDetails.forEach((d) => {
        layerSet.add(d.layerNumber || 1)
      })
      availableLayers.value = Array.from(layerSet).sort((a, b) => a - b)

      const visibleDetails = selectedLayer.value && selectedLayer.value > 0
        ? baseDetails.filter((d) => (d.layerNumber || 1) === selectedLayer.value)
        : baseDetails

      detailRows.value = visibleDetails
        .map((d, idx) => {
          const colorHex = getColorForDetail(d, `row-${idx}`)
          return {
            detailId: d.id, // 唯一标识当前这一个明细
            itemName: d.itemName || String(d.itemId ?? ''),
            itemCategory: d.itemCategory || '未分类',
            itemId: d.itemId,
            containerId: d.containerId,
            containerName: d.containerName || String(d.containerId ?? ''),
            layerNumber: d.layerNumber || 1,
            supportRate: Number(d.supportRate ?? (d.layerNumber <= 1 ? 100 : 0)),
            colorHex,
            colorCss: `#${colorHex.toString(16).padStart(6, '0')}`
          }
        })
        .sort((a, b) => {
          const nameA = String(a.itemName || '').toLocaleString('zh-CN')
          const nameB = String(b.itemName || '').toLocaleString('zh-CN')
          const cmp = nameA.localeCompare(nameB, 'zh-CN')
          if (cmp !== 0) return cmp
          if (a.containerId !== b.containerId) return (a.containerId || 0) - (b.containerId || 0)
          return (a.layerNumber || 0) - (b.layerNumber || 0)
        })

      drawActualPlan(visibleDetails)
      if (shouldFitCamera) {
        fitCameraToObject(planGroup)
      }
    }

    const drawEmptyContainerHint = () => {
      if (!planGroup) return
      // 轻量提示：空场景时画一个参考容器
      const containerGeometry = new THREE.BoxGeometry(600, 400, 500)
      const containerMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.2,
        roughness: 0.6,
        transparent: true,
        opacity: 0.15
      })
      const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial)
      containerMesh.position.set(0, 200, 0)
      planGroup.add(containerMesh)
      const rwE = Math.max(1, renderer.domElement.clientWidth)
      const rhE = Math.max(1, renderer.domElement.clientHeight)
      const vHint = new Float32Array([
        -300, 0, 250, 300, 0, 250, 300, 400, 250, -300, 400, 250,
        -300, 0, -250, 300, 0, -250, 300, 400, -250, -300, 400, -250
      ])
      const idxHint = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7
      ])
      const fatHint = createFatBoxWireframeMesh(vHint, idxHint, 0x000000, 4.5, new THREE.Vector2(rwE, rhE))
      fatHint.position.copy(containerMesh.position)
      fatHint.renderOrder = 2
      planGroup.add(fatHint)
    }

    const drawActualPlan = (details) => {
      // 根据实际装箱方案数据渲染（单位：mm）
      
      const first = details[0] || {}
      const cL = Number(first.containerLength || 0) || 600
      const cW = Number(first.containerWidth || 0) || 500
      const cH = Number(first.containerHeight || 0) || 400

      const containerCenter = new THREE.Vector3(0, cH / 2, 0)

      // 容器半透明盒体 + 边框
      const containerGeometry = new THREE.BoxGeometry(cL, cH, cW)
      const containerMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.15,
        roughness: 0.7,
        transparent: true,
        opacity: 0.18
      })
      const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial)
      containerMesh.position.copy(containerCenter)
      planGroup.add(containerMesh)

      const rwC = Math.max(1, renderer.domElement.clientWidth)
      const rhC = Math.max(1, renderer.domElement.clientHeight)
      const boxVerts = new Float32Array([
        -cL / 2, 0, cW / 2,
        cL / 2, 0, cW / 2,
        cL / 2, cH, cW / 2,
        -cL / 2, cH, cW / 2,
        -cL / 2, 0, -cW / 2,
        cL / 2, 0, -cW / 2,
        cL / 2, cH, -cW / 2,
        -cL / 2, cH, -cW / 2
      ])
      const boxIdx = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7
      ])
      const fatBox = createFatBoxWireframeMesh(boxVerts, boxIdx, 0x000000, 4.5, new THREE.Vector2(rwC, rhC))
      fatBox.renderOrder = 2
      planGroup.add(fatBox)

      // 物品：把后端 positionZ(高度) 映射到 three.js 的 y
      details.forEach((d, idx) => {
        let iL = Number(d.itemLength || 0) || 200
        let iW = Number(d.itemWidth || 0) || 150
        const iH = Number(d.itemHeight || 0) || 100

        const x0 = Number(d.positionX || 0)
        const z0 = Number(d.positionY || 0)
        const y0 = Number(d.positionZ || 0)

        const rot = Number(d.rotation || 0) || 0
        // 旋转 90° 时，长宽互换。三维展示中不再额外旋转几何体，只通过尺寸变化表达朝向，
        // 避免与后端二维坐标系产生错位和溢出。
        if (Math.abs(rot) % 180 === 90) {
          const tmp = iL
          iL = iW
          iW = tmp
        }

        const geometry = new THREE.BoxGeometry(iL, iH, iW)

        const isHighlighted = highlightedDetailId.value != null && d.id === highlightedDetailId.value
        const baseColor = isHighlighted ? 0xffffff : getColorForDetail(d, `mesh-0-${idx}`)
        const material = new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: isHighlighted ? new THREE.Color(0xffffff).multiplyScalar(0.3) : new THREE.Color(baseColor).multiplyScalar(0.08),
          metalness: 0.35,
          roughness: 0.55
        })
        // 避免边框线与面发生 z-fighting，导致线条“断/消失”
        material.polygonOffset = true
        material.polygonOffsetFactor = 1
        material.polygonOffsetUnits = 1
        const mesh = new THREE.Mesh(geometry, material)

        // position 表示“物品左下角(靠近原点)”，three.js 需要中心点
        const x = -cL / 2 + x0 + iL / 2
        const y = y0 + iH / 2
        const z = -cW / 2 + z0 + iW / 2
        mesh.position.set(x, y, z)

        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData.detailId = d.id
        planGroup.add(mesh)

        clickableMeshes.push(mesh)

        // 黑色边框线
        const edgeGeo = new THREE.EdgesGeometry(geometry)
        const edgeLines = new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({ color: 0x000000, depthTest: true, depthWrite: false })
        )
        edgeLines.position.copy(mesh.position)
        edgeLines.rotation.copy(mesh.rotation)
        edgeLines.renderOrder = 3
        edgeLines.scale.setScalar(1.001)
        planGroup.add(edgeLines)
      })

      const rulerOrigin = new THREE.Vector3(-cL / 2, 0, -cW / 2)
      const rw = Math.max(1, renderer.domElement.clientWidth)
      const rh = Math.max(1, renderer.domElement.clientHeight)
      const ruler = createContainerAxisRulerGroup({
        origin: rulerOrigin,
        lengthWorld: cL,
        widthWorld: cW,
        heightWorld: cH,
        lengthMm: cL,
        widthMm: cW,
        heightMm: cH,
        labelScale: Math.max(cL, cW, cH) * 0.056,
        resolution: new THREE.Vector2(rw, rh),
        gap: 0
      })
      planGroup.add(ruler)
    }

    const orbitCamera = ({ deltaAzimuth = 0, deltaPolar = 0 }) => {
      if (!camera) return
      const offset = camera.position.clone().sub(cameraTarget)
      const spherical = new THREE.Spherical().setFromVector3(offset)
      spherical.theta += deltaAzimuth
      spherical.phi += deltaPolar
      const eps = 0.0001
      spherical.phi = Math.max(eps, Math.min(Math.PI - eps, spherical.phi))
      const nextOffset = new THREE.Vector3().setFromSpherical(spherical)
      camera.position.copy(cameraTarget.clone().add(nextOffset))
      camera.lookAt(cameraTarget)
    }

    const rotateLeft = () => orbitCamera({ deltaAzimuth: Math.PI / 12 })
    const rotateRight = () => orbitCamera({ deltaAzimuth: -Math.PI / 12 })
    const rotateUp = () => orbitCamera({ deltaPolar: -Math.PI / 18 })
    const rotateDown = () => orbitCamera({ deltaPolar: Math.PI / 18 })

    const resetView = () => {
      if (camera) {
        camera.position.set(800, 600, 800)
        cameraTarget.set(0, 0, 0)
        camera.lookAt(cameraTarget)
      }
    }

    const zoomIn = () => {
      if (camera) {
        camera.position.multiplyScalar(0.8)
      }
    }

    const zoomOut = () => {
      if (camera) {
        camera.position.multiplyScalar(1.2)
      }
    }

    const exportImage = () => {
      if (renderer) {
        const link = document.createElement('a')
        link.href = renderer.domElement.toDataURL('image/png')
        link.download = `packing-${currentPlan.value.planName}-${Date.now()}.png`
        link.click()
        ElMessage.success('图片导出成功')
      }
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

    const selectedDetail = computed(() => {
      if (!currentPlan.value || !highlightedDetailId.value) return null
      const details = currentPlan.value.details || []
      return details.find((d) => d.id === highlightedDetailId.value) || null
    })

    const activeContainerInfo = computed(() => {
      if (!activeContainerId.value || !containerOptions.value.length) return null
      return (
        containerOptions.value.find(
          (opt) => String(opt.id) === String(activeContainerId.value)
        ) || null
      )
    })

    const onContainerChange = () => {
      // 容器切换时，仅重新渲染当前容器，不重置视角
      renderCurrentPlan(false)
    }

    const currentContainerFillRate = computed(() => {
      if (!currentPlan.value || !activeContainerId.value) return 0
      const details = (currentPlan.value.details || []).filter(
        (d) => String(d.containerId ?? 'unknown') === String(activeContainerId.value)
      )
      if (!details.length) return 0
      const first = details[0]
      const cL = Number(first.containerLength || 0)
      const cW = Number(first.containerWidth || 0)
      const cH = Number(first.containerHeight || 0)
      const containerVolume = cL * cW * cH
      if (containerVolume <= 0) return 0
      let usedVolume = 0
      details.forEach((d) => {
        const l = Number(d.itemLength || 0)
        const w = Number(d.itemWidth || 0)
        const h = Number(d.itemHeight || 0)
        usedVolume += l * w * h
      })
      return (usedVolume / containerVolume) * 100
    })

    const formatLayerLabel = (layer) => {
      const map = {
        1: '第一层',
        2: '第二层',
        3: '第三层',
        4: '第四层',
        5: '第五层',
        6: '第六层',
        7: '第七层',
        8: '第八层',
        9: '第九层',
        10: '第十层'
      }
      return map[layer] || `第${layer}层`
    }

    const reloadCurrentPlan = async () => {
      if (!selectedPlanId.value) return
      try {
        const response = await axios.get(`http://localhost:8080/api/packing/plan/${selectedPlanId.value}`, {
          params: { algorithmType: algorithmType.value }
        })
        currentPlan.value = response.data.data
        renderCurrentPlan()
      } catch (e) {
        console.error('重新加载方案失败:', e)
      }
    }

    const generateRegularPlan = async () => {
      if (!selectedPlanId.value) {
        ElMessage.warning('请先在上方选择一个方案')
        return
      }
      if (isOptimizing.value) return
      try {
        isOptimizing.value = true
        optimizeProgress.value = 5
        if (progressTimer) {
          clearInterval(progressTimer)
        }
        progressTimer = setInterval(() => {
          if (optimizeProgress.value < 90) {
            optimizeProgress.value += 5
          }
        }, 300)

        const response = await axios.post('http://localhost:8080/api/packing/optimize', {
          planId: selectedPlanId.value,
          algorithmType: algorithmType.value
        })
        ElMessage.success('方案生成完成（' + (algorithmType.value === "HEURISTIC_V2" ? "常规算法2" : "常规算法") + '），填充率: ' + Number(response.data.fillRate || 0).toFixed(2) + '%')
        hasRegularResult.value = true
        activeResultType.value = 'regular'
        await reloadCurrentPlan()
      } catch (e) {
        console.error('生成常规方案失败:', e)
        ElMessage.error('生成常规方案失败')
      } finally {
        optimizeProgress.value = 100
        if (progressTimer) {
          clearInterval(progressTimer)
          progressTimer = null
        }
        setTimeout(() => {
          isOptimizing.value = false
          optimizeProgress.value = 0
        }, 400)
      }
    }

    const onPlanChange = async () => {
      if (selectedPlanId.value) {
        try {
          const response = await axios.get(`http://localhost:8080/api/packing/plan/${selectedPlanId.value}`, {
            params: { algorithmType: algorithmType.value }
          })
          currentPlan.value = response.data.data
          containerIdx.value = 0

          // 重新绘制当前方案
          renderCurrentPlan()
        } catch (error) {
          console.error('加载方案详情失败:', error)
        }
      }
    }

    const onDetailRowClick = (row) => {
      if (!row || row.detailId == null) {
        highlightedDetailId.value = null
      } else if (highlightedDetailId.value === row.detailId) {
        // 再次点击同一行，取消高亮
        highlightedDetailId.value = null
      } else {
        highlightedDetailId.value = row.detailId
      }
      // 重新按当前高亮状态渲染三维场景
      renderCurrentPlan(false)
    }

    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      // 从URL参数获取planId
      const planIdFromUrl = route.query.planId || new URLSearchParams(window.location.search).get('planId')
      
      loadPlans().then(() => {
        if (planIdFromUrl) {
          selectedPlanId.value = parseInt(String(planIdFromUrl))
          onPlanChange()
        }
      })
      
      setTimeout(() => {
        initThreeJS()
      }, 300)
    })

    onBeforeUnmount(() => {
      if (progressTimer) {
        clearInterval(progressTimer)
        progressTimer = null
      }
      if (fullscreenChangeHandler) {
        document.removeEventListener('fullscreenchange', fullscreenChangeHandler)
        document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler)
        fullscreenChangeHandler = null
      }
      if (dblclickHandler && renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('dblclick', dblclickHandler)
        dblclickHandler = null
      }
    })

    return {
      plans,
      selectedPlanId,
      currentPlan,
      detailRows,
      containerIdList,
      containerOptions,
      activeContainerId,
      highlightedDetailId,
      renderCurrentPlan,
      rotateUp,
      rotateDown,
      rotateLeft,
      rotateRight,
      resetView,
      zoomIn,
      zoomOut,
      exportImage,
      getStatusType,
      selectedDetail,
      activeContainerInfo,
      activeResultType,
      hasRegularResult,
      algorithmType,
      isOptimizing,
      optimizeProgress,
      availableLayers,
      selectedLayer,
      onContainerChange,
      currentContainerFillRate,
      formatLayerLabel,
      generateRegularPlan,
      onAlgorithmTypeChange,
      onPlanChange,
      onDetailRowClick,
      goBack
    }
  }
}
</script>

<style scoped>
.packing-visualization {
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
}

.result-frame {
  border: 3px solid #000;
  margin: 8px;
  padding: 12px;
  box-sizing: border-box;
  height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
}

.top-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tab-group {
  display: flex;
  gap: 8px;
}

.progress-inline {
  flex: 1;
  margin: 0 24px;
}

.top-actions {
  display: flex;
  gap: 16px;
}

.tab-button {
  min-width: 140px;
  padding: 8px 16px;
  border: 3px solid #000;
  background: #fff;
  color: #000;
  font-weight: bold;
  cursor: pointer;
}

.tab-button.active {
  background: #a8e6cf;
  color: #000;
}

.plan-select {
  display: flex;
  align-items: center;
}

.middle-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex: 1;
  min-height: 0;
}

.left-panel {
  flex: 3;
  display: flex;
  min-height: 0;
}

.layer-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-right: 8px;
  /* 当层数较多时，按钮区域内部滚动，避免超出整体边框 */
  max-height: 100%;
  overflow-y: auto;
}

.layer-btn {
  padding: 6px 10px;
  border: 2px solid #000;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-height: 60px;
}

.layer-btn.active {
  background: #a8e6cf;
  color: #000;
}

.result-box {
  flex: 1;
  border: 3px solid #000;
  background: #fff;
  display: flex;
  align-items: stretch;
  justify-content: center;
  min-height: 0;
}

.canvas {
  width: 100%;
  height: 100%;
}

.canvas:fullscreen,
.canvas:-webkit-full-screen {
  width: 100%;
  height: 100%;
}

.right-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-box {
  border: 3px solid #000;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-box-header {
  background: #a8e6cf;
  color: #000;
  padding: 6px 10px;
  font-weight: bold;
}

.info-box-body {
  padding: 8px 10px;
  font-size: 12px;
  flex: 1;
  /* 固定高度区间，避免选中物品时右侧整体高度被内容撑太高 */
  min-height: 100px;
  max-height: 120px;
  overflow-y: auto;
}

.info-box-body p {
  margin: 4px 0;
}

.bottom-section {
  border: 3px solid #000;
  margin-top: 8px;
}

.bottom-header {
  background: #a8e6cf;
  color: #000;
  padding: 6px 10px;
  font-weight: bold;
}

.bottom-table {
  padding: 6px 8px;
  background: #fff;
}

.bottom-table :deep(.el-table),
.bottom-table :deep(.el-table__cell),
.bottom-table :deep(.el-table th),
.bottom-table :deep(.el-table td) {
  color: #000;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 8px 0 10px 0;
  border-top: 3px solid #000;
  background: #fff;
}

.no-data {
  text-align: center;
  color: #000;
  padding: 20px 0;
}
</style>
