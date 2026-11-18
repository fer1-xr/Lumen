import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/sync'
import { useStore } from '../lib/store'

const STATUS: Record<string, string> = {
  off: '',
  cargando: 'Cargando tus datos…',
  guardando: 'Guardando…',
  guardado: '✓ Todo guardado en la nube',
  error: '⚠️ No se pudo sincronizar. Se reintentará con el próximo cambio.',
}

export function Cuenta() {
  const { user, status, enabled } = useAuth()
  const notes = useStore((s) => s.notes.length)
  const highlights = useStore((s) => s.highlights.length)
  const [mode, setMode] = useState<'entrar' | 'registro'>('entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!enabled || !supabase)
    return (
      <div className="page">
        <h1>Mi cuenta</h1>
        <p>Las cuentas no están configuradas en esta instalación. Tus notas se guardan solo en este dispositivo.</p>
      </div>
    )
  const sb = supabase

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const { data, error } =
      mode === 'registro'
        ? await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } })
        : await sb.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return setMsg(error.message)
    if (mode === 'registro' && !data.session) setMsg('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.')
  }

  if (user)
    return (
      <div className="page">
        <h1>Mi cuenta</h1>
        <p>
          Sesión iniciada como <strong>{user.email}</strong>.
        </p>
        <p>
          Tus {notes} notas, {highlights} resaltados, marcadores y progreso se guardan automáticamente en tu cuenta y estarán
          disponibles en cualquier dispositivo donde inicies sesión.
        </p>
        <p className="muted">{STATUS[status]}</p>
        <button className="btn" onClick={() => sb.auth.signOut()}>
          Cerrar sesión
        </button>
      </div>
    )

  return (
    <div className="page">
      <h1>{mode === 'entrar' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      <p className="muted">Guarda tus notas, resaltados y progreso en la nube. Lo que ya tengas en este dispositivo se conservará.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <input className="input" type="email" required placeholder="Correo electrónico" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="input"
          type="password"
          required
          minLength={6}
          placeholder="Contraseña (mín. 6 caracteres)"
          autoComplete={mode === 'registro' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn primary" disabled={busy}>
          {busy ? '…' : mode === 'entrar' ? 'Entrar' : 'Crear cuenta'}
        </button>
        {msg && <p>{msg}</p>}
      </form>
      <p>
        {mode === 'entrar' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button className="link-btn" onClick={() => setMode(mode === 'entrar' ? 'registro' : 'entrar')}>
          {mode === 'entrar' ? 'Crear una' : 'Iniciar sesión'}
        </button>
      </p>
    </div>
  )
}
