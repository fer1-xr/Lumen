import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useStore, type Highlight, type Note, type Bookmark } from './store'

type Synced = Pick<ReturnType<typeof useStore.getState>, 'highlights' | 'notes' | 'bookmarks' | 'read' | 'settings' | 'gardenSeen' | 'lastPos'>

const snapshot = (): Synced => {
  const s = useStore.getState()
  return { highlights: s.highlights, notes: s.notes, bookmarks: s.bookmarks, read: s.read, settings: s.settings, gardenSeen: s.gardenSeen, lastPos: s.lastPos }
}

/** Une por id, quedándose con la versión más reciente */
function unionById<T extends { id: string; created: number; updated?: number }>(a: T[] = [], b: T[] = []): T[] {
  const m = new Map<string, T>()
  for (const x of [...a, ...b]) {
    const prev = m.get(x.id)
    if (!prev || (x.updated ?? x.created) >= (prev.updated ?? prev.created)) m.set(x.id, x)
  }
  return [...m.values()]
}

function merge(local: Synced, remote: Partial<Synced>): Synced {
  return {
    highlights: unionById<Highlight>(local.highlights, remote.highlights),
    notes: unionById<Note>(local.notes, remote.notes),
    bookmarks: unionById<Bookmark>(local.bookmarks, remote.bookmarks),
    read: { ...local.read, ...remote.read },
    gardenSeen: { ...local.gardenSeen, ...remote.gardenSeen },
    settings: { ...local.settings, ...remote.settings },
    lastPos: remote.lastPos ?? local.lastPos,
  }
}

export type SyncStatus = 'off' | 'cargando' | 'guardando' | 'guardado' | 'error'
let status: SyncStatus = 'off'
const listeners = new Set<() => void>()
const setStatus = (s: SyncStatus) => {
  status = s
  listeners.forEach((l) => l())
}

let session: Session | null = null
let unsub: (() => void) | null = null
let timer: ReturnType<typeof setTimeout> | undefined

async function push() {
  if (!supabase || !session) return
  setStatus('guardando')
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: session.user.id, data: snapshot(), updated_at: new Date().toISOString() })
  setStatus(error ? 'error' : 'guardado')
}

async function start(s: Session) {
  if (!supabase) return
  session = s
  unsub?.()
  setStatus('cargando')
  const { data, error } = await supabase.from('user_data').select('data').eq('user_id', s.user.id).maybeSingle()
  if (error) return setStatus('error')
  if (data?.data) useStore.setState(merge(snapshot(), data.data as Partial<Synced>))
  await push()
  unsub = useStore.subscribe(() => {
    clearTimeout(timer)
    timer = setTimeout(push, 1500)
  })
}

function stop() {
  unsub?.()
  unsub = null
  clearTimeout(timer)
  session = null
  setStatus('off')
}

/** Arranca la sincronización una sola vez para toda la app */
export function initSync() {
  if (!supabase) return
  supabase.auth.getSession().then(({ data }) => data.session && start(data.session))
  supabase.auth.onAuthStateChange((event, s) => {
    if (event === 'SIGNED_IN' && s && s.user.id !== session?.user.id) start(s)
    if (event === 'SIGNED_OUT') stop()
  })
}

export function useAuth() {
  const [, force] = useState(0)
  const [user, setUser] = useState(session?.user ?? null)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    if (!supabase) return () => void listeners.delete(l)
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => {
      listeners.delete(l)
      data.subscription.unsubscribe()
    }
  }, [])
  return { user, status, enabled: !!supabase }
}
