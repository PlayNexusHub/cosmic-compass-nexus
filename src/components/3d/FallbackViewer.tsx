import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Globe, RefreshCw } from 'lucide-react';
import { PlanetType, AnalysisType } from '../SatelliteApp';

interface FallbackViewerProps {
  planet: PlanetType;
  activeAnalysis: AnalysisType | null;
  onRetry: () => void;
}

const planetEmojis = {
  earth: '🌍',
  mars: '🔴',
  moon: '🌙',
  universe: '🌌'
};

const planetColors = {
  earth: 'from-blue-500 to-green-500',
  mars: 'from-red-500 to-orange-500', 
  moon: 'from-gray-300 to-gray-500',
  universe: 'from-purple-500 to-indigo-500'
};

export const FallbackViewer = ({ planet, activeAnalysis, onRetry }: FallbackViewerProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-space p-8">
      <Alert className="max-w-md mb-6 border-warning/30 bg-warning/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          3D visualization temporarily unavailable. Using 2D fallback view.
        </AlertDescription>
      </Alert>

      <Card className="w-96 h-96 bg-card/90 backdrop-blur-sm border-primary/20 shadow-glow">
        <CardContent className="p-8 h-full flex flex-col items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${planetColors[planet]} flex items-center justify-center mb-6 shadow-glow`}
          >
            <span className="text-6xl">{planetEmojis[planet]}</span>
          </motion.div>

          <h3 className="text-2xl font-bold text-glow capitalize mb-2">
            {planet}
          </h3>

          {activeAnalysis && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-2 text-primary"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">
                {activeAnalysis} Analysis Active
              </span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="mt-6 flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/30 text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry 3D View</span>
          </motion.button>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground max-w-md">
        <p>
          The 3D viewer requires WebGL support. Please ensure your browser supports WebGL 
          or try refreshing the page.
        </p>
      </div>
    </div>
  );
};