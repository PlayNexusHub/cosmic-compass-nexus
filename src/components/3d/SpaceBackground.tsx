import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

export const SpaceBackground = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random star positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      // Distribute stars in a sphere
      const radius = Math.random() * 100 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random star colors (mostly white/blue with some yellow/red)
      const starType = Math.random();
      if (starType < 0.7) {
        // White/blue stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.85) {
        // Blue stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.95) {
        // Yellow stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.7;
      } else {
        // Red stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.7;
      }
    }
    
    return [positions, colors];
  }, []);

  // Gentle rotation animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        alphaTest={0.1}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
    </Points>
  );
};

export const Nebula = () => {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      // Create nebula-like clusters
      const cluster = Math.floor(Math.random() * 3);
      const clusterCenter = [
        cluster * 20 - 20,
        Math.sin(cluster) * 10,
        cluster * 15 - 15
      ];
      
      positions[i * 3] = clusterCenter[0] + (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = clusterCenter[1] + (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = clusterCenter[2] + (Math.random() - 0.5) * 25;
    }
    
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta / 40;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={2}
        sizeAttenuation={true}
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};