import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { useUI } from '../lib/ui'
import { refLink } from '../lib/refs'

export function Overlays() {
  return (
    <>
      <NoteEditor />
      <Drawer />
      <Toast />
    </>
  )
}

function Toast() {
  const t = useUI((s) => s.toast)
  return t ? <div className="toast">{t}</div> : null
}

function NoteEditor() {
  const ed = useUI((s) => s.editor)
  const close = useUI((s) => s.openEditor)
  const addNote = useStore((s) => s.addNote)
  const updateNote = useStore((s) => s.updateNote)
  const toast = useUI((s) => s.showToast)
  const [text, setText] = useState('')
  useEffect(() => setText(ed?.text || ''), [ed])
  if (!ed) return null
  const save = () => {
    if (!text.trim()) return close(null)
    if (ed.noteId) updateNote(ed.noteId, text.trim())
    else addNote({ ref: ed.ref, start: ed.start, end: ed.end, quote: ed.quote, text: text.trim() })
    toast('Comentario guardado en «Resaltados y notas»')
    close(null)
  }
  return (
    <div className="modal-bg" onClick={() => close(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>💬 Comentario · {ed.label}</h3>
        {ed.quote && <blockquote className="quote">{ed.quote}</blockquote>}
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu reflexión, una pregunta, una aplicación para tu vida… Usa #etiquetas para organizar."
          rows={7}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save()
          }}
        />
        <div className="modal-actions">
          <button className="btn ghost" onClick={() => close(null)}>
            Cancelar
          </button>
          <button className="btn primary" onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

function Drawer() {
  const d = useUI((s) => s.drawer)
  const open = useUI((s) => s.openDrawer)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && open(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  if (!d) return null
  return (
    <div className="drawer-bg" onClick={() => open(null)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={() => open(null)}>
          ✕
        </button>
        {d.type === 'straub' && (
          <>
            <h3>📜 Comentario de Mons. Straubinger</h3>
            <div className="drawer-sub">{d.label}</div>
            {d.notes.map((n, i) => (
              <p key={i} className="straub-note" dangerouslySetInnerHTML={{ __html: n }} />
            ))}
          </>
        )}
        {d.type === 'notes' && <NotesList refId={d.ref} label={d.label} />}
      </aside>
    </div>
  )
}

function NotesList({ refId, label }: { refId: string; label: string }) {
  const notes = useStore((s) => s.notes)
  const del = useStore((s) => s.deleteNote)
  const openEditor = useUI((s) => s.openEditor)
  const list = useMemo(() => notes.filter((n) => n.ref === refId).sort((a, b) => b.created - a.created), [notes, refId])
  return (
    <>
      <h3>💬 Mis comentarios</h3>
      <div className="drawer-sub">
        {label} · <Link to={refLink(refId)}>ir al texto</Link>
      </div>
      {list.map((n) => (
        <div key={n.id} className="note-card">
          {n.quote && <blockquote className="quote">{n.quote}</blockquote>}
          <p className="note-text">{n.text}</p>
          <div className="note-meta">
            {new Date(n.updated).toLocaleString('es')}
            <span>
              <button className="link" onClick={() => openEditor({ noteId: n.id, ref: n.ref, label, text: n.text, quote: n.quote })}>
                Editar
              </button>
              <button className="link danger" onClick={() => confirm('¿Eliminar este comentario?') && del(n.id)}>
                Eliminar
              </button>
            </span>
          </div>
        </div>
      ))}
      <button className="btn" onClick={() => openEditor({ ref: refId, label, text: '' })}>
        + Nuevo comentario
      </button>
    </>
  )
}
