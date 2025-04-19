import React from 'react';
import { Brain, Shield, Radio } from 'lucide-react';

export const ApplicationTheory: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E0E0E0] card-hover" style={{ height: '500px' }}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#1A1A1A]">
        <div className="bg-[#2F80ED]/10 p-2 rounded-lg">
          <Brain className="w-5 h-5 text-[#2F80ED]" />
        </div>
        AI Detection Technology
      </h2>

      <div className="space-y-5 overflow-y-auto pr-2 blue-scrollbar" style={{ maxHeight: '420px' }}>
        <section className="hover:bg-[#F9FAFB] p-4 rounded-lg transition-colors">
          <h3 className="text-md font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Shield className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] bg-clip-text text-transparent">How It Works</span>
          </h3>
          <p className="text-sm text-[#555555] leading-relaxed">
            This system uses unsupervised machine learning to detect anomalies in the radio frequency (RF) spectrum. 
            By learning normal patterns of RF activity, our AI can identify unusual transmissions that may represent 
            security threats, interference, or covert communications.
          </p>
        </section>

        <div className="border-t border-[#E0E0E0] pt-4 mt-4">
          <h3 className="text-md font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Radio className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] bg-clip-text text-transparent">Detection Configuration</span>
          </h3>
          <div className="space-y-4">
            <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E0E0E0] hover:shadow-sm transition-shadow">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="h-4 w-4 text-[#2F80ED] rounded focus:ring-[#2F80ED]"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Enable AI-based signal analysis
                </span>
              </label>
              <p className="text-xs text-[#555555] mt-1 ml-6">
                Uses unsupervised learning to detect abnormal RF patterns
              </p>
            </div>
            
            <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E0E0E0] hover:shadow-sm transition-shadow">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="h-4 w-4 text-[#2F80ED] rounded focus:ring-[#2F80ED]"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Auto-classify detected anomalies
                </span>
              </label>
              <p className="text-xs text-[#555555] mt-1 ml-6">
                Automatically attempt to identify signal types
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};