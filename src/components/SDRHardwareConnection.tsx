import React, { useState } from 'react';
import { Radio, Wifi, AlertTriangle, Check, X } from 'lucide-react';
import { SDRDeviceInfo } from '../types';

interface SDRHardwareConnectionProps {
  isConnected: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  deviceInfo: SDRDeviceInfo | null;
}

export const SDRHardwareConnection: React.FC<SDRHardwareConnectionProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  deviceInfo
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await onConnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to hardware');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <Radio className="w-5 h-5" />
        SDR Hardware Connection
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Connection Status:</span>
          {isConnected ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Check className="w-4 h-4 mr-1" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <X className="w-4 h-4 mr-1" />
              Disconnected
            </span>
          )}
        </div>

        {deviceInfo && isConnected && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              Connected Device Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Device:</span>
                <span className="ml-1 font-medium">{deviceInfo.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-1 font-medium">{deviceInfo.type}</span>
              </div>
              {deviceInfo.capabilities?.frequencyRange && (
                <div className="col-span-2">
                  <span className="text-gray-600">Frequency Range:</span>
                  <span className="ml-1 font-medium">
                    {deviceInfo.capabilities.frequencyRange[0]} - {deviceInfo.capabilities.frequencyRange[1]} MHz
                  </span>
                </div>
              )}
              {deviceInfo.capabilities?.maxSampleRate && (
                <div>
                  <span className="text-gray-600">Max Sample Rate:</span>
                  <span className="ml-1 font-medium">
                    {deviceInfo.capabilities.maxSampleRate} MHz
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 rounded-md flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-2 ${
              isConnecting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Radio className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Connect to Hardware'}
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Disconnect
          </button>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-sm text-yellow-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <span>
            Not connected to physical hardware? The system will continue running with simulated data. Connect your SDR hardware when available.
          </span>
        </p>
      </div>
    </div>
  );
};
