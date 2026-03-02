'use client'

import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
}

export function AudioPlayer({ src, title = 'Trilha Sonora' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.6)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const val = Number(e.target.value)
    audio.currentTime = (val / 100) * audio.duration
    setProgress(val)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(480px, calc(100% - 48px))',
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top row: icon + title + volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Play button */}
          <button
            onClick={togglePlay}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#f5a623',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5c842' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f5a623' }}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <rect x="2" y="1" width="4" height="12" rx="1"/>
                <rect x="8" y="1" width="4" height="12" rx="1"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M3 1.5l9 5.5-9 5.5V1.5z"/>
              </svg>
            )}
          </button>

          {/* Title + times */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-ubuntu)',
              fontWeight: 500,
              fontSize: 13,
              color: '#ffffff',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {title}
            </p>
            <p style={{
              fontFamily: 'var(--font-ubuntu)',
              fontSize: 11,
              color: '#8fa3b8',
              margin: 0,
            }}>
              {fmt(currentTime)} / {fmt(duration)}
            </p>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#8fa3b8' }}>
              <path d="M2 5h2l3-3v10L4 9H2V5z" fill="currentColor"/>
              {volume > 0 && <path d="M9 4a3 3 0 010 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>}
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              style={{ width: 60, accentColor: '#f5a623', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          style={{
            width: '100%',
            accentColor: '#f5a623',
            cursor: 'pointer',
            height: 4,
          }}
        />
      </div>
    </>
  )
}
