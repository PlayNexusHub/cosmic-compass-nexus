import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { PlanetType, AnalysisType } from './SatelliteApp';

interface AnalysisPanelProps {
  activeAnalysis: AnalysisType | null;
  isAnalyzing: boolean;
  planet: PlanetType;
}

const analysisResults = {
  anomaly: [
    { type: 'Thermal Anomaly', severity: 'high', location: '34.0522°N, 118.2437°W', confidence: 94 },
    { type: 'Structural Change', severity: 'medium', location: '40.7128°N, 74.0060°W', confidence: 78 },
    { type: 'Vegetation Loss', severity: 'low', location: '51.5074°N, 0.1278°W', confidence: 62 },
  ],
  thermal: [
    { metric: 'Surface Temperature', value: '42.7°C', trend: 'increasing', change: '+2.3°C' },
    { metric: 'Heat Islands', value: '7 detected', trend: 'stable', change: '±0' },
    { metric: 'Thermal Gradient', value: '15.2°C/km', trend: 'decreasing', change: '-1.1°C/km' },
  ],
  spectral: [
    { band: 'Near Infrared', value: '0.847', quality: 'excellent', coverage: '98.2%' },
    { band: 'Red Edge', value: '0.723', quality: 'good', coverage: '95.7%' },
    { band: 'Blue', value: '0.412', quality: 'fair', coverage: '89.3%' },
  ],
  structural: [
    { feature: 'Buildings', count: 2847, change: '+127', accuracy: '96.3%' },
    { feature: 'Roads', length: '458.2 km', change: '+12.8 km', accuracy: '92.1%' },
    { feature: 'Water Bodies', area: '23.7 km²', change: '-0.8 km²', accuracy: '94.7%' },
  ],
};

export const AnalysisPanel = ({ 
  activeAnalysis, 
  isAnalyzing, 
  planet 
}: AnalysisPanelProps) => {
  const getProgressValue = () => {
    if (!isAnalyzing) return 100;
    return Math.min(75, Date.now() % 1000 / 10);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-warning" />;
      case 'decreasing': return <TrendingUp className="w-3 h-3 text-success rotate-180" />;
      default: return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  if (!activeAnalysis) {
    return (
      <Card className="bg-card/30 backdrop-blur-sm border-primary/20 h-64">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Analysis Active
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Select an analysis tool to view results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-primary/20 h-64">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-glow capitalize">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            {activeAnalysis} Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {planet}
            </Badge>
            {isAnalyzing ? (
              <Badge variant="default" className="animate-pulse-glow">
                <Clock className="w-3 h-3 mr-1" />
                Processing
              </Badge>
            ) : (
              <Badge variant="secondary">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
        
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{getProgressValue().toFixed(0)}%</span>
            </div>
            <Progress 
              value={getProgressValue()} 
              className="h-2" 
            />
          </motion.div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-3">
            {activeAnalysis === 'anomaly' && analysisResults.anomaly.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(result.severity)}`} />
                      <span className="text-sm font-medium">{result.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{result.location}</p>
                  </div>
                  <Badge 
                    variant={result.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {result.confidence}%
                  </Badge>
                </div>
              </motion.div>
            ))}

            {activeAnalysis === 'thermal' && analysisResults.thermal.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(result.trend)}
                    <span className="text-sm font-medium">{result.metric}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{result.value}</div>
                    <div className="text-xs text-muted-foreground">{result.change}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeAnalysis === 'spectral' && analysisResults.spectral.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{result.band}</span>
                    <div className="text-xs text-muted-foreground">
                      Coverage: {result.coverage}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{result.value}</div>
                    <Badge variant="outline" className="text-xs">
                      {result.quality}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeAnalysis === 'structural' && analysisResults.structural.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{result.feature}</span>
                    <div className="text-xs text-muted-foreground">
                      Accuracy: {result.accuracy}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{result.count || result.length || result.area}</div>
                    <div className="text-xs text-success">{result.change}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};