import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SIZE_ICON } from '@/constants';
import { chipStore } from '@/stores/chipStore';
import { invoke } from '@tauri-apps/api/core';
import { Cable, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConnectChip() {
  const [selectedCom, setSelectedCom] = useState<string>();
  const [listCom, setListCom] = useState<string[]>([]);
  const [selectedBaudRate, setSelectedBaudRate] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const _ports = await invoke<string[]>('get_ports_available');
      setListCom(_ports);
    })();
  }, []);

  const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

  const connect = chipStore((store) => store?.isConnected);
  const setConnect = chipStore((store) => store?.setIsConnected);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await invoke('connect_driver', {
        port: selectedCom,
        baudRate: Number(selectedBaudRate),
        fcType: 'pixhawk',
      });
      setConnect(true);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    // Implement the logic to disconnect from the connected COM port
    // Example: chipStore.disconnect();
    setConnect(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={'border-none p-1 hover:bg-border hover:rounded-sm'}>
          <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
              <div className='flex gap-1 items-center'>
                <Cable className='text-primary/70' size={SIZE_ICON} />
                {connect ? (
                  <span className='h-1 w-1 bg-green-500 rounded-full'></span>
                ) : (
                  <span className='h-1 w-1 bg-red-500 rounded-full'></span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kết nối với mạch</p>
            </TooltipContent>
          </Tooltip>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-min-80 w-fit max-w-93 bg-linear-to-r from-background to-surface text-primary'>
        <div className='flex flex-col gap-4'>
          <h4 className='leading-none font-medium text-center'>
            Kết nối với mạch của bạn
          </h4>
          <div className='w-full h-full flex justify-between items-center gap-2'>
            <div className='w-full flex justify-between items-center gap-1.5'>
              <Select value={selectedCom} onValueChange={setSelectedCom}>
                <SelectTrigger className='w-full text-xs'>
                  <SelectValue placeholder='Chọn cổng kết nối' />
                </SelectTrigger>
                <SelectContent className='bg-background'>
                  {listCom.map((com) => (
                    <SelectItem
                      key={com}
                      value={com}
                      className='text-primary text-xs'
                    >
                      {com}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                  <button className='border-none p-1 hover:bg-border hover:rounded-sm'>
                    <RefreshCw className='text-primary' size={SIZE_ICON} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lấy dữ liệu mới</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={selectedBaudRate}
              onValueChange={setSelectedBaudRate}
            >
              <SelectTrigger className='w-full text-xs'>
                <SelectValue placeholder='Chọn tốc độ kết nối' />
              </SelectTrigger>
              <SelectContent className='bg-background'>
                {baudRates.map((baudRate) => (
                  <SelectItem
                    key={baudRate}
                    value={String(baudRate)}
                    className='text-primary text-xs'
                  >
                    {baudRate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='mt-3 flex flex-col gap-2'>
          <p className='text-xs text-muted'>
            Vui lòng chọn đúng cổng kết nối và tốc độ kết nối để kết nối với
            mạch của bạn.
          </p>
          {connect ? (
            <Button
              size={'sm'}
              variant={'destructive'}
              onClick={handleDisconnect}
            >
              Ngắt kết nối
            </Button>
          ) : (
            <Button size={'sm'} onClick={handleConnect}>
              Kết nối
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
