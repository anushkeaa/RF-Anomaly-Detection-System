# RF Anomaly Detection System - Python Backend

This is the Python backend for the RF Anomaly Detection System. It processes RF signal data, detects anomalies using machine learning, and provides API endpoints for the frontend.

## Setup Instructions

### 1. Install Python Dependencies

First, make sure you have Python 3.8+ installed. Then install the required packages:

```bash
# Install all required packages
pip install -r requirements.txt
```

Or install individual packages:

```bash
pip install flask flask-cors numpy pandas scikit-learn scipy matplotlib joblib
```

For hardware support (optional):
```bash
pip install pyrtlsdr
```

### 2. Start the Server

```bash
python app.py
```

The server will:
1. Create a sample RF signals dataset if one doesn't exist
2. Train an anomaly detection model
3. Start the Flask server on port 5000

## API Endpoints

- `GET /api/check-hardware` - Check if SDR hardware is available
- `POST /api/start` - Start signal processing
- `POST /api/stop` - Stop signal processing
- `GET /api/signals` - Get current signals
- `GET /api/anomalies` - Get detected anomalies
- `GET /api/spectrogram` - Get spectrogram data
- `POST /api/clear-anomalies` - Clear all anomalies

## Hardware Support

The system can work with RTL-SDR hardware if available. If no hardware is detected, it will automatically fall back to using the sample dataset.

## Troubleshooting

If you encounter issues with the RTL-SDR library on Windows:
1. Install the RTL-SDR drivers from https://zadig.akeo.ie/
2. Connect your RTL-SDR device
3. Use Zadig to install the WinUSB driver for your device

For other platforms, see the pyrtlsdr documentation.
