import { create } from 'zustand'
import type { SolarStoreState, SelectedBody, SelectedBodyType } from '@/lib/types'

export const useSolarStore = create<SolarStoreState>((set) => ({
  selectedBody: null,
  hoveredBody: null,
  tooltipBody: null,

  selectBody: (type: SelectedBodyType, id: string) =>
    set({ selectedBody: { type, id } }),

  setHoveredBody: (body: SelectedBody | null) => set({ hoveredBody: body }),

  setTooltipBody: (body: SelectedBody | null) => set({ tooltipBody: body }),

  clearSelection: () => set({ selectedBody: null }),

  simulationSpeed: 1,
  setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),

  backgroundMusicPlaying: false,
  backgroundMusicVolume: 0.1,
  setBackgroundMusicPlaying: (playing: boolean) => set({ backgroundMusicPlaying: playing }),
  setBackgroundMusicVolume: (volume: number) => set({ backgroundMusicVolume: volume }),
}))
