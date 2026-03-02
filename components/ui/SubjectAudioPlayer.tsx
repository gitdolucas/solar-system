'use client'

import { useSolarStore } from '@/lib/store/useSolarStore'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { SUN } from '@/lib/data/sun'
import { AudioPlayer } from './AudioPlayer'

/**
 * Renders the AudioPlayer only when a subject is selected and that subject
 * has an optional audio URL. No loop — playback stops when the track ends.
 */
export function SubjectAudioPlayer() {
  const selectedBody = useSolarStore((s) => s.selectedBody)

  if (!selectedBody) return null

  if (selectedBody.type === 'sun') {
    if (SUN.audio) return <AudioPlayer key={SUN.audio} src={SUN.audio} title={SUN.nome} />
    return null
  }

  if (selectedBody.type === 'planet') {
    const planet = PLANETS.find((p) => p.id === selectedBody.id)
    if (planet?.audio) return <AudioPlayer key={planet.audio} src={planet.audio} title={planet.nome} />
    return null
  }

  if (selectedBody.type === 'moon') {
    const moon = MOONS.find((m) => m.id === selectedBody.id)
    if (moon?.audio) return <AudioPlayer key={moon.audio} src={moon.audio} title={moon.nome} />
    return null
  }

  return null
}
