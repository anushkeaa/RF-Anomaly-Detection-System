import React, { useState } from 'react';
import { Radio, Cpu, AlertCircle } from 'lucide-react';

interface HardwareConnectCardProps {
  backendConnected: boolean;
}

export const HardwareConnectCard: React.FC<HardwareConnectCardProps> = ({ 
  backendConnected 
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectHardware = () => {
    setConnecting(true);
    setError(null);
    
    // Simulate connection attempt
    setTimeout(() => {
      setConnecting(false);
      setError("No hardware detected. Using simulation data.");
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E0E0E0] card-hover">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#1A1A1A]">
        <div className="bg-[#2F80ED]/10 p-2 rounded-lg">
          <Cpu className="w-5 h-5 text-[#2F80ED]" />
        </div>
        Hardware Connection
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E0E0E0]">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-[#56CC9D]' : 'bg-[#EB5757]'}`}></div>
            <span className="text-sm font-medium text-[#1A1A1A]">
              {backendConnected ? 'Backend Server: Connected' : 'Backend Server: Disconnected'}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-[#555555] leading-relaxed">
          Connect RTL-SDR hardware to capture real RF signals from your environment. 
          Without hardware, the system will use simulated data.
        </p>
        
        {error && (
          <div className="text-xs bg-[#EB5757]/10 p-3 rounded-lg border border-[#EB5757]/20 text-[#EB5757] flex items-start gap-1.5">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <button
          onClick={handleConnectHardware}
          disabled={connecting || !backendConnected}
          className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 shadow-md transition-all
            ${connecting 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : !backendConnected
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90'
            }`}
        >
          <Radio className="w-4 h-4" />
          {connecting ? 'Connecting...' : 'Connect Hardware'}
        </button>
      </div>
    </div>
  );
};
