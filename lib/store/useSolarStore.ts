import { create } from 'zustand'
import type { SolarStoreState, SelectedBody, SelectedBodyType } from '@/lib/types'

export const useSolarStore = create<SolarStoreState>((set, get) => ({
  selectedBody: null,
  previousBody: null,
  hoveredBody: null,
  tooltipBody: null,

  selectBody: (type: SelectedBodyType, id: string) =>
    set((state) => ({
      previousBody: state.selectedBody,
      selectedBody: { type, id },
    })),

  setHoveredBody: (body: SelectedBody | null) => set({ hoveredBody: body }),

  setTooltipBody: (body: SelectedBody | null) => set({ tooltipBody: body }),

  clearSelection: () => {
    const { previousBody } = get()
    if (previousBody) {
      set({ selectedBody: previousBody, previousBody: null })
    } else {
      set({ selectedBody: null, previousBody: null })
    }
  },

  simulationSpeed: 1,
  setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),

  backgroundMusicPlaying: false,
  backgroundMusicVolume: 0.1,
  setBackgroundMusicPlaying: (playing: boolean) => set({ backgroundMusicPlaying: playing }),
  setBackgroundMusicVolume: (volume: number) => set({ backgroundMusicVolume: volume }),
}))
