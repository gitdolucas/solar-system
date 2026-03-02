'use client'

import { createContext, useContext } from 'react'

const SidebarDenseContext = createContext(false)

export function useSidebarDense(): boolean {
  return useContext(SidebarDenseContext)
}

export const SidebarDenseProvider = SidebarDenseContext.Provider
