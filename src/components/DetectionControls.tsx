import React from 'react';
import { Settings, Radio, AlertTriangle } from 'lucide-react';
import { DetectionConfig } from '../types';

interface DetectionControlsProps {
  config: DetectionConfig;
  onConfigChange: (config: DetectionConfig) => void;
  isRunning: boolean;
  onToggleDetection: () => void;
}

export const DetectionControls: React.FC<DetectionControlsProps> = ({
  config,
  onConfigChange,
  isRunning,
  onToggleDetection,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E0E0E0] card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#1A1A1A]">
          <div className="bg-[#2F80ED]/10 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-[#2F80ED]" />
          </div>
          Detection Controls
        </h2>
        <button
          onClick={onToggleDetection}
          className={`px-4 py-2.5 rounded-lg shadow-md ${
            isRunning
              ? 'bg-[#EB5757] hover:bg-[#EB5757]/90'
              : 'bg-[#2F80ED] hover:bg-[#2F80ED]/90'
          } text-white font-medium flex items-center gap-2 transition-all`}
        >
          <Radio className="w-4 h-4" />
          {isRunning ? 'Stop Detection' : 'Start Detection'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E0E0E0] shadow-sm">
            <label className="block text-sm font-medium text-[#555555] mb-2">
              Frequency Range (MHz)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={config.frequencyRange[0]}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    frequencyRange: [Number(e.target.value), config.frequencyRange[1]],
                  })
                }
                className="block w-full rounded-md border-[#E0E0E0] bg-white text-[#1A1A1A] shadow-sm focus:border-[#2F80ED] focus:ring-[#2F80ED]"
              />
              <span className="text-[#555555]">to</span>
              <input
                type="number"
                value={config.frequencyRange[1]}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    frequencyRange: [config.frequencyRange[0], Number(e.target.value)],
                  })
                }
                className="block w-full rounded-md border-[#E0E0E0] bg-white text-[#1A1A1A] shadow-sm focus:border-[#2F80ED] focus:ring-[#2F80ED]"
              />
            </div>
          </div>

          <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E0E0E0] shadow-sm">
            <label className="block text-sm font-medium text-[#555555] mb-2">
              Sensitivity Threshold
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.sensitivityThreshold}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  sensitivityThreshold: Number(e.target.value),
                })
              }
              className="block w-full accent-[#2F80ED]"
            />
            <div className="flex justify-between text-xs text-[#555555] mt-2">
              <span>Low</span>
              <span className="font-medium text-[#2F80ED]">{(config.sensitivityThreshold * 100).toFixed(0)}%</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E0E0E0] shadow-sm">
            <label className="block text-sm font-medium text-[#555555] mb-2">
              Sampling Rate (MHz)
            </label>
            <input
              type="number"
              value={config.samplingRate}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  samplingRate: Number(e.target.value),
                })
              }
              className="block w-full rounded-md border-[#E0E0E0] bg-white text-[#1A1A1A] shadow-sm focus:border-[#2F80ED] focus:ring-[#2F80ED]"
            />
          </div>

          <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E0E0E0] shadow-sm">
            <label className="block text-sm font-medium text-[#555555] mb-2">
              Window Size (samples)
            </label>
            <select
              value={config.windowSize}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  windowSize: Number(e.target.value),
                })
              }
              className="block w-full rounded-md border-[#E0E0E0] bg-white text-[#1A1A1A] shadow-sm focus:border-[#2F80ED] focus:ring-[#2F80ED]"
            >
              <option value={256}>256</option>
              <option value={512}>512</option>
              <option value={1024}>1024</option>
              <option value={2048}>2048</option>
              <option value={4096}>4096</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#F2994A]/5 to-[#F2994A]/15 rounded-lg border border-[#F2994A]/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <AlertTriangle className="w-5 h-5 text-[#F2994A] flex-shrink-0" />
          </div>
          <p className="text-sm text-[#555555]">
            Adjusting these parameters may affect detection accuracy. Monitor results
            carefully after changes.
          </p>
        </div>
      </div>
    </div>
  );
};