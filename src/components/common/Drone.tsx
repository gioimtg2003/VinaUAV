import { cn } from '@/lib/utils';
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Activity,
  AlertTriangle,
  Battery,
  Compass,
  Gauge,
  Map,
  Navigation,
  Play,
  RotateCcw,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Arm from './Drone/Arm';
import BodyFrame from './Drone/BodyFrame';
import GPSSensor from './Drone/GPSSensor';
import Propeller from './Drone/Propeller';

type MotorPosition = 'FL' | 'FR' | 'BL' | 'BR';

interface MotorState {
  id: MotorPosition;
  label: string;
  rpm: number;
  status: 'idle' | 'testing' | 'error';
  temp: number;
}
// A single propeller component
interface IMUData {
  pitch: number;
  roll: number;
  yaw: number;
  altitude: number;
  throttle: number;
}

// The Main Drone Body
const Drone = React.memo(
  ({
    imuRef,
    motors,
    selectedMotor,
    onMotorClick,
  }: {
    imuRef: React.MutableRefObject<IMUData>;
    motors: Record<MotorPosition, MotorState>;
    selectedMotor: MotorPosition | null;
    onMotorClick: (id: MotorPosition) => void;
  }) => {
    const groupRef = useRef<THREE.Group>(null);

    // Refs for propeller speeds to avoid re-renders
    const flSpeed = useRef(0);
    const frSpeed = useRef(0);
    const blSpeed = useRef(0);
    const brSpeed = useRef(0);

    useFrame(() => {
      if (groupRef.current) {
        const { pitch, roll, yaw, throttle } = imuRef.current;

        // Apply rotations directly
        groupRef.current.rotation.x = -pitch * (Math.PI / 180);
        groupRef.current.rotation.z = -roll * (Math.PI / 180);
        groupRef.current.rotation.y = -yaw * (Math.PI / 180);
        groupRef.current.position.y = altitude;

        // Update propeller speeds in refs
        const baseSpeed = 0.5 + (throttle / 100) * 2;

        flSpeed.current = motors.FL.status === 'testing' ? 5 : baseSpeed;
        frSpeed.current = motors.FR.status === 'testing' ? -5 : -baseSpeed;
        blSpeed.current = motors.BL.status === 'testing' ? -5 : -baseSpeed;
        brSpeed.current = motors.BR.status === 'testing' ? 5 : baseSpeed;
      }
    });

    // Destructure for JSX readability
    const { altitude } = imuRef.current;

    return (
      <group ref={groupRef}>
        {/*  top Main Body */}
        <BodyFrame />
        {/* Top Shell Detail */}

        {/* Arms */}
        <Arm />

        {/* GPS */}
        <GPSSensor />

        {/* Propellers - Pass refs instead of state values */}
        <Propeller
          position={[-0.65, -0.035, -0.65]}
          speed={flSpeed}
          id='FL'
          isSelected={selectedMotor === 'FL'}
        />

        <Propeller
          position={[0.65, -0.035, -0.65]}
          speed={frSpeed}
          id='FR'
          isSelected={selectedMotor === 'FR'}
          onClick={onMotorClick}
        />
        <Propeller
          position={[-0.65, -0.035, 0.65]}
          speed={blSpeed}
          id='BL'
          isSelected={selectedMotor === 'BL'}
          onClick={onMotorClick}
        />
        <Propeller
          position={[0.65, -0.035, 0.65]}
          speed={brSpeed}
          id='BR'
          isSelected={selectedMotor === 'BR'}
          onClick={onMotorClick}
        />

        {/* LED Indicators */}
        {/*<mesh position={[-0.3, 0.05, -0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color='#ef4444' />
        </mesh>
        <mesh position={[0.3, 0.05, -0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color='#22c55e' />
        </mesh>*/}

        {/* Camera Gimbal */}
        <group position={[0, -0.1, 0.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color='#1e293b' />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
            <meshStandardMaterial color='#0f172a' />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
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
  }
);

Drone.displayName = 'Drone';

// --- UI Components ---

const TelemetryCard = React.memo(
  ({
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
        {subValue && (
          <div className='text-[10px] text-slate-500'>{subValue}</div>
        )}
      </div>
    </div>
  )
);

TelemetryCard.displayName = 'TelemetryCard';

export const ControlSlider = ({
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
  // OPTIMIZATION: Use Ref for high-frequency IMU data
  // This prevents React re-renders on every frame update
  const imuRef = useRef<IMUData>({
    pitch: 0,
    roll: 0,
    yaw: 0,
    altitude: 2,
    throttle: 0,
  });

  // State for UI (throttled updates)
  const [uiData, setUiData] = useState<IMUData>(imuRef.current);

  // Motor States
  const [motors, setMotors] = useState<Record<MotorPosition, MotorState>>({
    FL: { id: 'FL', label: 'Front Left', rpm: 0, status: 'idle', temp: 24 },
    FR: { id: 'FR', label: 'Front Right', rpm: 0, status: 'idle', temp: 24 },
    BL: { id: 'BL', label: 'Back Left', rpm: 0, status: 'idle', temp: 24 },
    BR: { id: 'BR', label: 'Back Right', rpm: 0, status: 'idle', temp: 24 },
  });

  const [selectedMotor, setSelectedMotor] = useState<MotorPosition | null>(
    null
  );

  // Simulation State
  const [isSimulating] = useState(false);
  const [simulationMode] = useState<'manual' | 'auto'>('manual');

  // Refs for simulation loop
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUiUpdateRef = useRef(0);

  // Simulation Loop
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

  // const resetDrone = () => {
  //   setIsSimulating(false);
  //   imuRef.current = { pitch: 0, roll: 0, yaw: 0, altitude: 2, throttle: 0 };
  //   setUiData({ ...imuRef.current });
  //   setSelectedMotor(null);
  //   setMotors((prev) => ({
  //     FL: { ...prev.FL, status: 'idle', rpm: 0 },
  //     FR: { ...prev.FR, status: 'idle', rpm: 0 },
  //     BL: { ...prev.BL, status: 'idle', rpm: 0 },
  //     BR: { ...prev.BR, status: 'idle', rpm: 0 },
  //   }));
  //   timeRef.current = 0;
  // };

  const handleMotorClick = useCallback((id: MotorPosition) => {
    setSelectedMotor(id);
  }, []);

  const handleTestMotor = () => {
    if (!selectedMotor) return;

    setMotors((prev) => ({
      ...prev,
      [selectedMotor]: {
        ...prev[selectedMotor],
        status: 'testing',
        rpm: 8500,
      },
    }));

    setTimeout(() => {
      setMotors((prev) => ({
        ...prev,
        [selectedMotor]: {
          ...prev[selectedMotor],
          status: 'idle',
          rpm: 0,
        },
      }));
    }, 3000);
  };

  // Manual Control Handlers
  // const updateImuManual = (key: keyof IMUData, value: number) => {
  //   imuRef.current = { ...imuRef.current, [key]: value };
  //   setUiData({ ...imuRef.current });
  // };

  return (
    <div className='relative w-full h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30'>
      {/* 3D Canvas */}
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
            motors={motors}
            selectedMotor={selectedMotor}
            onMotorClick={handleMotorClick}
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

      {/* Right Panel: Controls */}
      <div className='absolute top-24 right-4 z-10 w-64 pointer-events-auto'>
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

      {/* Motor Test Modal */}
      <AnimatePresence>
        {selectedMotor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
            onClick={() => setSelectedMotor(null)}
          >
            <motion.div
              className='bg-slate-900 border border-slate-700 rounded-2xl p-6 w-80 shadow-2xl relative'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMotor(null)}
                className='absolute top-4 right-4 text-slate-500 hover:text-slate-300'
              >
                <X size={20} />
              </button>

              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 bg-blue-500/10 rounded-xl'>
                  <Zap className='text-blue-400' size={24} />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-white'>Motor Test</h3>
                  <p className='text-sm text-slate-400'>
                    {motors[selectedMotor].label} ({selectedMotor})
                  </p>
                </div>
              </div>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between items-center p-3 bg-slate-800/50 rounded-lg'>
                  <span className='text-sm text-slate-400'>Status</span>
                  <span
                    className={cn(
                      'text-sm font-bold px-2 py-1 rounded',
                      motors[selectedMotor].status === 'testing'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-700 text-slate-300'
                    )}
                  >
                    {motors[selectedMotor].status === 'testing'
                      ? 'TESTING...'
                      : 'IDLE'}
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-800/50 rounded-lg'>
                  <span className='text-sm text-slate-400'>Current RPM</span>
                  <span className='text-sm font-mono text-slate-200'>
                    {motors[selectedMotor].rpm}
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-800/50 rounded-lg'>
                  <span className='text-sm text-slate-400'>Temperature</span>
                  <span className='text-sm font-mono text-slate-200'>
                    {motors[selectedMotor].temp}°C
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <button
                  onClick={handleTestMotor}
                  disabled={motors[selectedMotor].status === 'testing'}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all',
                    motors[selectedMotor].status === 'testing'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                  )}
                >
                  {motors[selectedMotor].status === 'testing' ? (
                    <RotateCcw className='animate-spin' size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                  {motors[selectedMotor].status === 'testing'
                    ? 'RUNNING'
                    : 'TEST MOTOR'}
                </button>
                <button
                  onClick={() => setSelectedMotor(null)}
                  className='py-2.5 rounded-lg font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all'
                >
                  CLOSE
                </button>
              </div>

              {motors[selectedMotor].status === 'testing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2'
                >
                  <AlertTriangle
                    size={16}
                    className='text-amber-500 shrink-0 mt-0.5'
                  />
                  <p className='text-xs text-amber-200/80'>
                    Warning: Motor is spinning at high speed. Keep clear of
                    propellers.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Center: Artificial Horizon
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none'>
        <div className='relative w-64 h-32'>
          <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden'>
            <div
              className='absolute w-[200%] h-[200%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-linear'
              style={{
                transform: `translate(-50%, -50%) rotate(${uiData.roll}deg) translateY(${uiData.pitch * 2}px)`,
                background:
                  'linear-gradient(to bottom, #3b82f6 50%, #d97706 50%)',
                opacity: 0.3,
              }}
            >
              <div className='absolute top-1/2 left-0 w-full h-[1px] bg-white/50' />
              <div className='absolute top-[40%] left-[20%] w-[60%] h-[1px] bg-white/20' />
              <div className='absolute top-[60%] left-[20%] w-[60%] h-[1px] bg-white/20' />
            </div>

            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div className='w-12 h-1 bg-yellow-400/80 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]' />
              <div className='absolute w-1 h-4 bg-yellow-400/80' />
            </div>

            <div className='absolute top-2 left-0 right-0 flex justify-center'>
              <div className='bg-slate-900/80 px-3 py-0.5 rounded-full border border-slate-700 text-[10px] font-mono text-slate-300'>
                {uiData.yaw.toFixed(0)}°
              </div>
            </div>
          </div>
        </div>
        </div>*/}
    </div>
  );
}
