/**
 * Service for API communication with the Python backend
 */
class ApiService {
  private baseUrl: string = 'http://localhost:5000/api';
  private isBackendAvailable: boolean = false;
  
  /**
   * Check if the backend is available
   */
  async checkBackendAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-hardware`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Short timeout to quickly detect if server is unavailable
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        this.isBackendAvailable = true;
        console.log('Backend is available');
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Backend is not available:', error);
      this.isBackendAvailable = false;
      return false;
    }
  }
  
  /**
   * Start the signal processing on the backend
   */
  async startProcessing(config: any): Promise<boolean> {
    if (!this.isBackendAvailable) {
      await this.checkBackendAvailability();
    }
    
    if (!this.isBackendAvailable) {
      console.warn('Cannot start processing: Backend is not available');
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      return data.status === 'started';
    } catch (error) {
      console.error('Failed to start processing:', error);
      return false;
    }
  }
  
  /**
   * Stop the signal processing on the backend
   */
  async stopProcessing(): Promise<boolean> {
    if (!this.isBackendAvailable) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/stop`, {
        method: 'POST',
      });
      
      const data = await response.json();
      return data.status === 'stopped';
    } catch (error) {
      console.error('Failed to stop processing:', error);
      return false;
    }
  }
  
  /**
   * Get the current signals from the backend
   */
  async getSignals(): Promise<any[]> {
    if (!this.isBackendAvailable) {
      return [];
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/signals`);
      const data = await response.json();
      return data.signals || [];
    } catch (error) {
      console.error('Failed to get signals:', error);
      return [];
    }
  }
  
  /**
   * Get the current anomalies from the backend
   */
  async getAnomalies(): Promise<any[]> {
    if (!this.isBackendAvailable) {
      return [];
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/anomalies`);
      const data = await response.json();
      return data.anomalies || [];
    } catch (error) {
      console.error('Failed to get anomalies:', error);
      return [];
    }
  }
  
  /**
   * Get the spectrogram data from the backend
   */
  async getSpectrogram(): Promise<any> {
    if (!this.isBackendAvailable) {
      return {
        frequencies: [],
        timePoints: [],
        intensities: [],
      };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/spectrogram`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get spectrogram:', error);
      return {
        frequencies: [],
        timePoints: [],
        intensities: [],
      };
    }
  }
  
  /**
   * Check if hardware is available
   */
  async checkHardware(): Promise<any> {
    if (!this.isBackendAvailable) {
      await this.checkBackendAvailability();
    }
    
    if (!this.isBackendAvailable) {
      return { available: false, backendAvailable: false };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/check-hardware`);
      const data = await response.json();
      return { ...data, backendAvailable: true };
    } catch (error) {
      console.error('Failed to check hardware:', error);
      return { available: false, backendAvailable: false };
    }
  }
  
  /**
   * Clear all anomalies
   */
  async clearAnomalies(): Promise<boolean> {
    if (!this.isBackendAvailable) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/clear-anomalies`, {
        method: 'POST',
      });
      
      const data = await response.json();
      return data.status === 'cleared';
    } catch (error) {
      console.error('Failed to clear anomalies:', error);
      return false;
    }
  }
}

export default new ApiService();
