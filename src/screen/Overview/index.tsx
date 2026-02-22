import Drone from '@/components/common/Drone/index';
import { IMUData } from '@/components/common/Drone/type';
import TelemetryCard from '@/components/common/TelemetryCard';
import { DRONE_MOTORS } from '@/constants';
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Activity,
  Compass,
  Gauge,
  Map,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function OverviewScreen() {
  const imuRef = useRef<IMUData>({
    pitch: 0,
    roll: 0,
    yaw: 0,
    altitude: 2,
    throttle: 0,
  });
  const [uiData, setUiData] = useState<IMUData>(imuRef.current);

  // const [selectedMotor, setSelectedMotor] = useState<MotorPosition | null>(
  //   null
  // );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMode, setSimulationMode] = useState<'manual' | 'auto'>(
    'manual'
  );

  // Refs for simulation loop
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUiUpdateRef = useRef(0);

  useEffect(() => {
    if (isSimulating && simulationMode === 'auto') {
      const animate = (time: number) => {
        timeRef.current += 0.01;

        // Update Ref (High Performance)
        imuRef.current = {
          pitch: Math.sin(timeRef.current) * 15,
          roll: Math.cos(timeRef.current * 0.7) * 15,
          yaw: (imuRef.current.yaw + 0.5) % 360,
          altitude: 2 + Math.sin(timeRef.current * 2) * 0.5,
          throttle: 40 + Math.sin(timeRef.current * 3) * 20,
        };

        // Throttle UI Updates (every 100ms)
        if (time - lastUiUpdateRef.current > 100) {
          setUiData({ ...imuRef.current });
          lastUiUpdateRef.current = time;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSimulating, simulationMode]);

  return (
    <div className='relative w-full h-screen bg-background text-text-main overflow-hidden'>
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

          <Drone
            imuRef={imuRef}
            motors={DRONE_MOTORS}
            // selectedMotor={selectedMotor}
            // onMotorClick={handleMotorClick}
          />

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />

          <Environment preset='city' />
        </Canvas>
      </div>
      {/* Left Panel: Telemetry */}
      <div className='absolute top-24 left-4 z-10 flex flex-col gap-3 pointer-events-auto'>
        <TelemetryCard
          label='Pitch'
          value={uiData.pitch.toFixed(1)}
          unit='°'
          icon={Navigation}
          color='text-blue-400'
        />
        <TelemetryCard
          label='Roll'
          value={uiData.roll.toFixed(1)}
          unit='°'
          icon={RotateCcw}
          color='text-purple-400'
        />
        <TelemetryCard
          label='Yaw'
          value={uiData.yaw.toFixed(1)}
          unit='°'
          icon={Compass}
          color='text-orange-400'
        />
        <TelemetryCard
          label='Altitude'
          value={uiData.altitude.toFixed(2)}
          unit='m'
          icon={Map}
          color='text-emerald-400'
        />
        <TelemetryCard
          label='Speed'
          value={(Math.abs(uiData.pitch) + Math.abs(uiData.roll)).toFixed(1)}
          unit='m/s'
          icon={Gauge}
          color='text-rose-400'
        />
      </div>

      <div className='absolute top-1/4 right-4 z-10 w-64 pointer-events-auto'>
        {/* Mini Log */}
        <div className='mt-4 bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-xl p-3 h-32 overflow-hidden'>
          <div className='text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-2'>
            <Activity size={12} />
            System Log
          </div>
          <div className='space-y-1 font-mono text-[10px] text-slate-400'>
            <div className='flex gap-2'>
              <span className='text-slate-600'>[10:42:01]</span>
              <span className='text-green-400'>FC_CONNECTED</span>
            </div>
            <div className='flex gap-2'>
              <span className='text-slate-600'>[10:42:05]</span>
              <span>IMU_CALIBRATED</span>
            </div>
            {isSimulating && (
              <div className='flex gap-2'>
                <span className='text-slate-600'>[10:42:12]</span>
                <span className='text-blue-400'>MOTORS_ARMED</span>
              </div>
            )}
            <div className='flex gap-2'>
              <span className='text-slate-600'>[10:42:15]</span>
              <span>GPS_3D_FIX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
