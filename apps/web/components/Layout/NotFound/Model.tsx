"use client";

import {
  Float,
  MeshTransmissionMaterial,
  Text,
  useGLTF,
} from "@react-three/drei";

import { useThree } from "@react-three/fiber";

type GLTFNode = {
  Scene: {
    children: any[];
  };
};

export function Model() {
  const { viewport } = useThree();

  const { nodes } = useGLTF("/media/shards.glb") as unknown as {
    nodes: GLTFNode;
  };

  return (
    <group scale={viewport.width / 1.5}>
      {nodes.Scene.children.map((mesh, index) => (
        <GlassMesh key={index} data={mesh} />
      ))}

      <Font />
    </group>
  );
}

function Font() {
  return (
    <group>
      <Text
        font="/fonts/PPNeueMontreal-Regular.ttf"
        position={[0, 0, -0.1]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        404
      </Text>

      <Text
        font="/fonts/PPNeueMontreal-Regular.ttf"
        position={[0, -0.15, -0.1]}
        fontSize={0.03}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        The link is broken
      </Text>
    </group>
  );
}

function GlassMesh({ data }: { data: any }) {
  return (
    <Float speed={1.5}>
      <mesh {...data}>
        <MeshTransmissionMaterial
          roughness={0}
          transmission={0.99}
          thickness={0.275}
          ior={1.8}
          chromaticAberration={0.3}
          resolution={128}
        />
      </mesh>
    </Float>
  );
}

useGLTF.preload("/media/shards.glb");