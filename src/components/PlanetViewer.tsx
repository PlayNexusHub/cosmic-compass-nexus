import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, MapPin, AlertTriangle } from 'lucide-react';
import { PlanetType, AnalysisType, SatelliteData } from './SatelliteApp';
import { Planet3D } from './3d/Planet3D';
import { SpaceBackground, Nebula } from './3d/SpaceBackground';
import { FallbackViewer } from './3d/FallbackViewer';
import { useSatelliteData } from '@/hooks/useSatelliteData';

interface PlanetViewerProps {
  planet: PlanetType;
  activeAnalysis: AnalysisType | null;
  onDataAcquisition: (coordinates: [number, number]) => void;
  satelliteData: SatelliteData;
}

export const PlanetViewer = ({ 
  planet, 
  activeAnalysis, 
  onDataAcquisition, 
  satelliteData 
}: PlanetViewerProps) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [imagerySource, setImagerySource] = useState('nasa');
  const [resolution, setResolution] = useState('high');
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  
  const { acquireData, runAnalysis, isLoading } = useSatelliteData(planet);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        setShowFallback(true);
      }
    } catch (e) {
      setWebGLSupported(false);
      setShowFallback(true);
    }
  }, []);

  const handleAcquireData = () => {
    acquireData(latitude, longitude, imagerySource);
    onDataAcquisition([latitude, longitude]);
  };

  const handleRunAnalysis = () => {
    if (activeAnalysis) {
      runAnalysis(activeAnalysis, latitude, longitude);
    }
  };

  const handleRetry3D = () => {
    setShowFallback(false);
  };

  const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-space">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
        />
        <p className="text-muted-foreground">Initializing 3D View...</p>
      </div>
    </div>
  );

  const ErrorFallback = ({ error, retry }: { error: Error, retry: () => void }) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-space p-8">
      <Card className="max-w-md bg-card/90 backdrop-blur-sm border-destructive/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">3D Rendering Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || 'Failed to initialize 3D viewer'}
          </p>
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* 3D Viewer */}
      <div className="absolute inset-0 bg-gradient-space">
        {showFallback || !webGLSupported ? (
          <FallbackViewer 
            planet={planet}
            activeAnalysis={activeAnalysis}
            onRetry={handleRetry3D}
          />
        ) : (
          <Canvas 
            key={`${planet}-${Date.now()}`} // Force re-render on planet change
            camera={{ position: [0, 0, 3], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
              premultipliedAlpha: false
            }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor('#0a0a0a', 0);
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              scene.fog = new THREE.Fog(0x0a0a0a, 8, 15);
              console.log(`✅ 3D Canvas created for ${planet}`);
            }}
            onError={(error) => {
              console.error('Canvas error:', error);
              setShowFallback(true);
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SpaceBackground />
              <Nebula />
              
              {/* Enhanced Lighting Setup */}
              <ambientLight intensity={0.4} color="#ffffff" />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.5} 
                color="#ffffff"
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              
              {/* Fill lights for better illumination */}
              <pointLight position={[-10, 0, -10]} intensity={0.3} color="#4A90E2" />
              <pointLight position={[10, 0, 10]} intensity={0.3} color="#ff6b6b" />
              <pointLight position={[0, 10, 0]} intensity={0.2} color="#00d2ff" />
              
              <Planet3D planet={planet} activeAnalysis={activeAnalysis} />
              
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                minDistance={1.5}
                maxDistance={10}
                enableDamping={true}
                dampingFactor={0.02}
                autoRotate={!activeAnalysis}
                autoRotateSpeed={0.3}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
                panSpeed={0.8}
                screenSpacePanning={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Controls Overlay */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <Card className="w-80 bg-card/90 backdrop-blur-sm border-primary/20 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center text-glow">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              View Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imagery">Imagery Source</Label>
              <Select value={imagerySource} onValueChange={setImagerySource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nasa">NASA Earth Data</SelectItem>
                  <SelectItem value="esa">ESA Copernicus</SelectItem>
                  <SelectItem value="usgs">USGS Earth Explorer</SelectItem>
                  <SelectItem value="planet">PlanetScope</SelectItem>
                  <SelectItem value="maxar">Maxar SecureWatch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (1m/pixel)</SelectItem>
                  <SelectItem value="ultra">Ultra (0.5m/pixel)</SelectItem>
                  <SelectItem value="maximum">Maximum (0.25m/pixel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  placeholder="-90 to 90"
                  min="-90"
                  max="90"
                  step="0.0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  placeholder="-180 to 180"
                  min="-180"
                  max="180"
                  step="0.0001"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleAcquireData}
                className="flex-1 btn-glow"
              >
                <Download className="w-4 h-4 mr-2" />
                Acquire Data
              </Button>
              <Button 
                variant="outline"
                onClick={handleRunAnalysis}
                disabled={!activeAnalysis || isLoading}
                className="flex-1 btn-glow"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Overlay */}
      {activeAnalysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-10"
        >
          <Card className="bg-primary/10 border-primary/30 shadow-glow">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold text-primary capitalize">
                  {activeAnalysis} Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  Active on {planet}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Planet Info */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 right-4 z-10"
      >
        <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold capitalize text-glow mb-2">
              {planet} View
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span>{satelliteData.position[0].toFixed(4)}, {satelliteData.position[1].toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Altitude:</span>
                <span>{satelliteData.altitude}km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution:</span>
                <span>{satelliteData.resolution}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};