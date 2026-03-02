'use client'

import { PLANETS } from '@/lib/data/planets'
import { useSolarStore } from '@/lib/store/useSolarStore'

export function SystemInfo() {
  const selectBody = useSolarStore((s) => s.selectBody)
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-4xl leading-tight mb-3"
          style={{ fontFamily: 'var(--font-pacifico)', color: '#f5a623' }}
        >
          Sistema Solar
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: '#8fa3b8', fontFamily: 'var(--font-ubuntu)' }}>
          Nosso lar no universo! O Sistema Solar é formado pelo Sol e tudo que orbita ao redor dele.
          Clique em um planeta para explorar!
        </p>
      </div>

      <div>
        <h2
          className="text-xl mb-4"
          style={{ fontFamily: 'var(--font-ubuntu)', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}
        >
          Planetas
        </h2>
        <div className="flex flex-col gap-2">
          {PLANETS.map((planet) => (
            <button
              key={planet.id}
              onClick={() => selectBody('planet', planet.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left w-full cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${planet.cor}18`
                e.currentTarget.style.border = `1px solid ${planet.cor}50`
                setHoveredBody({ type: 'planet', id: planet.id })
                setTooltipBody({ type: 'planet', id: planet.id })
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                setHoveredBody(null)
                setTooltipBody(null)
              }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: planet.cor }}
              />
              <span className="text-base font-medium" style={{ fontFamily: 'var(--font-ubuntu)' }}>
                {planet.nome}
              </span>
              <span className="ml-auto text-sm" style={{ color: '#8fa3b8', fontFamily: 'var(--font-ubuntu)' }}>
                {planet.apelido}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#8fa3b8', flexShrink: 0 }}>
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(245, 166, 35, 0.08)', border: '1px solid rgba(245, 166, 35, 0.2)' }}
      >
        <p className="text-base leading-relaxed" style={{ color: '#f5c842', fontFamily: 'var(--font-ubuntu)' }}>
          ✨ Dica: use o mouse para girar e o scroll para aproximar ou afastar a câmera!
        </p>
      </div>
    </div>
  )
}
