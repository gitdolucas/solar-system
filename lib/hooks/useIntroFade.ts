import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Shared intro clock — elapsed seconds since scene mount.
 * Ticked once per frame by SceneContent. Read by every useIntroFade instance.
 */
export const introClockRef = { elapsed: 0 }

/** Seconds between each phase start */
export const INTRO_PHASE_DURATION = 2

/**
 * Returns a ref holding the current fade opacity [0..1].
 * Fading begins when introClockRef.elapsed >= myPhase * INTRO_PHASE_DURATION.
 *
 * @param myPhase  Phase index (0=Sun, 1=inner planets, 2=inner belt, 3=outer planets, 4=outer belt)
 * @param speed    Lerp speed (default 1.5 → ~1.5s to reach 0.995)
 */
export function useIntroFade(myPhase: number, speed = 1.5) {
  const opacityRef = useRef(0)
  const doneRef = useRef(false)
  const startTime = myPhase * INTRO_PHASE_DURATION

  useFrame((_, delta) => {
    if (doneRef.current) return
    if (introClockRef.elapsed < startTime) return

    const current = opacityRef.current
    const next = current + (1 - current) * (1 - Math.exp(-speed * delta))
    opacityRef.current = next

    if (next >= 0.995) {
      opacityRef.current = 1
      doneRef.current = true
    }
  })

  return opacityRef
}
