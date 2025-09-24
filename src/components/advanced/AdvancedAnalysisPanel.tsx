import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Settings, 
  Zap, 
  TrendingUp,
  Target,
  Filter,
  Layers,
  BarChart3
} from 'lucide-react';

interface AnalysisParameters {
  sensitivity: number;
  confidenceThreshold: number;
  spatialResolution: number;
  temporalWindow: number;
  algorithmType: string;
  enableMachineLearning: boolean;
  useNeuralNetwork: boolean;
  multiSpectralAnalysis: boolean;
}

interface AdvancedAnalysisPanelProps {
  onRunAdvancedAnalysis: (params: AnalysisParameters) => void;
  isAnalyzing: boolean;
}

export const AdvancedAnalysisPanel = ({ onRunAdvancedAnalysis, isAnalyzing }: AdvancedAnalysisPanelProps) => {
  const [parameters, setParameters] = useState<AnalysisParameters>({
    sensitivity: 75,
    confidenceThreshold: 85,
    spatialResolution: 10,
    temporalWindow: 30,
    algorithmType: 'adaptive',
    enableMachineLearning: true,
    useNeuralNetwork: false,
    multiSpectralAnalysis: true,
  });

  const updateParameter = <K extends keyof AnalysisParameters>(
    key: K,
    value: AnalysisParameters[K]
  ) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const runAnalysis = () => {
    onRunAdvancedAnalysis(parameters);
  };

  const presetConfigurations = {
    conservative: {
      sensitivity: 50,
      confidenceThreshold: 95,
      spatialResolution: 30,
      temporalWindow: 60,
      algorithmType: 'conservative',
    },
    balanced: {
      sensitivity: 75,
      confidenceThreshold: 85,
      spatialResolution: 10,
      temporalWindow: 30,
      algorithmType: 'adaptive',
    },
    aggressive: {
      sensitivity: 95,
      confidenceThreshold: 70,
      spatialResolution: 5,
      temporalWindow: 15,
      algorithmType: 'aggressive',
    },
  };

  const applyPreset = (preset: keyof typeof presetConfigurations) => {
    setParameters(prev => ({
      ...prev,
      ...presetConfigurations[preset],
    }));
  };

  return (
    <Card className="w-full bg-card/30 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-glow">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          Advanced Analysis Engine
        </CardTitle>
        <div className="flex space-x-2">
          {Object.keys(presetConfigurations).map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset as keyof typeof presetConfigurations)}
              className="capitalize"
            >
              {preset}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Sensitivity: {parameters.sensitivity}%</span>
                  </Label>
                  <Slider
                    value={[parameters.sensitivity]}
                    onValueChange={(value) => updateParameter('sensitivity', value[0])}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher values detect more anomalies but may increase false positives
                  </p>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Confidence Threshold: {parameters.confidenceThreshold}%</span>
                  </Label>
                  <Slider
                    value={[parameters.confidenceThreshold]}
                    onValueChange={(value) => updateParameter('confidenceThreshold', value[0])}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum confidence level for reporting detections
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Spatial Resolution: {parameters.spatialResolution}m</span>
                  </Label>
                  <Slider
                    value={[parameters.spatialResolution]}
                    onValueChange={(value) => updateParameter('spatialResolution', value[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Analysis grid resolution in meters per pixel
                  </p>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Temporal Window: {parameters.temporalWindow} days</span>
                  </Label>
                  <Slider
                    value={[parameters.temporalWindow]}
                    onValueChange={(value) => updateParameter('temporalWindow', value[0])}
                    min={1}
                    max={365}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Time period for change detection analysis
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithms" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="algorithmType">Detection Algorithm</Label>
                <Select 
                  value={parameters.algorithmType} 
                  onValueChange={(value) => updateParameter('algorithmType', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - High Precision</SelectItem>
                    <SelectItem value="adaptive">Adaptive - Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive - High Recall</SelectItem>
                    <SelectItem value="ensemble">Ensemble - Multiple Algorithms</SelectItem>
                    <SelectItem value="deep_learning">Deep Learning - AI Enhanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <Label className="font-medium">Machine Learning</Label>
                    <p className="text-xs text-muted-foreground">Use ML for pattern recognition</p>
                  </div>
                  <Switch
                    checked={parameters.enableMachineLearning}
                    onCheckedChange={(checked) => updateParameter('enableMachineLearning', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <Label className="font-medium">Neural Network</Label>
                    <p className="text-xs text-muted-foreground">Deep learning analysis</p>
                  </div>
                  <Switch
                    checked={parameters.useNeuralNetwork}
                    onCheckedChange={(checked) => updateParameter('useNeuralNetwork', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <Label className="font-medium">Multi-Spectral</Label>
                    <p className="text-xs text-muted-foreground">Analyze all spectral bands</p>
                  </div>
                  <Switch
                    checked={parameters.multiSpectralAnalysis}
                    onCheckedChange={(checked) => updateParameter('multiSpectralAnalysis', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <Label className="font-medium">Real-time Mode</Label>
                    <p className="text-xs text-muted-foreground">Continuous monitoring</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {/* Analysis Results Visualization */}
                <Card className="p-4 bg-gradient-nebula border-primary/20">
                  <h4 className="font-semibold mb-3">Algorithm Performance</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-success">94.7%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">89.2%</div>
                      <div className="text-xs text-muted-foreground">Precision</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">91.5%</div>
                      <div className="text-xs text-muted-foreground">Recall</div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Processing Speed</span>
                      <Badge variant="secondary">Fast</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      2.3 MP/s average throughput
                    </p>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <Badge variant="outline">Optimal</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      1.2 GB active processing
                    </p>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">GPU Acceleration</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      CUDA cores: 2048/2048
                    </p>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">AI Confidence</span>
                      <Badge variant="default">High</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Model certainty: 96.8%
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-border">
          <Button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full btn-glow"
            size="lg"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Settings />
              </motion.div>
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Running Advanced Analysis...' : 'Run Advanced Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};