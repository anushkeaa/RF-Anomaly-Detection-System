import React, { useEffect, useState, useRef } from 'react';
import { RFSignal, SpectrogramData, AnomalyDetectionResult, DetectionConfig } from '../types';
import { Spectrogram } from './Spectrogram';
import { Radio, Waves, AlertCircle, Database, Server, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import SignalProcessingService from '../services/SignalProcessingService';
import AnomalyDetectionService from '../services/AnomalyDetectionService';
import ApiService from '../services/ApiService';

interface RealTimeSignalAnalyzerProps {
  config: DetectionConfig;
  isRunning: boolean;
  onAnomalyDetected: (anomaly: AnomalyDetectionResult) => void;
  useBackend: boolean;
}

export const RealTimeSignalAnalyzer: React.FC<RealTimeSignalAnalyzerProps> = ({
  config,
  isRunning,
  onAnomalyDetected,
  useBackend,
}) => {
  const [spectrogramData, setSpectrogramData] = useState<SpectrogramData>({
    frequencies: [],
    timePoints: [],
    intensities: [],
  });
  
  const [activeSignals, setActiveSignals] = useState<RFSignal[]>([]);
  const [statistics, setStatistics] = useState({
    signalsProcessed: 0,
    potentialThreats: 0,
    bandwidth: 0,
  });
  
  const signalProcessingRef = useRef<SignalProcessingService | null>(null);
  const anomalyDetectionRef = useRef<AnomalyDetectionService | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize services
  useEffect(() => {
    signalProcessingRef.current = new SignalProcessingService(config);
    
    anomalyDetectionRef.current = new AnomalyDetectionService({
      learningRate: 0.01,
      epochs: 10,
      batchSize: 32,
      modelType: 'unsupervised',
      featureExtraction: 'wavelet',
    });
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  
  // Update config when it changes
  useEffect(() => {
    if (signalProcessingRef.current) {
      signalProcessingRef.current.updateConfig(config);
    }
  }, [config]);
  
  // Start/stop the signal processing loop
  useEffect(() => {
    if (isRunning) {
      if (useBackend) {
        startBackendPolling();
      } else {
        startProcessing();
      }
    } else {
      stopProcessing();
    }
    
    return () => stopProcessing();
  }, [isRunning, useBackend]);
  
  // Start polling backend for data
  const startBackendPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    const pollData = async () => {
      try {
        // Get spectrogram data
        const spectrogramData = await ApiService.getSpectrogram();
        if (spectrogramData.frequencies?.length > 0) {
          setSpectrogramData(spectrogramData);
        }
        
        // Get signals
        const signals = await ApiService.getSignals();
        if (signals?.length > 0) {
          const rfSignals = signals.map((s: any) => ({
            frequency: s.frequency,
            amplitude: s.amplitude,
            timestamp: s.time * 1000, // Convert to milliseconds
            confidence: 1.0,
            isAnomaly: s.is_anomaly === 1
          }));
          
          updateActiveSignals(rfSignals);
          
          // Update statistics
          setStatistics(prev => ({
            signalsProcessed: prev.signalsProcessed + rfSignals.length,
            potentialThreats: prev.potentialThreats + rfSignals.filter((s: RFSignal) => s.isAnomaly).length,
            bandwidth: calculateTotalBandwidth(rfSignals),
          }));
        }
        
        // Get anomalies
        const anomalies = await ApiService.getAnomalies();
        if (anomalies?.length > 0) {
          // Get anomalies that are new (last 2 seconds)
          const lastCheckedTime = new Date().getTime() - 2000;
          const newAnomalies = anomalies.filter((a: any) => a.timestamp * 1000 > lastCheckedTime);
          
          newAnomalies.forEach((anomaly: any) => {
            onAnomalyDetected(anomaly);
          });
        }
      } catch (error) {
        console.error('Error polling backend data:', error);
      }
    };
    
    // Poll immediately and then every 500ms
    pollData();
    pollIntervalRef.current = setInterval(pollData, 500);
  };
  
  const startProcessing = () => {
    if (!signalProcessingRef.current || !anomalyDetectionRef.current) return;
    
    const processFrame = () => {
      // Simulate receiving data from SDR
      const rawData = simulateSDRData(config);
      
      // Process the raw data
      const signals = signalProcessingRef.current!.processRawData(rawData);
      
      // Update active signals
      updateActiveSignals(signals);
      
      // Generate spectrogram data
      const newSpectrogramData = signalProcessingRef.current!.generateSpectrogram(activeSignals);
      setSpectrogramData(newSpectrogramData);
      
      // Extract features for each signal
      const signalFeatures = new Map();
      for (const signal of signals) {
        const features = signalProcessingRef.current!.extractSignalFeatures(signal, rawData);
        signalFeatures.set(signal.frequency, features);
      }
      
      // Detect anomalies
      if (config.aiModelEnabled && anomalyDetectionRef.current!.isReady()) {
        const anomalies = anomalyDetectionRef.current!.detectAnomalies(signals, signalFeatures);
        
        // Notify parent component of anomalies
        anomalies.forEach(anomaly => {
          onAnomalyDetected(anomaly);
        });
        
        // Update statistics
        setStatistics(prev => ({
          signalsProcessed: prev.signalsProcessed + signals.length,
          potentialThreats: prev.potentialThreats + anomalies.length,
          bandwidth: calculateTotalBandwidth(signals),
        }));
      }
      
      // Schedule next frame
      animationFrameRef.current = requestAnimationFrame(processFrame);
    };
    
    processFrame();
  };
  
  const stopProcessing = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };
  
  const updateActiveSignals = (newSignals: RFSignal[]) => {
    setActiveSignals(prev => {
      // Remove signals older than 10 seconds
      const currentTime = Date.now();
      const filtered = prev.filter(signal => currentTime - signal.timestamp < 10000);
      
      // Add new signals
      return [...filtered, ...newSignals];
    });
  };
  
  const calculateTotalBandwidth = (signals: RFSignal[]): number => {
    if (signals.length === 0) return 0;
    
    // Simple calculation - just count how many distinct frequency bins are occupied
    const frequencyBins = new Set<number>();
    signals.forEach(signal => {
      const bin = Math.floor(signal.frequency / 10) * 10; // 10 MHz bins
      frequencyBins.add(bin);
    });
    
    return frequencyBins.size * 10; // Each bin is 10 MHz
  };
  
  // Simulate SDR data for demonstration
  const simulateSDRData = (config: DetectionConfig): Float32Array => {
    const { frequencyRange, windowSize } = config;
    const data = new Float32Array(windowSize);
    
    // Add some background noise
    for (let i = 0; i < windowSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.1;
    }
    
    // Add some simulated signals
    // Signal 1: Continuous tone
    const signal1Freq = frequencyRange[0] + Math.random() * (frequencyRange[1] - frequencyRange[0]);
    const signal1Amp = 0.5 + Math.random() * 0.5;
    
    // Signal 2: Pulsed signal
    const signal2Freq = frequencyRange[0] + Math.random() * (frequencyRange[1] - frequencyRange[0]);
    const signal2Amp = 0.3 + Math.random() * 0.7;
    const pulseRate = 10; // Hz
    
    // Signal 3: Frequency hopping (potential covert signal)
    const signal3BaseFreq = frequencyRange[0] + Math.random() * (frequencyRange[1] - frequencyRange[0]);
    const signal3Amp = 0.4 + Math.random() * 0.2;
    const hoppingRate = 20; // Hz
    
    // Generate time-domain signal
    for (let i = 0; i < windowSize; i++) {
      const time = i / config.samplingRate * 1e-6;
      
      // Continuous tone
      data[i] += signal1Amp * Math.sin(2 * Math.PI * signal1Freq * time);
      
      // Pulsed signal
      const pulse = Math.sin(2 * Math.PI * pulseRate * time) > 0 ? 1 : 0;
      data[i] += signal2Amp * pulse * Math.sin(2 * Math.PI * signal2Freq * time);
      
      // Frequency hopping signal
      const hop = Math.floor(time * hoppingRate) % 5; // 5 different frequencies
      const hopFreq = signal3BaseFreq + hop * 20; // 20 MHz separation
      data[i] += signal3Amp * Math.sin(2 * Math.PI * hopFreq * time);
      
      // Randomly add "unknown" signal with low probability (simulates covert transmission)
      if (Math.random() < 0.01) {
        const unknownFreq = frequencyRange[0] + Math.random() * (frequencyRange[1] - frequencyRange[0]);
        const unknownAmp = 0.2 + Math.random() * 0.3;
        data[i] += unknownAmp * Math.sin(2 * Math.PI * unknownFreq * time);
      }
    }
    
    return data;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E0E0E0] card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#1A1A1A]">
          <div className="bg-[#2F80ED]/10 p-2 rounded-lg">
            <Waves className="w-6 h-6 text-[#2F80ED]" />
          </div>
          RF Spectrum Analysis
        </h2>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
            isRunning ? 'bg-[#56CC9D]/10 text-[#56CC9D]' : 'bg-[#F9FAFB] text-[#555555]'
          } shadow-sm`}>
            <Radio className="w-4 h-4 mr-2" />
            {isRunning ? 'Scanning' : 'Idle'}
          </span>
          
          {useBackend && (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-[#2F80ED]/10 text-[#2F80ED] shadow-sm">
              <Server className="w-4 h-4 mr-2" />
              Python Backend
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        {spectrogramData.frequencies.length === 0 && !isRunning ? (
          <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] h-[400px] flex flex-col items-center justify-center">
            <Waves className="w-16 h-16 text-[#E0E0E0] mb-4" />
            <p className="text-[#555555] text-lg">Click "Start Detection" to view RF spectrum data</p>
            <p className="text-[#555555] text-sm mt-2">Spectrogram will appear here when scanning is active</p>
          </div>
        ) : (
          <div className="w-full h-[400px] overflow-hidden rounded-lg border border-[#E0E0E0] shadow-inner">
            <Spectrogram 
              data={spectrogramData} 
              width={800} 
              height={400} 
            />
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-[#2F80ED]/5 to-[#2F80ED]/20 p-4 rounded-xl border border-[#2F80ED]/20 flex flex-col items-center card-hover">
            <div className="bg-white p-2 rounded-full shadow-md mb-2">
              <Activity className="w-5 h-5 text-[#2F80ED]" />
            </div>
            <p className="text-xs text-[#2F80ED] uppercase font-semibold mb-1">Signals Processed</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{statistics.signalsProcessed}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#56CC9D]/5 to-[#56CC9D]/20 p-4 rounded-xl border border-[#56CC9D]/20 flex flex-col items-center card-hover">
            <div className="bg-white p-2 rounded-full shadow-md mb-2">
              <Radio className="w-5 h-5 text-[#56CC9D]" />
            </div>
            <p className="text-xs text-[#56CC9D] uppercase font-semibold mb-1">Active Bandwidth</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{statistics.bandwidth} <span className="text-sm font-normal">MHz</span></p>
          </div>
          
          <div className="bg-gradient-to-br from-[#EB5757]/5 to-[#EB5757]/20 p-4 rounded-xl border border-[#EB5757]/20 flex flex-col items-center card-hover">
            <div className="bg-white p-2 rounded-full shadow-md mb-2">
              <AlertTriangle className="w-5 h-5 text-[#EB5757]" />
            </div>
            <p className="text-xs text-[#EB5757] uppercase font-semibold mb-1">Potential Threats</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{statistics.potentialThreats}</p>
          </div>
        </div>
      </div>
      
      {activeSignals.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-[#1A1A1A] border-b border-[#E0E0E0] pb-2">
            <div className="bg-[#2F80ED]/10 p-1.5 rounded-lg">
              <Radio className="w-4 h-4 text-[#2F80ED]" />
            </div>
            Active Signals
          </h3>
          <div className="overflow-auto max-h-40 rounded-lg border border-[#E0E0E0] shadow-inner">
            <table className="min-w-full divide-y divide-[#E0E0E0]">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">Frequency (MHz)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">Amplitude</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E0E0E0]">
                {activeSignals.slice(-5).map((signal, index) => (
                  <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-[#1A1A1A] font-medium">{signal.frequency.toFixed(2)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-[#1A1A1A]">{signal.amplitude.toFixed(3)}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {signal.isAnomaly ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EB5757]/10 text-[#EB5757]">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          Anomaly
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#56CC9D]/10 text-[#56CC9D]">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
