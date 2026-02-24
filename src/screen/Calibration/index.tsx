import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SENSOR_CALIBRATION_LIST } from '@/constants';
import { cn } from '@/lib/utils';
import { Environment, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Check, Component } from 'lucide-react';
import { useState } from 'react';

export default function CalibrationScreen() {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  return (
    <div className='relative w-full h-full bg-background text-text-main overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Canvas shadows camera={{ position: [0, 8, 10], fov: 45 }}>
          <color attach='background' args={['#0f172a']} />
          <fog attach='fog' args={['#0f172a', 5, 20]} />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={1.5}
            castShadow
            shadow-mapSize={2048}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color='#3b82f6' />

          <Grid
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor='#334155'
            sectionSize={5}
            sectionThickness={1}
            sectionColor='#475569'
            fadeDistance={25}
            fadeStrength={1}
            infiniteGrid
          />

          <Environment preset='city' />
        </Canvas>
      </div>
      <div className='absolute top-1/4 right-4 z-10 max-w-80 pointer-events-auto'>
        <div className='mt-4 bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-xl py-3 overflow-hidden'>
          <div className=' px-3 text-sm tracking-widest text-text-main font-bold mb-1 flex items-center gap-2'>
            <Component size={16} color='#3b82f6' />
            Cảm biến
          </div>
          <p className='ml-4 text-xs  text-muted mb-2 flex items-center gap-2'>
            Chọn cảm biến ở bên dưới để bắt đầu quá trình calibrate
          </p>

          <Separator />

          <div className='flex flex-col max-h-56  gap-2 mt-2 overflow-y-scroll calibration-scroll'>
            {SENSOR_CALIBRATION_LIST?.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex flex-col hover:bg-border/40 px-3 py-2 cursor-pointer',
                  item?.id === selectedSensorId && 'bg-border/40'
                )}
                onClick={() => {
                  if (item.id === selectedSensorId) {
                    setSelectedSensorId(null);
                  } else {
                    setSelectedSensorId(item.id);
                  }
                }}
              >
                <div className='flex justify-items-start  items-center gap-2'>
                  <item.Icon size={16} color='#3b82f6' />
                  <span>{item?.name}</span>{' '}
                  {selectedSensorId === item.id && (
                    <Check size={16} color='#10b981' className='ml-auto' />
                  )}
                </div>
                <span className='text-xs text-muted ml-5'>
                  {item?.description}
                </span>
              </div>
            ))}
          </div>

          <div className='pt-2 w-full flex justify-center'>
            <Button
              className='w-8/10 mx-auto'
              size={'sm'}
              disabled={!selectedSensorId}
              onClick={() => {
                // Handle button click
              }}
            >
              Hiệu chỉnh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
