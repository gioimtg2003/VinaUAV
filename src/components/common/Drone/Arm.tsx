import { memo } from 'motion/react';

const Arm = () => {
  return (
    <group>
      <mesh
        position={[-0.4, 0, -0.4]}
        rotation={[Math.PI / 2, 0, Math.PI / 1.3]}
        castShadow
      >
        <capsuleGeometry args={[0.05, 0.6]} />
        <meshStandardMaterial color='#63676e' />
      </mesh>
      <mesh
        position={[0.4, 0, -0.4]}
        rotation={[Math.PI / 2, 0, Math.PI / -1.3]}
        castShadow
      >
        <capsuleGeometry args={[0.05, 0.6]} />
        <meshStandardMaterial color='#63676e' />
      </mesh>
      <mesh
        position={[-0.4, 0, 0.4]}
        rotation={[Math.PI / 2, 0, Math.PI / -1.3]}
        castShadow
        receiveShadow
      >
        <capsuleGeometry args={[0.05, 0.6]} />
        <meshStandardMaterial color='#63676e' />
      </mesh>
      <mesh
        position={[0.4, 0, 0.4]}
        rotation={[Math.PI / 2, 0, Math.PI / 1.3]}
        castShadow
        receiveShadow
      >
        <capsuleGeometry args={[0.05, 0.6]} />
        <meshStandardMaterial color='#63676e' />
      </mesh>
    </group>
  );
};

Arm.displayName = 'Arm';
export default memo(Arm);
