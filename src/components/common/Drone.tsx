import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { cn } from '@/lib/utils';
import {
  Activity,
  Battery,
  Compass,
  Cpu,
  Gauge,
  Map,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Wifi,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// A single propeller component
const Propeller = ({
  position,
  rotationSpeed,
}: {
  position: [number, number, number];
  rotationSpeed: number;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * delta * 10;
    }
  });

  return (
    <group position={position} ref={ref}>
      {/* Motor housing */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
        <meshStandardMaterial color='#333' metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Propeller Blades */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.2, 0.02, 0.15]} />
        <meshStandardMaterial color='#111' metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.15, 0.02, 1.2]} />
        <meshStandardMaterial color='#111' metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Center cap */}
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color='#ef4444'
          emissive='#ef4444'
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// The Main Drone Body
const Drone = ({
  pitch,
  roll,
  yaw,
  altitude,
  throttle,
}: {
  pitch: number;
  roll: number;
  yaw: number;
  altitude: number;
  throttle: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate propeller speed based on throttle (simulated)
  const propSpeed = 0.5 + (throttle / 100) * 2;

  useFrame(() => {
    if (groupRef.current) {
      // Apply IMU rotations
      // Note: In Three.js, rotations are usually applied in order X, Y, Z.
      // Pitch (X), Yaw (Y), Roll (Z) - Adjusting for standard aerospace coordinates
      groupRef.current.rotation.x = -pitch * (Math.PI / 180);
      groupRef.current.rotation.z = -roll * (Math.PI / 180);
      groupRef.current.rotation.y = -yaw * (Math.PI / 180);

      // Update altitude (Y position)
      groupRef.current.position.y = altitude;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.15, 0.4]} />
        <meshStandardMaterial color='#e2e8f0' metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Top Shell Detail */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.3]} />
        <meshStandardMaterial color='#f8fafc' metalness={0.1} roughness={0.2} />
      </mesh>

      {/* Arms */}
      <group>
        {/* Front Left */}
        <mesh
          position={[-0.4, 0, -0.4]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color='#334155' />
        </mesh>
        {/* Front Right */}
        <mesh
          position={[0.4, 0, -0.4]}
          rotation={[0, -Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color='#334155' />
        </mesh>
        {/* Back Left */}
        <mesh
          position={[-0.4, 0, 0.4]}
          rotation={[0, -Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color='#334155' />
        </mesh>
        {/* Back Right */}
        <mesh
          position={[0.4, 0, 0.4]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color='#334155' />
        </mesh>
      </group>

      {/* Propellers */}
      <Propeller position={[-0.7, 0, -0.7]} rotationSpeed={propSpeed} />
      <Propeller position={[0.7, 0, -0.7]} rotationSpeed={-propSpeed} />
      <Propeller position={[-0.7, 0, 0.7]} rotationSpeed={-propSpeed} />
      <Propeller position={[0.7, 0, 0.7]} rotationSpeed={propSpeed} />

      {/* LED Indicators */}
      <mesh position={[-0.3, 0.05, -0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color='#ef4444' />
      </mesh>
      <mesh position={[0.3, 0.05, -0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color='#22c55e' />
      </mesh>

      {/* Camera Gimbal */}
      <group position={[0, -0.1, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color='#1e293b' />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <cylinderGeometry
            args={[0.04, 0.04, 0.08, 16]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <meshStandardMaterial color='#0f172a' />
        </mesh>
        {/* Lens */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry
            args={[0.02, 0.02, 0.02, 16]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <meshPhysicalMaterial
            color='#3b82f6'
            transmission={0.5}
            opacity={0.8}
            roughness={0}
            metalness={0}
          />
        </mesh>
      </group>
    </group>
  );
};

// --- UI Components ---

const TelemetryCard = ({
  label,
  value,
  unit,
  icon: Icon,
  color = 'text-slate-200',
  subValue,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: any;
  color?: string;
  subValue?: string;
}) => (
  <div className='bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 min-w-[140px]'>
    <div className={cn('p-2 rounded-md bg-slate-800/50', color)}>
      <Icon size={18} />
    </div>
    <div>
      <div className='text-[10px] uppercase tracking-wider text-slate-400 font-semibold'>
        {label}
      </div>
      <div className='text-lg font-mono font-bold text-slate-100'>
        {value}
        <span className='text-xs text-slate-500 ml-1'>{unit}</span>
      </div>
      {subValue && <div className='text-[10px] text-slate-500'>{subValue}</div>}
    </div>
  </div>
);

const ControlSlider = ({
  label,
  value,
  onChange,
  min = -45,
  max = 45,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <div className='flex flex-col gap-1 w-full'>
    <div className='flex justify-between text-xs text-slate-400'>
      <span>{label}</span>
      <span>{value}°</span>
    </div>
    <input
      type='range'
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className='w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
    />
  </div>
);

// --- Main Application ---

export default function DroneVisualizer() {
  // State for IMU Data
  const [imuData, setImuData] = useState({
    pitch: 0,
    roll: 0,
    yaw: 0,
    altitude: 2,
    throttle: 0,
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMode, setSimulationMode] = useState<'manual' | 'auto'>(
    'manual'
  );

  // Refs for simulation loop
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Simulation Loop
  useEffect(() => {
    if (isSimulating && simulationMode === 'auto') {
      const animate = () => {
        timeRef.current += 0.01;
        setImuData((prev) => ({
          ...prev,
          pitch: Math.sin(timeRef.current) * 15,
          roll: Math.cos(timeRef.current * 0.7) * 15,
          yaw: (prev.yaw + 0.5) % 360,
          altitude: 2 + Math.sin(timeRef.current * 2) * 0.5,
          throttle: 40 + Math.sin(timeRef.current * 3) * 20,
        }));
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSimulating, simulationMode]);

  const resetDrone = () => {
    setIsSimulating(false);
    setImuData({ pitch: 0, roll: 0, yaw: 0, altitude: 2, throttle: 0 });
    timeRef.current = 0;
  };

  return (
    <div className='relative w-full h-full bg-background text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30'>
      {/* 3D Canvas */}
      <div className='absolute inset-0 z-0'>
        <Canvas shadows camera={{ position: [5, 4, 5], fov: 45 }}>
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
            pitch={imuData.pitch}
            roll={imuData.roll}
            yaw={imuData.yaw}
            altitude={imuData.altitude}
            throttle={imuData.throttle}
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
            enableZoom={false}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />

          <Environment preset='city' />
        </Canvas>
      </div>

      {/* --- HUD / UI Overlay --- */}

      {/* Top Bar: Status */}
      <div className='absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none'>
        <div className='flex gap-2 pointer-events-auto'>
          <div className='bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-2 rounded-lg flex items-center gap-2'>
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                isSimulating ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            <span className='text-xs font-bold uppercase tracking-widest text-slate-300'>
              {isSimulating ? 'System Active' : 'Standby'}
            </span>
          </div>
          <div className='bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-2 rounded-lg flex items-center gap-2'>
            <Wifi size={14} className='text-blue-400' />
            <span className='text-xs font-mono text-slate-300'>5.8 GHz</span>
          </div>
        </div>

        <div className='flex gap-2 pointer-events-auto'>
          <div className='bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-2 rounded-lg flex items-center gap-3'>
            <Battery size={16} className='text-green-400' />
            <div className='w-24 h-2 bg-slate-700 rounded-full overflow-hidden'>
              <div className='h-full bg-green-500 w-[85%]' />
            </div>
            <span className='text-xs font-mono font-bold'>85%</span>
          </div>
        </div>
      </div>

      {/* Left Panel: Telemetry */}
      <div className='absolute top-24 left-4 z-10 flex flex-col gap-3 pointer-events-auto'>
        <TelemetryCard
          label='Pitch'
          value={imuData.pitch.toFixed(1)}
          unit='°'
          icon={Navigation}
          color='text-blue-400'
        />
        <TelemetryCard
          label='Roll'
          value={imuData.roll.toFixed(1)}
          unit='°'
          icon={RotateCcw}
          color='text-purple-400'
        />
        <TelemetryCard
          label='Yaw'
          value={imuData.yaw.toFixed(1)}
          unit='°'
          icon={Compass}
          color='text-orange-400'
        />
        <TelemetryCard
          label='Altitude'
          value={imuData.altitude.toFixed(2)}
          unit='m'
          icon={Map}
          color='text-emerald-400'
        />
        <TelemetryCard
          label='Speed'
          value={(Math.abs(imuData.pitch) + Math.abs(imuData.roll)).toFixed(1)}
          unit='m/s'
          icon={Gauge}
          color='text-rose-400'
        />
      </div>

      {/* Right Panel: Controls */}
      <div className='absolute top-24 right-4 z-10 w-64 pointer-events-auto'>
        <div className='bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl'>
          <div className='p-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50'>
            <div className='flex items-center gap-2 text-slate-200'>
              <Cpu size={16} className='text-blue-400' />
              <span className='text-sm font-bold'>Flight Control</span>
            </div>
            <Settings
              size={14}
              className='text-slate-500 cursor-pointer hover:text-slate-300'
            />
          </div>

          <div className='p-4 space-y-6'>
            {/* Mode Toggle */}
            <div className='flex bg-slate-800 rounded-lg p-1'>
              <button
                onClick={() => setSimulationMode('manual')}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
                  simulationMode === 'manual'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Manual
              </button>
              <button
                onClick={() => setSimulationMode('auto')}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
                  simulationMode === 'auto'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Auto-Pilot
              </button>
            </div>

            {/* Sliders (Only active in Manual) */}
            <div
              className={cn(
                'space-y-4 transition-opacity',
                simulationMode === 'auto'
                  ? 'opacity-50 pointer-events-none'
                  : 'opacity-100'
              )}
            >
              <ControlSlider
                label='Pitch'
                value={imuData.pitch}
                onChange={(v) => setImuData((p) => ({ ...p, pitch: v }))}
              />
              <ControlSlider
                label='Roll'
                value={imuData.roll}
                onChange={(v) => setImuData((p) => ({ ...p, roll: v }))}
              />
              <ControlSlider
                label='Yaw'
                value={imuData.yaw}
                min={0}
                max={360}
                onChange={(v) => setImuData((p) => ({ ...p, yaw: v }))}
              />
              <ControlSlider
                label='Altitude'
                value={imuData.altitude}
                min={0}
                max={10}
                step={0.1}
                onChange={(v) => setImuData((p) => ({ ...p, altitude: v }))}
              />
              <ControlSlider
                label='Throttle'
                value={imuData.throttle}
                min={0}
                max={100}
                onChange={(v) => setImuData((p) => ({ ...p, throttle: v }))}
              />
            </div>

            {/* Action Buttons */}
            <div className='grid grid-cols-2 gap-2 pt-2'>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={cn(
                  'flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all',
                  isSimulating
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                )}
              >
                {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                {isSimulating ? 'PAUSE' : 'START'}
              </button>
              <button
                onClick={resetDrone}
                className='flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all'
              >
                <RotateCcw size={16} />
                RESET
              </button>
            </div>
          </div>
        </div>

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

      {/* Bottom Center: Artificial Horizon / Compass */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none'>
        <div className='relative w-64 h-32'>
          {/* Artificial Horizon Background */}
          <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden'>
            <div
              className='absolute w-[200%] h-[200%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-linear'
              style={{
                transform: `translate(-50%, -50%) rotate(${imuData.roll}deg) translateY(${imuData.pitch * 2}px)`,
                background:
                  'linear-gradient(to bottom, #3b82f6 50%, #d97706 50%)',
                opacity: 0.3,
              }}
            >
              {/* Horizon Lines */}
              <div className='absolute top-1/2 left-0 w-full h-[1px] bg-white/50' />
              <div className='absolute top-[40%] left-[20%] w-[60%] h-[1px] bg-white/20' />
              <div className='absolute top-[60%] left-[20%] w-[60%] h-[1px] bg-white/20' />
            </div>

            {/* Center Crosshair */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div className='w-12 h-1 bg-yellow-400/80 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]' />
              <div className='absolute w-1 h-4 bg-yellow-400/80' />
            </div>

            {/* Yaw Indicator */}
            <div className='absolute top-2 left-0 right-0 flex justify-center'>
              <div className='bg-slate-900/80 px-3 py-0.5 rounded-full border border-slate-700 text-[10px] font-mono text-slate-300'>
                {imuData.yaw.toFixed(0)}°
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
