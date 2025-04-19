import React, { useState, useEffect } from 'react';
import { Radar, Shield, Brain } from 'lucide-react';
import { DetectionControls } from './components/DetectionControls';
import { RealTimeSignalAnalyzer } from './components/RealTimeSignalAnalyzer';
import { AnomalyList } from './components/AnomalyList';
import { AboutApplication } from './components/AboutApplication';
import { HardwareConnectCard } from './components/HardwareConnectCard';
import { Footer } from './components/Footer';
import { DetectionConfig, AnomalyDetectionResult } from './types';
import ApiService from './services/ApiService';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<DetectionConfig>({
    frequencyRange: [80, 108], // FM radio band
    sensitivityThreshold: 0.75,
    samplingRate: 2.4,
    windowSize: 1024,
    aiModelEnabled: true,
    autoClassify: true,
    knownSignals: [],
    detectionMode: 'passive',
    hardwareConnection: {
      enabled: false
    }
  });
  const [anomalies, setAnomalies] = useState<AnomalyDetectionResult[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState<any>(null);
  const [signalSource, setSignalSource] = useState<'simulation' | 'dataset' | 'hardware'>('simulation');
  const [datasetInfo, setDatasetInfo] = useState<any>(null);
  
  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isAvailable = await ApiService.checkBackendAvailability();
        setBackendConnected(isAvailable);
        
        if (isAvailable) {
          const hardwareStatus = await ApiService.checkHardware();
          setHardwareInfo(hardwareStatus);
          
          if (hardwareStatus.available) {
            setSignalSource('hardware');
          } else {
            setSignalSource('dataset');
            setDatasetInfo({
              path: hardwareStatus.datasetPath
            });
          }
        }
      } catch (error) {
        console.error('Error checking backend:', error);
        setBackendConnected(false);
        setSignalSource('simulation');
      }
    };
    
    checkBackend();
    
    // Check backend availability every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cleanup function to handle component unmounting
    return () => {
      setIsRunning(false);
      if (backendConnected) {
        ApiService.stopProcessing();
      }
    };
  }, [backendConnected]);

  const handleToggleDetection = async () => {
    if (isRunning) {
      setIsRunning(false);
      if (backendConnected) {
        await ApiService.stopProcessing();
      }
    } else {
      setIsRunning(true);
      if (backendConnected) {
        await ApiService.startProcessing(config);
      }
    }
  };

  const handleAnomalyDetected = (anomaly: AnomalyDetectionResult) => {
    setAnomalies((prev) => {
      // Check if this anomaly already exists by ID to avoid duplicates
      if (prev.some(a => a.id === anomaly.id)) {
        return prev;
      }
      
      // Limit the number of displayed anomalies to avoid overwhelming the UI
      const updatedAnomalies = [anomaly, ...prev];
      if (updatedAnomalies.length > 50) {
        return updatedAnomalies.slice(0, 50);
      }
      return updatedAnomalies;
    });
  };

  const handleClearAllAnomalies = async () => {
    setAnomalies([]);
    if (backendConnected) {
      await ApiService.clearAnomalies();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex flex-col">
      <header className="bg-white shadow-lg border-b border-[#E0E0E0] backdrop-filter backdrop-blur-sm bg-opacity-95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-[#2F80ED] to-[#56CCF2] rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A1A1A] to-[#2F80ED]">
                RF Anomaly Detection System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#2F80ED] bg-blue-50 py-1 px-3 rounded-xl shadow-sm">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-medium">AI-Powered Detection</span>
              </div>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-md ${
                  isRunning
                    ? 'bg-[#56CC9D]/90 text-white'
                    : 'bg-white text-[#555555] border border-[#E0E0E0]'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    isRunning ? 'bg-white animate-pulse' : 'bg-gray-400'
                  }`}
                ></span>
                {isRunning ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Left Column (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="transform perspective-1000">
              <div className="transition-transform duration-300 hover:rotate-x-1 hover:translate-z-2">
                <RealTimeSignalAnalyzer
                  config={config}
                  isRunning={isRunning}
                  onAnomalyDetected={handleAnomalyDetected}
                  useBackend={backendConnected}
                />
              </div>
            </div>

            <div className="transform perspective-1000">
              <div className="transition-transform duration-300 hover:rotate-x-1 hover:translate-z-2">
                <AnomalyList
                  anomalies={anomalies}
                  onClearAll={handleClearAllAnomalies}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="transform perspective-1000 transition-all duration-300 hover:rotate-x-1 hover:translate-z-4">
              <DetectionControls
                config={config}
                onConfigChange={setConfig}
                isRunning={isRunning}
                onToggleDetection={handleToggleDetection}
              />
            </div>
            
            <div className="transform perspective-1000 transition-all duration-300 hover:rotate-x-1 hover:translate-z-4">
              <HardwareConnectCard backendConnected={backendConnected} />
            </div>
            
            <div className="transform perspective-1000 transition-all duration-300 hover:rotate-x-1 hover:translate-z-4">
              <AboutApplication />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;