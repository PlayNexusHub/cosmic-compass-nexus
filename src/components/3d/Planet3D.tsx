import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { Mesh } from 'three';
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
    texture: 'earth',
  },
  mars: {
    color: '#CD5C5C',
    atmosphereColor: '#FFA07A',
    size: 0.8,
    rotationSpeed: 0.008,
    texture: 'mars',
  },
  moon: {
    color: '#C0C0C0',
    atmosphereColor: '#F5F5F5',
    size: 0.6,
    rotationSpeed: 0.005,
    texture: 'moon',
  },
  universe: {
    color: '#4B0082',
    atmosphereColor: '#9370DB',
    size: 1.5,
    rotationSpeed: 0.02,
    texture: 'universe',
  },
};

export const Planet3D = ({ planet, activeAnalysis }: Planet3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  
  const config = planetConfigs[planet];

  // Create planet texture/material
  const planetMaterial = useMemo(() => {
    return {
      color: config.color,
      emissive: activeAnalysis ? '#00ffff' : '#000000',
      emissiveIntensity: activeAnalysis ? 0.1 : 0,
    };
  }, [config.color, activeAnalysis]);

  const atmosphereMaterial = useMemo(() => {
    return {
      color: config.atmosphereColor,
      transparent: true,
      opacity: 0.3,
      emissive: activeAnalysis ? '#00ffff' : '#000000',
      emissiveIntensity: activeAnalysis ? 0.05 : 0,
    };
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
      <Sphere ref={meshRef} args={[config.size, 64, 64]}>
        <meshPhongMaterial {...planetMaterial} />
      </Sphere>

      {/* Atmosphere */}
      {planet !== 'moon' && (
        <Sphere ref={atmosphereRef} args={[config.size * 1.1, 32, 32]}>
          <meshPhongMaterial {...atmosphereMaterial} />
        </Sphere>
      )}

      {/* Analysis Indicators */}
      {activeAnalysis && (
        <>
          {/* Analysis Grid */}
          <mesh>
            <ringGeometry args={[config.size * 1.2, config.size * 1.3, 32]} />
            <meshBasicMaterial 
              color="#00ffff" 
              transparent 
              opacity={0.5}
              side={2}
            />
          </mesh>
          
          {/* Analysis Label */}
          <Text
            position={[0, config.size * 1.5, 0]}
            fontSize={0.2}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
          >
            {activeAnalysis.toUpperCase()} ANALYSIS
          </Text>
        </>
      )}

      {/* Planet Label */}
      <Text
        position={[0, -config.size * 1.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {planet.toUpperCase()}
      </Text>

      {/* Orbital Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.size * 2, config.size * 2.1, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
};