import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useMediaQuery } from "react-responsive";
import { useRef } from "react";
import { Room } from "./Room";

const HeroRoom = () => {
  let pos = [0, -1, 0];
  const isSmallScreen = useMediaQuery({ maxWidth: 1800 });
  const spotTarget = useRef();

  if (isSmallScreen) {
    return null;
  }

  return (
    <Canvas camera={{ position: [-2, 1, 2], fov: 45 }}>
      <OrbitControls minDistance={4} maxDistance={7} />
      <ambientLight intensity={0.8} color="#fff" />

      <spotLight
        position={[0, 1, 0]} // In front of and above the wall
        angle={0.5}
        penumbra={0.5}
        intensity={5}
        color="#F9D856"
        castShadow
        target={spotTarget.current}
      />
      <spotLight
        position={[0, 3, 0]} // In front of and above the wall
        angle={0.4}
        penumbra={0.5}
        intensity={10}
        color="#fff"
        castShadow
        target={spotTarget.current}
      />

      <group position={pos}>
        <Room />
      </group>
    </Canvas>
  );
};

export default HeroRoom;
