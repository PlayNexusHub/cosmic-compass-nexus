import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, MapPin } from 'lucide-react';
import { PlanetType, AnalysisType, SatelliteData } from './SatelliteApp';
import { Planet3D } from './3d/Planet3D';
import { SpaceBackground, Nebula } from './3d/SpaceBackground';
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
  
  const { acquireData, runAnalysis, isLoading } = useSatelliteData(planet);

  const handleAcquireData = () => {
    acquireData(latitude, longitude, imagerySource);
    onDataAcquisition([latitude, longitude]);
  };

  const handleRunAnalysis = () => {
    if (activeAnalysis) {
      runAnalysis(activeAnalysis, latitude, longitude);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Viewer */}
      <div className="absolute inset-0 bg-gradient-space">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <Suspense fallback={null}>
            <SpaceBackground />
            <Nebula />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Planet3D planet={planet} activeAnalysis={activeAnalysis} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={1.5}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>
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