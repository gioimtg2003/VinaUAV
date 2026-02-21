import { create } from 'zustand';

interface ChipStore {
  com?: string;
  baudRate?: number;
  isConnected: boolean;

  // set com port
  setCom: (com: string) => void;
  setBaudRate: (baudRate: number) => void;
  setIsConnected: (status: boolean) => void;

  // Clear all fields
  clear: () => void;
}

export const chipStore = create<ChipStore>()((set, get) => ({
  isConnected: false,
  setCom: (com: string) => set({ com }),
  setBaudRate: (baudRate: number) => set({ baudRate }),
  setIsConnected: (status: boolean) => {
    const { com, baudRate } = get();
    if (com && baudRate) {
      set({ isConnected: status });
      return;
    }
    console.warn('setIsConnected called without valid com and baudRate');
  },

  clear: () => set({ com: undefined, baudRate: undefined, isConnected: false }),
}));
