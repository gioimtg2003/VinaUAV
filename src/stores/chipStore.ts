import { create } from 'zustand'

interface ChipStore {
  com?: string
  baudRate?: number
  isConnected: boolean

  // set com port
  setCom: (com: string) => void
  setBaudRate: (baudRate: number) => void
  setIsConnected: (isConnected: boolean) => void

  // Clear all fields
  clear: () => void
}

export const chipStore = create<ChipStore>()((set, get) => ({
  isConnected: false,
  setCom: (com: string) => set({ com }),
  setBaudRate: (baudRate: number) => set({ baudRate }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),

  clear: () => set({ com: undefined, baudRate: undefined, isConnected: false })
}))
