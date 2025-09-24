import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Monitor, 
  Database, 
  Zap,
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    // Display Settings
    fps: 60,
    quality: 'high',
    antiAliasing: true,
    shadows: true,
    reflections: false,
    
    // Performance Settings
    autoOptimize: true,
    backgroundProcessing: true,
    cacheSize: 1024,
    maxConcurrentRequests: 5,
    
    // Data Settings
    defaultDataSource: 'sentinel2',
    autoRefresh: true,
    refreshInterval: 30,
    compressionLevel: 'medium',
    
    // Privacy Settings
    telemetry: true,
    crashReports: true,
    analytics: false,
    
    // Advanced Settings
    apiTimeout: 30,
    retryAttempts: 3,
    debugMode: false,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fps: 60,
      quality: 'high',
      antiAliasing: true,
      shadows: true,
      reflections: false,
      autoOptimize: true,
      backgroundProcessing: true,
      cacheSize: 1024,
      maxConcurrentRequests: 5,
      defaultDataSource: 'sentinel2',
      autoRefresh: true,
      refreshInterval: 30,
      compressionLevel: 'medium',
      telemetry: true,
      crashReports: true,
      analytics: false,
      apiTimeout: 30,
      retryAttempts: 3,
      debugMode: false,
    });
  };

  const saveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('satellitePro_settings', JSON.stringify(settings));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-sm border-primary/20 max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-glow">
            <Settings className="w-8 h-8 mr-3 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="display" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 h-96 overflow-y-auto">
            <TabsContent value="display" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2 text-primary" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fps">Target FPS: {settings.fps}</Label>
                        <Slider
                          id="fps"
                          min={30}
                          max={120}
                          step={15}
                          value={[settings.fps]}
                          onValueChange={(value) => updateSetting('fps', value[0])}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>30 FPS</span>
                          <span>120 FPS</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="quality">Render Quality</Label>
                        <Select value={settings.quality} onValueChange={(value) => updateSetting('quality', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="ultra">Ultra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="antiAliasing">Anti-Aliasing</Label>
                        <Switch
                          id="antiAliasing"
                          checked={settings.antiAliasing}
                          onCheckedChange={(checked) => updateSetting('antiAliasing', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="shadows">Dynamic Shadows</Label>
                        <Switch
                          id="shadows"
                          checked={settings.shadows}
                          onCheckedChange={(checked) => updateSetting('shadows', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="reflections">Reflections</Label>
                        <Switch
                          id="reflections"
                          checked={settings.reflections}
                          onCheckedChange={(checked) => updateSetting('reflections', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    Performance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Optimize</Label>
                          <p className="text-xs text-muted-foreground">Automatically adjust settings for optimal performance</p>
                        </div>
                        <Switch
                          checked={settings.autoOptimize}
                          onCheckedChange={(checked) => updateSetting('autoOptimize', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Background Processing</Label>
                          <p className="text-xs text-muted-foreground">Continue analysis when app is in background</p>
                        </div>
                        <Switch
                          checked={settings.backgroundProcessing}
                          onCheckedChange={(checked) => updateSetting('backgroundProcessing', checked)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cacheSize">Cache Size: {settings.cacheSize}MB</Label>
                        <Slider
                          id="cacheSize"
                          min={256}
                          max={4096}
                          step={256}
                          value={[settings.cacheSize]}
                          onValueChange={(value) => updateSetting('cacheSize', value[0])}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="maxRequests">Max Concurrent Requests: {settings.maxConcurrentRequests}</Label>
                        <Slider
                          id="maxRequests"
                          min={1}
                          max={10}
                          step={1}
                          value={[settings.maxConcurrentRequests]}
                          onValueChange={(value) => updateSetting('maxConcurrentRequests', value[0])}
                          className="mt-2"
                        />
                      </div>

                      <div className="p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold mb-2">System Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">CPU Usage</span>
                            <Badge variant="outline">24%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">GPU Usage</span>
                            <Badge variant="outline">15%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Memory</span>
                            <Badge variant="outline">2.1GB</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-primary" />
                    Data Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="defaultDataSource">Default Data Source</Label>
                        <Select value={settings.defaultDataSource} onValueChange={(value) => updateSetting('defaultDataSource', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sentinel2">Sentinel-2</SelectItem>
                            <SelectItem value="landsat8">Landsat 8</SelectItem>
                            <SelectItem value="landsat9">Landsat 9</SelectItem>
                            <SelectItem value="modis">MODIS</SelectItem>
                            <SelectItem value="nasa">NASA Earth Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Refresh</Label>
                          <p className="text-xs text-muted-foreground">Automatically refresh data</p>
                        </div>
                        <Switch
                          checked={settings.autoRefresh}
                          onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="refreshInterval">Refresh Interval: {settings.refreshInterval}s</Label>
                        <Slider
                          id="refreshInterval"
                          min={10}
                          max={300}
                          step={10}
                          value={[settings.refreshInterval]}
                          onValueChange={(value) => updateSetting('refreshInterval', value[0])}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="compression">Compression Level</Label>
                        <Select value={settings.compressionLevel} onValueChange={(value) => updateSetting('compressionLevel', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="apiTimeout">API Timeout: {settings.apiTimeout}s</Label>
                        <Slider
                          id="apiTimeout"
                          min={10}
                          max={120}
                          step={5}
                          value={[settings.apiTimeout]}
                          onValueChange={(value) => updateSetting('apiTimeout', value[0])}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="retryAttempts">Retry Attempts: {settings.retryAttempts}</Label>
                        <Slider
                          id="retryAttempts"
                          min={1}
                          max={10}
                          step={1}
                          value={[settings.retryAttempts]}
                          onValueChange={(value) => updateSetting('retryAttempts', value[0])}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Telemetry Data</Label>
                        <p className="text-xs text-muted-foreground">Send anonymous usage data to help improve the app</p>
                      </div>
                      <Switch
                        checked={settings.telemetry}
                        onCheckedChange={(checked) => updateSetting('telemetry', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Crash Reports</Label>
                        <p className="text-xs text-muted-foreground">Automatically send crash reports</p>
                      </div>
                      <Switch
                        checked={settings.crashReports}
                        onCheckedChange={(checked) => updateSetting('crashReports', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics</Label>
                        <p className="text-xs text-muted-foreground">Track feature usage for analytics</p>
                      </div>
                      <Switch
                        checked={settings.analytics}
                        onCheckedChange={(checked) => updateSetting('analytics', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Debug Mode</Label>
                        <p className="text-xs text-muted-foreground">Enable detailed logging and debug information</p>
                      </div>
                      <Switch
                        checked={settings.debugMode}
                        onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold mb-4">Data Management</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full">
                        Export Settings
                      </Button>
                      <Button variant="outline" className="w-full">
                        Clear All Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button variant="outline" onClick={resetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};