'use client'

import { useRef, useEffect } from 'react'
import { useSolarStore } from '@/lib/store/useSolarStore'

const BACKGROUND_MUSIC_SRC = '/audio/background-music.mp3'

export function BackgroundMusicSource() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playing = useSolarStore((s) => s.backgroundMusicPlaying)
  const volume = useSolarStore((s) => s.backgroundMusicVolume)
  const setBackgroundMusicPlaying = useSolarStore((s) => s.setBackgroundMusicPlaying)

  useEffect(() => {
    const startOnGesture = () => {
      const el = audioRef.current
      if (el) {
        el.play().catch(() => {})
        setBackgroundMusicPlaying(true)
      }
      document.removeEventListener('click', startOnGesture)
      document.removeEventListener('keydown', startOnGesture)
      document.removeEventListener('touchstart', startOnGesture)
    }
    document.addEventListener('click', startOnGesture)
    document.addEventListener('keydown', startOnGesture)
    document.addEventListener('touchstart', startOnGesture)
    return () => {
      document.removeEventListener('click', startOnGesture)
      document.removeEventListener('keydown', startOnGesture)
      document.removeEventListener('touchstart', startOnGesture)
    }
  }, [setBackgroundMusicPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [playing])

  return <audio ref={audioRef} src={BACKGROUND_MUSIC_SRC} preload="metadata" loop />
}
