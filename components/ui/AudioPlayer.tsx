'use client'

import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
  /** When true, render in flow (e.g. inside sidebar) instead of floating over the canvas */
  embedded?: boolean
  /** When true (e.g. mobile sidebar), use compact padding and font sizes */
  dense?: boolean
}

export function AudioPlayer({ src, title = 'Trilha Sonora', embedded = false, dense = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.6)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const onTimeUpdate = () => {
      if (isDragging) return
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
  }, [volume, isDragging])

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

  const seekToFraction = (fraction: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const clamped = Math.max(0, Math.min(1, fraction))
    audio.currentTime = clamped * audio.duration
    setProgress(clamped * 100)
    setCurrentTime(clamped * audio.duration)
  }

  const getClickFraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return (e.clientX - rect.left) / rect.width
  }

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    seekToFraction(getClickFraction(e))
  }

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    seekToFraction(getClickFraction(e))
  }

  const handleProgressMouseUp = () => setIsDragging(false)

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

  // Waveform bar heights — static decorative pattern
  const barHeights = [3, 6, 9, 12, 8, 14, 10, 6, 11, 14, 9, 7, 12, 8, 4, 10, 13, 7, 5, 9, 12, 6, 14, 10, 8]

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div
        style={{
          ...(embedded
            ? { position: 'relative' as const, width: '100%', marginTop: dense ? 6 : 12 }
            : {
                position: 'absolute' as const,
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(500px, calc(100% - 48px))',
                zIndex: 10,
              }),
          background: 'linear-gradient(135deg, rgba(2,6,18,0.96) 0%, rgba(4,10,28,0.96) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(100,180,255,0.15)',
          borderRadius: dense ? '6px' : '8px',
          padding: '0',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(100,180,255,0.05) inset',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line — hide when dense */}
        {!dense && (
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(100,180,255,0.4) 30%, rgba(100,180,255,0.4) 70%, transparent 100%)',
            }}
          />
        )}

        {/* Corner brackets — hide when dense to save space */}
        {!dense && (
          <>
            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '10px', height: '10px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '6px', borderTop: '1px solid rgba(100,200,255,0.4)', borderLeft: '1px solid rgba(100,200,255,0.4)' }} />
            </div>
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderTop: '1px solid rgba(100,200,255,0.4)', borderRight: '1px solid rgba(100,200,255,0.4)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '10px', height: '10px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '6px', height: '6px', borderBottom: '1px solid rgba(100,200,255,0.4)', borderLeft: '1px solid rgba(100,200,255,0.4)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '10px', height: '10px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '6px', height: '6px', borderBottom: '1px solid rgba(100,200,255,0.4)', borderRight: '1px solid rgba(100,200,255,0.4)' }} />
            </div>
          </>
        )}

        <div style={{ padding: dense ? '6px 8px' : '16px 20px 18px' }}>
          {dense ? (
            /* Minimal dense: single row — play | time | progress | volume */
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 36 }}>
              <button
                onClick={togglePlay}
                title={title}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: isPlaying ? 'rgba(100,180,255,0.12)' : 'rgba(245,166,35,0.15)',
                  border: isPlaying ? '1px solid rgba(100,180,255,0.3)' : '1px solid rgba(245,166,35,0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {isPlaying ? (
                  <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                    <rect x="2.5" y="2" width="3.5" height="10" rx="1" fill="rgba(100,180,255,0.9)" />
                    <rect x="8" y="2" width="3.5" height="10" rx="1" fill="rgba(100,180,255,0.9)" />
                  </svg>
                ) : (
                  <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 2l8 5-8 5V2z" fill="rgba(245,166,35,0.95)" />
                  </svg>
                )}
              </button>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 9,
                  color: 'rgba(100,180,255,0.6)',
                  flexShrink: 0,
                  width: 32,
                }}
                title={`${title} · ${fmt(currentTime)} / ${fmt(duration)}`}
              >
                {fmt(currentTime)}/{fmt(duration)}
              </span>
              <div
                ref={progressRef}
                onMouseDown={handleProgressMouseDown}
                onMouseMove={handleProgressMouseMove}
                onMouseUp={handleProgressMouseUp}
                onMouseLeave={handleProgressMouseUp}
                onTouchStart={(e) => {
                  setIsDragging(true)
                  const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                  seekToFraction((e.touches[0].clientX - r.left) / r.width)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  const el = progressRef.current
                  if (!el) return
                  const r = el.getBoundingClientRect()
                  seekToFraction((e.touches[0].clientX - r.left) / r.width)
                }}
                onTouchEnd={() => setIsDragging(false)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 6,
                  background: 'rgba(100,180,255,0.1)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, rgba(100,180,255,0.6) 0%, rgba(140,210,255,0.9) 100%)',
                    borderRadius: 3,
                    transition: isDragging ? 'none' : 'width 0.1s linear',
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                title="Volume"
                style={{
                  width: 28,
                  cursor: 'pointer',
                  accentColor: 'rgba(100,180,255,0.8)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  height: 3,
                  background: `linear-gradient(90deg, rgba(100,180,255,0.7) 0%, rgba(100,180,255,0.7) ${volume * 100}%, rgba(100,180,255,0.12) ${volume * 100}%, rgba(100,180,255,0.12) 100%)`,
                  borderRadius: 2,
                  outline: 'none',
                  border: 'none',
                  flexShrink: 0,
                }}
              />
            </div>
          ) : (
            /* Default: label row + main controls + waveform */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '12px', height: '1px', background: 'rgba(100,180,255,0.4)' }} />
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: 'rgba(100,180,255,0.45)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>
                  TRANSMISSÃO DE ÁUDIO
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: isPlaying ? '#4ade80' : 'rgba(100,180,255,0.3)',
                    boxShadow: isPlaying ? '0 0 6px #4ade80' : 'none',
                    transition: 'all 0.3s ease',
                  }} />
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    color: isPlaying ? '#4ade80' : 'rgba(100,180,255,0.3)',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                  }}>
                    {isPlaying ? 'AO VIVO' : 'PARADO'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={togglePlay}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '6px',
                    background: isPlaying ? 'rgba(100,180,255,0.12)' : 'rgba(245,166,35,0.15)',
                    border: isPlaying ? '1px solid rgba(100,180,255,0.3)' : '1px solid rgba(245,166,35,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isPlaying ? 'rgba(100,180,255,0.2)' : 'rgba(245,166,35,0.25)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isPlaying ? 'rgba(100,180,255,0.12)' : 'rgba(245,166,35,0.15)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {isPlaying ? (
                    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                      <rect x="2.5" y="2" width="3.5" height="10" rx="1" fill="rgba(100,180,255,0.9)" />
                      <rect x="8" y="2" width="3.5" height="10" rx="1" fill="rgba(100,180,255,0.9)" />
                    </svg>
                  ) : (
                    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                      <path d="M3.5 2l8 5-8 5V2z" fill="rgba(245,166,35,0.95)" />
                    </svg>
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{
                      fontFamily: 'var(--font-ubuntu)',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#ddeeff',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      minWidth: 0,
                    }}>
                      {title}
                    </p>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      color: 'rgba(100,180,255,0.5)',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}>
                      {fmt(currentTime)}&nbsp;/&nbsp;{fmt(duration)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px', marginBottom: '8px' }}>
                    {barHeights.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: '2px',
                          height: `${h}px`,
                          borderRadius: '1px',
                          background: isPlaying ? `rgba(100,180,255,${0.3 + (h / 14) * 0.55})` : `rgba(100,180,255,${0.1 + (h / 14) * 0.15})`,
                          transition: 'all 0.3s ease',
                          animation: isPlaying ? `wave-bar-${(i % 4) + 1} ${0.6 + (i % 3) * 0.2}s ease-in-out infinite alternate` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    ref={progressRef}
                    onMouseDown={handleProgressMouseDown}
                    onMouseMove={handleProgressMouseMove}
                    onMouseUp={handleProgressMouseUp}
                    onMouseLeave={handleProgressMouseUp}
                    style={{
                      height: '4px',
                      background: 'rgba(100,180,255,0.1)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, rgba(100,180,255,0.6) 0%, rgba(140,210,255,0.9) 100%)',
                        borderRadius: '2px',
                        transition: isDragging ? 'none' : 'width 0.1s linear',
                        boxShadow: '0 0 8px rgba(100,180,255,0.4)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <svg width={13} height={13} viewBox="0 0 13 13" fill="none" style={{ color: volume > 0 ? 'rgba(100,180,255,0.6)' : 'rgba(100,180,255,0.25)' }}>
                    <path d="M2 4.5h1.5l2.5-2.5v9L3.5 8.5H2V4.5z" fill="currentColor" />
                    {volume > 0.3 && <path d="M8 3.5a3.5 3.5 0 010 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />}
                    {volume <= 0.3 && volume > 0 && <path d="M8 5a1.5 1.5 0 010 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />}
                  </svg>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolume}
                    style={{
                      width: '52px',
                      cursor: 'pointer',
                      accentColor: 'rgba(100,180,255,0.8)',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      height: '3px',
                      background: `linear-gradient(90deg, rgba(100,180,255,0.7) 0%, rgba(100,180,255,0.7) ${volume * 100}%, rgba(100,180,255,0.12) ${volume * 100}%, rgba(100,180,255,0.12) 100%)`,
                      borderRadius: '2px',
                      outline: 'none',
                      border: 'none',
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom accent line — hide when dense */}
        {!dense && (
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(100,180,255,0.15) 50%, transparent 100%)',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes wave-bar-1 {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.2); }
        }
        @keyframes wave-bar-2 {
          from { transform: scaleY(0.7); }
          to   { transform: scaleY(1.4); }
        }
        @keyframes wave-bar-3 {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.1); }
        }
        @keyframes wave-bar-4 {
          from { transform: scaleY(0.6); }
          to   { transform: scaleY(1.3); }
        }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(100,180,255,0.9);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(100,180,255,0.6);
          border: none;
        }
        input[type=range]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(100,180,255,0.9);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(100,180,255,0.6);
          border: none;
        }
      `}</style>
    </>
  )
}
