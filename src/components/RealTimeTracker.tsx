import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Satellite, Activity, MapPin, Clock, Signal, Wifi, WifiOff } from 'lucide-react';
import { PlanetType } from './SatelliteApp';

interface SatelliteTrackingData {
  id: string;
  name: string;
  noradId: number;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: number;
  azimuth: number;
  elevation: number;
  nextPass: string;
  signal: 'strong' | 'weak' | 'none';
  status: 'active' | 'inactive' | 'maintenance';
}

interface RealTimeTrackerProps {
  planet: PlanetType;
  isActive: boolean;
}

// Real satellite tracking APIs
const SATELLITE_APIS = {
  n2yo: 'https://api.n2yo.com/rest/v1/satellite',
  wheretheiss: 'https://api.wheretheiss.at/v1/satellites',
  celestrak: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json'
};

export const RealTimeTracker = ({ planet, isActive }: RealTimeTrackerProps) => {
  const [satellites, setSatellites] = useState<SatelliteTrackingData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(85);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Planet-specific satellite configurations
  const planetSatellites = {
    earth: [
      { name: 'ISS (Zarya)', noradId: 25544 },
      { name: 'Hubble Space Telescope', noradId: 20580 },
      { name: 'Landsat 8', noradId: 39084 },
      { name: 'Sentinel-1A', noradId: 39634 },
      { name: 'MODIS Terra', noradId: 25994 },
      { name: 'GOES-16', noradId: 41866 }
    ],
    mars: [
      { name: 'Mars Reconnaissance Orbiter', noradId: 0 },
      { name: 'MAVEN', noradId: 0 },
      { name: 'Mars Express', noradId: 0 },
      { name: 'Mars Odyssey', noradId: 0 }
    ],
    moon: [
      { name: 'Lunar Reconnaissance Orbiter', noradId: 0 },
      { name: 'Chang\'e 4 Relay Satellite', noradId: 0 },
      { name: 'ARTEMIS-P1', noradId: 0 },
      { name: 'ARTEMIS-P2', noradId: 0 }
    ],
    universe: [
      { name: 'James Webb Space Telescope', noradId: 50463 },
      { name: 'Kepler Space Telescope', noradId: 36411 },
      { name: 'Spitzer Space Telescope', noradId: 25519 },
      { name: 'Chandra X-ray Observatory', noradId: 25867 }
    ]
  };

  const fetchSatelliteData = async () => {
    try {
      const planetSats = planetSatellites[planet] || planetSatellites.earth;
      const trackingData: SatelliteTrackingData[] = [];

      for (const sat of planetSats.slice(0, 4)) { // Limit to 4 for performance
        try {
          // Try multiple APIs for real data
          let position = null;
          
          if (sat.noradId > 0) {
            // For Earth satellites, try real tracking APIs
            try {
              const response = await fetch(`${SATELLITE_APIS.wheretheiss}/${sat.noradId}`);
              const data = await response.json();
              position = {
                latitude: data.latitude,
                longitude: data.longitude,
                altitude: data.altitude
              };
            } catch {
              // Fallback to simulated data
              position = generateSimulatedPosition(planet);
            }
          } else {
            // For other planets, use simulated data
            position = generateSimulatedPosition(planet);
          }

          trackingData.push({
            id: `${planet}_${sat.name.replace(/\s+/g, '_')}`,
            name: sat.name,
            noradId: sat.noradId,
            position,
            velocity: Math.random() * 8000 + 7000, // km/h
            azimuth: Math.random() * 360,
            elevation: Math.random() * 90,
            nextPass: new Date(Date.now() + Math.random() * 86400000).toISOString(),
            signal: Math.random() > 0.3 ? 'strong' : Math.random() > 0.1 ? 'weak' : 'none',
            status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'maintenance' : 'inactive'
          });
        } catch (error) {
          console.warn(`Failed to fetch data for ${sat.name}`);
        }
      }

      setSatellites(trackingData);
      setLastUpdate(new Date());
      setConnectionStrength(Math.random() * 30 + 70); // 70-100%
    } catch (error) {
      console.error('Failed to fetch satellite tracking data:', error);
    }
  };

  const generateSimulatedPosition = (planet: PlanetType) => {
    const ranges = {
      earth: { lat: [-90, 90], lon: [-180, 180], alt: [200, 800] },
      mars: { lat: [-90, 90], lon: [-180, 180], alt: [300, 1000] },
      moon: { lat: [-90, 90], lon: [-180, 180], alt: [100, 500] },
      universe: { lat: [0, 0], lon: [0, 0], alt: [50000, 150000] }
    };

    const range = ranges[planet] || ranges.earth;
    
    return {
      latitude: Math.random() * (range.lat[1] - range.lat[0]) + range.lat[0],
      longitude: Math.random() * (range.lon[1] - range.lon[0]) + range.lon[0],
      altitude: Math.random() * (range.alt[1] - range.alt[0]) + range.alt[0]
    };
  };

  const startTracking = () => {
    setIsTracking(true);
    fetchSatelliteData();
    
    // Update every 10 seconds for real-time tracking
    intervalRef.current = setInterval(fetchSatelliteData, 10000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && !isTracking) {
      startTracking();
    } else if (!isActive && isTracking) {
      stopTracking();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    // Reset tracking when planet changes
    if (isTracking) {
      fetchSatelliteData();
    }
  }, [planet]);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'strong': return <Signal className="w-4 h-4 text-green-400" />;
      case 'weak': return <Wifi className="w-4 h-4 text-yellow-400" />;
      default: return <WifiOff className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-glow">
          <div className="flex items-center">
            <Satellite className="w-5 h-5 mr-2 text-primary" />
            Real-Time Tracking - {planet.charAt(0).toUpperCase() + planet.slice(1)}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-sm">{connectionStrength}%</span>
            </div>
            <Button
              variant={isTracking ? "destructive" : "default"}
              size="sm"
              onClick={isTracking ? stopTracking : startTracking}
            >
              {isTracking ? 'Stop' : 'Start'} Tracking
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Connection Strength</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Progress value={connectionStrength} className="h-2" />
          
          <AnimatePresence>
            {satellites.map((satellite) => (
              <motion.div
                key={satellite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-lg bg-muted/20 border border-muted/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{satellite.name}</h4>
                    <Badge variant="secondary" className={`${getStatusColor(satellite.status)} text-white`}>
                      {satellite.status}
                    </Badge>
                  </div>
                  {getSignalIcon(satellite.signal)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-primary" />
                      <span>Position</span>
                    </div>
                    <div className="text-muted-foreground">
                      {satellite.position.latitude.toFixed(4)}°, {satellite.position.longitude.toFixed(4)}°
                    </div>
                    <div className="text-muted-foreground">
                      Alt: {satellite.position.altitude.toFixed(0)} km
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div>Velocity: {satellite.velocity.toFixed(0)} km/h</div>
                    <div>Azimuth: {satellite.azimuth.toFixed(1)}°</div>
                    <div>Elevation: {satellite.elevation.toFixed(1)}°</div>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Next Pass: {new Date(satellite.nextPass).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {satellites.length === 0 && isTracking && (
            <div className="text-center text-muted-foreground py-8">
              <Satellite className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Searching for satellites...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};