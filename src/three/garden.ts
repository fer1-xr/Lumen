import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { CITY_DEFS } from './cities'
import { at, mat, rng, tree, sphere, disc } from './kit'
import { CIUDADES } from '../data/ciudades'

const SPACING_X = 25
const SPACING_Z = 27
const PLOT_R = 9.2

/** Posición de cada ciudad: recorrido en serpentina (historia de la salvación) */
export function plotPos(i: number) {
  const row = Math.floor(i / 5)
  const col = row % 2 === 0 ? i % 5 : 4 - (i % 5)
  return new THREE.Vector3((col - 2) * SPACING_X, 0, (row - 1) * SPACING_Z)
}

interface Plot {
  id: string
  root: THREE.Group
  base: THREE.Mesh
  stages: THREE.Object3D[]
  label: HTMLDivElement
  level: number
}

export class GardenScene {
  renderer: THREE.WebGLRenderer
  labels: CSS2DRenderer
  scene = new THREE.Scene()
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  plots: Plot[] = []
  private raf = 0
  private anims: { obj: THREE.Object3D; t0: number; dur: number }[] = []
  private fly: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t0: number } | null = null
  private ro: ResizeObserver
  private clock = new THREE.Clock()
  private sparkles: THREE.Points[] = []

  constructor(private el: HTMLElement, private onSelect: (id: string | null) => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(this.renderer.domElement)
    this.labels = new CSS2DRenderer()
    this.labels.domElement.className = 'garden-labels'
    el.appendChild(this.labels.domElement)

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.5, 900)
    this.camera.position.set(0, 95, 110)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 4)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI * 0.46
    this.controls.minDistance = 12
    this.controls.maxDistance = 240

    this.buildWorld()
    this.buildPlots()

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(el)
    this.resize()

    const ray = new THREE.Raycaster()
    let down: { x: number; y: number } | null = null
    this.renderer.domElement.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }))
    this.renderer.domElement.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return
      const r = this.renderer.domElement.getBoundingClientRect()
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera)
      const hits = ray.intersectObjects(this.plots.map((p) => p.root), true)
      const hit = hits.find((h) => this.plotOf(h.object))
      this.onSelect(hit ? this.plotOf(hit.object)!.id : null)
    })
    this.loop()
  }

  private plotOf(o: THREE.Object3D | null): Plot | undefined {
    while (o) {
      const p = this.plots.find((x) => x.root === o)
      if (p) return p
      o = o.parent
    }
  }

  private buildWorld() {
    const s = this.scene
    s.background = new THREE.Color('#bfe0f0')
    s.fog = new THREE.Fog('#cfe6ef', 160, 420)
    s.add(new THREE.HemisphereLight('#fff6e0', '#6a8a50', 1.2))
    const sun = new THREE.DirectionalLight('#fff1d6', 2.4)
    sun.position.set(-60, 110, 50)
    sun.castShadow = true
    sun.shadow.mapSize.set(4096, 4096)
    const sc = sun.shadow.camera
    sc.left = -85
    sc.right = 85
    sc.top = 70
    sc.bottom = -70
    sc.far = 400
    sun.shadow.bias = -0.0004
    s.add(sun)

    // isla
    const island = new THREE.Mesh(new THREE.CylinderGeometry(92, 98, 4, 64), mat('#86b96a'))
    island.position.y = -2
    island.receiveShadow = true
    s.add(island)
    const beach = new THREE.Mesh(new THREE.CylinderGeometry(100, 104, 3, 64), mat('#e5d3a1'))
    beach.position.y = -2.6
    s.add(beach)
    const sea = new THREE.Mesh(new THREE.CircleGeometry(600, 64), mat('#5aa6c8', { rough: 0.25, metal: 0.1 }))
    sea.rotation.x = -Math.PI / 2
    sea.position.y = -2.2
    s.add(sea)

    // camino entre ciudades
    const pts = CIUDADES.map((_, i) => plotPos(i))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2)
    const N = 220
    const road = new THREE.Group()
    for (let i = 0; i < N; i++) {
      const p = curve.getPoint(i / N)
      const tile = disc(1.35, '#e3d2a6', 0.06, mat('#e3d2a6'))
      tile.position.set(p.x, 0.0, p.z)
      road.add(tile)
    }
    s.add(road)

    // árboles decorativos alrededor
    const R = rng(7)
    for (let i = 0; i < 140; i++) {
      const a = R() * Math.PI * 2
      const r = 62 + R() * 26
      const t = tree(['round', 'pine', 'olive', 'cypress'][Math.floor(R() * 4)] as 'round', 1.4 + R() * 1.6)
      t.position.set(Math.cos(a) * r, 0, Math.sin(a) * r)
      s.add(t)
    }
    for (let i = 0; i < 40; i++) {
      const p = new THREE.Vector3((R() - 0.5) * 120, 0, (R() - 0.5) * 80)
      if (pts.some((q) => q.distanceTo(p) < PLOT_R + 3)) continue
      s.add(at(tree(R() > 0.5 ? 'round' : 'pine', 1 + R()), p.x, 0, p.z))
    }
    // nubes
    for (let i = 0; i < 18; i++) {
      const c = new THREE.Group()
      for (let k = 0; k < 4; k++) c.add(at(sphere(3 + R() * 3, '#ffffff', mat('#ffffff', { opacity: 0.9 }), 1), k * 3.5, R() * 1.5, R() * 2))
      const ca = R() * Math.PI * 2
      const cr = 170 + R() * 120
      c.position.set(Math.cos(ca) * cr, 40 + R() * 30, Math.sin(ca) * cr)
      c.traverse((o) => ((o as THREE.Mesh).castShadow = false))
      s.add(c)
    }
  }

  private buildPlots() {
    CIUDADES.forEach((c, i) => {
      const def = CITY_DEFS[c.id]
      const root = new THREE.Group()
      root.position.copy(plotPos(i))
      const base = new THREE.Mesh(new THREE.CylinderGeometry(PLOT_R, PLOT_R + 0.4, 0.6, 40), mat('#a08868'))
      base.receiveShadow = true
      base.position.y = 0.0
      root.add(base)
      const content = new THREE.Group()
      content.position.y = 0.3
      root.add(content)
      const stages = def.stages.map((f) => {
        const o = new THREE.Group()
        o.add(f())
        o.visible = false
        content.add(o)
        return o
      })
      const label = document.createElement('div')
      label.className = 'g-label'
      label.onclick = () => this.onSelect(c.id)
      const lo = new CSS2DObject(label)
      lo.position.set(0, 11, 0)
      root.add(lo)
      this.scene.add(root)
      this.plots.push({ id: c.id, root, base, stages, label, level: -1 })
    })
  }

  setLevels(levels: Record<string, number>, seen: Record<string, number>) {
    const now = performance.now()
    for (const p of this.plots) {
      const lvl = levels[p.id] ?? 0
      if (lvl === p.level) continue
      const prevSeen = p.level === -1 ? seen[p.id] ?? 0 : p.level
      p.level = lvl
      const def = CITY_DEFS[p.id]
      ;(p.base.material as THREE.Material) = lvl === 0 ? mat('#a08868') : mat(def.ground)
      p.stages.forEach((s, k) => {
        const vis = k < lvl
        if (vis && !s.visible && k >= prevSeen) {
          s.scale.setScalar(0.001)
          this.anims.push({ obj: s, t0: now + (k - prevSeen) * 450, dur: 900 })
          this.sparkle(p.root.position, now + (k - prevSeen) * 450)
        }
        if (!vis) s.scale.setScalar(1)
        s.visible = vis
      })
      const city = CIUDADES.find((c) => c.id === p.id)!
      p.label.innerHTML = `<b>${city.name}</b><span>${'★'.repeat(lvl)}${'☆'.repeat(5 - lvl)}</span>`
      p.label.classList.toggle('locked', lvl === 0)
    }
  }

  private sparkle(pos: THREE.Vector3, t0: number) {
    const n = 60
    const g = new THREE.BufferGeometry()
    const arr = new Float32Array(n * 3)
    const vel: number[] = []
    for (let i = 0; i < n; i++) {
      arr.set([pos.x + (Math.random() - 0.5) * 8, 1, pos.z + (Math.random() - 0.5) * 8], i * 3)
      vel.push(1 + Math.random() * 3)
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffe680', size: 0.5, transparent: true, opacity: 0, depthWrite: false }))
    pts.userData = { t0, vel }
    this.scene.add(pts)
    this.sparkles.push(pts)
  }

  focus(id: string | null) {
    const target = id ? this.plots.find((p) => p.id === id)!.root.position.clone() : new THREE.Vector3(0, 0, 4)
    if (id && this.el.clientWidth > 860) target.x += 7
    const off = id ? new THREE.Vector3(0, 20, 26) : new THREE.Vector3(0, 95, 106)
    this.fly = { from: this.camera.position.clone(), to: target.clone().add(off), tFrom: this.controls.target.clone(), tTo: target.clone().setY(id ? 2 : 0), t0: performance.now() }
    this.plots.forEach((p) => p.label.classList.toggle('active', p.id === id))
  }

  private resize() {
    const w = this.el.clientWidth
    const h = this.el.clientHeight
    this.renderer.setSize(w, h)
    this.labels.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const dt = this.clock.getDelta()
    this.anims = this.anims.filter((a) => {
      const t = Math.min(1, Math.max(0, (now - a.t0) / a.dur))
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.cos(t * Math.PI * 2.2)
      a.obj.scale.setScalar(Math.max(0.001, e))
      return t < 1
    })
    this.sparkles = this.sparkles.filter((p) => {
      const t = (now - p.userData.t0) / 1600
      const m = p.material as THREE.PointsMaterial
      if (t < 0) return true
      if (t > 1) {
        this.scene.remove(p)
        p.geometry.dispose()
        m.dispose()
        return false
      }
      m.opacity = Math.sin(t * Math.PI)
      const pos = p.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) + p.userData.vel[i] * dt * 3)
      pos.needsUpdate = true
      return true
    })
    if (this.fly) {
      const t = Math.min(1, (now - this.fly.t0) / 1100)
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      this.camera.position.lerpVectors(this.fly.from, this.fly.to, e)
      this.controls.target.lerpVectors(this.fly.tFrom, this.fly.tTo, e)
      if (t >= 1) this.fly = null
    }
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.labels.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.controls.dispose()
    this.renderer.dispose()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
    })
    this.renderer.domElement.remove()
    this.labels.domElement.remove()
  }
}
