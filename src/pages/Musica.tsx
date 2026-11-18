import { useState } from 'react'
import { PISTAS, type Pista } from '../data/musica'
import { useMedia } from '../lib/media'

const STYLES = ['Todas', 'Favoritas', 'Orquestal', 'Coral', 'Gregoriano', 'Solista', 'Mis canciones'] as const

export function Musica() {
  const { myTracks, favTracks, queue, index, playing, playQueue, setPlaying, toggleFav, addTrack, removeTrack } = useMedia()
  const [style, setStyle] = useState<(typeof STYLES)[number]>('Todas')
  const [form, setForm] = useState({ title: '', composer: '', url: '' })
  const all = [...PISTAS, ...myTracks]
  const list = all.filter((t) =>
    style === 'Todas' ? true : style === 'Favoritas' ? favTracks.includes(t.id) : style === 'Mis canciones' ? t.custom : t.style === style,
  )
  const current = queue[index]
  const play = (i: number) => {
    if (current?.id === list[i].id) setPlaying(!playing)
    else playQueue(list, i)
  }
  const okUrl = /^https?:\/\/.+\.(mp3|ogg|m4a|wav|opus)(\?.*)?$/i.test(form.url)
  return (
    <div className="page">
      <header className="page-head">
        <h1>Música sacra</h1>
        <p className="subtitle">Agnus Dei, Requiem, Miserere… una playlist orquestal y coral para orar. Sigue sonando mientras navegas.</p>
      </header>
      <div className="music-hero">
        <div className="music-cover">✠<span>Agnus Dei</span></div>
        <div>
          <div className="kicker">Playlist</div>
          <div className="title">Lumen · Sacra orquestal</div>
          <div className="muted">{list.length} pistas</div>
          <button className="btn primary big" onClick={() => list.length && playQueue(list, 0)}>▶ Reproducir todo</button>
        </div>
      </div>
      <div className="seg wrap-seg">
        {STYLES.map((s) => (
          <button key={s} className={style === s ? 'on' : ''} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>
      <ol className="tracklist">
        {list.map((t: Pista, i) => {
          const on = current?.id === t.id
          return (
            <li key={t.id} className={on ? 'on' : ''}>
              <button className="track-play" onClick={() => play(i)}>{on && playing ? '⏸' : '▶'}</button>
              <div className="track-main" onClick={() => play(i)}>
                <div className="track-title">{t.title}</div>
                <div className="track-sub">{t.composer}{t.performer ? ' · ' + t.performer : ''} · <em>{t.style}</em></div>
                <div className="track-note">{t.note}</div>
              </div>
              <button className="icon-btn" onClick={() => toggleFav(t.id)} title="Favorita">{favTracks.includes(t.id) ? '❤️' : '🤍'}</button>
              {t.custom && <button className="icon-btn" onClick={() => removeTrack(t.id)} title="Quitar">🗑</button>}
            </li>
          )
        })}
      </ol>
      {!list.length && <p className="muted">Nada aquí todavía.</p>}
      <details className="card add-form">
        <summary>＋ Añadir una canción (enlace a archivo de audio)</summary>
        <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Compositor / intérprete" value={form.composer} onChange={(e) => setForm({ ...form, composer: e.target.value })} />
        <input className="input" placeholder="https://…/cancion.mp3" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <button
          className="btn primary"
          disabled={!form.title || !okUrl}
          onClick={() => {
            addTrack({ id: 'u' + Date.now().toString(36), title: form.title, composer: form.composer || '—', style: 'Solista', note: 'Añadida por mí.', src: form.url, custom: true })
            setForm({ title: '', composer: '', url: '' })
          }}
        >
          Guardar
        </button>
      </details>
      <p className="hint">Grabaciones alojadas en Internet Archive (archive.org).</p>
    </div>
  )
}
