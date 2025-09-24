import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PlanetViewer } from './PlanetViewer';
import { StatusPanel } from './StatusPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { LoadingScreen } from './LoadingScreen';
import { useToast } from '@/hooks/use-toast';

export type PlanetType = 'earth' | 'mars' | 'moon' | 'universe';
export type AnalysisType = 'anomaly' | 'thermal' | 'spectral' | 'structural';

export interface SatelliteData {
  position: [number, number];
  altitude: number;
  resolution: string;
  fps: number;
  memory: number;
}

export const SatelliteApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlanet, setCurrentPlanet] = useState<PlanetType>('earth');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [satelliteData, setSatelliteData] = useState<SatelliteData>({
    position: [0, 0],
    altitude: 1000,
    resolution: 'High',
    fps: 60,
    memory: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "SatellitePro Initialized",
        description: "All systems online. Ready for satellite analytics.",
        duration: 3000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handlePlanetChange = (planet: PlanetType) => {
    setCurrentPlanet(planet);
    setActiveAnalysis(null);
    toast({
      title: `Switching to ${planet.charAt(0).toUpperCase() + planet.slice(1)}`,
      description: `Loading ${planet} view and satellite data...`,
    });
  };

  const handleAnalysisStart = (type: AnalysisType) => {
    setActiveAnalysis(type);
    setIsAnalyzing(true);
    
    toast({
      title: `Starting ${type} Analysis`,
      description: `Analyzing satellite data for ${currentPlanet}...`,
    });

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `${type} analysis finished successfully.`,
        duration: 5000,
      });
    }, 3000);
  };

  const handleDataAcquisition = (coordinates: [number, number]) => {
    setSatelliteData(prev => ({
      ...prev,
      position: coordinates
    }));
    
    toast({
      title: "Data Acquired",
      description: `Satellite data acquired for coordinates: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`,
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${format.toUpperCase()}`,
      description: `Generating ${format} export file...`,
    });

    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format.toUpperCase()} file has been generated and downloaded.`,
        duration: 3000,
      });
    }, 1500);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container min-h-screen bg-gradient-space flex flex-col overflow-hidden">
      <Header 
        currentPlanet={currentPlanet}
        isAnalyzing={isAnalyzing}
      />
      
      <main className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPlanet={currentPlanet}
          activeAnalysis={activeAnalysis}
          onPlanetChange={handlePlanetChange}
          onAnalysisStart={handleAnalysisStart}
          onExport={handleExport}
          isAnalyzing={isAnalyzing}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <PlanetViewer
              planet={currentPlanet}
              activeAnalysis={activeAnalysis}
              onDataAcquisition={handleDataAcquisition}
              satelliteData={satelliteData}
            />
          </div>
          
          <div className="flex">
            <div className="flex-1">
              <AnalysisPanel
                activeAnalysis={activeAnalysis}
                isAnalyzing={isAnalyzing}
                planet={currentPlanet}
              />
            </div>
            <StatusPanel
              satelliteData={satelliteData}
              currentPlanet={currentPlanet}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-primary/20 rounded-lg p-8 text-center shadow-glow"
            >
              <div className="animate-spin-slow text-4xl text-primary mb-4">
                🛰️
              </div>
              <h3 className="text-lg font-semibold text-glow mb-2">
                Running {activeAnalysis} Analysis
              </h3>
              <p className="text-muted-foreground">
                Processing satellite data for {currentPlanet}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};