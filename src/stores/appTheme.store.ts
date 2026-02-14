import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppThemeState {
  themeID: string
  setTheme: (themeID: string) => void
}

export const appThemeStore = create<AppThemeState>()(
  persist(
    (set) => ({
      themeID: 'default',
      setTheme: (themeID: string) => {
        // handle set variables
        // document.documentElement.style
        // --color-primary: #f6f8ff;
        // --color-background: #272d2d;
        // --color-surface: #29282d;
        // --color-border: #50514f;
        // --color-text-main: #f6f8ff;
        // --color-text-muted: #f7f7ff;
        set({ themeID })
      }
    }),
    { name: 'appTheme' }
  )
)
