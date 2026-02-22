import { useFrame } from '@react-three/fiber';
import { memo, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { MotorPosition } from './type';

interface PropellerProps {
  position: [number, number, number];
  speed: React.RefObject<number>;
  id: MotorPosition;
  isSelected: boolean;
  disabledHover?: boolean;
  onClick?: (id: MotorPosition) => void;
}

const Propeller = (props: PropellerProps) => {
  const {
    position,
    speed,
    id,
    isSelected,
    disabledHover = false,
    onClick,
  } = props;

  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) {
      // Read directly from ref for maximum performance
      ref.current.rotation.y += speed.current * delta * 10;
    }
  });

  /**
   * Draw a propller with shape
   */
  const aPropellerGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.08, -0.15);

    shape.lineTo(-0.08, 0);

    shape.quadraticCurveTo(0, 0.3, 0.08, 0.3);
    shape.quadraticCurveTo(0.02, 0.12, 0.01, 0.05);
    // shape.bezierCurveTo(
    //   -0.05,
    //   0.5,
    //   0.05,
    //   0.5,
    //   0.08,
    //   0.3
    // );

    shape.lineTo(0.01, 0);

    // shape.bezierCurveTo(0.05, -0.2, -0.05, -0.2, -0.08, 0);

    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: false,
      curveSegments: 12,
    });
  }, []);

  return (
    <group
      position={position}
      ref={ref}
      onClick={(e) => {
        if (!disabledHover) return;
        e.stopPropagation();
        onClick?.(id);
      }}
      onPointerOver={(e) => {
        if (!disabledHover) return;

        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (!disabledHover) return;

        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : '#666e7a'}
          metalness={0.8}
          roughness={0.2}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      <mesh
        {...(id === 'BR' || id === 'FL'
          ? { position: [-0.08, 0.1, 0.12] }
          : { position: [0.08, 0.13, 0.12] })}
        rotation={[Math.PI / 2, Math.PI / 8, 0]}
        geometry={aPropellerGeometry}
        {...((id === 'BR' || id === 'FL') && { scale: [-1, 1, 1] })}
      >
        {/*<boxGeometry args={[1.2, 0.02, 0.15]} />*/}
        <meshStandardMaterial
          color={hovered || isSelected ? '#60a5fa' : '#696FC7'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <mesh
        {...(id === 'BR' || id === 'FL'
          ? { position: [-0.08, 0.12, -0.1] }
          : { position: [-0.12, 0.12, 0] })}
        rotation={[Math.PI / 2, 0, Math.PI / 1.5]}
        geometry={aPropellerGeometry}
        {...((id === 'BR' || id === 'FL') && { scale: [-1, 1, 1] })}
      >
        {/*<boxGeometry args={[1.2, 0.02, 0.15]} />*/}
        <meshStandardMaterial
          color={hovered || isSelected ? '#60a5fa' : '#696FC7'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <mesh
        {...(id === 'BR' || id === 'FL'
          ? { position: [0.14, 0.12, 0] }
          : { position: [0.08, 0.12, -0.12] })}
        rotation={[Math.PI / 2, 0, -Math.PI / 1.5]}
        geometry={aPropellerGeometry}
        {...((id === 'BR' || id === 'FL') && { scale: [-1, 1, 1] })}
      >
        {/*<boxGeometry args={[1.2, 0.02, 0.15]} />*/}
        <meshStandardMaterial
          color={hovered || isSelected ? '#60a5fa' : '#696FC7'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/*<mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.15, 0.02, 1.2]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#60a5fa' : '#111'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>*/}
      {/* Center cap */}
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.08, 0.08, 12, 1]} />
        <meshStandardMaterial
          color={'#787878'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial
          color='#3b82f6'
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

Propeller.displayName = 'Propeller';
export default memo(Propeller);
