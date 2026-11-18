import { create } from 'zustand'

export type Drawer =
  | { type: 'notes'; ref: string; label: string }
  | { type: 'straub'; label: string; notes: string[] }
  | null

export interface EditorState {
  noteId?: string
  ref: string
  start?: number
  end?: number
  quote?: string
  label: string
  text: string
}

interface UI {
  drawer: Drawer
  editor: EditorState | null
  toast: string | null
  openDrawer: (d: Drawer) => void
  openEditor: (e: EditorState | null) => void
  showToast: (t: string) => void
}

let toastTimer: number | undefined

export const useUI = create<UI>((set) => ({
  drawer: null,
  editor: null,
  toast: null,
  openDrawer: (drawer) => set({ drawer }),
  openEditor: (editor) => set({ editor }),
  showToast: (toast) => {
    set({ toast })
    clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), 2200)
  },
}))
