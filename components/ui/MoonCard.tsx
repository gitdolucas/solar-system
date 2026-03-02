import type { MoonData } from '@/lib/types'

interface StatRowProps {
  label: string
  value: string
  icon: string
}

function StatRow({ label, value, icon }: StatRowProps) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#8fa3b8', fontFamily: 'var(--font-ubuntu)', fontWeight: 500 }}>
          {label}
        </p>
        <p className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-ubuntu)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

interface MoonCardProps {
  moon: MoonData
}

export function MoonCard({ moon }: MoonCardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: moon.cor }} />
          <p className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8fa3b8', fontFamily: 'var(--font-ubuntu)' }}>
            {moon.apelido}
          </p>
        </div>
        <h1
          className="text-4xl leading-tight"
          style={{ fontFamily: 'var(--font-pacifico)', color: moon.cor }}
        >
          {moon.nome}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        <StatRow icon="🌡️" label="Temperatura" value={moon.temperatura} />
      </div>

      <div>
        <h2
          className="text-base uppercase tracking-wider mb-3"
          style={{ color: '#8fa3b8', fontFamily: 'var(--font-ubuntu)', fontWeight: 500 }}
        >
          Curiosidades
        </h2>
        <div className="flex flex-col gap-2">
          {moon.curiosidades.map((c, i) => (
            <div
              key={i}
              className="flex gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: moon.cor + '33', color: moon.cor, fontFamily: 'var(--font-ubuntu)' }}
              >
                {i + 1}
              </span>
              <p className="text-base leading-relaxed text-white" style={{ fontFamily: 'var(--font-ubuntu)' }}>
                {c.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
