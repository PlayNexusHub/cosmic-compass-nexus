import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Text, useTexture } from '@react-three/drei';
import { Mesh, TextureLoader } from 'three';
import * as THREE from 'three';
import { PlanetType, AnalysisType } from '../SatelliteApp';

interface Planet3DProps {
  planet: PlanetType;
  activeAnalysis: AnalysisType | null;
}

// Real satellite imagery URLs from various free APIs
const planetConfigs = {
  earth: {
    color: '#4A90E2',
    atmosphereColor: '#87CEEB',
    size: 1,
    rotationSpeed: 0.01,
    textureUrls: [
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/globe_west_2048.jpg',
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/globe_east_2048.jpg',
      'https://map1.vis.earthdata.nasa.gov/wmts-geo/1.0.0/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/EPSG4326_250m/8/120/85.jpg',
      'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/250m/8/120/85.jpg'
    ],
    normalMapUrl: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/gebco_08_rev_elev_21600x10800.png'
  },
  mars: {
    color: '#CD5C5C', 
    atmosphereColor: '#FFA07A',
    size: 0.8,
    rotationSpeed: 0.008,
    textureUrls: [
      'https://mars.nasa.gov/system/resources/detail_files/25042_PIA23499-web.jpg',
      'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2016/10/mars_true_color/16208579-1-eng-GB/Mars_true_color_pillars.jpg',
      'https://images-assets.nasa.gov/image/PIA00407/PIA00407~large.jpg',
      'https://solarsystem.nasa.gov/system/basic_html_elements/11567_MarsMap-PIA00407-full.jpg'
    ],
    normalMapUrl: 'https://solarsystem.nasa.gov/system/basic_html_elements/11568_mars-elevation-map.jpg'
  },
  moon: {
    color: '#C0C0C0',
    atmosphereColor: '#F5F5F5',
    size: 0.6,
    rotationSpeed: 0.005,
    textureUrls: [
      'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg',
      'https://solarsystem.nasa.gov/system/basic_html_elements/11561_Moon_Map-1.jpg',
      'https://images-assets.nasa.gov/image/PIA00302/PIA00302~large.jpg',
      'https://www.lpi.usra.edu/resources/lunar_orbiter/images/preview/4162_h2.jpg'
    ],
    normalMapUrl: 'https://solarsystem.nasa.gov/system/basic_html_elements/11562_moon-elevation-map.jpg'
  },
  universe: {
    color: '#4B0082',
    atmosphereColor: '#9370DB', 
    size: 1.5,
    rotationSpeed: 0.02,
    textureUrls: [
      'https://svs.gsfc.nasa.gov/vis/a000000/a004500/a004569/eso0932a.jpg',
      'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_ann_pillars_of_creation.jpg',
      'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000393/GSFC_20171208_Archive_e000393~large.jpg',
      'https://solarsystem.nasa.gov/system/resources/detail_files/2486_stsci-h-p1821a-f-1340x520.jpg'
    ],
    normalMapUrl: null
  },
};

export const Planet3D = ({ planet, activeAnalysis }: Planet3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null);
  const [normalTexture, setNormalTexture] = useState<THREE.Texture | null>(null);
  const config = planetConfigs[planet];

  // Load planet textures with fallback system
  useEffect(() => {
    const loadTexture = async () => {
      const loader = new TextureLoader();
      let textureLoaded = false;
      let textureIndex = 0;
      
      // Try to load textures in order until one succeeds
      while (!textureLoaded && textureIndex < config.textureUrls.length) {
        try {
          const texture = await new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(
              config.textureUrls[textureIndex],
              resolve,
              undefined,
              reject
            );
          });
          
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          setLoadedTexture(texture);
          setCurrentTextureIndex(textureIndex);
          textureLoaded = true;
          console.log(`✅ Loaded texture ${textureIndex + 1} for ${planet}`);
        } catch (error) {
          console.warn(`❌ Failed to load texture ${textureIndex + 1} for ${planet}, trying next...`);
          textureIndex++;
        }
      }
      
      if (!textureLoaded) {
        console.warn(`⚠️  All textures failed for ${planet}, using procedural texture`);
        // Create a procedural texture as final fallback
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Create gradient based on planet
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, config.color);
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        setLoadedTexture(texture);
      }
    };
    
    // Load normal map if available
    if (config.normalMapUrl) {
      const loader = new TextureLoader();
      loader.load(
        config.normalMapUrl,
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          setNormalTexture(texture);
          console.log(`✅ Loaded normal map for ${planet}`);
        },
        undefined,
        (error) => {
          console.warn(`❌ Failed to load normal map for ${planet}`);
        }
      );
    }
    
    loadTexture();
  }, [planet, config]);

  // Create planet material with loaded textures
  const planetMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial({
      map: loadedTexture,
      normalMap: normalTexture,
      color: loadedTexture ? '#ffffff' : config.color,
      emissive: activeAnalysis ? new THREE.Color('#00ffff') : new THREE.Color('#000000'),
      emissiveIntensity: activeAnalysis ? 0.1 : 0,
      shininess: planet === 'earth' ? 10 : 1,
      bumpScale: 0.02,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
    return material;
  }, [loadedTexture, normalTexture, config.color, activeAnalysis, planet]);

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