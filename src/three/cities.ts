import * as THREE from 'three'
import { at, box, column, cone, cyl, disc, dome, glowLight, group, house, mat, person, rng, sheep, sphere, strip, tree, wallRing, water } from './kit'

type Stage = () => THREE.Object3D
export interface CityDef {
  ground: string
  stages: Stage[]
}

const ring = (n: number, r: number, f: (i: number, a: number) => THREE.Object3D, off = 0) =>
  group(...Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + off
    const o = f(i, a)
    o.position.x += Math.cos(a) * r
    o.position.z += Math.sin(a) * r
    return o
  }))

/** Coloca n objetos al azar en un anillo [r0, r1] */
function scatter(seed: number, n: number, r0: number, r1: number, f: (rand: () => number) => THREE.Object3D) {
  const R = rng(seed)
  const g = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2
    const r = r0 + R() * (r1 - r0)
    const o = f(R)
    o.position.x += Math.cos(a) * r
    o.position.z += Math.sin(a) * r
    o.rotation.y = R() * Math.PI * 2
    g.add(o)
  }
  return g
}

const hill = (r: number, h: number, color: string) => {
  const s = sphere(r, color, undefined, 1)
  s.scale.set(1, h / r, 1)
  s.castShadow = false
  return s
}

/** Apoya cada hijo sobre una colina (cúpula) de centro (cx,cz), radio r y altura h; dz desplaza el grupo */
function onHill(g: THREE.Group, cx: number, cz: number, r: number, h: number, dz = 0) {
  g.position.z += dz
  for (const c of g.children) {
    const d = Math.hypot(c.position.x - cx, c.position.z + dz - cz)
    c.position.y = Math.max(0, h * Math.sqrt(Math.max(0, 1 - (d / r) ** 2)) - 0.15)
  }
  return g
}

const flowers = (seed: number, n: number, r0: number, r1: number) =>
  scatter(seed, n, r0, r1, (R) => at(sphere(0.12, ['#f7d14a', '#f28cb1', '#ffffff', '#c67ae0', '#ff7a45'][Math.floor(R() * 5)]), 0, 0.12, 0))

export const CITY_DEFS: Record<string, CityDef> = {
  eden: {
    ground: '#7fb069',
    stages: [
      () => group(at(hill(2.6, 0.6, '#6ea55a'), -5, 0, -4), at(hill(2.2, 0.5, '#6ea55a'), 5, 0, -3.5), scatter(1, 8, 3, 8, () => sphere(0.3, '#9a9a8a'))),
      () => scatter(2, 14, 3, 8.2, (R) => tree(R() > 0.5 ? 'round' : 'pine', 0.8 + R() * 0.5)),
      () =>
        group(
          water(2, '#58a9dd'),
          ...[0, 1, 2, 3].map((i) => {
            const s = strip(7, 0.7, '#58a9dd')
            s.position.set(Math.cos((i * Math.PI) / 2) * 5, 0, Math.sin((i * Math.PI) / 2) * 5)
            s.rotation.y = -(i * Math.PI) / 2
            return s
          }),
        ),
      () =>
        group(
          flowers(4, 60, 2.4, 8.4),
          scatter(5, 6, 3, 7.5, (R) => tree('fruit', 0.9 + R() * 0.3)),
          scatter(6, 5, 4, 8, () => sheep()),
          scatter(7, 3, 4, 7, () => {
            const deer = group(at(box(0.5, 0.25, 0.22, '#b07a45'), 0, 0.35, 0), at(box(0.12, 0.3, 0.12, '#b07a45'), 0.25, 0.55, 0))
            ;[[0.18, 0.08], [-0.18, 0.08], [0.18, -0.08], [-0.18, -0.08]].forEach(([x, z]) => deer.add(at(cyl(0.03, 0.03, 0.35, '#7a5030', 4), x, 0, z)))
            return deer
          }),
        ),
      () => {
        const t = tree('round', 3.6, '#7bd36a')
        ;(t.children[1] as THREE.Mesh).material = mat('#86e070', { emissive: '#f0d060', ei: 0.35 })
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2
          t.add(at(sphere(0.1, '#ffd84a', mat('#ffd84a', { emissive: '#ffcc33', ei: 1 })), Math.cos(a) * 0.6, 1.3 + (i % 3) * 0.2, Math.sin(a) * 0.6))
        }
        const l = glowLight('#ffe9a0', 8, 12)
        l.position.y = 5
        return group(at(t, 0, 0.06, 0), l, at(tree('fruit', 1.3), 2.6, 0, 2.2))
      },
    ],
  },
  sinai: {
    ground: '#d8b98a',
    stages: [
      () => group(at(cone(5, 9, '#9c7b5b', 9), 0, 0, -3.5), at(cone(2.5, 4, '#a98868', 7), -4.5, 0, -4), scatter(11, 6, 5, 8.3, () => hill(0.9, 0.4, '#cfae7e'))),
      () => ring(12, 6.3, (i) => cone(0.6, 0.9, ['#e9dcc0', '#c9a27a', '#b5674b', '#efe7d6'][i % 4], 4), 0.2),
      () => {
        const g = new THREE.Group()
        const fence = (len: number, x: number, z: number, ry: number) => at(box(len, 0.5, 0.06, '#f5f1e6'), x, 0, z, ry)
        g.add(fence(5, 0, 1.3, 0), fence(5, 0, 4.7, 0), fence(3.4, -2.5, 3, Math.PI / 2), fence(3.4, 2.5, 3, Math.PI / 2))
        g.add(at(box(1.6, 1.0, 1.0, '#7a4b8c'), 1.2, 0, 3), at(box(0.6, 0.45, 0.6, '#b08d57'), -1, 0, 3))
        return g
      },
      () => {
        const g = new THREE.Group()
        for (let i = 0; i < 6; i++) g.add(at(sphere(0.55 - i * 0.04, '#f2f2f2', mat('#ffffff', { opacity: 0.85 })), Math.sin(i) * 0.15, 0.5 + i * 0.75, 0))
        const fire = cone(0.45, 2.2, '#ff8a2a', 7, mat('#ff8a2a', { emissive: '#ff5a00', ei: 1.2 }))
        const l = glowLight('#ff9a40', 6, 10)
        l.position.y = 1.5
        return group(at(g, -3.2, 0, 1.8), at(group(fire, l), -4.2, 0, 2.8))
      },
      () => {
        const tab = (x: number) => at(group(box(0.35, 0.55, 0.08, '#c9c3b6'), at(sphere(0.175, '#c9c3b6'), 0, 0.55, 0)), x, 0, 0)
        const l = glowLight('#fff3c0', 10, 10)
        l.position.y = 1
        return at(group(tab(-0.2), tab(0.2), l), 0, 8.6, -3.5, 0, 1.2)
      },
    ],
  },
  jerico: {
    ground: '#c9b07a',
    stages: [
      () => group(water(1.6), scatter(21, 5, 1.9, 3, () => tree('palm', 0.9))),
      () => group(scatter(22, 14, 2.5, 5.3, (R) => house(0.8 + R() * 0.5, 0.8 + R() * 0.4, 0.7 + R() * 0.4, '#d9c39a')), scatter(23, 6, 6.8, 8.4, () => tree('palm', 1.1))),
      () => wallRing(6, 1.2, '#b89a6a', 8),
      () => {
        const rahab = group(house(1, 1, 0.8, '#cbb183'), at(box(0.04, 1.6, 0.04, '#d2202a'), 0.55, -0.2, 0.3))
        const ark = group(box(0.7, 0.4, 0.45, '#d8b13a', mat('#d8b13a', { metal: 0.6, rough: 0.3 })), at(box(1.4, 0.05, 0.05, '#a07a20'), 0, 0.2, 0.18), at(box(1.4, 0.05, 0.05, '#a07a20'), 0, 0.2, -0.18))
        const priests = ring(4, 0.55, () => person('#e8e3d6'))
        return group(at(rahab, 0, 1.2, -6), at(group(ark, priests), 0, 0, 7.2))
      },
      () =>
        group(
          ...[0, 1, 2].map((i) => {
            const a = Math.PI * 0.15 + i * 0.5
            const f = box(2.4, 0.25, 1.4, '#e8c547')
            return at(f, Math.cos(a) * 7.7, 0, Math.sin(a) * 7.7, -a)
          }),
          at(person('#7a4b8c'), 7.2, 0, 3.6),
        ),
    ],
  },
  jerusalen: {
    ground: '#b9a77e',
    stages: [
      () => group(cyl(6.7, 7.2, 0.6, '#a99a72', 28), scatter(30, 8, 7.4, 8.6, () => tree('olive', 0.8))),
      () => scatter(31, 26, 2, 5.6, (R) => house(0.7 + R() * 0.5, 0.7 + R() * 0.5, 0.6 + R() * 0.5, R() > 0.5 ? '#e6dcc6' : '#d8cba9')).translateY(0.6),
      () => at(wallRing(6.4, 1.3, '#cdbb8f', 10, 0, '#bfa979'), 0, 0.6, 0),
      () => at(group(house(2.4, 1.8, 1.4, '#efe6d2', 'flat', '#c9b88f'), at(box(0.6, 2.2, 0.6, '#e2d6bd'), 1.1, 0, 0.8), at(box(0.6, 2.2, 0.6, '#e2d6bd'), -1.1, 0, 0.8)), 3, 0.6, 2.5, 0.4),
      () => {
        const t = group(
          box(4.2, 0.4, 3.2, '#efe8d8'),
          at(box(1.4, 2.8, 2.0, '#f7f2e6'), 0.4, 0.4, 0),
          at(box(1.6, 0.3, 2.2, '#d9b13a', mat('#d9b13a', { metal: 0.5, rough: 0.35 })), 0.4, 3.2, 0),
          at(column(2.0, '#d4a937'), -0.6, 0.4, 0.6),
          at(column(2.0, '#d4a937'), -0.6, 0.4, -0.6),
          at(cyl(0.45, 0.45, 0.4, '#a87c3a', 12), -1.5, 0.4, 0),
        )
        const l = glowLight('#fff2c4', 6, 10)
        l.position.y = 4
        return at(group(t, l), -1.5, 0.6, -1.5, 0.2)
      },
    ],
  },
  sabiduria: {
    ground: '#9fbf86',
    stages: [
      () => group(cyl(3.6, 3.9, 0.5, '#d9d0bd', 7), at(cyl(3.2, 3.4, 0.3, '#e6dfcf', 7), 0, 0.5, 0)),
      () => ring(7, 2.7, () => column(2.6, '#f4efe3', 0.2), Math.PI / 14),
      () => {
        const roof = group(cyl(3.5, 3.5, 0.3, '#e6dfcf', 7), at(cone(3.6, 1.2, '#b9573f', 7), 0, 0.3, 0))
        const table = group(box(1.4, 0.5, 0.7, '#7a5534'), at(cyl(0.12, 0.12, 0.25, '#c0392b', 8), 0.3, 0.5, 0), at(sphere(0.15, '#f1c40f'), -0.3, 0.6, 0))
        return group(at(roof, 0, 3.4, 0), at(table, 0, 0.8, 0))
      },
      () => group(flowers(41, 50, 4.2, 8.4), scatter(42, 7, 4.8, 8, () => tree('fruit', 0.8)), at(group(cyl(0.6, 0.7, 0.4, '#d8d0c0', 10), at(water(0.5), 0, 0.4, 0), at(cyl(0.1, 0.1, 0.8, '#d8d0c0'), 0, 0.4, 0)), 5.8, 0, 2)),
      () => {
        const harp = group(at(box(0.08, 1.2, 0.08, '#c19a3b'), -0.35, 0, 0), at(box(0.8, 0.08, 0.08, '#c19a3b'), 0, 1.2, 0))
        for (let i = 0; i < 6; i++) harp.add(at(box(0.015, 1.1 - i * 0.12, 0.015, '#fff7da'), -0.25 + i * 0.1, 0.05, 0))
        const l = glowLight('#fff0b0', 7, 10)
        l.position.y = 2.6
        return group(at(harp, 0, 1.3, -0.9), l)
      },
    ],
  },
  babilonia: {
    ground: '#cfb27e',
    stages: [
      () => at(strip(17.5, 2.2, '#3f87b5'), 0, 0, 6.3),
      () => scatter(51, 22, 1.5, 5, (R) => house(0.8 + R() * 0.5, 0.8 + R() * 0.5, 0.6 + R() * 0.6, '#c49a63')),
      () => {
        const blue = mat('#2457a8', { rough: 0.5 })
        const g = group(at(box(0.9, 2.4, 0.8, '#2457a8', blue), -0.9, 0, 0), at(box(0.9, 2.4, 0.8, '#2457a8', blue), 0.9, 0, 0), at(box(2.7, 0.7, 0.8, '#2457a8', blue), 0, 1.7, 0))
        for (let i = 0; i < 4; i++) g.add(at(box(0.25, 0.18, 0.02, '#e8c24a'), -0.9 + (i % 2) * 1.8, 0.6 + Math.floor(i / 2) * 0.8, 0.41))
        return at(g, 0, 0, 5.1)
      },
      () => {
        const g = new THREE.Group()
        for (let i = 0; i < 4; i++) {
          g.add(at(box(3 - i * 0.6, 0.55, 2.4 - i * 0.5, '#bc9a68'), 0, i * 0.55, 0))
          g.add(at(box(3.1 - i * 0.6, 0.18, 2.5 - i * 0.5, '#4f9a45'), 0, i * 0.55 + 0.55, 0))
        }
        g.add(scatter(52, 8, 0.2, 1.1, () => tree('palm', 0.45)))
        return at(g, 4.6, 0, -2.5, 0.3)
      },
      () => {
        const g = new THREE.Group()
        for (let i = 0; i < 6; i++) g.add(at(box(5 - i * 0.75, 0.75, 5 - i * 0.75, i % 2 ? '#b98a54' : '#c99b62'), 0, i * 0.75, 0))
        g.add(at(box(0.8, 0.8, 0.8, '#3a6fb8'), 0, 4.5, 0))
        g.add(at(box(0.5, 4.5, 1.8, '#a87a46'), 0, 0, 2.6))
        return at(g, -2.6, 0, -2.2, 0.15)
      },
    ],
  },
  ninive: {
    ground: '#c8b88a',
    stages: [
      () => at(strip(17.5, 2.6, '#3a7fae'), 0, 0, -6.2),
      () => scatter(61, 20, 1.5, 5, (R) => house(0.8 + R() * 0.6, 0.8 + R() * 0.5, 0.6 + R() * 0.5, '#bfa680')),
      () => group(wallRing(5.6, 1.6, '#a88d64', 12), at(group(box(3, 1.6, 2.2, '#d1b98d'), at(box(3.2, 0.3, 2.4, '#8a6a3c'), 0, 1.6, 0), at(box(0.5, 0.9, 0.5, '#c9a24a'), 0, 1.9, 0)), 0, 0, 0)),
      () => {
        const fish = sphere(0.9, '#4d6f86', undefined, 1)
        fish.scale.set(2.2, 0.8, 0.9)
        const tail = cone(0.6, 0.9, '#4d6f86', 4)
        tail.rotation.z = Math.PI / 2
        tail.position.x = -2.4
        const eye = at(sphere(0.1, '#111'), 1.5, 0.25, 0.55)
        return at(group(fish, tail, eye), 3, 0.2, -6.4, 0.1)
      },
      () => {
        const plant = group(cyl(0.08, 0.12, 1.5, '#6b8f3a', 6))
        for (let i = 0; i < 8; i++) {
          const leaf = sphere(0.45, '#3f9a3a')
          leaf.scale.set(1, 0.18, 0.7)
          const a = (i / 8) * Math.PI * 2
          plant.add(at(leaf, Math.cos(a) * 0.5, 1.4 + (i % 2) * 0.25, Math.sin(a) * 0.5, -a))
        }
        const jonah = person('#8a5a2b')
        const l = glowLight('#fff3c0', 5, 9)
        l.position.y = 3
        return group(at(plant, 6.6, 0, 3.4, 0, 1.4), at(jonah, 6.2, 0, 4.2), l, scatter(62, 10, 2, 5, () => person(['#6b4c8a', '#3a5f8a', '#8a3a3a'][Math.floor(Math.random() * 3)])))
      },
    ],
  },
  templo: {
    ground: '#bfae86',
    stages: [
      () => scatter(71, 22, 1, 8, (R) => box(0.4 + R() * 0.5, 0.25 + R() * 0.3, 0.3 + R() * 0.4, '#cdbf9e')),
      () => {
        const sc = (x: number, z: number) => {
          const g = new THREE.Group()
          for (const [dx, dz] of [[0, 0], [1.2, 0], [0, 1.2], [1.2, 1.2]]) g.add(at(box(0.08, 2, 0.08, '#8b6b45'), dx, 0, dz))
          g.add(at(box(1.4, 0.06, 1.4, '#a0805a'), 0.6, 1, 0.6), at(box(1.4, 0.06, 1.4, '#a0805a'), 0.6, 2, 0.6))
          return at(g, x, 0, z)
        }
        return group(sc(-4, 2), sc(3, -4), scatter(72, 9, 3, 7, () => person(['#8a6a3a', '#6b4c8a', '#3a5f8a'][Math.floor(Math.random() * 3)])))
      },
      () => wallRing(6.6, 1.5, '#d6c69d', 12, 0, '#c9b88c'),
      () => {
        const l = glowLight('#fff2c4', 4, 8)
        l.position.y = 3
        return group(box(3.6, 0.35, 2.6, '#e8dfc8'), at(box(1.3, 2.3, 1.6, '#efe8d6'), 0.6, 0.35, 0), at(column(1.6, '#e8dfc8'), -0.6, 0.35, 0.5), at(column(1.6, '#e8dfc8'), -0.6, 0.35, -0.5), l)
      },
      () => {
        const gold = mat('#e2b33c', { metal: 0.7, rough: 0.25, emissive: '#7a5500', ei: 0.4 })
        const m = group(cyl(0.06, 0.12, 1.2, '#e2b33c', 6, gold), at(box(0.4, 0.15, 0.4, '#e2b33c', gold), 0, 0, 0))
        for (let i = -3; i <= 3; i++) {
          const arm = cyl(0.03, 0.03, 0.55 - Math.abs(i) * 0.05, '#e2b33c', 5, gold)
          arm.position.set(i * 0.17, 0.9 - Math.abs(i) * 0.05, 0)
          m.add(arm)
          m.add(at(cone(0.04, 0.12, '#ffb020', 5, mat('#ffcc40', { emissive: '#ff9a00', ei: 2 })), i * 0.17, 0.9 - Math.abs(i) * 0.05 + 0.55 - Math.abs(i) * 0.05, 0))
        }
        const l = glowLight('#ffcc66', 8, 8)
        l.position.y = 2
        return at(group(m, l), 2.2, 0, 2.6, 0, 1.6)
      },
    ],
  },
  belen: {
    ground: '#a8b77e',
    stages: [
      () => group(at(hill(2.2, 0.9, '#9caa70'), -5.6, 0, -5), at(hill(2.5, 1.1, '#9caa70'), 5.4, 0, -5.2), scatter(81, 6, 5, 8.4, () => tree('olive', 0.9))),
      () => scatter(82, 16, 1.6, 5.5, (R) => house(0.7 + R() * 0.4, 0.7 + R() * 0.4, 0.6 + R() * 0.4, '#f0eadc', R() > 0.7 ? 'dome' : 'flat', '#e3dccb')),
      () => group(scatter(83, 14, 6, 8.4, () => sheep()), at(person('#8a6a3a'), 6.5, 0, 2), at(person('#6b5a3a'), 7, 0, -1.5), at(group(cyl(0.3, 0.35, 0.2, '#444', 6), at(cone(0.25, 0.5, '#ff8a2a', 6, mat('#ff8a2a', { emissive: '#ff5a00' })), 0, 0.2, 0)), 6.4, 0, 0.6)),
      () => {
        const cave = dome(1.6, '#9a8a70')
        cave.scale.set(1, 0.9, 1)
        const g = group(
          cave,
          at(box(1.3, 1.1, 0.1, '#2a2018'), 0, 0, 1.45),
          at(box(1.6, 0.1, 1.2, '#8b6b45'), 0, 1.25, 1.6),
          at(box(0.45, 0.25, 0.25, '#a0805a'), 0, 0, 2.1),
          at(sphere(0.1, '#f6e7c8'), 0, 0.3, 2.1),
          at(person('#2c5aa0'), -0.5, 0, 2.2),
          at(person('#7a5a3a'), 0.55, 0, 2.2),
        )
        return at(g, 0, 0, 0.5)
      },
      () => {
        const star = sphere(0.45, '#fff6c0', mat('#fff6c0', { emissive: '#ffe680', ei: 2 }), 0)
        const rays = group(
          ...[0, 1, 2, 3].map((i) => {
            const r = box(0.08, 2.4, 0.08, '#fff6c0', mat('#fff6c0', { emissive: '#ffe680', ei: 2 }))
            r.position.y = -1.2
            r.rotation.z = (i * Math.PI) / 4
            return group(r)
          }),
        )
        const l = glowLight('#fff2b0', 14, 16)
        return at(group(star, rays, l, at(person('#b03030'), 3, -7, 3), at(person('#3060a0'), 3.6, -7, 3.4), at(person('#3a8a3a'), 2.4, -7, 3.6)), 0, 7, 0.5)
      },
    ],
  },
  cafarnaum: {
    ground: '#9fb17a',
    stages: [
      () => {
        const lake = water(7, '#3f8fc5')
        lake.scale.set(1, 1, 0.55)
        return at(lake, 0, 0.02, 4.4)
      },
      () => scatter(91, 14, 2, 6.8, (R) => house(0.8 + R() * 0.4, 0.8 + R() * 0.4, 0.6 + R() * 0.3, '#4a4440', 'flat', '#6b625a')).translateZ(-3.2),
      () => {
        const boat = () => {
          const b = sphere(0.5, '#7a5534')
          b.scale.set(1.8, 0.35, 0.6)
          return group(at(b, 0, 0.15, 0), at(cyl(0.03, 0.03, 1.4, '#5a3a20', 4), 0, 0.15, 0), at(box(0.02, 0.8, 0.6, '#f2ead8'), 0.1, 0.6, 0))
        }
        return group(at(boat(), -2.5, 0, 4.2, 0.4), at(boat(), 1.8, 0, 5.4, -0.3), at(boat(), 4, 0, 3.2, 1.1), at(box(1.6, 0.05, 0.9, '#d8cfb8'), 0, 0.12, 1.6))
      },
      () => group(box(2.6, 0.3, 1.8, '#efe8d8'), ...[-1, -0.33, 0.33, 1].map((x) => at(column(1.6, '#f4efe3'), x, 0.3, 0.7)), at(box(2.4, 1.6, 1.0, '#e8dfc8'), 0, 0.3, -0.3), at(box(2.7, 0.2, 1.9, '#d6ccb2'), 0, 1.9, 0)).translateX(-4).translateZ(-4),
      () => {
        const oct = cyl(1.1, 1.1, 1, '#5a524a', 8)
        const l = glowLight('#fff0c0', 4, 8)
        l.position.y = 2
        return at(group(oct, at(cyl(1.25, 1.25, 0.15, '#7a7066', 8), 0, 1, 0), at(cyl(0.6, 0.6, 0.8, '#5a524a', 8), 0, 1.15, 0), l), 3.6, 0, -2.6)
      },
    ],
  },
  roma: {
    ground: '#9cb07a',
    stages: [
      () => group(at(strip(17, 1, '#8c8577'), 0, 0, 0, 0.35), scatter(101, 10, 6, 8.4, () => tree('cypress', 1.1))),
      () => scatter(102, 18, 2, 5.6, (R) => house(0.9 + R() * 0.6, 0.8 + R() * 0.5, 0.7 + R() * 0.6, ['#e6c9a0', '#d9a77a', '#efe0c4'][Math.floor(R() * 3)], 'gable', '#b5502e')),
      () => {
        const g = new THREE.Group()
        for (let i = 0; i < 8; i++) {
          g.add(at(box(0.3, 2, 0.4, '#cdb48a'), -5 + i * 1.3, 0, 0))
          g.add(at(box(1.3, 0.35, 0.4, '#cdb48a'), -4.35 + i * 1.3, 2, 0))
        }
        return at(g, 0, 0, -6.6, 0.1)
      },
      () => {
        const temple = () => group(box(2, 0.3, 1.4, '#efe8d8'), ...[-0.7, -0.23, 0.23, 0.7].map((x) => at(column(1.3, '#f4efe3', 0.1), x, 0.3, 0.55)), at(box(2, 1.3, 0.8, '#ebe2cf'), 0, 0.3, -0.25), at(box(2.1, 0.2, 1.5, '#e0d6c0'), 0, 1.6, 0), at(cone(1.2, 0.5, '#e0d6c0', 4), 0, 1.8, 0))
        return group(at(temple(), -3.2, 0, 3, 0.3), at(temple(), 3, 0, 3.4, -0.4), at(box(3, 0.08, 2.5, '#d8d0c0'), 0, 0, 2.8))
      },
      () => {
        const g = new THREE.Group()
        const n = 28
        for (let lvl = 0; lvl < 3; lvl++)
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2
            const w = box(0.55, 0.65, 0.25, lvl % 2 ? '#d8c6a3' : '#cbb68e')
            w.position.set(Math.cos(a) * 2.4, lvl * 0.68, Math.sin(a) * 1.8)
            w.rotation.y = -a + Math.PI / 2
            g.add(w)
          }
        g.add(at(disc(2.1, '#d9c79c'), 0, 0, 0))
        g.scale.set(1, 1, 1)
        return at(g, 0, 0, -1.4)
      },
    ],
  },
  efeso: {
    ground: '#a7b582',
    stages: [
      () => group(at(hill(3.6, 1.6, '#93a26e'), -3.6, 0, -4), at(hill(3, 1.3, '#93a26e'), 4, 0, -4.4), scatter(111, 7, 6, 8.4, () => tree('olive', 0.9))),
      () => group(at(strip(13, 1.2, '#e8e1d2'), 0, 0, 2.5), ...Array.from({ length: 8 }, (_, i) => at(column(1.4, '#f0ebe0', 0.08), -5.6 + i * 1.6, 0, 1.7)), ...Array.from({ length: 8 }, (_, i) => at(column(1.4, '#f0ebe0', 0.08), -5.6 + i * 1.6, 0, 3.3))),
      () => {
        const g = new THREE.Group()
        for (let k = 0; k < 6; k++) {
          const t = new THREE.Mesh(new THREE.CylinderGeometry(3.4 - k * 0.4, 3.4 - k * 0.4, 0.3, 24, 1, false, Math.PI / 2, Math.PI), mat('#e2d8c2'))
          t.position.y = k * 0.3 + 0.15
          t.castShadow = t.receiveShadow = true
          g.add(t)
        }
        return at(g, -2.6, 0, -2.4)
      },
      () => group(box(3.2, 0.3, 0.6, '#ece4d4'), ...[-1.2, -0.4, 0.4, 1.2].map((x) => at(column(1.6, '#f6f0e4', 0.1), x, 0.3, 0.1)), at(box(3.2, 0.25, 0.7, '#e2d8c2'), 0, 1.9, 0), ...[-0.8, 0, 0.8].map((x) => at(column(1.1, '#f6f0e4', 0.08), x, 2.15, 0.1)), at(box(2.4, 0.2, 0.6, '#e2d8c2'), 0, 3.25, 0), at(box(3, 3.2, 0.3, '#d9cfba'), 0, 0.3, -0.4)).translateX(3.4).translateZ(-2.2),
      () => {
        const l = glowLight('#cfe3ff', 4, 7)
        l.position.y = 2.2
        return at(group(house(1.4, 1.1, 0.9, '#b8ab94', 'dome', '#a39680'), flowers(112, 14, 1.1, 1.9), l), 5.6, 0, 4.2)
      },
    ],
  },
  vaticano: {
    ground: '#9fb07c',
    stages: [
      () => hill(7.5, 0.8, '#94a674'),
      () => group(at(box(0.5, 0.4, 0.5, '#e8e0cf'), 0, 0.6, 4), at(cone(0.3, 3.4, '#d9cfba', 4), 0, 1, 4), at(water(0.6), -1.8, 0.6, 4), at(water(0.6), 1.8, 0.6, 4)),
      () => {
        const g = new THREE.Group()
        for (const side of [-1, 1]) {
          for (let i = 0; i <= 10; i++) {
            const a = (i / 10) * Math.PI * 0.75 - Math.PI * 0.375
            g.add(at(column(1.1, '#f1ece0', 0.11), side * (2.6 + Math.cos(a) * 2.6), 0.6, 4 + Math.sin(a) * 3.2))
          }
        }
        return g
      },
      () => group(at(box(5, 2.2, 1.4, '#eadfca'), 0, 0.6, -0.8), ...[-2, -1.2, -0.4, 0.4, 1.2, 2].map((x) => at(column(2, '#f4efe3', 0.13), x, 0.6, 0)), at(box(5.2, 0.35, 1.5, '#ddd1b8'), 0, 2.8, -0.75), at(box(5.4, 0.3, 4.2, '#eadfca'), 0, 0.6, -3.2), at(box(5, 2.4, 4, '#e8dcc5'), 0, 0.6, -3.2)),
      () => {
        const d = dome(1.7, '#a8c0c8')
        const g = group(cyl(1.8, 1.8, 1.0, '#ece2cd', 16), at(d, 0, 1.0, 0), at(cyl(0.25, 0.3, 0.7, '#ece2cd', 8), 0, 2.65, 0), at(sphere(0.12, '#e2b33c'), 0, 3.4, 0), at(box(0.04, 0.5, 0.04, '#e2b33c'), 0, 3.4, 0), at(box(0.3, 0.04, 0.04, '#e2b33c'), 0, 3.7, 0))
        const l = glowLight('#fff3d0', 5, 10)
        l.position.y = 5
        return at(group(g, l), 0, 3, -3.4)
      },
    ],
  },
  asis: {
    ground: '#9db07a',
    stages: [
      () => group(at(hill(6, 2.4, '#8c9f6b'), 0, 0, -4), at(hill(3, 1, '#97a873'), 4.5, 0, 1)),
      () => group(scatter(121, 12, 5, 8.4, () => tree('olive', 0.85)), scatter(122, 6, 5.5, 8.4, () => tree('cypress', 1.1))),
      () => onHill(scatter(123, 18, 1.2, 4.6, (R) => house(0.7 + R() * 0.4, 0.7 + R() * 0.4, 0.6 + R() * 0.5, '#e8c8b0', 'gable', '#b05a3a')), 0, -4, 6, 2.4, -1.5),
      () => at(group(house(1.4, 2, 1, '#e6c7ad', 'gable', '#a8553a'), at(box(0.4, 1.6, 0.4, '#e6c7ad'), 0.6, 0, -0.9)), 4.6, 0.7, 3.4, -0.4),
      () => {
        const g = group(box(1.8, 1.4, 3.8, '#efd8c4'), at(box(1.9, 0.1, 3.9, '#c9a88a'), 0, 1.4, 0), at(box(0.8, 3, 0.8, '#efd8c4'), 1.3, 0, -1.4), at(cone(0.6, 0.7, '#b05a3a', 4), 1.3, 3, -1.4), at(box(4, 0.8, 2.6, '#d9c0aa'), 0, -0.8, 0.6))
        const roof = house(1.8, 3.8, 0, '#efd8c4', 'gable', '#b05a3a')
        g.add(at(roof, 0, 1.4, 0))
        const l = glowLight('#fff0d0', 4, 9)
        l.position.y = 3
        return at(group(g, l), -2.8, 2.2, -4.6, 0.3)
      },
    ],
  },
  'nueva-jerusalen': {
    ground: '#b9d7c9',
    stages: [
      () => scatter(131, 12, 4, 8.4, () => {
        const c = sphere(0.7, '#ffffff', mat('#ffffff', { opacity: 0.8 }), 1)
        c.scale.set(1.5, 0.6, 1)
        c.position.y = 0.4
        return c
      }),
      () => {
        const jewels = ['#5ab4c5', '#4b6fd1', '#c94b4b', '#3fae6a', '#b06ad1', '#e0a43a', '#c9c94b', '#3fbcb0', '#d14b8a', '#6a4bd1', '#e06a3a', '#7ad14b']
        return group(...jewels.map((c, i) => at(box(9 - i * 0.12, 0.12, 9 - i * 0.12, c, mat(c, { metal: 0.3, rough: 0.3 })), 0, i * 0.12, 0)))
      },
      () => {
        const g = new THREE.Group()
        const jasper = mat('#9fe0c8', { metal: 0.2, rough: 0.2, opacity: 0.85 })
        for (let s = 0; s < 4; s++) {
          const wall = box(8, 1.6, 0.25, '#9fe0c8', jasper)
          const a = (s * Math.PI) / 2
          wall.position.set(Math.cos(a) * 4, 1.44, Math.sin(a) * 4)
          wall.rotation.y = -a + Math.PI / 2
          g.add(wall)
          for (let k = -1; k <= 1; k++) {
            const pearl = sphere(0.35, '#fffaf0', mat('#fffaf0', { emissive: '#fff2d0', ei: 0.4, rough: 0.15 }), 1)
            const along = k * 2.4
            pearl.position.set(Math.cos(a) * 4.15 - Math.sin(a) * along, 1.9, Math.sin(a) * 4.15 + Math.cos(a) * along)
            g.add(pearl)
          }
        }
        return g
      },
      () => {
        const river = strip(7.4, 0.8, '#7fd3ff')
        river.material = mat('#7fd3ff', { emissive: '#4fb8ff', ei: 0.5, rough: 0.1 })
        return group(at(river, 0, 1.45, 0, Math.PI / 2), at(tree('fruit', 1.1, '#5fd36a'), -1, 1.45, 2.6), at(tree('fruit', 1.1, '#5fd36a'), 1, 1.45, 2.6))
      },
      () => {
        const gold = mat('#f2cf55', { metal: 0.8, rough: 0.2, emissive: '#8a6a10', ei: 0.5, opacity: 0.92 })
        const city = group(at(box(4.2, 4.2, 4.2, '#f2cf55', gold), 0, 0, -0.6))
        for (let i = 0; i < 6; i++) city.add(at(box(0.6, 1.2 + (i % 3) * 0.6, 0.6, '#ffe58a', gold), -1.5 + (i % 3) * 1.5, 4.2, -2 + Math.floor(i / 3) * 2.6))
        const lamb = group(at(sphere(0.25, '#ffffff', undefined, 1), 0, 0.3, 0), at(sphere(0.12, '#ffffff'), 0.28, 0.45, 0))
        const l = glowLight('#fff4c0', 18, 20)
        l.position.y = 7
        return at(group(city, at(lamb, 0, 0, 2.2), l), 0, 1.45, 0)
      },
    ],
  },
}
