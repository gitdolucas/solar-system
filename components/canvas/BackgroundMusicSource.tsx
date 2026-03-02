'use client'

import { useRef, useEffect } from 'react'
import { useSolarStore } from '@/lib/store/useSolarStore'

const BACKGROUND_MUSIC_SRC = '/audio/background-music.mp3'

export function BackgroundMusicSource() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playing = useSolarStore((s) => s.backgroundMusicPlaying)
  const volume = useSolarStore((s) => s.backgroundMusicVolume)

  // Music is now started by the SplashScreen via setBackgroundMusicPlaying(true).
  // No auto-start-on-gesture needed here.

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
