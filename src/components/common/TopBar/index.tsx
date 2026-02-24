import { SIZE_ICON } from '@/constants';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Bell, KeyRound, Minus, Square, X } from 'lucide-react';
import './styles.css';

import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConnectChip from './ConnectChip';
const COMMON_CLASSNAME_ICON =
  'border-none p-1 hover:bg-border hover:rounded-sm';
export default function Topbar() {
  return (
    <header className='w-full flex justify-between items-center select-none h-12.5 fixed top-0 left-0 right-0  bg-background  border-b border-b-border'>
      <div data-tauri-drag-region className='h-full w-full flex items-center'>
        <h2 className='text-primary h-fit text-xl font-bold'>VinaUAVsss</h2>
      </div>
      <div className='flex items-center justify-center gap-8 mr-2 shrink-0 h-full'>
        <div className='flex items-center justify-between h-6 gap-2'>
          <ConnectChip />
          <Separator orientation='vertical' />
          <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
              <button className={COMMON_CLASSNAME_ICON}>
                <KeyRound className='text-primary/80' size={SIZE_ICON} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quản lý khóa của bạn</p>
            </TooltipContent>
          </Tooltip>
          <button className={COMMON_CLASSNAME_ICON}>
            <Bell className='text-primary/80' size={SIZE_ICON} />
          </button>
        </div>

        <div className='flex items-center justify-center gap-3'>
          <button
            className={COMMON_CLASSNAME_ICON}
            onClick={() => {
              getCurrentWindow().minimize();
            }}
          >
            <Minus className='text-primary/80' size={SIZE_ICON} />
          </button>
          <button
            className={COMMON_CLASSNAME_ICON}
            onClick={async () => {
              const appWindow = getCurrentWindow();
              if (await appWindow.isMaximized()) {
                await appWindow.unmaximize();
              } else {
                await appWindow.maximize();
              }
            }}
          >
            <Square className='text-primary/80' size={SIZE_ICON} />
          </button>

          <button
            className='border-none p-1 hover:bg-red-400 hover:rounded-sm'
            onClick={() => {
              getCurrentWindow().close();
            }}
          >
            <X className='text-primary/80' size={SIZE_ICON} />
          </button>
        </div>
      </div>
    </header>
  );
}
