import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEGACY } from './vaticano'

/** Traslada las referencias de la antigua lista de encíclicas a los nuevos identificadores */
const remap = (ref: string) => ref.replace(/^enc:([\w-]+)/, (m, id: string) => (LEGACY[id] ? 'enc:' + LEGACY[id] : m))
function migrateEnc<T extends { read?: Record<string, number>; highlights?: { ref: string }[]; notes?: { ref: string }[]; bookmarks?: { ref: string }[] }>(p: T): T {
  if (p.read) p.read = Object.fromEntries(Object.entries(p.read).map(([k, v]) => [remap(k), v]))
  for (const list of [p.highlights, p.notes, p.bookmarks]) list?.forEach((x) => (x.ref = remap(x.ref)))
  return p
}

export type ColorId = 'amarillo' | 'verde' | 'azul' | 'rosa' | 'naranja' | 'morado'

export const COLORS: { id: ColorId; hex: string; label: string }[] = [
  { id: 'amarillo', hex: '#ffe066', label: 'Amarillo' },
  { id: 'verde', hex: '#a9e5a0', label: 'Verde' },
  { id: 'azul', hex: '#9fd3ff', label: 'Azul' },
  { id: 'rosa', hex: '#ffb3c7', label: 'Rosa' },
  { id: 'naranja', hex: '#ffc58a', label: 'Naranja' },
  { id: 'morado', hex: '#d3b8ff', label: 'Morado' },
]

export interface Highlight {
  id: string
  ref: string // p.ej. "b:gn.1.3", "cic:p1s1c1:2"
  start: number
  end: number
  color: ColorId
  created: number
}

export interface Note {
  id: string
  ref: string
  start?: number
  end?: number
  quote?: string
  text: string
  created: number
  updated: number
}

export interface Bookmark {
  id: string
  ref: string
  label: string
  created: number
}

export type Theme = 'claro' | 'sepia' | 'oscuro'

export interface Settings {
  theme: Theme
  fontSize: number
  showNotes: boolean
  showHeadings: boolean
  colorLabels: Record<ColorId, string>
  activePlan?: string
  planStart?: number
}

interface State {
  highlights: Highlight[]
  notes: Note[]
  bookmarks: Bookmark[]
  read: Record<string, number> // "b:gn.1", "cic:p1s1c1", "enc:rerum-novarum", "san:francisco-de-asis"
  lastPos?: { book: string; chapter: number }
  settings: Settings
  gardenSeen: Record<string, number> // ciudad -> último nivel visto (para animaciones)
  applyHighlight: (ref: string, start: number, end: number, color: ColorId | null) => void
  addNote: (n: Omit<Note, 'id' | 'created' | 'updated'>) => string
  updateNote: (id: string, text: string) => void
  deleteNote: (id: string) => void
  toggleBookmark: (ref: string, label: string) => void
  setRead: (key: string, value: boolean) => void
  setLastPos: (book: string, chapter: number) => void
  setSettings: (s: Partial<Settings>) => void
  setGardenSeen: (city: string, level: number) => void
  importData: (data: Partial<State>) => void
  reset: () => void
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

const defaultSettings: Settings = {
  theme: 'claro',
  fontSize: 19,
  showNotes: true,
  showHeadings: true,
  colorLabels: {
    amarillo: 'Promesas de Dios',
    verde: 'Vida espiritual',
    azul: 'Doctrina',
    rosa: 'Amor de Dios',
    naranja: 'Mandatos / exhortaciones',
    morado: 'Profecías y Cristo',
  },
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      highlights: [],
      notes: [],
      bookmarks: [],
      read: {},
      settings: defaultSettings,
      gardenSeen: {},
      applyHighlight: (ref, start, end, color) =>
        set((s) => {
          if (end <= start) return s
          const out: Highlight[] = []
          for (const h of s.highlights) {
            if (h.ref !== ref || h.end <= start || h.start >= end) {
              out.push(h)
              continue
            }
            if (h.start < start) out.push({ ...h, id: uid(), end: start })
            if (h.end > end) out.push({ ...h, id: uid(), start: end })
          }
          if (color) out.push({ id: uid(), ref, start, end, color, created: Date.now() })
          return { highlights: out }
        }),
      addNote: (n) => {
        const id = uid()
        set((s) => ({ notes: [...s.notes, { ...n, id, created: Date.now(), updated: Date.now() }] }))
        return id
      },
      updateNote: (id, text) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, text, updated: Date.now() } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      toggleBookmark: (ref, label) =>
        set((s) =>
          s.bookmarks.some((b) => b.ref === ref)
            ? { bookmarks: s.bookmarks.filter((b) => b.ref !== ref) }
            : { bookmarks: [...s.bookmarks, { id: uid(), ref, label, created: Date.now() }] },
        ),
      setRead: (key, value) =>
        set((s) => {
          const read = { ...s.read }
          if (value) read[key] = Date.now()
          else delete read[key]
          return { read }
        }),
      setLastPos: (book, chapter) => set({ lastPos: { book, chapter } }),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setGardenSeen: (city, level) => set((s) => ({ gardenSeen: { ...s.gardenSeen, [city]: level } })),
      importData: (d) =>
        set((s) => ({
          highlights: d.highlights ?? s.highlights,
          notes: d.notes ?? s.notes,
          bookmarks: d.bookmarks ?? s.bookmarks,
          read: d.read ?? s.read,
          settings: d.settings ? { ...defaultSettings, ...d.settings } : s.settings,
        })),
      reset: () => set({ highlights: [], notes: [], bookmarks: [], read: {}, gardenSeen: {}, settings: defaultSettings }),
    }),
    {
      name: 'lumen-estudio-v1',
      partialize: (s) => ({
        highlights: s.highlights,
        notes: s.notes,
        bookmarks: s.bookmarks,
        read: s.read,
        lastPos: s.lastPos,
        settings: s.settings,
        gardenSeen: s.gardenSeen,
      }),
      merge: (p, c) => {
        const persisted = migrateEnc((p || {}) as Partial<State>)
        return { ...c, ...persisted, settings: { ...defaultSettings, ...(persisted.settings || {}) } }
      },
    },
  ),
)
