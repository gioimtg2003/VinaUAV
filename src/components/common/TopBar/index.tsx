import { SIZE_ICON } from '@/constants'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Minus, Square, X } from 'lucide-react'
import './styles.css'

import ConnectChip from './ConnectChip'
const COMMON_CLASSNAME_ICON = 'border-none p-1 hover:bg-border hover:rounded-sm'
export default function Topbar() {
  return (
    <header className='w-full flex justify-between items-center select-none h-12.5 fixed top-0 left-0 right-0  bg-background  border-b border-b-border'>
      <div data-tauri-drag-region className='h-full w-full flex items-center'>
        <h2 className='text-primary h-fit text-xl font-bold'>VinaUAV</h2>
      </div>
      <div className='flex items-center justify-center gap-8 mr-2 shrink-0'>
        <ConnectChip />

        <div className='flex items-center justify-center gap-3'>
          <button
            className={COMMON_CLASSNAME_ICON}
            onClick={() => {
              getCurrentWindow().minimize()
            }}
          >
            <Minus className='text-primary/80' size={SIZE_ICON} />
          </button>
          <button
            className={COMMON_CLASSNAME_ICON}
            onClick={async () => {
              const appWindow = getCurrentWindow()
              if (await appWindow.isMaximized()) {
                await appWindow.unmaximize()
              } else {
                await appWindow.maximize()
              }
            }}
          >
            <Square className='text-primary/80' size={SIZE_ICON} />
          </button>

          <button
            className='border-none p-1 hover:bg-red-400 hover:rounded-sm'
            onClick={() => {
              getCurrentWindow().close()
            }}
          >
            <X className='text-primary/80' size={SIZE_ICON} />
          </button>
        </div>
      </div>
    </header>
  )
}
