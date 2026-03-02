'use client'

import { useSolarStore } from '@/lib/store/useSolarStore'

export function BackButton() {
  const clearSelection = useSolarStore((s) => s.clearSelection)

  return (
    <button
      onClick={clearSelection}
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-white font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        fontFamily: 'var(--font-ubuntu)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M12 4L6 10L12 16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Voltar
    </button>
  )
}
