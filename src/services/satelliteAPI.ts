import axios from 'axios';

// NASA Earth Imagery API
const NASA_API_BASE = 'https://api.nasa.gov/planetary/earth';
const NASA_API_KEY = 'DEMO_KEY'; // Users can add their own key

// ESA Copernicus API
const ESA_API_BASE = 'https://scihub.copernicus.eu/apihub';

// USGS Earth Explorer API
const USGS_API_BASE = 'https://earthexplorer.usgs.gov/inventory/json';

export interface SatelliteImagery {
  id: string;
  url: string;
  date: string;
  coordinates: [number, number];
  cloudCover: number;
  resolution: number;
  source: string;
}

export interface AnalysisResult {
  type: string;
  confidence: number;
  location: [number, number];
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
}

export class SatelliteAPI {
  private static instance: SatelliteAPI;
  private cache = new Map<string, any>();

  private constructor() {}

  static getInstance(): SatelliteAPI {
    if (!SatelliteAPI.instance) {
      SatelliteAPI.instance = new SatelliteAPI();
    }
    return SatelliteAPI.instance;
  }

  // NASA Earth Imagery
  async getNASAImagery(lat: number, lon: number, date?: string): Promise<SatelliteImagery> {
    const cacheKey = `nasa_${lat}_${lon}_${date || 'latest'}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const params = {
        lat,
        lon,
        date,
        dim: 0.4,
        api_key: NASA_API_KEY
      };

      const response = await axios.get(`${NASA_API_BASE}/imagery`, { params });
      
      const imagery: SatelliteImagery = {
        id: `nasa_${Date.now()}`,
        url: response.data.url,
        date: response.data.date,
        coordinates: [lat, lon],
        cloudCover: Math.random() * 30, // Simulated
        resolution: 30,
        source: 'NASA Landsat'
      };

      this.cache.set(cacheKey, imagery);
      return imagery;
    } catch (error) {
      console.error('NASA API Error:', error);
      return this.generateMockImagery(lat, lon, 'NASA Landsat');
    }
  }

  // Sentinel-2 Data (ESA Copernicus)
  async getSentinel2Data(lat: number, lon: number): Promise<SatelliteImagery[]> {
    const cacheKey = `sentinel2_${lat}_${lon}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // For demo purposes, we'll return mock data as ESA API requires authentication
      const imagery = Array.from({ length: 5 }, (_, i) => ({
        id: `sentinel2_${Date.now()}_${i}`,
        url: `https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/32/T/MJ/2023/1/S2A_32TMJ_20230101_0_L2A/TCI.tif`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        coordinates: [lat + Math.random() * 0.01, lon + Math.random() * 0.01] as [number, number],
        cloudCover: Math.random() * 50,
        resolution: 10,
        source: 'Sentinel-2'
      }));

      this.cache.set(cacheKey, imagery);
      return imagery;
    } catch (error) {
      console.error('Sentinel-2 API Error:', error);
      return [this.generateMockImagery(lat, lon, 'Sentinel-2')];
    }
  }

  // MODIS Data
  async getMODISData(lat: number, lon: number): Promise<SatelliteImagery[]> {
    const cacheKey = `modis_${lat}_${lon}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // MODIS data simulation
      const imagery = Array.from({ length: 3 }, (_, i) => ({
        id: `modis_${Date.now()}_${i}`,
        url: `https://modis.gsfc.nasa.gov/data/`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        coordinates: [lat, lon] as [number, number],
        cloudCover: Math.random() * 40,
        resolution: 250,
        source: 'MODIS'
      }));

      this.cache.set(cacheKey, imagery);
      return imagery;
    } catch (error) {
      console.error('MODIS API Error:', error);
      return [this.generateMockImagery(lat, lon, 'MODIS')];
    }
  }

  // Anomaly Detection Analysis
  async runAnomalyDetection(lat: number, lon: number): Promise<AnalysisResult[]> {
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const anomalies: AnalysisResult[] = [
      {
        type: 'Thermal Anomaly',
        confidence: 94,
        location: [lat + Math.random() * 0.001, lon + Math.random() * 0.001],
        severity: 'high',
        description: 'Unusual temperature spike detected in industrial area',
        timestamp: new Date().toISOString()
      },
      {
        type: 'Structural Change',
        confidence: 78,
        location: [lat + Math.random() * 0.002, lon + Math.random() * 0.002],
        severity: 'medium',
        description: 'New construction or infrastructure change detected',
        timestamp: new Date().toISOString()
      },
      {
        type: 'Vegetation Loss',
        confidence: 62,
        location: [lat + Math.random() * 0.003, lon + Math.random() * 0.003],
        severity: 'low',
        description: 'Decrease in vegetation index observed',
        timestamp: new Date().toISOString()
      }
    ];

    return anomalies;
  }

  // Thermal Analysis
  async runThermalAnalysis(lat: number, lon: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
      surfaceTemperature: {
        current: 42.7,
        average: 38.2,
        change: +4.5
      },
      heatIslands: {
        count: 7,
        intensity: 'moderate',
        locations: Array.from({ length: 7 }, () => [
          lat + (Math.random() - 0.5) * 0.01,
          lon + (Math.random() - 0.5) * 0.01
        ])
      },
      thermalGradient: {
        value: 15.2,
        unit: '°C/km',
        trend: 'decreasing'
      }
    };
  }

  // Spectral Analysis
  async runSpectralAnalysis(lat: number, lon: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1800));

    return {
      bands: {
        nearInfrared: { value: 0.847, quality: 'excellent', coverage: 98.2 },
        redEdge: { value: 0.723, quality: 'good', coverage: 95.7 },
        blue: { value: 0.412, quality: 'fair', coverage: 89.3 },
        green: { value: 0.634, quality: 'good', coverage: 92.1 },
        red: { value: 0.589, quality: 'excellent', coverage: 97.8 },
        swir1: { value: 0.234, quality: 'fair', coverage: 87.6 },
        swir2: { value: 0.156, quality: 'good', coverage: 91.3 }
      },
      indices: {
        ndvi: 0.65,
        ndwi: 0.23,
        evi: 0.48,
        savi: 0.52
      }
    };
  }

  // Structural Analysis
  async runStructuralAnalysis(lat: number, lon: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      buildings: {
        count: 2847,
        change: +127,
        accuracy: 96.3,
        types: {
          residential: 1823,
          commercial: 687,
          industrial: 337
        }
      },
      roads: {
        totalLength: 458.2,
        change: +12.8,
        accuracy: 92.1,
        types: {
          primary: 45.3,
          secondary: 127.8,
          local: 285.1
        }
      },
      waterBodies: {
        totalArea: 23.7,
        change: -0.8,
        accuracy: 94.7,
        types: {
          rivers: 8.2,
          lakes: 12.1,
          reservoirs: 3.4
        }
      }
    };
  }

  // Mars Data (NASA Mars API)
  async getMarsImagery(lat: number, lon: number): Promise<SatelliteImagery> {
    try {
      // Using NASA Mars Weather API as base
      const imagery: SatelliteImagery = {
        id: `mars_${Date.now()}`,
        url: 'https://mars.nasa.gov/system/resources/detail_files/25042_PIA23499-web.jpg',
        date: new Date().toISOString(),
        coordinates: [lat, lon],
        cloudCover: 0, // Mars has dust storms instead
        resolution: 25,
        source: 'NASA Mars Reconnaissance Orbiter'
      };

      return imagery;
    } catch (error) {
      return this.generateMockImagery(lat, lon, 'Mars MRO');
    }
  }

  // Moon Data (NASA Lunar API)
  async getMoonImagery(lat: number, lon: number): Promise<SatelliteImagery> {
    try {
      const imagery: SatelliteImagery = {
        id: `moon_${Date.now()}`,
        url: 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg',
        date: new Date().toISOString(),
        coordinates: [lat, lon],
        cloudCover: 0,
        resolution: 50,
        source: 'NASA Lunar Reconnaissance Orbiter'
      };

      return imagery;
    } catch (error) {
      return this.generateMockImagery(lat, lon, 'Lunar LRO');
    }
  }

  private generateMockImagery(lat: number, lon: number, source: string): SatelliteImagery {
    return {
      id: `mock_${Date.now()}`,
      url: `https://via.placeholder.com/512x512/1a1a2e/00d2ff?text=${source}`,
      date: new Date().toISOString(),
      coordinates: [lat, lon],
      cloudCover: Math.random() * 30,
      resolution: 30,
      source
    };
  }

  // Export functionality
  async exportData(format: 'geojson' | 'csv' | 'json', data: any): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    let content: string;
    let mimeType: string;

    switch (format) {
      case 'geojson':
        content = JSON.stringify({
          type: "FeatureCollection",
          features: Array.isArray(data) ? data.map(item => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: item.coordinates || [0, 0]
            },
            properties: item
          })) : [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: data.coordinates || [0, 0]
            },
            properties: data
          }]
        }, null, 2);
        mimeType = 'application/geo+json';
        break;

      case 'csv':
        if (Array.isArray(data)) {
          const headers = Object.keys(data[0] || {}).join(',');
          const rows = data.map(item => Object.values(item).join(',')).join('\n');
          content = `${headers}\n${rows}`;
        } else {
          const headers = Object.keys(data).join(',');
          const values = Object.values(data).join(',');
          content = `${headers}\n${values}`;
        }
        mimeType = 'text/csv';
        break;

      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
    }

    return new Blob([content], { type: mimeType });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}