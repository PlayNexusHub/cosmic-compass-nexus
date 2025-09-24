import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Text, useTexture } from '@react-three/drei';
import { Mesh, TextureLoader } from 'three';
import * as THREE from 'three';
import { PlanetType, AnalysisType } from '../SatelliteApp';

interface Planet3DProps {
  planet: PlanetType;
  activeAnalysis: AnalysisType | null;
}

const planetConfigs = {
  earth: {
    color: '#4A90E2',
    atmosphereColor: '#87CEEB',
    size: 1,
    rotationSpeed: 0.01,
    textureUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=1024&h=512&fit=crop',
  },
  mars: {
    color: '#CD5C5C', 
    atmosphereColor: '#FFA07A',
    size: 0.8,
    rotationSpeed: 0.008,
    textureUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1024&h=512&fit=crop',
  },
  moon: {
    color: '#C0C0C0',
    atmosphereColor: '#F5F5F5',
    size: 0.6,
    rotationSpeed: 0.005,
    textureUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1024&h=512&fit=crop',
  },
  universe: {
    color: '#4B0082',
    atmosphereColor: '#9370DB', 
    size: 1.5,
    rotationSpeed: 0.02,
    textureUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1024&h=512&fit=crop',
  },
};

export const Planet3D = ({ planet, activeAnalysis }: Planet3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const config = planetConfigs[planet];

  // Load planet texture
  let texture = null;
  try {
    texture = useLoader(TextureLoader, config.textureUrl);
  } catch (error) {
    console.log('Texture loading failed, using color fallback');
  }

  // Create planet material with texture or color fallback
  const planetMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: texture ? '#ffffff' : config.color,
      emissive: activeAnalysis ? new THREE.Color('#00ffff') : new THREE.Color('#000000'),
      emissiveIntensity: activeAnalysis ? 0.1 : 0,
      shininess: 1,
    });
    return material;
  }, [texture, config.color, activeAnalysis]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: config.atmosphereColor,
      transparent: true,
      opacity: 0.2,
      emissive: activeAnalysis ? new THREE.Color('#00ffff') : new THREE.Color('#000000'),
      emissiveIntensity: activeAnalysis ? 0.05 : 0,
    });
  }, [config.atmosphereColor, activeAnalysis]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += config.rotationSpeed * 0.5;
    }
  });

  return (
    <group>
      {/* Main Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.size, 64, 64]} />
        <primitive object={planetMaterial} />
      </mesh>

      {/* Atmosphere */}
      {planet !== 'moon' && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[config.size * 1.05, 32, 32]} />
          <primitive object={atmosphereMaterial} />
        </mesh>
      )}

      {/* Analysis Indicators */}
      {activeAnalysis && (
        <>
          {/* Analysis Grid */}
          <mesh>
            <ringGeometry args={[config.size * 1.2, config.size * 1.25, 32]} />
            <meshBasicMaterial 
              color="#00ffff" 
              transparent 
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Scanning Lines */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[config.size * 1.1, config.size * 1.15, 32]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Analysis Label */}
          <Text
            position={[0, config.size * 1.6, 0]}
            fontSize={0.15}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {activeAnalysis.toUpperCase()} ANALYSIS ACTIVE
          </Text>
        </>
      )}

      {/* Planet Label */}
      <Text
        position={[0, -config.size * 1.4, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {planet.toUpperCase()}
      </Text>

      {/* Orbital Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.size * 1.8, config.size * 1.82, 64]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Satellite Tracking Points */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * (config.size * 1.3),
            Math.sin((i * Math.PI * 2) / 5) * (config.size * 1.3) * 0.3,
            Math.sin((i * Math.PI * 2) / 5) * (config.size * 1.3)
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      ))}
    </group>
  );
};