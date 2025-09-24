import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Keyboard, 
  Mouse, 
  Zap,
  ExternalLink,
  BookOpen,
  Video
} from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  const shortcuts = [
    { key: 'Ctrl+N', action: 'New Analysis Session' },
    { key: 'Ctrl+O', action: 'Open Data Source' },
    { key: 'Ctrl+E', action: 'Export Current Data' },
    { key: 'Ctrl+A', action: 'Start Analysis' },
    { key: 'Space', action: 'Pause/Resume Analysis' },
    { key: 'F11', action: 'Toggle Fullscreen' },
    { key: 'Esc', action: 'Cancel Current Operation' },
    { key: '1-4', action: 'Switch Planet Views' },
  ];

  const mouseControls = [
    { action: 'Left Click + Drag', description: 'Rotate planet view' },
    { action: 'Right Click + Drag', description: 'Pan camera' },
    { action: 'Mouse Wheel', description: 'Zoom in/out' },
    { action: 'Double Click', description: 'Focus on point' },
    { action: 'Ctrl + Click', description: 'Set analysis point' },
  ];

  const quickSteps = [
    {
      step: 1,
      title: 'Select Planet',
      description: 'Choose Earth, Mars, Moon, or Universe from the Explorer panel'
    },
    {
      step: 2,
      title: 'Configure Data',
      description: 'Set imagery source, resolution, and coordinates in the View Controls'
    },
    {
      step: 3,
      title: 'Acquire Data',
      description: 'Click "Acquire Data" to load satellite imagery for your target'
    },
    {
      step: 4,
      title: 'Run Analysis',
      description: 'Select an analysis tool (Anomaly, Thermal, Spectral, Structural) and click "Run Analysis"'
    },
    {
      step: 5,
      title: 'Export Results',
      description: 'Export your findings in GeoJSON, CSV, or JSON format'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-sm border-primary/20 max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-glow">
            <HelpCircle className="w-8 h-8 mr-3 text-primary" />
            Help & Support
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="getting-started" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 h-96 overflow-y-auto">
            <TabsContent value="getting-started" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Quick Start Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quickSteps.map((step) => (
                      <div key={step.step} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="controls" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Keyboard className="w-5 h-5 mr-2 text-primary" />
                      Keyboard Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {shortcut.key}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mouse className="w-5 h-5 mr-2 text-primary" />
                      Mouse Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mouseControls.map((control, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {control.action}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{control.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">Analysis Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">🔍 Anomaly Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Identify unusual patterns, structural changes, and thermal anomalies in satellite imagery.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">🌡️ Thermal Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze surface temperatures, heat islands, and thermal gradients.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">🎨 Spectral Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Process multispectral data across different wavelength bands.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">🏔️ Structural Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Detect buildings, roads, water bodies, and infrastructure changes.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">🛰️ Sentinel-2</h4>
                      <p className="text-sm text-muted-foreground">
                        ESA's high-resolution multispectral imaging mission.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">🌍 Landsat 8/9</h4>
                      <p className="text-sm text-muted-foreground">
                        NASA/USGS Earth observation satellites.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">📡 MODIS</h4>
                      <p className="text-sm text-muted-foreground">
                        Moderate Resolution Imaging Spectroradiometer data.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">🌐 NASA Earth Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive Earth science data collection.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-primary" />
                      Technical Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => window.open('mailto:playnexushq@gmail.com')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Email: playnexushq@gmail.com
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => window.open('https://playnexus.com', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website: playnexus.com
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Response Time</h4>
                      <p className="text-sm text-muted-foreground">
                        We typically respond to support requests within 24-48 hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="w-5 h-5 mr-2 text-primary" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Documentation</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprehensive guides and API documentation available.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Common Issues</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Clear browser cache if experiencing loading issues</li>
                        <li>• Ensure stable internet connection for data acquisition</li>
                        <li>• Use Chrome or Firefox for best performance</li>
                        <li>• WebGL support required for 3D visualization</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};