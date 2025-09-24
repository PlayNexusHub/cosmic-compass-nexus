import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap,
  Trash2,
  MapPin,
  Gauge
} from 'lucide-react';
import { PlanetType, SatelliteData } from './SatelliteApp';

interface StatusPanelProps {
  satelliteData: SatelliteData;
  currentPlanet: PlanetType;
  isAnalyzing: boolean;
}

export const StatusPanel = ({ 
  satelliteData, 
  currentPlanet, 
  isAnalyzing 
}: StatusPanelProps) => {
  const clearStatus = () => {
    // Reset status logic here
  };

  const statusItems = [
    {
      label: 'Position',
      value: `${satelliteData.position[0].toFixed(4)}°, ${satelliteData.position[1].toFixed(4)}°`,
      icon: MapPin,
      color: 'text-primary'
    },
    {
      label: 'Altitude',
      value: `${satelliteData.altitude}km`,
      icon: Gauge,
      color: 'text-accent'
    },
    {
      label: 'Resolution',
      value: satelliteData.resolution,
      icon: Activity,
      color: 'text-success'
    },
    {
      label: 'FPS',
      value: satelliteData.fps.toString(),
      icon: Zap,
      color: 'text-warning'
    },
    {
      label: 'Memory',
      value: `${satelliteData.memory}MB`,
      icon: HardDrive,
      color: 'text-mars'
    }
  ];

  return (
    <Card className="w-80 bg-card/30 backdrop-blur-sm border-primary/20 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-glow">
            <Cpu className="w-5 h-5 mr-2 text-primary" />
            Status
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isAnalyzing ? "default" : "secondary"}
              className={isAnalyzing ? "animate-pulse-glow" : ""}
            >
              {isAnalyzing ? 'Analyzing' : 'Ready'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearStatus}
              className="btn-glow"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}:
                  </span>
                </div>
                <span className="text-sm font-mono text-foreground">
                  {item.value}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* System Performance */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground">
            System Performance
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span className="text-foreground">
                {isAnalyzing ? '78%' : '24%'}
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: '24%' }}
                animate={{ width: isAnalyzing ? '78%' : '24%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GPU Usage</span>
              <span className="text-foreground">
                {isAnalyzing ? '92%' : '15%'}
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <motion.div
                className="bg-accent h-2 rounded-full"
                initial={{ width: '15%' }}
                animate={{ width: isAnalyzing ? '92%' : '15%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <span className="text-foreground">
                {isAnalyzing ? '125 MB/s' : '2.3 MB/s'}
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <motion.div
                className="bg-success h-2 rounded-full"
                initial={{ width: '8%' }}
                animate={{ width: isAnalyzing ? '65%' : '8%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Current Planet Status */}
        <div className="p-3 bg-gradient-nebula rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Target</span>
            <Badge variant="outline" className="capitalize">
              {currentPlanet}
            </Badge>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {isAnalyzing 
              ? `Running analysis on ${currentPlanet}...`
              : `Monitoring ${currentPlanet} satellite data`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};