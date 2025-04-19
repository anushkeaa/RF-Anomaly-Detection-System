import { RFSignal, SpectrogramData, SignalFeatures, DetectionConfig } from '../types';

class SignalProcessingService {
  private sampleRate: number;
  private fftSize: number;
  private config: DetectionConfig;
  private buffer: Float32Array;
  private lastProcessedTime: number;

  constructor(config: DetectionConfig) {
    this.config = config;
    this.sampleRate = config.samplingRate * 1e6; // Convert MHz to Hz
    this.fftSize = config.windowSize;
    this.buffer = new Float32Array(this.fftSize);
    this.lastProcessedTime = Date.now();
  }

  updateConfig(config: DetectionConfig): void {
    this.config = config;
    this.sampleRate = config.samplingRate * 1e6;
    this.fftSize = config.windowSize;
    this.buffer = new Float32Array(this.fftSize);
  }

  processRawData(rawData: Float32Array): RFSignal[] {
    // Convert raw SDR data to RFSignal objects
    const signals: RFSignal[] = [];
    const now = Date.now();
    
    // Perform FFT to get frequency domain representation
    const fftResult = this.performFFT(rawData);
    
    // Find peaks in the frequency spectrum
    const peaks = this.findPeaks(fftResult, this.config.sensitivityThreshold);
    
    // Convert peaks to RFSignal objects
    peaks.forEach(peak => {
      signals.push({
        frequency: peak.frequency,
        amplitude: peak.amplitude,
        timestamp: now,
        confidence: peak.confidence,
        isAnomaly: false // Initially set to false, AI will determine this
      });
    });
    
    this.lastProcessedTime = now;
    return signals;
  }

  generateSpectrogram(signals: RFSignal[], timeWindow: number = 10): SpectrogramData {
    const currentTime = Date.now();
    const startTime = currentTime - (timeWindow * 1000);
    
    // Filter signals within the time window
    const relevantSignals = signals.filter(s => s.timestamp >= startTime);
    
    // Group by time intervals
    const timeIntervals = 100; // Number of time intervals for the spectrogram
    const freqBins = 100; // Number of frequency bins
    
    const minFreq = this.config.frequencyRange[0];
    const maxFreq = this.config.frequencyRange[1];
    const freqStep = (maxFreq - minFreq) / freqBins;
    
    // Initialize arrays
    const frequencies: number[] = Array.from(
      { length: freqBins }, 
      (_, i) => minFreq + i * freqStep
    );
    
    const timeStep = timeWindow * 1000 / timeIntervals;
    const timePoints: number[] = Array.from(
      { length: timeIntervals }, 
      (_, i) => startTime + i * timeStep
    );
    
    // Initialize intensity matrix with zeros
    const intensities: number[][] = Array.from(
      { length: timeIntervals }, 
      () => Array(freqBins).fill(0)
    );
    
    // Fill in intensities
    relevantSignals.forEach(signal => {
      const timeIndex = Math.floor((signal.timestamp - startTime) / timeStep);
      const freqIndex = Math.floor((signal.frequency - minFreq) / freqStep);
      
      if (timeIndex >= 0 && timeIndex < timeIntervals && 
          freqIndex >= 0 && freqIndex < freqBins) {
        intensities[timeIndex][freqIndex] = 
          Math.max(intensities[timeIndex][freqIndex], signal.amplitude);
      }
    });
    
    return { frequencies, timePoints, intensities };
  }

  extractSignalFeatures(signal: RFSignal, surroundingData: Float32Array): SignalFeatures {
    // Extract features for AI model
    // This is a simplified version - in real implementation, 
    // this would use DSP techniques
    
    // Perform spectral analysis
    const spectralData = this.performFFT(surroundingData);
    const spectralDensity = this.calculateSpectralDensity(spectralData);
    
    // Find peak frequencies
    const peakFrequencies = this.findPeakFrequencies(spectralData, 5);
    
    // Calculate signal-to-noise ratio
    const signalToNoiseRatio = this.calculateSNR(signal, spectralData);
    
    // Estimate bandwidth
    const bandwidthEstimate = this.estimateBandwidth(spectralData, signal.frequency);
    
    // Calculate time domain variance
    const timeVariance = this.calculateTimeVariance(surroundingData);
    
    return {
      spectralDensity,
      peakFrequencies,
      signalToNoiseRatio,
      bandwidthEstimate,
      timeVariance,
      modulationType: this.estimateModulation(spectralData, surroundingData)
    };
  }

  // Helper methods
  private performFFT(data: Float32Array): { frequencies: number[], magnitudes: number[] } {
    // In a real implementation, this would use a proper FFT library
    // This is a simplified version for demonstration
    
    const frequencies: number[] = [];
    const magnitudes: number[] = [];
    
    // Calculate frequency step
    const freqStep = this.sampleRate / this.fftSize;
    
    // Simulate FFT results
    for (let i = 0; i < this.fftSize / 2; i++) {
      frequencies.push(i * freqStep);
      // Generate simulated magnitude (would be real FFT result in production)
      const index = Math.floor(i / (this.fftSize / 2) * data.length);
      magnitudes.push(Math.abs(data[index] || 0));
    }
    
    return { frequencies, magnitudes };
  }
  
  private findPeaks(fftResult: { frequencies: number[], magnitudes: number[] }, threshold: number): Array<{ frequency: number, amplitude: number, confidence: number }> {
    const peaks: Array<{ frequency: number, amplitude: number, confidence: number }> = [];
    const { frequencies, magnitudes } = fftResult;
    
    // Find local maxima
    for (let i = 1; i < magnitudes.length - 1; i++) {
      if (magnitudes[i] > magnitudes[i-1] && 
          magnitudes[i] > magnitudes[i+1] && 
          magnitudes[i] > threshold) {
        
        // Calculate confidence based on how much the peak stands out
        const localNoise = (magnitudes[i-1] + magnitudes[i+1]) / 2;
        const confidence = Math.min(1, (magnitudes[i] - localNoise) / localNoise);
        
        peaks.push({
          frequency: frequencies[i],
          amplitude: magnitudes[i],
          confidence
        });
      }
    }
    
    return peaks;
  }
  
  private calculateSpectralDensity(fftResult: { frequencies: number[], magnitudes: number[] }): number[] {
    // Simplified spectral density calculation
    return fftResult.magnitudes.map(m => Math.pow(m, 2));
  }
  
  private findPeakFrequencies(fftResult: { frequencies: number[], magnitudes: number[] }, count: number): number[] {
    // Create array of [frequency, magnitude] pairs
    const pairs = fftResult.frequencies.map((f, i) => [f, fftResult.magnitudes[i]]);
    
    // Sort by magnitude in descending order
    pairs.sort((a, b) => b[1] - a[1]);
    
    // Return top frequencies
    return pairs.slice(0, count).map(pair => pair[0]);
  }
  
  private calculateSNR(signal: RFSignal, fftResult: { frequencies: number[], magnitudes: number[] }): number {
    // Find the index closest to the signal frequency
    const freqStep = fftResult.frequencies[1] - fftResult.frequencies[0];
    const signalIndex = Math.round(signal.frequency / freqStep);
    
    if (signalIndex < 0 || signalIndex >= fftResult.magnitudes.length) {
      return 0;
    }
    
    // Signal power is the magnitude at the signal frequency
    const signalPower = Math.pow(fftResult.magnitudes[signalIndex], 2);
    
    // Noise power is the average of all other magnitudes
    let noisePower = 0;
    let count = 0;
    
    for (let i = 0; i < fftResult.magnitudes.length; i++) {
      if (Math.abs(i - signalIndex) > 3) { // Exclude points close to the signal
        noisePower += Math.pow(fftResult.magnitudes[i], 2);
        count++;
      }
    }
    
    noisePower = count > 0 ? noisePower / count : 1;
    
    // Calculate SNR in dB
    return 10 * Math.log10(signalPower / noisePower);
  }
  
  private estimateBandwidth(fftResult: { frequencies: number[], magnitudes: number[] }, centerFreq: number): number {
    // Find the index closest to the center frequency
    const freqStep = fftResult.frequencies[1] - fftResult.frequencies[0];
    const centerIndex = Math.round(centerFreq / freqStep);
    
    if (centerIndex < 0 || centerIndex >= fftResult.magnitudes.length) {
      return 0;
    }
    
    const peakMagnitude = fftResult.magnitudes[centerIndex];
    const halfPower = peakMagnitude / Math.sqrt(2); // -3dB point
    
    // Find lower -3dB point
    let lowerIndex = centerIndex;
    while (lowerIndex > 0 && fftResult.magnitudes[lowerIndex] > halfPower) {
      lowerIndex--;
    }
    
    // Find upper -3dB point
    let upperIndex = centerIndex;
    while (upperIndex < fftResult.magnitudes.length - 1 && fftResult.magnitudes[upperIndex] > halfPower) {
      upperIndex++;
    }
    
    // Calculate bandwidth
    return (upperIndex - lowerIndex) * freqStep;
  }
  
  private calculateTimeVariance(timeData: Float32Array): number {
    // Calculate variance of time domain data
    const mean = timeData.reduce((sum, val) => sum + val, 0) / timeData.length;
    const variance = timeData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / timeData.length;
    return variance;
  }
  
  private estimateModulation(fftResult: { frequencies: number[], magnitudes: number[] }, timeData: Float32Array): string | undefined {
    // This would be a complex algorithm in practice
    // For now, return a placeholder based on simple heuristics
    
    // Calculate some metrics that could indicate modulation type
    const spectralFlatness = this.calculateSpectralFlatness(fftResult.magnitudes);
    const zeroCrossings = this.countZeroCrossings(timeData);
    
    if (spectralFlatness > 0.8) {
      return 'FM';
    } else if (zeroCrossings > timeData.length / 10) {
      return 'FSK';
    } else if (spectralFlatness < 0.2) {
      return 'AM';
    }
    
    return undefined; // Unknown modulation
  }
  
  private calculateSpectralFlatness(magnitudes: number[]): number {
    // Spectral flatness is the geometric mean divided by arithmetic mean
    const geometricMean = Math.exp(
      magnitudes.reduce((sum, val) => sum + Math.log(val + 1e-10), 0) / magnitudes.length
    );
    
    const arithmeticMean = magnitudes.reduce((sum, val) => sum + val, 0) / magnitudes.length;
    
    return geometricMean / arithmeticMean;
  }
  
  private countZeroCrossings(timeData: Float32Array): number {
    let count = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 0 && timeData[i-1] < 0) || 
          (timeData[i] < 0 && timeData[i-1] >= 0)) {
        count++;
      }
    }
    return count;
  }
}

export default SignalProcessingService;
