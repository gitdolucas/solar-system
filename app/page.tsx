import { Sidebar } from '@/components/ui/Sidebar'
import { SubjectAudioPlayer } from '@/components/ui/SubjectAudioPlayer'
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
      <Sidebar />
      <main
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <SceneClient />
        <SubjectAudioPlayer />
      </main>
    </div>
  )
}
