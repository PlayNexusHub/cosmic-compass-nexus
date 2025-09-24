import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Satellite, 
  Radio, 
  MapPin, 
  Clock,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SatelliteTrackingData {
  name: string;
  noradId: number;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: number;
  visibility: 'visible' | 'eclipsed' | 'daylight';
  nextPass: string;
  elevation: number;
  azimuth: number;
}

export const RealTimeSatelliteTracker = () => {
  const [satellites, setSatellites] = useState<SatelliteTrackingData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Mock real-time satellite data
  const generateMockSatellites = (): SatelliteTrackingData[] => {
    const satelliteNames = [
      'ISS (ZARYA)',
      'LANDSAT 8',
      'SENTINEL-2A',
      'NOAA-20',
      'TERRA',
      'AQUA',
      'SPOT-7',
      'WORLDVIEW-3'
    ];

    return satelliteNames.map((name, index) => ({
      name,
      noradId: 25544 + index,
      position: {
        latitude: (Math.random() - 0.5) * 180,
        longitude: (Math.random() - 0.5) * 360,
        altitude: 400 + Math.random() * 500,
      },
      velocity: 7.5 + Math.random() * 0.5,
      visibility: ['visible', 'eclipsed', 'daylight'][Math.floor(Math.random() * 3)] as any,
      nextPass: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      elevation: Math.random() * 90,
      azimuth: Math.random() * 360,
    }));
  };

  const startTracking = () => {
    setIsTracking(true);
    setSatellites(generateMockSatellites());
    setLastUpdate(new Date());
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const refreshData = () => {
    if (isTracking) {
      setSatellites(generateMockSatellites());
      setLastUpdate(new Date());
    }
  };

  // Auto-refresh every 10 seconds when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        refreshData();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'visible':
        return 'text-success';
      case 'eclipsed':
        return 'text-muted-foreground';
      case 'daylight':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'visible':
        return <Eye className="w-3 h-3" />;
      case 'eclipsed':
        return <Radio className="w-3 h-3" />;
      case 'daylight':
        return <Zap className="w-3 h-3" />;
      default:
        return <Radio className="w-3 h-3" />;
    }
  };

  return (
    <Card className="w-full bg-card/30 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-glow">
            <Satellite className="w-5 h-5 mr-2 text-primary" />
            Real-Time Satellite Tracker
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? 'Active' : 'Inactive'}
            </Badge>
            {isTracking ? (
              <Button variant="outline" size="sm" onClick={stopTracking}>
                Stop
              </Button>
            ) : (
              <Button size="sm" onClick={startTracking}>
                Start Tracking
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={refreshData} disabled={!isTracking}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {lastUpdate && (
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!isTracking ? (
          <div className="text-center py-8">
            <Satellite className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Click "Start Tracking" to monitor real-time satellite positions
            </p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {satellites.map((satellite, index) => (
                <motion.div
                  key={satellite.noradId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-muted/20 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{satellite.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        NORAD ID: {satellite.noradId}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getVisibilityColor(satellite.visibility)}`}>
                      {getVisibilityIcon(satellite.visibility)}
                      <span className="text-xs capitalize">{satellite.visibility}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-mono">
                          {satellite.position.latitude.toFixed(2)}°, {satellite.position.longitude.toFixed(2)}°
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Altitude:</span>
                        <span className="font-mono">{satellite.position.altitude.toFixed(0)} km</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Velocity:</span>
                        <span className="font-mono">{satellite.velocity.toFixed(1)} km/s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Elevation:</span>
                        <span className="font-mono">{satellite.elevation.toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Next pass:</span>
                      </div>
                      <span className="font-mono text-primary">
                        {new Date(satellite.nextPass).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};