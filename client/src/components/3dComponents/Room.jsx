import { useGLTF } from "@react-three/drei";

export function Room(props) {
  const { nodes, materials } = useGLTF("/models/Room.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane.geometry}
        material={materials["Material.002"]}
        position={[0, 0.234, 0]}
      />
      <mesh
        geometry={nodes.Plane001.geometry}
        material={materials["Material.009"]}
        position={[-0.827, 0.284, 0]}
        scale={[0.861, 1, 1]}
      />
      <group position={[0, 1.054, 0]}>
        <mesh
          geometry={nodes.Cube001_1.geometry}
          material={materials.Material}
        />
        <mesh
          geometry={nodes.Cube001_2.geometry}
          material={materials["Material.007"]}
        />
      </group>
      <group position={[1.038, 1.147, 0]} scale={[1, 0.479, 0.146]}>
        <mesh
          geometry={nodes.Cube002_1.geometry}
          material={materials["Material.006"]}
        />
        <mesh
          geometry={nodes.Cube002_2.geometry}
          material={materials["Material.001"]}
        />
      </group>
      <mesh
        geometry={nodes.Cube002.geometry}
        material={materials["Material.006"]}
        position={[-0.078, 1.245, -0.874]}
        scale={1.119}
      />
      <mesh
        geometry={nodes.Plane002.geometry}
        material={materials["Material.003"]}
        position={[0.348, 0.464, -0.048]}
        scale={[0.355, 0.827, 0.671]}
      />
      <mesh
        geometry={nodes.Plane003.geometry}
        material={materials["Material.003"]}
        position={[0.348, 0.605, 0.566]}
        scale={[0.355, 0.827, 0.051]}
      />
      <mesh
        geometry={nodes.Plane004.geometry}
        material={materials["Material.005"]}
        position={[-0.051, 0.518, 0.568]}
        scale={[0.056, 0.062, 0.056]}
      />
      <mesh
        geometry={nodes.Plane005.geometry}
        material={materials["Material.013"]}
        position={[0.348, 0.566, -0.039]}
        scale={[0.355, 0.827, 0.531]}
      />
      <mesh
        geometry={nodes.Plane006.geometry}
        material={materials["Material.004"]}
        position={[0.348, 0.566, -0.039]}
        scale={[0.355, 0.827, 0.531]}
      />
      <group position={[-0.498, 0.283, -0.548]} scale={[0.279, 0.25, 0.25]}>
        <mesh
          geometry={nodes.Plane008_1.geometry}
          material={materials["Material.017"]}
        />
        <mesh
          geometry={nodes.Plane008_2.geometry}
          material={materials["Material.003"]}
        />
      </group>
      <mesh
        geometry={nodes.Plane009.geometry}
        material={materials["Material.005"]}
        position={[-0.768, 0.604, -0.322]}
        scale={[0.044, 0.056, 0.044]}
      />
      <group position={[-0.596, 0.809, -0.515]} scale={0.116}>
        <mesh
          geometry={nodes.Sphere_1.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Sphere_2.geometry}
          material={materials["Material.003"]}
        />
      </group>
      <mesh
        geometry={nodes.Cylinder.geometry}
        material={materials["Material.005"]}
        position={[0.308, 1.303, -0.842]}
        scale={[0.068, 0.02, 0.068]}
      />
      <mesh
        geometry={nodes.Sphere001.geometry}
        material={materials["Material.015"]}
        position={[0.308, 1.444, -0.842]}
        scale={[0.084, 0.137, 0.084]}
      />
      <group
        position={[-0.065, 1.369, -0.82]}
        rotation={[0, -0.449, 0]}
        scale={[0.239, 0.39, 0.956]}
      >
        <mesh
          geometry={nodes.Cube005_1.geometry}
          material={materials["Material.010"]}
        />
        <mesh
          geometry={nodes.Cube005_2.geometry}
          material={materials["Material.011"]}
        />
      </group>
      <mesh
        geometry={nodes.Plane010.geometry}
        material={materials["Material.016"]}
        position={[-0.435, 1.446, -0.918]}
        rotation={[1.09, 0, 0]}
        scale={[0.105, 0.159, 0.15]}
      />
      <group position={[-0.065, 1.327, -0.82]} scale={[0.239, 0.39, 0.956]}>
        <mesh
          geometry={nodes.Cube006.geometry}
          material={materials["Material.012"]}
        />
        <mesh
          geometry={nodes.Cube006_1.geometry}
          material={materials["Material.011"]}
        />
      </group>
      <mesh
        geometry={nodes.Plane011.geometry}
        material={materials["Material.008"]}
        position={[-0.318, 0.289, 0.142]}
        scale={[0.2, 0.279, 0.279]}
      />
      <mesh
        geometry={nodes.Plane013.geometry}
        material={materials["Material.014"]}
        position={[0.338, 0.597, -0.412]}
        scale={[0.171, 0.26, 0.148]}
      />
      <mesh
        geometry={nodes.Cube005.geometry}
        material={materials["Material.006"]}
        position={[0.795, 1.147, -0.282]}
      />
      <mesh
        geometry={nodes.Cylinder001.geometry}
        material={materials["Material.006"]}
        position={[0.8, 1.343, -0.115]}
      />
      <mesh
        geometry={nodes.Cylinder002.geometry}
        material={nodes.Cylinder002.material}
        position={[0.801, 1.32, -0.115]}
      />
      <mesh
        geometry={nodes.Cylinder003.geometry}
        material={nodes.Cylinder003.material}
        position={[0.8, 0.98, -0.115]}
      />
      <mesh
        geometry={nodes.Cylinder004.geometry}
        material={nodes.Cylinder004.material}
        position={[0.801, 0.957, -0.115]}
      />
      <mesh
        geometry={nodes.Plane014.geometry}
        material={materials["Material.011"]}
        position={[0.787, 1.147, -0.411]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  );
}
// -5, 8, -10
useGLTF.preload("/models/Room.glb");
