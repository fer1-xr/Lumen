import * as THREE from 'three'

/** Pequeño kit de primitivas low-poly para construir las ciudades */
const matCache = new Map<string, THREE.Material>()
export function mat(color: string | number, opts: { emissive?: string | number; ei?: number; opacity?: number; metal?: number; rough?: number } = {}) {
  const key = JSON.stringify([color, opts])
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: opts.rough ?? 0.85,
      metalness: opts.metal ?? 0,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.ei ?? 1,
      transparent: opts.opacity !== undefined,
      opacity: opts.opacity ?? 1,
    })
    matCache.set(key, m)
  }
  return m
}

function mesh(g: THREE.BufferGeometry, m: THREE.Material, shadow = true) {
  const o = new THREE.Mesh(g, m)
  o.castShadow = shadow
  o.receiveShadow = true
  return o
}

export const box = (w: number, h: number, d: number, color: string | number, m?: THREE.Material) => {
  const g = new THREE.BoxGeometry(w, h, d)
  g.translate(0, h / 2, 0)
  return mesh(g, m ?? mat(color))
}
export const cyl = (rt: number, rb: number, h: number, color: string | number, seg = 8, m?: THREE.Material) => {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg)
  g.translate(0, h / 2, 0)
  return mesh(g, m ?? mat(color))
}
export const cone = (r: number, h: number, color: string | number, seg = 8, m?: THREE.Material) => {
  const g = new THREE.ConeGeometry(r, h, seg)
  g.translate(0, h / 2, 0)
  return mesh(g, m ?? mat(color))
}
export const sphere = (r: number, color: string | number, m?: THREE.Material, detail = 0) => {
  const g = new THREE.IcosahedronGeometry(r, detail)
  return mesh(g, m ?? mat(color))
}
export const dome = (r: number, color: string | number, m?: THREE.Material) => {
  const g = new THREE.SphereGeometry(r, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2)
  return mesh(g, m ?? mat(color))
}
export const disc = (r: number, color: string | number, h = 0.08, m?: THREE.Material, seg = 24) => {
  const g = new THREE.CylinderGeometry(r, r, h, seg)
  g.translate(0, h / 2, 0)
  return mesh(g, m ?? mat(color), false)
}

export function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, ry = 0, s = 1): T {
  o.position.set(x, y, z)
  o.rotation.y = ry
  if (s !== 1) o.scale.multiplyScalar(s)
  return o
}

export function group(...items: THREE.Object3D[]) {
  const g = new THREE.Group()
  items.forEach((i) => g.add(i))
  return g
}

/** Generador pseudoaleatorio con semilla */
export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

export function house(w: number, d: number, h: number, wall: string, roof: 'flat' | 'gable' | 'dome' = 'flat', roofColor = '#a0522d') {
  const g = group(box(w, h, d, wall))
  if (roof === 'gable') {
    const rr = w * 0.62
    const geo = new THREE.CylinderGeometry(rr, rr, d * 1.08, 3)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, rr * 0.5, 0)
    const r = mesh(geo, mat(roofColor))
    r.position.y = h
    r.scale.set(1, 0.6, 1)
    g.add(r)
  } else if (roof === 'dome') {
    g.add(at(dome(Math.min(w, d) * 0.45, roofColor), 0, h, 0))
  } else {
    g.add(at(box(w * 1.06, 0.12, d * 1.06, roofColor), 0, h, 0))
  }
  // puerta
  g.add(at(box(w * 0.22, h * 0.5, 0.05, '#4a3020'), 0, 0, d / 2 + 0.01))
  return g
}

export function tree(kind: 'round' | 'pine' | 'palm' | 'olive' | 'cypress' | 'fruit', s = 1, leaf?: string) {
  const g = new THREE.Group()
  if (kind === 'palm') {
    const trunk = cyl(0.09, 0.14, 2.2, '#8b6b45', 6)
    trunk.rotation.z = 0.08
    g.add(trunk)
    for (let i = 0; i < 7; i++) {
      const f = cone(0.18, 1.3, leaf ?? '#3f8f3a', 4)
      f.position.set(0, 2.15, 0)
      f.rotation.set(Math.PI / 2.4, (i / 7) * Math.PI * 2, 0, 'YXZ')
      g.add(f)
    }
  } else if (kind === 'pine') {
    g.add(cyl(0.08, 0.12, 0.6, '#6b4a2b', 5))
    g.add(at(cone(0.7, 1.3, leaf ?? '#2f6b3a', 7), 0, 0.5, 0))
    g.add(at(cone(0.52, 1.0, leaf ?? '#367a42', 7), 0, 1.1, 0))
  } else if (kind === 'cypress') {
    g.add(cyl(0.06, 0.08, 0.3, '#6b4a2b', 5))
    const c = sphere(0.35, leaf ?? '#2e5a34', undefined, 1)
    c.scale.set(1, 3.2, 1)
    c.position.y = 1.3
    g.add(c)
  } else if (kind === 'olive') {
    g.add(cyl(0.1, 0.16, 0.7, '#7a6650', 5))
    const c = sphere(0.6, leaf ?? '#8aa070', undefined, 0)
    c.scale.set(1.2, 0.7, 1.1)
    c.position.y = 0.95
    g.add(c)
  } else {
    g.add(cyl(0.09, 0.14, 0.9, '#7a5534', 6))
    const c = sphere(0.65, leaf ?? '#4f9a45', undefined, 1)
    c.position.y = 1.35
    g.add(c)
    if (kind === 'fruit') {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        g.add(at(sphere(0.09, '#d63a2f'), Math.cos(a) * 0.55, 1.2 + (i % 2) * 0.3, Math.sin(a) * 0.55))
      }
    }
  }
  g.scale.setScalar(s)
  return g
}

export function wallRing(r: number, h: number, color: string, towers = 8, gap = 0, towerColor?: string) {
  const g = new THREE.Group()
  const seg = towers * 3
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2
    if (gap && i === 0) continue
    const len = 2 * r * Math.sin(Math.PI / seg) + 0.05
    const w = box(len, h, 0.35, color)
    w.position.set(Math.cos(a0 + Math.PI / seg) * r, 0, Math.sin(a0 + Math.PI / seg) * r)
    w.rotation.y = -(a0 + Math.PI / seg) + Math.PI / 2
    g.add(w)
  }
  for (let i = 0; i < towers; i++) {
    const a = (i / towers) * Math.PI * 2
    g.add(at(box(0.8, h * 1.35, 0.8, towerColor ?? color), Math.cos(a) * r, 0, Math.sin(a) * r, -a))
  }
  return g
}

export function column(h: number, color = '#efe8dc', r = 0.13) {
  return group(cyl(r, r * 1.1, h, color, 8), at(box(r * 3, 0.1, r * 3, color), 0, h, 0), box(r * 3, 0.1, r * 3, color))
}

export function sheep() {
  const g = new THREE.Group()
  const b = sphere(0.22, '#f4f1ea', undefined, 1)
  b.scale.set(1.3, 0.9, 1)
  b.position.y = 0.3
  g.add(b)
  g.add(at(sphere(0.1, '#3a3330'), 0.28, 0.36, 0))
  for (const [x, z] of [
    [0.15, 0.1],
    [-0.15, 0.1],
    [0.15, -0.1],
    [-0.15, -0.1],
  ])
    g.add(at(cyl(0.03, 0.03, 0.2, '#3a3330', 4), x, 0, z))
  return g
}

export function person(color: string) {
  return group(cone(0.16, 0.55, color, 6), at(sphere(0.09, '#d9b08c'), 0, 0.62, 0))
}

export function water(r: number, color = '#4b9bd1') {
  const d = disc(r, color, 0.06, mat(color, { rough: 0.2, metal: 0.1 }))
  d.receiveShadow = true
  return d
}

export function strip(len: number, w: number, color: string, h = 0.07) {
  const b = box(len, h, w, color, mat(color, { rough: 0.3 }))
  b.castShadow = false
  return b
}

export function glowLight(color: string, intensity = 6, dist = 14) {
  const l = new THREE.PointLight(color, intensity, dist, 1.6)
  return l
}
