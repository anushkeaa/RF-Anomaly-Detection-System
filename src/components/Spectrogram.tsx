import React, { useEffect, useRef } from 'react';
import { SpectrogramData } from '../types';

interface SpectrogramProps {
  data: SpectrogramData;
  width: number;
  height: number;
}

export const Spectrogram: React.FC<SpectrogramProps> = ({ data, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill background with a blue-green gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a2e38');  // Dark blue-green
    gradient.addColorStop(1, '#0f4c5c');  // Slightly lighter blue-green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines for better visual reference
    drawGrid(ctx, width, height);

    // Check if we have valid data to display
    if (!data.frequencies?.length || !data.timePoints?.length || !data.intensities?.length) {
      // Display message if no data
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Waiting for signal data...', width / 2, height / 2);
      return;
    }

    // Find min/max intensity values for normalization
    let minIntensity = Infinity;
    let maxIntensity = -Infinity;
    
    for (const row of data.intensities) {
      for (const value of row) {
        if (value < minIntensity) minIntensity = value;
        if (value > maxIntensity) maxIntensity = value;
      }
    }
    
    // Ensure we don't divide by zero
    if (minIntensity === maxIntensity) {
      minIntensity = 0;
      if (maxIntensity === 0) maxIntensity = 1;
    }

    // Draw dots for each data point
    for (let timeIdx = 0; timeIdx < data.intensities.length; timeIdx++) {
      for (let freqIdx = 0; freqIdx < data.frequencies.length; freqIdx++) {
        const frequency = data.frequencies[freqIdx];
        const time = data.timePoints[timeIdx];
        const intensity = data.intensities[timeIdx][freqIdx];
        
        // Skip very low intensities to avoid cluttering the display
        if (intensity < minIntensity + 0.1 * (maxIntensity - minIntensity)) continue;
        
        // Normalize intensity to 0-1 range
        const normalizedIntensity = (intensity - minIntensity) / (maxIntensity - minIntensity);
        
        // Calculate position
        // Map frequency to x-coordinate
        const x = (frequency - Math.min(...data.frequencies)) / 
                  (Math.max(...data.frequencies) - Math.min(...data.frequencies)) * width;
        
        // Map time to y-coordinate
        const y = (time - Math.min(...data.timePoints)) /
                  (Math.max(...data.timePoints) - Math.min(...data.timePoints)) * height;
        
        // Set dot color and size based on intensity
        const color = getIntensityColor(normalizedIntensity);
        const dotSize = 2 + normalizedIntensity * 4; // Size between 2-6 pixels based on intensity
        
        // Draw a glowing dot
        drawGlowingDot(ctx, x, y, dotSize, color, normalizedIntensity);
      }
    }

    // Draw extra dots to fill any gaps and ensure coverage of the entire canvas
    fillWithDots(ctx, width, height, data, minIntensity, maxIntensity);

  }, [data, width, height]);

  // Draw a grid on the background
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    const verticalSpacing = width / 10;
    for (let x = 0; x <= width; x += verticalSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    const horizontalSpacing = height / 10;
    for (let y = 0; y <= height; y += horizontalSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // Draw a dot with a glow effect
  const drawGlowingDot = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string,
    intensity: number
  ) => {
    // Create a radial gradient for the glow effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    // Draw the glow
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the dot
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  // Fill the canvas with additional dots to ensure full coverage
  const fillWithDots = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: SpectrogramData,
    minIntensity: number,
    maxIntensity: number
  ) => {
    // Add some random dots for a more interesting visualization
    const dotCount = 200; // Number of extra dots to add
    
    for (let i = 0; i < dotCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Determine what intensity this position should have based on nearby data points
      let closestIntensity = 0;
      let minDistance = Infinity;
      
      for (let timeIdx = 0; timeIdx < data.intensities.length; timeIdx++) {
        for (let freqIdx = 0; freqIdx < data.frequencies.length; freqIdx++) {
          const freq = data.frequencies[freqIdx];
          const time = data.timePoints[timeIdx];
          
          const dataX = (freq - Math.min(...data.frequencies)) / 
                        (Math.max(...data.frequencies) - Math.min(...data.frequencies)) * width;
          
          const dataY = (time - Math.min(...data.timePoints)) /
                        (Math.max(...data.timePoints) - Math.min(...data.timePoints)) * height;
          
          const distance = Math.sqrt(Math.pow(x - dataX, 2) + Math.pow(y - dataY, 2));
          
          if (distance < minDistance) {
            minDistance = distance;
            closestIntensity = data.intensities[timeIdx][freqIdx];
          }
        }
      }
      
      if (minDistance < 50) { // Only add dot if it's reasonably close to an actual data point
        const normalizedIntensity = (closestIntensity - minIntensity) / (maxIntensity - minIntensity);
        // Make the extra dots less intense
        const reducedIntensity = normalizedIntensity * 0.5;
        const color = getIntensityColor(reducedIntensity);
        const dotSize = 1 + reducedIntensity * 3; // Smaller than the main dots
        
        drawGlowingDot(ctx, x, y, dotSize, color, reducedIntensity);
      }
    }
  };

  // Function to convert intensity value to color
  const getIntensityColor = (value: number): string => {
    // Ensure value is between 0 and 1
    value = Math.max(0, Math.min(1, value));
    
    let r, g, b, a;
    
    if (value < 0.33) {
      // Low intensity: blue to cyan
      r = 0;
      g = Math.round(255 * (value / 0.33));
      b = 255;
      a = 0.7 + value * 0.3; // More transparent for low values
    } else if (value < 0.66) {
      // Medium intensity: cyan to yellow
      const adjustedValue = (value - 0.33) / 0.33;
      r = Math.round(255 * adjustedValue);
      g = 255;
      b = Math.round(255 * (1 - adjustedValue));
      a = 0.85;
    } else {
      // High intensity: yellow to red
      const adjustedValue = (value - 0.66) / 0.34;
      r = 255;
      g = Math.round(255 * (1 - adjustedValue));
      b = 0;
      a = 1.0; // Fully opaque for high values
    }
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full rounded-md"
    />
  );
};