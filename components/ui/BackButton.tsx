'use client'

import { useSolarStore } from '@/lib/store/useSolarStore'

export function BackButton() {
  const clearSelection = useSolarStore((s) => s.clearSelection)

  return (
    <button
      onClick={clearSelection}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px 5px 8px',
        background: 'rgba(100,180,255,0.07)',
        border: '1px solid rgba(100,180,255,0.2)',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'rgba(140,200,255,0.8)',
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        transition: 'all 0.15s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(100,180,255,0.14)'
        e.currentTarget.style.borderColor = 'rgba(100,180,255,0.4)'
        e.currentTarget.style.color = 'rgba(160,220,255,1)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(100,180,255,0.07)'
        e.currentTarget.style.borderColor = 'rgba(100,180,255,0.2)'
        e.currentTarget.style.color = 'rgba(140,200,255,0.8)'
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M7 2L3 5L7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Voltar
    </button>
  )
}
