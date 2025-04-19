import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';
import { AnomalyDetectionResult } from '../types';

interface AnomalyListProps {
  anomalies: AnomalyDetectionResult[];
  onClearAll: () => void;
}

export const AnomalyList: React.FC<AnomalyListProps> = ({ anomalies, onClearAll }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'classified' | 'unclassified'>('all');
  const [displayMessage, setDisplayMessage] = useState<string>('Monitoring for anomalies...');

  // Update display message based on anomalies
  useEffect(() => {
    if (anomalies.length === 0) {
      setDisplayMessage('Monitoring for anomalies...');
    } else if (filteredAnomalies.length === 0) {
      setDisplayMessage('No anomalies match the current filter.');
    } else {
      setDisplayMessage('');
    }
  }, [anomalies, filter]);

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filter === 'all') return true;
    if (filter === 'classified') return anomaly.isClassified;
    if (filter === 'unclassified') return !anomaly.isClassified;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds if needed
    return date.toLocaleString();
  };

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-sm border border-[#E0E0E0]" style={{ height: '533px' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#1A1A1A]">
          <div className="bg-[#EB5757]/10 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-[#EB5757]" />
          </div>
          Detected Anomalies
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-[#E0E0E0] shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 text-sm ${
                filter === 'all' 
                  ? 'bg-[#2F80ED] text-white font-medium shadow-inner' 
                  : 'bg-white text-[#555555] hover:bg-[#F9FAFB]'
              } transition-all`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('classified')}
              className={`px-3.5 py-2 text-sm ${
                filter === 'classified' 
                  ? 'bg-[#2F80ED] text-white font-medium shadow-inner' 
                  : 'bg-white text-[#555555] hover:bg-[#F9FAFB]'
              } transition-all`}
            >
              Classified
            </button>
            <button
              onClick={() => setFilter('unclassified')}
              className={`px-3.5 py-2 text-sm ${
                filter === 'unclassified' 
                  ? 'bg-[#2F80ED] text-white font-medium shadow-inner' 
                  : 'bg-white text-[#555555] hover:bg-[#F9FAFB]'
              } transition-all`}
            >
              Unclassified
            </button>
          </div>
          
          <button
            onClick={onClearAll}
            className="px-3.5 py-2 text-sm bg-[#EB5757] text-white rounded-lg hover:bg-[#EB5757]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            disabled={anomalies.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-red-scrollbar" style={{ maxHeight: '420px' }}>
        {displayMessage ? (
          <div className="text-[#555555] italic py-6 text-center flex flex-col items-center">
            <div className="bg-[#F9FAFB] p-4 rounded-full mb-3">
              <AlertCircle className="w-10 h-10 text-[#E0E0E0]" />
            </div>
            <p>{displayMessage}</p>
            {anomalies.length > 0 && (
              <p className="text-sm mt-2">Try changing the filter to see different anomalies.</p>
            )}
          </div>
        ) : (
          filteredAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id} 
              className={`border rounded-lg overflow-hidden card-hover ${getAnomalyColor(anomaly.confidence, anomaly.isKnown)}`}
            >
              <div 
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleExpand(anomaly.id)}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#EB5757]" />
                  <div>
                    <p className="font-medium">
                      {anomaly.isClassified 
                        ? anomaly.classification 
                        : 'Unknown Signal'} 
                      {" "}
                      ({anomaly.frequency.toFixed(2)} MHz)
                    </p>
                    <p className="text-sm">
                      Confidence: {(anomaly.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-75 whitespace-nowrap">
                    {formatTimestamp(anomaly.timestamp)}
                  </span>
                  {expandedId === anomaly.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              {expandedId === anomaly.id && (
                <div className="p-3 border-t border-current bg-white bg-opacity-70">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Info className="w-4 h-4" />
                        Signal Details
                      </p>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 text-gray-600">Frequency:</td>
                            <td className="py-1 font-medium">{anomaly.frequency.toFixed(2)} MHz</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-600">Signal Strength:</td>
                            <td className="py-1 font-medium">{anomaly.signalStrength.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-600">Duration:</td>
                            <td className="py-1 font-medium">{anomaly.duration.toFixed(1)}s</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        Time Information
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Detected at:</span>
                        </div>
                        <p className="font-medium">{formatTimestamp(anomaly.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <p className="text-sm font-medium mb-1">Analysis Recommendation</p>
                    <p className="text-sm">
                      {anomaly.confidence > 0.85
                        ? "High priority anomaly detected. Immediate investigation recommended."
                        : anomaly.confidence > 0.7
                        ? "Medium priority anomaly. Schedule follow-up analysis."
                        : "Low priority anomaly. Add to monitoring queue."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {filteredAnomalies.length > 0 && filteredAnomalies.length < 3 && (
          <div className="text-center text-[#555555] text-sm pt-2">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Monitoring for additional anomalies...
          </div>
        )}
      </div>
    </div>
  );
};

function getAnomalyColor(confidence: number, isKnown?: boolean) {
  return 'bg-gradient-to-r from-[#EB5757]/5 to-[#EB5757]/15 border-[#EB5757]/30 text-[#1A1A1A]';
}
