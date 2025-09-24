import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Info, 
  Settings, 
  Satellite,
  Wifi,
  WifiOff
} from 'lucide-react';
import { PlanetType } from './SatelliteApp';
import { AboutModal } from './modals/AboutModal';
import { HelpModal } from './modals/HelpModal';
import { SettingsModal } from './modals/SettingsModal';

interface HeaderProps {
  currentPlanet: PlanetType;
  isAnalyzing: boolean;
}

export const Header = ({ currentPlanet, isAnalyzing }: HeaderProps) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  return (
    <>
      <header className="bg-card/50 backdrop-blur-sm border-b border-primary/20 px-6 py-4 flex items-center justify-between shadow-elevation">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isAnalyzing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            >
              <Satellite className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-glow">SatellitePro</h1>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="capitalize">
            {currentPlanet}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-muted/20">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(true)}
              className="btn-glow"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAbout(true)}
              className="btn-glow"
            >
              <Info className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="btn-glow"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <AboutModal 
        open={showAbout} 
        onOpenChange={setShowAbout} 
      />
      
      <HelpModal 
        open={showHelp} 
        onOpenChange={setShowHelp} 
      />
      
      <SettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </>
  );
};