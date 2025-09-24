import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Moon, 
  Star,
  Search,
  Thermometer,
  Palette,
  Mountain,
  FileJson,
  Download,
  Database
} from 'lucide-react';
import { PlanetType, AnalysisType } from './SatelliteApp';

interface SidebarProps {
  currentPlanet: PlanetType;
  activeAnalysis: AnalysisType | null;
  onPlanetChange: (planet: PlanetType) => void;
  onAnalysisStart: (type: AnalysisType) => void;
  onExport: (format: string) => void;
  isAnalyzing: boolean;
}

const planetIcons = {
  earth: Globe,
  mars: Globe,
  moon: Moon,
  universe: Star
};

const planetColors = {
  earth: 'text-earth',
  mars: 'text-mars',
  moon: 'text-moon',
  universe: 'text-primary'
};

const analysisTools = [
  { type: 'anomaly' as AnalysisType, icon: Search, label: 'Anomaly Detection' },
  { type: 'thermal' as AnalysisType, icon: Thermometer, label: 'Thermal Analysis' },
  { type: 'spectral' as AnalysisType, icon: Palette, label: 'Spectral Analysis' },
  { type: 'structural' as AnalysisType, icon: Mountain, label: 'Structural Analysis' },
];

export const Sidebar = ({
  currentPlanet,
  activeAnalysis,
  onPlanetChange,
  onAnalysisStart,
  onExport,
  isAnalyzing
}: SidebarProps) => {
  return (
    <aside className="w-80 bg-card/30 backdrop-blur-sm border-r border-primary/20 p-6 space-y-6 overflow-y-auto">
      {/* Planet Explorer */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-glow flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary" />
          Explorer
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {(['earth', 'mars', 'moon', 'universe'] as PlanetType[]).map((planet) => {
            const Icon = planetIcons[planet];
            const isActive = currentPlanet === planet;
            
            return (
              <Button
                key={planet}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPlanetChange(planet)}
                className={`capitalize flex items-center justify-center space-x-2 btn-glow ${
                  isActive ? 'glow' : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${planetColors[planet]}`} />
                <span>{planet}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Analysis Tools */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Search className="w-4 h-4 mr-2 text-primary" />
          Analysis Tools
        </h4>
        
        <div className="space-y-2">
          {analysisTools.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={activeAnalysis === type ? "default" : "outline"}
              size="sm"
              onClick={() => onAnalysisStart(type)}
              disabled={isAnalyzing}
              className={`w-full justify-start space-x-2 btn-glow ${
                activeAnalysis === type ? 'glow' : ''
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {activeAnalysis === type && (
                <Badge variant="secondary" className="ml-auto">
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Database className="w-4 h-4 mr-2 text-primary" />
          Data Sources
        </h4>
        
        <Select defaultValue="sentinel2">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sentinel2">Sentinel-2</SelectItem>
            <SelectItem value="landsat8">Landsat 8</SelectItem>
            <SelectItem value="landsat9">Landsat 9</SelectItem>
            <SelectItem value="modis">MODIS</SelectItem>
            <SelectItem value="nasa">NASA Earth Data</SelectItem>
            <SelectItem value="esa">ESA Copernicus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Export */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Download className="w-4 h-4 mr-2 text-primary" />
          Export
        </h4>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { format: 'geojson', icon: FileJson, label: 'GeoJSON' },
            { format: 'csv', icon: FileJson, label: 'CSV' },
            { format: 'json', icon: FileJson, label: 'JSON' }
          ].map(({ format, icon: Icon, label }) => (
            <Button
              key={format}
              variant="outline"
              size="sm"
              onClick={() => onExport(format)}
              className="flex flex-col items-center space-y-1 h-auto py-3 btn-glow"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Status Indicator */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="p-4 bg-gradient-nebula rounded-lg border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">System Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            <span className="text-xs text-success">Online</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};