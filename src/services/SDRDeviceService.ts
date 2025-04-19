/**
 * Service for interfacing with SDR hardware devices
 */
class SDRDeviceService {
  private device: any = null;
  private isConnected: boolean = false;
  private deviceInfo: {
    name: string;
    serialNumber: string;
    supportedFrequencyRange: [number, number];
    maxSampleRate: number;
  } | null = null;

  /**
   * Check if WebUSB is supported by the browser
   */
  isWebUSBSupported(): boolean {
    return navigator && 'usb' in navigator;
  }

  /**
   * Get a list of supported SDR devices
   */
  getSupportedDevices(): string[] {
    return [
      'RTL-SDR',
      'HackRF',
      'Airspy',
      'SDRplay',
      'LimeSDR'
    ];
  }

  /**
   * Connect to an SDR device using WebUSB
   */
  async connect(): Promise<boolean> {
    try {
      if (!this.isWebUSBSupported()) {
        throw new Error('WebUSB is not supported in this browser');
      }

      // Request a device with the appropriate filters for SDR hardware
      // Note: This requires user interaction (a click event)
      const device = await navigator.usb.requestDevice({
        filters: [
          // RTL-SDR
          { vendorId: 0x0bda, productId: 0x2838 },
          // HackRF
          { vendorId: 0x1d50, productId: 0x6089 },
          // Add other SDR device filters as needed
        ]
      });

      console.log('Connected to device:', device);
      
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      this.device = device;
      this.isConnected = true;
      
      // Get device information
      this.deviceInfo = await this.getDeviceInfo();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to SDR device:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from the SDR device
   */
  async disconnect(): Promise<void> {
    if (!this.device || !this.isConnected) return;

    try {
      await this.device.releaseInterface(0);
      await this.device.close();
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }

    this.isConnected = false;
    this.device = null;
  }

  /**
   * Get information about the connected device
   */
  private async getDeviceInfo() {
    // This would be device-specific communication to get capabilities
    // Simplified example - in reality you'd send proper commands to the device
    
    if (!this.device) return null;
    
    // For RTL-SDR, typical specs are:
    return {
      name: this.device.productName || 'Unknown SDR',
      serialNumber: this.device.serialNumber || '',
      supportedFrequencyRange: [24, 1766] as [number, number], // MHz
      maxSampleRate: 2.4, // MSPS (Million Samples Per Second)
    };
  }

  /**
   * Set the center frequency for the SDR
   */
  async setCenterFrequency(frequency: number): Promise<boolean> {
    if (!this.isConnected || !this.device) return false;

    try {
      // This would be device-specific command to set frequency
      // Example for RTL-SDR using a hypothetical command structure
      const freqBytes = new Uint8Array(4);
      const view = new DataView(freqBytes.buffer);
      view.setUint32(0, frequency, true); // Little endian
      
      await this.device.controlTransferOut({
        requestType: 'vendor',
        recipient: 'device',
        request: 0x0a, // Set center frequency command (example)
        value: 0,
        index: 0
      }, freqBytes);
      
      return true;
    } catch (error) {
      console.error('Failed to set frequency:', error);
      return false;
    }
  }

  /**
   * Set the sample rate for the SDR
   */
  async setSampleRate(sampleRate: number): Promise<boolean> {
    if (!this.isConnected || !this.device) return false;

    try {
      // This would be device-specific command to set sample rate
      const rateBytes = new Uint8Array(4);
      const view = new DataView(rateBytes.buffer);
      view.setUint32(0, sampleRate, true); // Little endian
      
      await this.device.controlTransferOut({
        requestType: 'vendor',
        recipient: 'device',
        request: 0x0b, // Set sample rate command (example)
        value: 0,
        index: 0
      }, rateBytes);
      
      return true;
    } catch (error) {
      console.error('Failed to set sample rate:', error);
      return false;
    }
  }

  /**
   * Get samples from the SDR device
   */
  async getSamples(numSamples: number): Promise<Float32Array> {
    if (!this.isConnected || !this.device) {
      return new Float32Array(numSamples * 2); // Return empty array if not connected
    }

    try {
      // Request samples from the device
      await this.device.controlTransferOut({
        requestType: 'vendor',
        recipient: 'device',
        request: 0x0c, // Request samples command (example)
        value: numSamples,
        index: 0
      });

      // Read the response - this is highly device-specific
      const result = await this.device.transferIn(1, numSamples * 2 * 2); // 2 bytes per sample, I and Q
      
      // Convert the raw data to Float32Array of I/Q samples
      const rawData = new Uint8Array(result.data.buffer);
      const samples = new Float32Array(numSamples * 2); // I and Q interleaved
      
      for (let i = 0; i < rawData.length; i += 2) {
        // Convert from bytes to normalized float (-1.0 to 1.0)
        const value = ((rawData[i] << 8) | rawData[i+1]) - 32768;
        samples[i/2] = value / 32768.0;
      }
      
      return samples;
    } catch (error) {
      console.error('Failed to get samples:', error);
      return new Float32Array(numSamples * 2);
    }
  }

  /**
   * Check if the device is connected
   */
  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get device capabilities and information
   */
  getDeviceCapabilities() {
    return this.deviceInfo;
  }
}

export default SDRDeviceService;
