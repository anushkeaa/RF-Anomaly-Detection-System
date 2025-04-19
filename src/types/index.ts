export interface RFSignal {
  frequency: number;
  amplitude: number;
  timestamp: number;
  confidence: number;
  isAnomaly: boolean;
}

export interface SpectrogramData {
  frequencies: number[];
  timePoints: number[];
  intensities: number[][];
}

export interface DetectionConfig {
  frequencyRange: [number, number];
  sensitivityThreshold: number;
  samplingRate: number;
  windowSize: number;
  aiModelEnabled: boolean;
  autoClassify: boolean;
  knownSignals: KnownSignalProfile[]; // Add reference to known signal profiles
  detectionMode: 'passive' | 'active'; // Mode of operation
  hardwareConnection: {
    enabled: boolean;
    deviceType?: string;
    deviceId?: string;
  };
}

export interface AnomalyDetectionResult {
  id: string;
  timestamp: number;
  frequency: number;
  confidence: number;
  signalStrength: number;
  classification?: string;
  duration: number;
  isClassified: boolean;
  isKnown?: boolean; // Whether this is a known signal from dataset
  matchedProfile?: string; // Reference to a known signal profile if matched
  signalProperties?: SignalProperties; // Additional details about the signal
}

export interface KnownSignalProfile {
  id: string;
  name: string;
  frequency: number | [number, number]; // Exact frequency or range
  signalType: string; // WiFi, Bluetooth, Cellular, etc.
  modulation?: string; // AM, FM, QPSK, etc.
  bandwidth?: number;
  description?: string;
  threat?: 'none' | 'low' | 'medium' | 'high';
}

export interface SignalProperties {
  bandwidth: number;
  centerFrequency: number;
  modulationType?: string;
  burstPattern?: number[];
  signalToNoiseRatio: number;
  fieldStrength?: number; // In dBm
}

export interface AIModelParams {
  learningRate: number;
  epochs: number;
  batchSize: number;
  modelType: 'unsupervised' | 'semi-supervised';
  featureExtraction: 'pca' | 'autoencoder' | 'wavelet';
}

export interface SignalFeatures {
  spectralDensity: number[];
  peakFrequencies: number[];
  signalToNoiseRatio: number;
  modulationType?: string;
  bandwidthEstimate: number;
  timeVariance: number;
}

export interface SDRDeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  capabilities?: {
    frequencyRange?: [number, number];
    maxSampleRate?: number;
    resolution?: number;
  };
}