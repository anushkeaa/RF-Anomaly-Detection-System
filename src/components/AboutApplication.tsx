import React from 'react';
import { Radio, Shield, AlertCircle, Brain, Lock, Zap, Cpu, FileText } from 'lucide-react';

export const AboutApplication: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-sm border border-[#E0E0E0]" style={{ height: '533px' }}>
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-[#1A1A1A]">
        <Radio className="w-5 h-5 text-[#2F80ED]" />
        About the Application
      </h2>

      <div className="space-y-6 overflow-y-auto pr-2 blue-scrollbar" style={{ maxHeight: '420px' }}>
        <section className="hover:bg-[#F9FAFB] p-4 rounded-lg transition-colors">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Shield className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Overview</span>
          </h3>
          <p className="text-sm text-[#555555] leading-relaxed">
            The RF Anomaly Detection System is a sophisticated tool designed to monitor radio frequency 
            spectrums for unusual signal patterns. By leveraging machine learning algorithms, 
            particularly unsupervised learning techniques, the system can identify potential security 
            threats, interference sources, and unauthorized transmissions without requiring prior 
            knowledge of these patterns.
          </p>
        </section>

        <section className="hover:bg-[#F9FAFB] p-4 rounded-lg transition-colors">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Brain className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Key Features</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#2F80ED]/5 p-3 rounded-lg border border-[#2F80ED]/20 hover:shadow-md transition-shadow">
              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-[#2F80ED]" />
                Real-time Analysis
              </h4>
              <p className="text-xs text-[#555555]">
                Continuous monitoring and analysis of RF spectrum with near-instantaneous anomaly detection
              </p>
            </div>
            
            <div className="bg-[#EB5757]/5 p-3 rounded-lg border border-[#EB5757]/20 hover:shadow-md transition-shadow">
              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#EB5757]" />
                Anomaly Detection
              </h4>
              <p className="text-xs text-[#555555]">
                Advanced ML algorithms identify unusual signal patterns without prior training on specific threats
              </p>
            </div>
            
            <div className="bg-[#56CC9D]/5 p-3 rounded-lg border border-[#56CC9D]/20 hover:shadow-md transition-shadow">
              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#56CC9D]" />
                Signal Classification
              </h4>
              <p className="text-xs text-[#555555]">
                Automatic categorization of detected anomalies based on signal characteristics
              </p>
            </div>
            
            <div className="bg-[#F2994A]/5 p-3 rounded-lg border border-[#F2994A]/20 hover:shadow-md transition-shadow">
              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#F2994A]" />
                Hardware Integration
              </h4>
              <p className="text-xs text-[#555555]">
                Compatible with RTL-SDR hardware for capturing actual RF signals from the environment
              </p>
            </div>
          </div>
        </section>

        <section className="hover:bg-[#F9FAFB] p-4 rounded-lg transition-colors">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Lock className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Use Cases & Applications</span>
          </h3>
          <div className="space-y-3">
            <div className="bg-[#F9FAFB] p-3 rounded border border-[#E0E0E0]">
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-1">Cybersecurity & TSCM</h4>
              <p className="text-xs text-[#555555]">
                Detecting unauthorized wireless transmissions, rogue access points, and potential bugging devices. 
                Technical Surveillance Countermeasures (TSCM) operations to identify covert listening devices or 
                unauthorized signal transmissions in sensitive areas.
              </p>
            </div>
            
            <div className="bg-[#F9FAFB] p-3 rounded border border-[#E0E0E0]">
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-1">Signal Intelligence</h4>
              <p className="text-xs text-[#555555]">
                Monitoring for unauthorized communications or unusual transmission patterns in protected 
                frequency bands. Identifying frequency-hopping signals, burst transmissions, and other 
                covert communication methods that may evade conventional detection.
              </p>
            </div>
            
            <div className="bg-[#F9FAFB] p-3 rounded border border-[#E0E0E0]">
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-1">Interference Detection</h4>
              <p className="text-xs text-[#555555]">
                Identifying sources of RF interference affecting critical communications or wireless networks. 
                Early warning system for potential jamming attempts or unintentional interference sources 
                before they cause significant disruption.
              </p>
            </div>
          </div>
        </section>

        <section className="hover:bg-[#F9FAFB] p-4 rounded-lg transition-colors">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-[#1A1A1A]">
            <Brain className="w-4 h-4 text-[#2F80ED]" /> 
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Technical Details</span>
          </h3>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">Machine Learning Model</h4>
              <p className="text-xs text-[#555555]">
                The system employs an Isolation Forest algorithm—a powerful unsupervised learning technique 
                specialized in anomaly detection. This approach identifies signal patterns that deviate from the 
                "normal" RF environment without requiring labeled training data.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">Signal Processing</h4>
              <p className="text-xs text-[#555555]">
                Advanced signal processing techniques extract features from RF signals, including frequency, 
                amplitude, timing patterns, and spectral characteristics. The spectral visualization uses 
                waterfall displays and heatmaps to represent signal intensity across frequency and time.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">Detection Capabilities</h4>
              <p className="text-xs text-[#555555]">
                The system can detect various anomalies, including:
              </p>
              <ul className="text-xs text-[#555555] list-disc pl-5 mt-1 space-y-1">
                <li>Frequency-hopping signals that change transmission frequency to avoid detection</li>
                <li>Burst transmissions that only appear briefly at irregular intervals</li>
                <li>Unusual power levels that may indicate jamming or unauthorized devices</li>
                <li>Signals appearing in unexpected or restricted frequency bands</li>
                <li>Abnormal modulation patterns that differ from standard communication protocols</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
