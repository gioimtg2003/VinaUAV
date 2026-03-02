import { create } from 'zustand';

export type FcType = 'esp32' | 'pixhawk';

interface ChipStore {
  com?: string;
  baudRate?: number;
  isConnected: boolean;
  fcType: FcType;

  // set com port
  setCom: (com: string) => void;
  setBaudRate: (baudRate: number) => void;
  setIsConnected: (status: boolean) => void;
  setFcType: (fcType: FcType) => void;

  // Clear all fields
  clear: () => void;
}

export const chipStore = create<ChipStore>()((set, get) => ({
  isConnected: false,
  fcType: 'esp32',

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

  setFcType: (fcType: FcType) => {
    set({ fcType });
  },

  clear: () =>
    set({
      com: undefined,
      baudRate: undefined,
      isConnected: false,
      fcType: 'esp32',
    }),
}));
