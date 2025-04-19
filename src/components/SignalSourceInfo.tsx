import React from 'react';
import { Database, Radio, AlertCircle, Info, Zap } from 'lucide-react';

interface SignalSourceInfoProps {
  sourceType: 'simulation' | 'dataset' | 'hardware';
  hardwareInfo?: {
    name?: string;
    frequencyRange?: [number, number];
    sampleRate?: number;
  };
  datasetInfo?: {
    path?: string;
    signalCount?: number;
  };
  isBackendConnected: boolean;
}

export const SignalSourceInfo: React.FC<SignalSourceInfoProps> = ({
  sourceType,
  hardwareInfo,
  datasetInfo,
  isBackendConnected
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-500" />
        Signal Source Information
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBackendConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span className="font-medium">
            {isBackendConnected ? 'Backend Connected' : 'Backend Not Connected'}
          </span>
        </div>
        
        {!isBackendConnected && (
          <div className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-700 mb-3">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Python backend not detected</p>
                <p className="mt-1">
                  Please start the Python backend server to see RF signals and anomalies.
                  Run <code className="bg-yellow-100 px-1 rounded">python server/app.py</code> in your terminal.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {sourceType === 'simulation' && (
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-purple-700">Using JavaScript Simulation</p>
              <p className="text-sm text-gray-600 mt-1">
                Currently generating simulated RF signals in the browser. For more advanced analysis, 
                connect to the Python backend.
              </p>
            </div>
          </div>
        )}
        
        {sourceType === 'dataset' && (
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700">Using Synthetic Dataset</p>
              <p className="text-sm text-gray-600 mt-1">
                Analyzing RF data from a synthetic dataset with simulated normal and anomaly signals.
              </p>
              {datasetInfo && (
                <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                  <p><span className="font-medium">Dataset:</span> {datasetInfo.path}</p>
                  {datasetInfo.signalCount && (
                    <p><span className="font-medium">Signals:</span> {datasetInfo.signalCount}</p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                The dataset contains normal FM radio signals and synthetic anomalies like frequency hopping signals 
                and high-power bursts.
              </p>
            </div>
          </div>
        )}
        
        {sourceType === 'hardware' && (
          <div className="flex items-start gap-3">
            <Radio className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-700">Using Real SDR Hardware</p>
              <p className="text-sm text-gray-600 mt-1">
                Capturing and analyzing real RF signals from your environment.
              </p>
              {hardwareInfo && (
                <div className="mt-2 text-xs bg-green-50 p-2 rounded">
                  <p><span className="font-medium">Device:</span> {hardwareInfo.name}</p>
                  {hardwareInfo.frequencyRange && (
                    <p><span className="font-medium">Frequency Range:</span> {hardwareInfo.frequencyRange[0]} - {hardwareInfo.frequencyRange[1]} MHz</p>
                  )}
                  {hardwareInfo.sampleRate && (
                    <p><span className="font-medium">Sample Rate:</span> {hardwareInfo.sampleRate} MSPS</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
