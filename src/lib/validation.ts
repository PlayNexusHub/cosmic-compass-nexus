/**
 * Input validation schemas for SatellitePro
 * PlayNexus - Secure input validation with zod
 */

import { z } from 'zod';

// Coordinate validation
export const coordinateSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90 degrees')
    .max(90, 'Latitude must be between -90 and 90 degrees'),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180 degrees')
    .max(180, 'Longitude must be between -180 and 180 degrees'),
});

// Planet type validation
export const planetSchema = z.enum(['earth', 'mars', 'moon', 'universe'], {
  errorMap: () => ({ message: 'Planet must be one of: earth, mars, moon, universe' })
});

// Analysis type validation
export const analysisTypeSchema = z.enum(['anomaly', 'thermal', 'spectral', 'structural'], {
  errorMap: () => ({ message: 'Analysis type must be one of: anomaly, thermal, spectral, structural' })
});

// Data source validation
export const dataSourceSchema = z.enum([
  'nasa', 'esa', 'usgs', 'planet', 'maxar', 'sentinel2', 'modis'
], {
  errorMap: () => ({ message: 'Invalid data source' })
});

// Resolution validation
export const resolutionSchema = z.enum(['high', 'ultra', 'maximum'], {
  errorMap: () => ({ message: 'Resolution must be one of: high, ultra, maximum' })
});

// Advanced analysis parameters
export const advancedAnalysisSchema = z.object({
  sensitivity: z.number()
    .min(1, 'Sensitivity must be between 1 and 100')
    .max(100, 'Sensitivity must be between 1 and 100'),
  confidenceThreshold: z.number()
    .min(50, 'Confidence threshold must be between 50 and 100')
    .max(100, 'Confidence threshold must be between 50 and 100'),
  spatialResolution: z.number()
    .min(1, 'Spatial resolution must be between 1 and 100 meters')
    .max(100, 'Spatial resolution must be between 1 and 100 meters'),
  temporalWindow: z.number()
    .min(1, 'Temporal window must be between 1 and 365 days')
    .max(365, 'Temporal window must be between 1 and 365 days'),
  algorithmType: z.enum(['fast', 'balanced', 'thorough', 'adaptive']),
  enableMachineLearning: z.boolean(),
  useNeuralNetwork: z.boolean(),
  multiSpectralAnalysis: z.boolean(),
});

// Contact/Support form validation
export const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Settings validation
export const settingsSchema = z.object({
  // Performance settings
  fps: z.number().min(30).max(120),
  quality: z.enum(['low', 'medium', 'high', 'ultra']),
  antiAliasing: z.boolean(),
  shadows: z.boolean(),
  
  // Data settings
  defaultPlanet: planetSchema,
  defaultDataSource: dataSourceSchema,
  autoRefresh: z.boolean(),
  refreshInterval: z.number().min(5).max(300), // 5 seconds to 5 minutes
  compressionLevel: z.enum(['low', 'medium', 'high']),
  
  // Privacy settings
  telemetry: z.boolean(),
  crashReports: z.boolean(),
  analytics: z.boolean(),
  
  // Advanced settings
  apiTimeout: z.number().min(5).max(120), // 5 seconds to 2 minutes
  retryAttempts: z.number().min(1).max(5),
  debugMode: z.boolean(),
});

// Export format validation
export const exportFormatSchema = z.enum(['geojson', 'csv', 'json'], {
  errorMap: () => ({ message: 'Export format must be one of: geojson, csv, json' })
});

// Satellite tracking validation
export const satelliteTrackingSchema = z.object({
  noradId: z.number().int().positive().optional(),
  name: z.string().trim().min(1).max(100),
  minElevation: z.number().min(0).max(90).optional(),
  trackingDuration: z.number().min(1).max(1440).optional(), // 1 minute to 24 hours
});

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

// Environment validation
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  VITE_APP_NAME: z.string().default('SatellitePro'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_NASA_API_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').optional(),
});

// Utility functions for validation
export const validateCoordinates = (lat: number, lon: number) => {
  return coordinateSchema.parse({ latitude: lat, longitude: lon });
};

export const validateAdvancedAnalysis = (params: unknown) => {
  return advancedAnalysisSchema.parse(params);
};

export const validateSettings = (settings: unknown) => {
  return settingsSchema.parse(settings);
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
};

export const validateEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: import.meta.env.MODE,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
      VITE_NASA_API_KEY: import.meta.env.VITE_NASA_API_KEY,
      VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
      VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
};