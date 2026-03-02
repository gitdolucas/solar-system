import { create } from 'zustand'
import type { SolarStoreState, SelectedBody, SelectedBodyType, OrbitMode } from '@/lib/types'

export const useSolarStore = create<SolarStoreState>((set, get) => ({
  selectedBody: null,
  previousBody: null,
  hoveredBody: null,
  tooltipBody: null,

  selectBody: (type: SelectedBodyType, id: string) =>
    set((state) => ({
      previousBody: state.selectedBody,
      selectedBody: { type, id },
      hoveredBody: null,
      tooltipBody: null,
    })),

  setHoveredBody: (body: SelectedBody | null) => set({ hoveredBody: body }),

  setTooltipBody: (body: SelectedBody | null) => set({ tooltipBody: body }),

  clearSelection: () => {
    const { previousBody } = get()
    if (previousBody) {
      set({ selectedBody: previousBody, previousBody: null, hoveredBody: null, tooltipBody: null })
    } else {
      set({ selectedBody: null, previousBody: null, hoveredBody: null, tooltipBody: null })
    }
  },

  simulationSpeed: 0.25,
  setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),

  orbitMode: 'real' as OrbitMode,
  setOrbitMode: (mode: OrbitMode) => set({ orbitMode: mode }),

  backgroundMusicPlaying: false,
  backgroundMusicVolume: 0.1,
  setBackgroundMusicPlaying: (playing: boolean) => set({ backgroundMusicPlaying: playing }),
  setBackgroundMusicVolume: (volume: number) => set({ backgroundMusicVolume: volume }),

  introComplete: false,
  setIntroComplete: () => set({ introComplete: true }),
}))
