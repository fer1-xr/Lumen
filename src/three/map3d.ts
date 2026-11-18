import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import type { Place } from '../lib/places'

export type RegionId = 'mundo' | 'tierrasanta'
interface Meta {
  lon0: number
  lon1: number
  lat0: number
  lat1: number
  w: number
  h: number
}

export const ROUTES: { id: string; name: string; color: string; region: RegionId; stops: string[] }[] = [
  { id: 'abraham', name: 'Camino de Abraham', color: '#d35400', region: 'mundo', stops: ['Ur 1', 'Haran (Harran)', 'Shechem', 'Bethel 1 (Beth-el)', 'Hebron', 'Beersheba 1 (Beer-sheba)'] },
  { id: 'exodo', name: 'Éxodo de Israel', color: '#8e44ad', region: 'tierrasanta', stops: ['Rameses', 'Succoth 2 (Sukkoth)', 'Pi-hahiroth', 'Marah', 'Elim', 'Rephidim', 'Mount Sinai (Sinai)', 'Kadesh-barnea (Kadesh)', 'Mount Hor 1 (Hor)', 'Mount Nebo (Nebo)', 'Jericho 1'] },
  { id: 'jesus', name: 'Vida pública de Jesús', color: '#c0392b', region: 'tierrasanta', stops: ['Bethlehem 1 (Beth-lehem)', 'Nazareth', 'Cana', 'Capernaum', 'Bethsaida 1', 'Caesarea Philippi', 'Mount Tabor (Tabor)', 'Jericho 1', 'Bethany 1', 'Jerusalem'] },
  { id: 'pablo1', name: '1er viaje de San Pablo', color: '#2980b9', region: 'mundo', stops: ['Antioch 1', 'Seleucia', 'Salamis', 'Paphos', 'Perga', 'Antioch 2', 'Iconium', 'Lystra', 'Derbe', 'Lystra', 'Iconium', 'Antioch 2', 'Perga', 'Attalia', 'Antioch 1'] },
  { id: 'pablo2', name: '2º viaje de San Pablo', color: '#16a085', region: 'mundo', stops: ['Antioch 1', 'Derbe', 'Lystra', 'Iconium', 'Troas', 'Neapolis', 'Philippi', 'Amphipolis', 'Apollonia', 'Thessalonica', 'Berea (Beroea)', 'Athens', 'Corinth', 'Cenchreae (Cenchrea)', 'Ephesus', 'Caesarea', 'Jerusalem', 'Antioch 1'] },
  { id: 'pablo3', name: '3er viaje de San Pablo', color: '#f39c12', region: 'mundo', stops: ['Antioch 1', 'Iconium', 'Ephesus', 'Troas', 'Philippi', 'Thessalonica', 'Corinth', 'Philippi', 'Troas', 'Assos', 'Mitylene', 'Miletus', 'Cos (Kos, Coos)', 'Rhodes 1', 'Patara', 'Tyre', 'Ptolemais', 'Caesarea', 'Jerusalem'] },
  { id: 'roma', name: 'Viaje de Pablo a Roma', color: '#7f8c8d', region: 'mundo', stops: ['Caesarea', 'Sidon (Zidon)', 'Myra', 'Cnidus', 'Fair Havens', 'Malta (Melita)', 'Syracuse', 'Rhegium', 'Puteoli', 'Forum of Appius (Market of Appius, Forum on the Appian Way, Appii Forum)', 'Rome'] },
]

const KIND_COLOR = { land: '#b3261e', water: '#1f6fb2', region: '#6b5a48' }

export class MapScene {
  renderer: THREE.WebGLRenderer
  labelsR: CSS2DRenderer
  scene = new THREE.Scene()
  camera: THREE.PerspectiveCamera
  controls: MapControls
  private raf = 0
  private ro: ResizeObserver
  private region: RegionId | null = null
  private meta!: Meta
  private heights!: Int16Array
  private k = 1
  private exag = 1
  private W = 0
  private H = 0
  private terrain: THREE.Mesh | null = null
  private markers: THREE.InstancedMesh | null = null
  private shown: Place[] = []
  private inst: { pos: THREE.Vector3; s: number }[] = []
  private markerF = 1
  private markerSize = 0.4
  private labelObjs: { obj: CSS2DObject; rank: number; place: Place }[] = []
  private routeGroup = new THREE.Group()
  private selMarker: THREE.Group
  private fly: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t0: number } | null = null
  private frame = 0
  private places: Place[] = []
  private filter: ((p: Place) => boolean) | null = null
  private selected: string | null = null
  private routesOn = new Set<string>()

  constructor(
    private el: HTMLElement,
    private onPick: (id: string | null) => void,
    private onHover: (p: Place | null, x: number, y: number) => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(this.renderer.domElement)
    this.labelsR = new CSS2DRenderer()
    this.labelsR.domElement.className = 'map-labels'
    el.appendChild(this.labelsR.domElement)
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000)
    this.controls = new MapControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI * 0.45
    this.controls.minDistance = 2
    this.controls.maxDistance = 260
    this.controls.zoomToCursor = true

    this.scene.background = new THREE.Color('#0e1a26')
    this.scene.fog = new THREE.Fog('#0e1a26', 220, 520)
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#4a3a2a', 1.6))
    const sun = new THREE.DirectionalLight('#fff4e0', 1.3)
    sun.position.set(-50, 80, 40)
    this.scene.add(sun)
    this.scene.add(this.routeGroup)

    // indicador de lugar seleccionado
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6, 8), new THREE.MeshBasicMaterial({ color: '#ffd24a', transparent: true, opacity: 0.85 }))
    beam.position.y = 3
    const ringM = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.75, 32), new THREE.MeshBasicMaterial({ color: '#ffd24a', side: THREE.DoubleSide }))
    ringM.rotation.x = -Math.PI / 2
    this.selMarker = new THREE.Group()
    this.selMarker.add(beam, ringM)
    this.selMarker.visible = false
    this.scene.add(this.selMarker)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(el)
    this.resize()

    const ray = new THREE.Raycaster()
    const ndc = (e: PointerEvent) => {
      const r = this.renderer.domElement.getBoundingClientRect()
      return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    }
    const pick = (e: PointerEvent): Place | null => {
      if (!this.markers) return null
      ray.setFromCamera(ndc(e), this.camera)
      const h = ray.intersectObject(this.markers)[0]
      return h && h.instanceId !== undefined ? this.shown[h.instanceId] : null
    }
    let down: { x: number; y: number } | null = null
    this.renderer.domElement.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }))
    this.renderer.domElement.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return
      const p = pick(e)
      this.onPick(p ? p.id : null)
    })
    this.renderer.domElement.addEventListener('pointermove', (e) => {
      if (e.buttons) return
      const p = pick(e)
      const r = this.renderer.domElement.getBoundingClientRect()
      this.onHover(p, e.clientX - r.left, e.clientY - r.top)
      this.renderer.domElement.style.cursor = p ? 'pointer' : ''
    })
    this.loop()
  }

  setPlaces(p: Place[]) {
    this.places = p
    if (this.region) this.buildMarkers()
  }

  async setRegion(id: RegionId) {
    if (this.region === id) return
    this.region = id
    const base = import.meta.env.BASE_URL + 'data/terrain/'
    const [meta, buf, tex] = await Promise.all([
      fetch(base + id + '.json').then((r) => r.json() as Promise<Meta>),
      fetch(base + id + '.bin').then((r) => r.arrayBuffer()),
      new THREE.TextureLoader().loadAsync(base + id + '.jpg'),
    ])
    if (this.region !== id) return
    this.meta = meta
    this.heights = new Int16Array(buf)
    const midLat = ((meta.lat0 + meta.lat1) / 2) * (Math.PI / 180)
    const wDeg = (meta.lon1 - meta.lon0) * Math.cos(midLat)
    const hDeg = meta.lat1 - meta.lat0
    this.k = 120 / Math.max(wDeg, hDeg)
    this.W = wDeg * this.k
    this.H = hDeg * this.k
    this.exag = id === 'mundo' ? 30 : 5
    if (this.terrain) {
      this.scene.remove(this.terrain)
      this.terrain.geometry.dispose()
      ;(this.terrain.material as THREE.MeshStandardMaterial).map?.dispose()
    }
    const geo = new THREE.PlaneGeometry(this.W, this.H, meta.w - 1, meta.h - 1)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let j = 0; j < meta.h; j++)
      for (let i = 0; i < meta.w; i++) {
        const e = this.heights[j * meta.w + i]
        pos.setY(j * meta.w + i, this.hy(e))
      }
    geo.computeVertexNormals()
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    this.terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }))
    this.scene.add(this.terrain)
    // base (laterales)
    this.buildMarkers()
    this.buildRoutes()
    this.resetView(false)
  }

  private hy(e: number) {
    return (e * this.k * this.exag) / 111000
  }

  /** Coordenadas de mundo para lon/lat */
  project(lon: number, lat: number) {
    const m = this.meta
    const u = (lon - m.lon0) / (m.lon1 - m.lon0)
    const v = (m.lat1 - lat) / (m.lat1 - m.lat0)
    return new THREE.Vector3(u * this.W - this.W / 2, this.heightAt(u, v), v * this.H - this.H / 2)
  }

  private heightAt(u: number, v: number) {
    const m = this.meta
    const x = Math.min(m.w - 1.001, Math.max(0, u * (m.w - 1)))
    const y = Math.min(m.h - 1.001, Math.max(0, v * (m.h - 1)))
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = x - ix
    const fy = y - iy
    const H = this.heights
    const e =
      H[iy * m.w + ix] * (1 - fx) * (1 - fy) + H[iy * m.w + ix + 1] * fx * (1 - fy) + H[(iy + 1) * m.w + ix] * (1 - fx) * fy + H[(iy + 1) * m.w + ix + 1] * fx * fy
    return this.hy(Math.max(e, 0))
  }

  inRegion(p: Place) {
    const m = this.meta
    return m && p.lon >= m.lon0 && p.lon <= m.lon1 && p.lat >= m.lat0 && p.lat <= m.lat1
  }

  setFilter(f: ((p: Place) => boolean) | null) {
    this.filter = f
    this.buildMarkers()
  }

  private buildMarkers() {
    if (!this.meta || !this.places.length) return
    if (this.markers) {
      this.scene.remove(this.markers)
      this.markers.geometry.dispose()
    }
    this.labelObjs.forEach((l) => {
      l.obj.removeFromParent()
      l.obj.element.remove()
    })
    this.labelObjs = []
    const ts = this.region === 'tierrasanta'
    this.shown = this.places.filter((p) => this.inRegion(p) && (!this.filter || this.filter(p)))
    const size = ts ? 0.32 : 0.42
    const geo = new THREE.SphereGeometry(size, 10, 8)
    const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.4 }), Math.max(1, this.shown.length))
    const col = new THREE.Color()
    this.markerSize = size
    this.inst = this.shown.map((p, i) => {
      im.setColorAt(i, col.set(KIND_COLOR[p.k]))
      return { pos: this.project(p.lon, p.lat), s: 0.7 + Math.min(1.6, Math.log10(1 + p.r.length) * 0.6) }
    })
    im.count = this.shown.length
    this.markers = im
    this.scene.add(im)
    this.markerF = 0
    this.updateMarkerScale()
    // etiquetas
    const ranked = [...this.shown].sort((a, b) => b.r.length - a.r.length).slice(0, ts ? 160 : 140)
    ranked.forEach((p, rank) => {
      const div = document.createElement('div')
      div.className = 'm-label' + (rank < 12 ? ' big' : '') + (p.k === 'water' ? ' water' : '')
      div.textContent = p.es
      div.onclick = () => this.onPick(p.id)
      const o = new CSS2DObject(div)
      o.position.copy(this.project(p.lon, p.lat))
      o.position.y += 0.4
      this.scene.add(o)
      this.labelObjs.push({ obj: o, rank, place: p })
    })
    this.updateLabels(true)
    if (this.selected) this.select(this.selected, false)
  }

  private updateMarkerScale() {
    if (!this.markers) return
    const d = this.camera.position.distanceTo(this.controls.target)
    const f = Math.min(1.3, Math.max(0.18, d / 90))
    if (this.markerF && Math.abs(f - this.markerF) / this.markerF < 0.08) return
    this.markerF = f
    const mtx = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const v = new THREE.Vector3()
    this.inst.forEach((it, i) => {
      const s = it.s * f
      v.copy(it.pos)
      v.y += this.markerSize * s * 0.6
      mtx.compose(v, q, new THREE.Vector3(s, s, s))
      this.markers!.setMatrixAt(i, mtx)
    })
    this.markers.instanceMatrix.needsUpdate = true
    this.markers.computeBoundingSphere()
  }

  private updateLabels(force = false) {
    if (!force && this.frame % 8) return
    this.updateMarkerScale()
    const d = this.camera.position.distanceTo(this.controls.target)
    const limit = d > 140 ? 18 : d > 90 ? 35 : d > 55 ? 70 : d > 30 ? 120 : 200
    for (const l of this.labelObjs) l.obj.visible = l.rank < limit || l.place.id === this.selected
  }

  setRoutes(ids: string[]) {
    this.routesOn = new Set(ids)
    this.buildRoutes()
  }

  private buildRoutes() {
    this.routeGroup.clear()
    if (!this.meta || !this.places.length) return
    for (const r of ROUTES) {
      if (!this.routesOn.has(r.id)) continue
      const pts = r.stops.map((s) => this.places.find((p) => p.en === s)).filter((p): p is Place => !!p)
      if (pts.length < 2) continue
      const path: THREE.Vector3[] = []
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]
        const b = pts[i + 1]
        const n = 24
        for (let k = 0; k < n; k++) {
          const t = k / n
          const lon = a.lon + (b.lon - a.lon) * t
          const lat = a.lat + (b.lat - a.lat) * t
          const v = this.project(lon, lat)
          v.y = Math.max(v.y, 0) + 0.25 + Math.sin(t * Math.PI) * (this.region === 'mundo' ? 0.8 : 0.4)
          path.push(v)
        }
      }
      const last = pts[pts.length - 1]
      path.push(this.project(last.lon, last.lat).add(new THREE.Vector3(0, 0.25, 0)))
      const curve = new THREE.CatmullRomCurve3(path)
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, path.length * 2, this.region === 'mundo' ? 0.2 : 0.1, 6),
        new THREE.MeshBasicMaterial({ color: r.color }),
      )
      this.routeGroup.add(tube)
    }
  }

  select(id: string | null, flyTo = true) {
    this.selected = id
    this.labelObjs.forEach((l) => l.obj.element.classList.toggle('sel', l.place.id === id))
    const p = id ? this.places.find((x) => x.id === id) : null
    if (!p || !this.meta || !this.inRegion(p)) {
      this.selMarker.visible = false
      this.updateLabels(true)
      return
    }
    const v = this.project(p.lon, p.lat)
    this.selMarker.position.copy(v)
    this.selMarker.visible = true
    this.updateLabels(true)
    if (flyTo) {
      const dist = this.region === 'mundo' ? 34 : 26
      this.flyTo(v, dist)
    }
  }

  private flyTo(target: THREE.Vector3, dist: number) {
    const dir = new THREE.Vector3(0, 0.85, 0.75).normalize()
    this.fly = { from: this.camera.position.clone(), to: target.clone().add(dir.multiplyScalar(dist)), tFrom: this.controls.target.clone(), tTo: target.clone(), t0: performance.now() }
  }

  resetView(animate = true) {
    const t = new THREE.Vector3(0, 0, this.region === 'mundo' ? 0 : 4)
    const pos = this.region === 'mundo' ? new THREE.Vector3(0, 78, 62) : new THREE.Vector3(0, 90, 70)
    if (animate) this.fly = { from: this.camera.position.clone(), to: pos, tFrom: this.controls.target.clone(), tTo: t, t0: performance.now() }
    else {
      this.camera.position.copy(pos)
      this.controls.target.copy(t)
    }
  }

  private resize() {
    const w = this.el.clientWidth
    const h = this.el.clientHeight
    this.renderer.setSize(w, h)
    this.labelsR.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    this.frame++
    if (this.fly) {
      const t = Math.min(1, (performance.now() - this.fly.t0) / 1200)
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      this.camera.position.lerpVectors(this.fly.from, this.fly.to, e)
      this.controls.target.lerpVectors(this.fly.tFrom, this.fly.tTo, e)
      if (t >= 1) this.fly = null
    }
    if (this.selMarker.visible) this.selMarker.children[1].scale.setScalar(1 + 0.25 * Math.sin(performance.now() / 250))
    this.controls.update()
    this.updateLabels()
    this.renderer.render(this.scene, this.camera)
    this.labelsR.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
    this.labelsR.domElement.remove()
  }
}
