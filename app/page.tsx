import { SimulationUI } from '@/components/ui/SimulationUI'
import { SceneClient } from '@/components/canvas/SceneClient'

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <SimulationUI />
      <main
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <SceneClient />
      </main>
    </div>
  )
}
