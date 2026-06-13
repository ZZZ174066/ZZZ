import * as THREE from 'three'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

/**
 * 三轴共原点；须传入 resolution 以使用加粗线（Line2）。
 * 轴线在容器刻度终点后继续延伸，末端为箭头与 X/Y/Z 字母。
 */
function niceStepMm(maxMm, targetTicks = 6) {
  if (!maxMm || maxMm <= 0) return 1
  const rough = maxMm / Math.max(2, targetTicks)
  const pow10 = 10 ** Math.floor(Math.log10(rough))
  const frac = rough / pow10
  let niceFrac = 1
  if (frac <= 1) niceFrac = 1
  else if (frac <= 2) niceFrac = 2
  else if (frac <= 5) niceFrac = 5
  else niceFrac = 10
  return niceFrac * pow10
}

function formatMmLabel(v) {
  const r = Math.round(v)
  if (Math.abs(v - r) < 0.05) return String(r)
  return v.toFixed(1)
}

function disposeObject3D(root) {
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose()
    const mat = obj.material
    if (mat) {
      const list = Array.isArray(mat) ? mat : [mat]
      list.forEach((m) => {
        if (m.map) m.map.dispose()
        m.dispose()
      })
    }
  })
}

function makeLabelSprite(text, scaleY, fontPx = 62) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const w = 384
  const h = 160
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#000000'
  ctx.font = `bold ${fontPx}px "Microsoft YaHei", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(text), w / 2, h / 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  const aspect = w / h
  sprite.scale.set(scaleY * aspect, scaleY, 1)
  sprite.renderOrder = 10
  return sprite
}

function addThinLine(group, a, b, color) {
  const geom = new THREE.BufferGeometry().setFromPoints([a, b])
  const line = new THREE.LineSegments(
    geom,
    new THREE.LineBasicMaterial({ color, depthTest: true, depthWrite: false })
  )
  line.renderOrder = 5
  group.add(line)
}

function addFatSegments(group, pairsFloat32, color, linewidth, resolution) {
  if (!pairsFloat32.length) return
  const geo = new LineSegmentsGeometry()
  geo.setPositions(pairsFloat32)
  const mat = new LineMaterial({
    color,
    linewidth,
    resolution,
    depthTest: true,
    depthWrite: false,
    transparent: false
  })
  const lines = new LineSegments2(geo, mat)
  lines.renderOrder = 5
  group.add(lines)
}

/** 与轴线长度计算共用，保证线段止于锥底、尖端在最外端 */
function getAxisArrowConeSize(maxW) {
  const h = Math.max(maxW * 0.046, 0.07)
  const r = Math.max(maxW * 0.018, 0.026)
  return { h, r }
}

/** 圆锥箭头：尖端在 tipWorld，锥底朝向 start 一侧 */
function addArrowCone(group, tipWorld, dirUnit, maxW, color = 0x000000) {
  const { h, r } = getAxisArrowConeSize(maxW)
  const geom = new THREE.ConeGeometry(r, h, 12)
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: true, depthWrite: true })
  const cone = new THREE.Mesh(geom, mat)
  const up = new THREE.Vector3(0, 1, 0)
  cone.quaternion.setFromUnitVectors(up, dirUnit)
  const center = tipWorld.clone().sub(dirUnit.clone().multiplyScalar(h * 0.5))
  cone.position.copy(center)
  cone.renderOrder = 6
  group.add(cone)
}

function addGraduatedAxis(group, p) {
  const {
    start,
    end,
    totalMm,
    tickDir,
    tickWorldLen,
    labelOffset,
    labelScale,
    skipMm0 = false,
    lineColor = 0x000000,
    fontPx = 62,
    resolution,
    axisLineWidthPx = 5,
    tickLineWidthPx = 2.5,
    maxWRef = 1,
    extensionRatio = 0.38,
    extensionMinWorld = 0,
    axisLetter = null,
    letterLabelScale = null
  } = p
  const edge = end.clone().sub(start)
  const worldLen = edge.length()
  if (worldLen < 1e-9 || totalMm < 1e-6) return

  const dir = edge.clone().normalize()
  const { h: hCone } = getAxisArrowConeSize(maxWRef)
  const extAlong = Math.max(worldLen * extensionRatio, extensionMinWorld, maxWRef * 0.14)
  const tipGap = hCone * 0.08
  const tipWorld = end.clone().add(dir.clone().multiplyScalar(extAlong + tipGap))
  const lineEnd = tipWorld.clone().sub(dir.clone().multiplyScalar(hCone))

  const stepMm = niceStepMm(totalMm, 6)
  const tickHalf = tickWorldLen * 0.5

  const mmList = []
  for (let mm = 0; mm <= totalMm + 1e-3; mm += stepMm) {
    mmList.push(Math.min(mm, totalMm))
  }
  const last = mmList[mmList.length - 1]
  if (last < totalMm - 0.5) mmList.push(totalMm)
  const uniq = []
  mmList.forEach((m) => {
    if (!uniq.length || Math.abs(uniq[uniq.length - 1] - m) > 0.5) uniq.push(m)
  })

  const mainPairs = new Float32Array([start.x, start.y, start.z, lineEnd.x, lineEnd.y, lineEnd.z])
  const tickPairs = []

  uniq.forEach((mm) => {
    if (skipMm0 && mm < 0.5) return
    const t = Math.min(1, mm / totalMm)
    const pos = start.clone().add(edge.clone().multiplyScalar(t))
    const tickA = pos.clone().sub(tickDir.clone().multiplyScalar(tickHalf))
    const tickB = pos.clone().add(tickDir.clone().multiplyScalar(tickHalf))
    tickPairs.push(tickA.x, tickA.y, tickA.z, tickB.x, tickB.y, tickB.z)
    const sp = makeLabelSprite(formatMmLabel(mm), labelScale, fontPx)
    sp.position.copy(pos).add(labelOffset)
    group.add(sp)
  })

  if (resolution) {
    addFatSegments(group, mainPairs, lineColor, axisLineWidthPx, resolution)
    if (tickPairs.length) {
      addFatSegments(group, new Float32Array(tickPairs), lineColor, tickLineWidthPx, resolution)
    }
  } else {
    addThinLine(group, start, lineEnd, lineColor)
    for (let i = 0; i < tickPairs.length; i += 6) {
      addThinLine(
        group,
        new THREE.Vector3(tickPairs[i], tickPairs[i + 1], tickPairs[i + 2]),
        new THREE.Vector3(tickPairs[i + 3], tickPairs[i + 4], tickPairs[i + 5]),
        lineColor
      )
    }
  }

  addArrowCone(group, tipWorld, dir, maxWRef, lineColor)

  if (axisLetter) {
    const ls = letterLabelScale != null ? letterLabelScale : labelScale * 1.35
    const letterSp = makeLabelSprite(axisLetter, ls, Math.round(fontPx * 1.15))
    const letterOff = dir.clone().multiplyScalar(maxWRef * 0.055 + hCone * 0.35)
    const side = new THREE.Vector3()
    if (Math.abs(dir.y) > 0.9) {
      side.crossVectors(dir, new THREE.Vector3(1, 0, 0)).normalize()
    } else {
      side.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
    }
    letterSp.position.copy(tipWorld).add(letterOff).add(side.multiplyScalar(maxWRef * 0.03))
    group.add(letterSp)
  }
}

/**
 * @param {THREE.Vector2} opt.resolution 画布像素尺寸
 * @param {number} [opt.gap] 自容器角水平外移，默认 0
 * @param {number} [opt.extensionRatio] 轴线超出容器刻度终点的比例
 * @param {number} [opt.numberLabelOutward] 刻度数字额外外移（世界单位）
 */
export function createContainerAxisRulerGroup(opt) {
  const {
    origin,
    lengthWorld,
    widthWorld,
    heightWorld,
    lengthMm,
    widthMm,
    heightMm
  } = opt

  const resolution = opt.resolution
  const maxW = Math.max(lengthWorld, widthWorld, heightWorld, 1)
  const labelScale = opt.labelScale != null ? opt.labelScale : maxW * 0.052
  const fontPx = opt.fontPx != null ? opt.fontPx : 62
  const gap = opt.gap != null ? opt.gap : 0
  const extensionRatio = opt.extensionRatio != null ? opt.extensionRatio : 0.38
  const numOut = opt.numberLabelOutward != null ? opt.numberLabelOutward : maxW * 0.018

  const group = new THREE.Group()
  group.name = 'axisRulerGroup'
  group.userData.isAxisRulerRoot = true

  const o = origin.clone()
  const off = maxW * 0.015
  const lineColor = 0x000000

  const horizOut =
    gap > 1e-9 ? new THREE.Vector3(-1, 0, -1).normalize().multiplyScalar(gap) : new THREE.Vector3(0, 0, 0)
  const origin0 = o.clone().add(horizOut)

  const down = new THREE.Vector3(0, -1, 0)
  const back = new THREE.Vector3(0, 0, -1)
  const left = new THREE.Vector3(-1, 0, 0)
  const tickHorizH = new THREE.Vector3(1, 0, -1).normalize()

  const axisW = opt.axisLineWidthPx != null ? opt.axisLineWidthPx : 5
  const tickW = opt.tickLineWidthPx != null ? opt.tickLineWidthPx : 2.5

  const axisArgs = {
    resolution,
    axisLineWidthPx: axisW,
    tickLineWidthPx: tickW,
    maxWRef: maxW,
    extensionRatio,
    extensionMinWorld: opt.extensionMinWorld != null ? opt.extensionMinWorld : maxW * 0.12
  }

  addGraduatedAxis(group, {
    start: origin0.clone(),
    end: origin0.clone().add(new THREE.Vector3(lengthWorld, 0, 0)),
    totalMm: lengthMm,
    tickDir: down.clone().normalize(),
    tickWorldLen: off * 1.2,
    labelOffset: down
      .clone()
      .multiplyScalar(off * 1.55 + numOut * 0.85)
      .add(back.clone().multiplyScalar(off * 0.22 + numOut * 0.42)),
    labelScale,
    lineColor,
    fontPx,
    skipMm0: false,
    axisLetter: 'X',
    ...axisArgs
  })

  addGraduatedAxis(group, {
    start: origin0.clone(),
    end: origin0.clone().add(new THREE.Vector3(0, 0, widthWorld)),
    totalMm: widthMm,
    tickDir: down.clone().normalize(),
    tickWorldLen: off * 1.2,
    labelOffset: down
      .clone()
      .multiplyScalar(off * 1.55 + numOut * 0.85)
      .add(new THREE.Vector3(1, 0, 0).multiplyScalar(off * 0.22 + numOut * 0.42)),
    labelScale,
    lineColor,
    fontPx,
    skipMm0: true,
    axisLetter: 'Y',
    ...axisArgs
  })

  addGraduatedAxis(group, {
    start: origin0.clone(),
    end: origin0.clone().add(new THREE.Vector3(0, heightWorld, 0)),
    totalMm: heightMm,
    tickDir: tickHorizH,
    tickWorldLen: off * 1.2,
    labelOffset: back
      .clone()
      .multiplyScalar(off * 1.7 + numOut * 0.95)
      .add(left.clone().multiplyScalar(off * 0.2 + numOut * 0.42)),
    labelScale,
    lineColor,
    fontPx,
    skipMm0: true,
    axisLetter: 'Z',
    ...axisArgs
  })

  return group
}

/** 将 Box8 顶点与 12 条边索引转为 LineSegments2 用的线段对（世界单位） */
export function createFatBoxWireframeSegments(verticesFloat32, indicesUint16) {
  const pairs = []
  const v = verticesFloat32
  for (let i = 0; i < indicesUint16.length; i += 2) {
    const a = indicesUint16[i] * 3
    const b = indicesUint16[i + 1] * 3
    pairs.push(v[a], v[a + 1], v[a + 2], v[b], v[b + 1], v[b + 2])
  }
  return new Float32Array(pairs)
}

export function createFatBoxWireframeMesh(verticesFloat32, indicesUint16, color, linewidthPx, resolution) {
  const positions = createFatBoxWireframeSegments(verticesFloat32, indicesUint16)
  const geo = new LineSegmentsGeometry()
  geo.setPositions(positions)
  const mat = new LineMaterial({
    color,
    linewidth: linewidthPx,
    resolution,
    depthTest: true,
    depthWrite: false,
    transparent: false
  })
  const mesh = new LineSegments2(geo, mat)
  mesh.name = 'containerWireframeFat'
  mesh.userData.isContainerWireframe = true
  mesh.renderOrder = 4
  return mesh
}

export function disposeAxisRulerGroup(group) {
  if (group) disposeObject3D(group)
}
