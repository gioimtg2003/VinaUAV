import { memo } from 'motion/react';

const GPSSensor = () => {
  return (
    <group position={[0.05, 0.2, -0.2]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.01, 0.3]} />
        <meshStandardMaterial color='#828282' />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.02, 32]} />
        <meshStandardMaterial color='#3b3c3d' />
      </mesh>
    </group>
  );
};

GPSSensor.displayName = 'GPSSensor';
export default memo(GPSSensor);
