import { useFrame } from '@react-three/fiber';
import { memo, useRef } from 'react';
import * as THREE from 'three';
import Arm from './Arm';
import BodyFrame from './BodyFrame';
import GPSSensor from './GPSSensor';
import Propeller from './Propeller';
import { IMUData, MotorPosition, MotorState } from './type';

const Drone = ({
  imuRef,
  motors,
  selectedMotor,
  onMotorClick,
}: {
  imuRef: React.RefObject<IMUData>;
  motors: Record<MotorPosition, MotorState>;
  selectedMotor?: MotorPosition;
  onMotorClick?: (id: MotorPosition) => void;
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

  const { altitude } = imuRef.current;

  return (
    <group ref={groupRef}>
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
};
Drone.displayName = 'Drone';
export default memo(Drone);
