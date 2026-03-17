import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const MOOD_COLORS = {
  5: '#10b981',
  4: '#6366f1',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
  0: '#a855f7',
};

function MoodBlob({ moodScore = 0, size = 1.8 }) {
  const meshRef = useRef();
  const color = MOOD_COLORS[moodScore] || MOOD_COLORS[0];
  const distort = moodScore === 0 ? 0.4 : 0.25 + (5 - moodScore) * 0.08;
  const speed = moodScore === 0 ? 2 : 1 + (5 - moodScore) * 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing({ count = 80, radius = 2.5, moodScore = 0 }) {
  const pointsRef = useRef();
  const color = MOOD_COLORS[moodScore] || MOOD_COLORS[0];

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.003;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function MoodSphere({ moodScore = 0, height = 300 }) {
  return (
    <div className="canvas-container" style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
        <MoodBlob moodScore={moodScore} />
        <ParticleRing moodScore={moodScore} />
      </Canvas>
    </div>
  );
}
