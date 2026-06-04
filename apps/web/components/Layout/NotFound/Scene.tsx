"use client";

import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { Model } from "./Model";

export default function Scene() {
  return (
    <Canvas
      orthographic
      camera={{
        position: [0, 0, 1],
        zoom: 800,
      }}
      style={{
        background: "#000",
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Model />

        <directionalLight intensity={3} position={[0, 0.1, 1]} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
