import { useState, useEffect } from 'react';
import { SatelliteAPI, SatelliteImagery, AnalysisResult } from '@/services/satelliteAPI';
import { PlanetType, AnalysisType } from '@/components/SatelliteApp';
import { useToast } from '@/hooks/use-toast';

interface UseSatelliteDataReturn {
  imagery: SatelliteImagery[];
  analysisResults: AnalysisResult[] | null;
  isLoading: boolean;
  error: string | null;
  acquireData: (lat: number, lon: number, source: string) => Promise<void>;
  runAnalysis: (type: AnalysisType, lat: number, lon: number) => Promise<void>;
  exportData: (format: 'geojson' | 'csv' | 'json') => Promise<void>;
}

export const useSatelliteData = (planet: PlanetType): UseSatelliteDataReturn => {
  const [imagery, setImagery] = useState<SatelliteImagery[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const api = SatelliteAPI.getInstance();

  const acquireData = async (lat: number, lon: number, source: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let data: SatelliteImagery | SatelliteImagery[];

      switch (planet) {
        case 'earth':
          switch (source) {
            case 'nasa':
              data = await api.getNASAImagery(lat, lon);
              break;
            case 'sentinel2':
              data = await api.getEnhancedSentinel2(lat, lon);
              break;
            case 'modis':
              data = await api.getMODISData(lat, lon);
              break;
            case 'esa':
              data = await api.getEnhancedSentinel2(lat, lon);
              break;
            case 'usgs':
              data = await api.getNASAImagery(lat, lon); // USGS uses similar endpoints
              break;
            case 'planet':
              data = await api.getSentinel2Data(lat, lon); // Planet fallback to Sentinel
              break;
            case 'maxar':
              data = await api.getNASAImagery(lat, lon); // Maxar fallback to NASA
              break;
            default:
              data = await api.getNASAImagery(lat, lon);
          }
          break;
        
        case 'mars':
          data = await api.getMarsImagery(lat, lon);
          break;
        
        case 'moon':
          data = await api.getMoonImagery(lat, lon);
          break;
        
        case 'universe':
          // For universe view, we'll use a combination of sources
          data = await api.getNASAImagery(lat, lon);
          break;
        
        default:
          data = await api.getNASAImagery(lat, lon);
      }

      setImagery(Array.isArray(data) ? data : [data]);
      
      toast({
        title: "Data Acquired Successfully",
        description: `Loaded ${Array.isArray(data) ? data.length : 1} satellite image(s) for ${planet}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to acquire satellite data';
      setError(errorMessage);
      
      toast({
        title: "Data Acquisition Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async (type: AnalysisType, lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    try {
      let results: any;

      switch (type) {
        case 'anomaly':
          results = await api.runAnomalyDetection(lat, lon);
          setAnalysisResults(results);
          break;
        
        case 'thermal':
          results = await api.runThermalAnalysis(lat, lon);
          // Convert thermal data to analysis results format
          setAnalysisResults([{
            type: 'Thermal Analysis',
            confidence: 95,
            location: [lat, lon],
            severity: 'medium' as const,
            description: `Surface temperature: ${results.surfaceTemperature.current}°C`,
            timestamp: new Date().toISOString()
          }]);
          break;
        
        case 'spectral':
          results = await api.runSpectralAnalysis(lat, lon);
          setAnalysisResults([{
            type: 'Spectral Analysis',
            confidence: 92,
            location: [lat, lon],
            severity: 'low' as const,
            description: `NDVI: ${results.indices.ndvi}`,
            timestamp: new Date().toISOString()
          }]);
          break;
        
        case 'structural':
          results = await api.runStructuralAnalysis(lat, lon);
          setAnalysisResults([{
            type: 'Structural Analysis',
            confidence: 89,
            location: [lat, lon],
            severity: 'medium' as const,
            description: `Buildings detected: ${results.buildings.count}`,
            timestamp: new Date().toISOString()
          }]);
          break;
      }

      toast({
        title: "Analysis Complete",
        description: `${type} analysis finished successfully`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'geojson' | 'csv' | 'json') => {
    try {
      const dataToExport = analysisResults || imagery;
      const blob = await api.exportData(format, dataToExport);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `satellite_data_${planet}_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()} file`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Clear data when planet changes
  useEffect(() => {
    setImagery([]);
    setAnalysisResults(null);
    setError(null);
  }, [planet]);

  return {
    imagery,
    analysisResults,
    isLoading,
    error,
    acquireData,
    runAnalysis,
    exportData
  };
};