import * as THREE from 'three';

export interface BodyFrameProps {
  enableHover?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function createFrame() {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);

  shape.lineTo(0, 0.3);

  shape.bezierCurveTo(0.09, 0.3, 0.18, 0.3, 0.24, 0.36);

  shape.quadraticCurveTo(0.24, 0.24, 0.36, 0.24);

  shape.bezierCurveTo(0.3, 0.18, 0.3, 0.09, 0.3, 0);

  const hole1 = new THREE.Path();

  hole1.moveTo(0.05, 0);
  hole1.lineTo(0, 0.05);
  hole1.lineTo(0.05, 0.05);
  hole1.lineTo(0.05, 0.05);
  hole1.closePath();

  const hole2 = new THREE.Path();

  hole2.moveTo(0.15, 0.12);
  hole2.quadraticCurveTo(0.27, 0.15, 0.24, 0.24);
  hole2.quadraticCurveTo(0.15, 0.27, 0.12, 0.15);
  hole2.closePath();

  shape.holes.push(hole1, hole2);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: false,
  });
}

const BodyFrame = ({
  enableHover = false,
  // isSelected = false,
}: BodyFrameProps) => {
  return (
    <group
      onClick={(e) => {
        if (!enableHover) {
          return;
        }
        e.stopPropagation();
      }}
      onPointerOver={() => {
        if (!enableHover) {
          return;
        }
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (!enableHover) {
          return;
        }
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#262626' />
      </mesh>
      <mesh
        position={[0, 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[-1, 1, 1]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#262626' />
      </mesh>
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#262626' />
      </mesh>
      <mesh
        position={[0, 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#262626' />
      </mesh>

      {/*  Bottom Main Body */}
      <mesh
        position={[0, -0.07, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#504B38' />
      </mesh>
      <mesh
        position={[0, -0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[-1, 1, 1]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#504B38' />
      </mesh>
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#504B38' />
      </mesh>
      <mesh
        position={[0, -0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        geometry={createFrame()}
      >
        <meshStandardMaterial color='#504B38' />
      </mesh>

      {/*Left */}

      <mesh position={[0.25, 0, 0.1]}>
        <capsuleGeometry args={[0.01, 0.08]} />
        <meshStandardMaterial color='#57595B' />
      </mesh>

      <mesh position={[0.25, 0, -0.1]}>
        <capsuleGeometry args={[0.01, 0.08]} />
        <meshStandardMaterial color='#57595B' />
      </mesh>

      {/*Right*/}
      <mesh position={[-0.25, 0, 0.1]}>
        <capsuleGeometry args={[0.01, 0.08]} />
        <meshStandardMaterial color='#57595B' />
      </mesh>

      <mesh position={[-0.25, 0, -0.1]}>
        <capsuleGeometry args={[0.01, 0.08]} />
        <meshStandardMaterial color='#57595B' />
      </mesh>
    </group>
  );
};

BodyFrame.displayName = 'BodyFrame';

export default BodyFrame;
