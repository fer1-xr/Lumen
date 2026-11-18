import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Pelicula } from '../data/peliculas'
import type { Pista } from '../data/musica'

/** Biblioteca personal (películas y canciones añadidas por el usuario) + estado del reproductor */
interface Media {
  myFilms: Pelicula[]
  myTracks: Pista[]
  favTracks: string[]
  queue: Pista[]
  index: number
  playing: boolean
  shuffle: boolean
  saintVideos: Record<string, string[]>
  addSaintVideo: (saint: string, url: string) => void
  removeSaintVideo: (saint: string, url: string) => void
  addFilm: (p: Pelicula) => void
  removeFilm: (id: string) => void
  addTrack: (t: Pista) => void
  removeTrack: (id: string) => void
  toggleFav: (id: string) => void
  playQueue: (q: Pista[], i: number) => void
  setIndex: (i: number) => void
  setPlaying: (p: boolean) => void
  toggleShuffle: () => void
  stop: () => void
}

export const useMedia = create<Media>()(
  persist(
    (set) => ({
      myFilms: [],
      myTracks: [],
      favTracks: [],
      queue: [],
      index: 0,
      playing: false,
      shuffle: false,
      saintVideos: {},
      addSaintVideo: (k, url) => set((s) => ({ saintVideos: { ...s.saintVideos, [k]: [...(s.saintVideos[k] || []), url] } })),
      removeSaintVideo: (k, url) => set((s) => ({ saintVideos: { ...s.saintVideos, [k]: (s.saintVideos[k] || []).filter((u) => u !== url) } })),
      addFilm: (p) => set((s) => ({ myFilms: [...s.myFilms, p] })),
      removeFilm: (id) => set((s) => ({ myFilms: s.myFilms.filter((f) => f.id !== id) })),
      addTrack: (t) => set((s) => ({ myTracks: [...s.myTracks, t] })),
      removeTrack: (id) => set((s) => ({ myTracks: s.myTracks.filter((f) => f.id !== id) })),
      toggleFav: (id) => set((s) => ({ favTracks: s.favTracks.includes(id) ? s.favTracks.filter((x) => x !== id) : [...s.favTracks, id] })),
      playQueue: (queue, index) => set({ queue, index, playing: true }),
      setIndex: (index) => set({ index }),
      setPlaying: (playing) => set({ playing }),
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      stop: () => set({ queue: [], playing: false }),
    }),
    {
      name: 'lumen-media',
      partialize: (s) => ({ myFilms: s.myFilms, myTracks: s.myTracks, favTracks: s.favTracks, shuffle: s.shuffle, saintVideos: s.saintVideos }),
    },
  ),
)
