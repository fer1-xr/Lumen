import { useEffect, useRef, useState } from 'react'
import { useMedia } from '../lib/media'

const fmt = (t: number) => (isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '–:––')

/** Reproductor fijo: la música sigue sonando mientras se navega por Lumen */
export function Player() {
  const { queue, index, playing, shuffle, setIndex, setPlaying, stop, toggleShuffle } = useMedia()
  const ref = useRef<HTMLAudioElement>(null)
  const [t, setT] = useState(0)
  const [d, setD] = useState(0)
  const [err, setErr] = useState(false)
  const track = queue[index]

  useEffect(() => {
    const a = ref.current
    if (!a || !track) return
    setErr(false)
    if (playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [track, playing, setPlaying])

  if (!track) return null
  const next = (dir = 1) => {
    if (shuffle && queue.length > 1) {
      let i = index
      while (i === index) i = Math.floor(Math.random() * queue.length)
      setIndex(i)
    } else setIndex((index + dir + queue.length) % queue.length)
    setPlaying(true)
  }
  return (
    <div className="player">
      <audio
        ref={ref}
        src={track.src}
        preload="metadata"
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
        onEnded={() => next()}
        onError={() => setErr(true)}
      />
      <div className="player-info">
        <span className="player-disc">{playing ? '🎶' : '🎵'}</span>
        <div>
          <div className="player-title">{track.title}</div>
          <div className="player-sub">{err ? 'No se pudo cargar esta pista' : track.composer}</div>
        </div>
      </div>
      <div className="player-ctl">
        <button className={'icon-btn' + (shuffle ? ' on' : '')} onClick={toggleShuffle} title="Aleatorio">🔀</button>
        <button className="icon-btn" onClick={() => next(-1)} title="Anterior">⏮</button>
        <button className="icon-btn play" onClick={() => setPlaying(!playing)} title={playing ? 'Pausa' : 'Reproducir'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="icon-btn" onClick={() => next(1)} title="Siguiente">⏭</button>
        <button className="icon-btn" onClick={stop} title="Cerrar">✕</button>
      </div>
      <div className="player-seek">
        <span>{fmt(t)}</span>
        <input
          type="range"
          min={0}
          max={d || 0}
          step={1}
          value={t}
          onChange={(e) => {
            if (ref.current) ref.current.currentTime = +e.target.value
          }}
        />
        <span>{fmt(d)}</span>
      </div>
    </div>
  )
}
