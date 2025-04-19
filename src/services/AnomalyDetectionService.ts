import { RFSignal, SignalFeatures, AnomalyDetectionResult, AIModelParams } from '../types';

class AnomalyDetectionService {
  private model: any; // In a real implementation, this would be a proper ML model
  private modelParams: AIModelParams;
  private trainingData: SignalFeatures[] = [];
  private isModelReady: boolean = false;
  private knownPatterns: Map<string, SignalFeatures[]> = new Map();

  constructor(params: AIModelParams) {
    this.modelParams = params;
    this.initializeModel();
  }

  private initializeModel(): void {
    // In a real implementation, this would initialize a PyTorch or TensorFlow.js model
    this.model = {
      predict: (features: SignalFeatures) => this.mockPredict(features),
      train: (data: SignalFeatures[]) => this.mockTrain(data),
    };
    
    console.log('AI model initialized with parameters:', this.modelParams);
    this.isModelReady = true;
  }

  isReady(): boolean {
    return this.isModelReady;
  }

  detectAnomalies(signals: RFSignal[], features: Map<number, SignalFeatures>): AnomalyDetectionResult[] {
    if (!this.isModelReady) {
      console.warn('AI model is not ready yet');
      return [];
    }

    const results: AnomalyDetectionResult[] = [];

    for (const signal of signals) {
      const signalFeatures = features.get(signal.frequency);
      
      if (!signalFeatures) continue;
      
      // Run the anomaly detection model
      const anomalyScore = this.model.predict(signalFeatures);
      
      // If the score exceeds a threshold, it's an anomaly
      if (anomalyScore > 0.7) {
        const result: AnomalyDetectionResult = {
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: signal.timestamp,
          frequency: signal.frequency,
          confidence: anomalyScore,
          signalStrength: signal.amplitude,
          duration: 1.0, // Default duration in seconds
          isClassified: false
        };
        
        // Try to classify the anomaly
        const classification = this.classifyAnomaly(signalFeatures);
        if (classification) {
          result.classification = classification;
          result.isClassified = true;
        }
        
        results.push(result);
      }
      
      // Add to training data for continuous learning
      this.trainingData.push(signalFeatures);
      
      // Retrain the model periodically
      if (this.trainingData.length >= this.modelParams.batchSize) {
        this.retrainModel();
      }
    }
    
    return results;
  }

  classifyAnomaly(features: SignalFeatures): string | undefined {
    // Compare with known patterns
    for (const [patternName, patternFeatures] of this.knownPatterns.entries()) {
      if (this.matchesPattern(features, patternFeatures)) {
        return patternName;
      }
    }
    
    // Classification methods based on feature analysis
    if (features.spectralDensity.length > 0) {
      // Use peak frequencies to identify common signal types
      const highestPeak = Math.max(...features.peakFrequencies);
      
      if (features.timeVariance > 0.8 && features.bandwidthEstimate < 10) {
        return 'Potential Drone Control';
      }
      
      if (features.signalToNoiseRatio > 15 && features.bandwidthEstimate < 5) {
        return 'Narrowband Transmission';
      }
      
      if (features.modulationType === 'FSK' && features.bandwidthEstimate > 50) {
        return 'Frequency Hopping Communication';
      }
      
      if (highestPeak > 900 && highestPeak < 930) {
        return 'GSM Communication';
      }
      
      if (features.timeVariance < 0.2 && features.signalToNoiseRatio > 20) {
        return 'Continuous Wave Signal';
      }
    }
    
    return 'Unknown Signal Type';
  }

  learnPattern(name: string, features: SignalFeatures[]): void {
    this.knownPatterns.set(name, features);
    console.log(`Learned new pattern: ${name}`);
  }

  private retrainModel(): void {
    console.log(`Retraining model with ${this.trainingData.length} samples`);
    this.model.train(this.trainingData);
    this.trainingData = []; // Clear training data after retraining
  }

  private mockPredict(features: SignalFeatures): number {
    // In a real implementation, this would use the actual model
    // For now, we'll use a simple heuristic to simulate anomaly detection
    
    // Check if signal has unusual spectral properties
    const spectralUniformity = this.calculateSpectralUniformity(features.spectralDensity);
    const snrFactor = Math.min(1, features.signalToNoiseRatio / 30);
    const bandwidthFactor = Math.min(1, features.bandwidthEstimate / 50);
    
    // Heuristic for "unusualness" of the signal
    let anomalyScore = 0;
    
    // Unusual spectral properties
    if (spectralUniformity < 0.3) {
      anomalyScore += 0.4;
    }
    
    // Very strong signal that doesn't match known patterns
    if (snrFactor > 0.7) {
      anomalyScore += 0.3;
    }
    
    // Unusual bandwidth for the frequency range
    if (bandwidthFactor < 0.2 || bandwidthFactor > 0.8) {
      anomalyScore += 0.2;
    }
    
    // Factor in time variance
    if (features.timeVariance > 0.7) {
      anomalyScore += 0.1;
    }
    
    // Random factor to simulate detection noise
    anomalyScore += (Math.random() - 0.5) * 0.1;
    
    // Ensure output is between 0 and 1
    return Math.max(0, Math.min(1, anomalyScore));
  }

  private mockTrain(data: SignalFeatures[]): void {
    // In a real implementation, this would train the actual model
    console.log(`Model trained on ${data.length} samples`);
  }

  private calculateSpectralUniformity(spectralDensity: number[]): number {
    // Calculate how uniform the spectrum is (higher = more uniform)
    if (spectralDensity.length === 0) return 1;
    
    const mean = spectralDensity.reduce((a, b) => a + b, 0) / spectralDensity.length;
    const variance = spectralDensity.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / spectralDensity.length;
    
    // Normalize to 0-1 range (higher values = more uniform)
    return 1 / (1 + variance / Math.pow(mean, 2));
  }

  private matchesPattern(features: SignalFeatures, patternFeatures: SignalFeatures[]): boolean {
    // Check if features match any pattern in the array
    for (const pattern of patternFeatures) {
      // Calculate similarity score
      let similarityScore = 0;
      
      // Compare SNR
      const snrDiff = Math.abs(features.signalToNoiseRatio - pattern.signalToNoiseRatio);
      if (snrDiff < 3) similarityScore += 0.25;
      
      // Compare bandwidth
      const bwDiff = Math.abs(features.bandwidthEstimate - pattern.bandwidthEstimate);
      if (bwDiff < pattern.bandwidthEstimate * 0.2) similarityScore += 0.25;
      
      // Compare modulation type
      if (features.modulationType === pattern.modulationType) similarityScore += 0.25;
      
      // Compare time variance
      const tvDiff = Math.abs(features.timeVariance - pattern.timeVariance);
      if (tvDiff < 0.1) similarityScore += 0.25;
      
      // If similarity score is high enough, consider it a match
      if (similarityScore > 0.7) return true;
    }
    
    return false;
  }
}

export default AnomalyDetectionService;
