# 📡 RF Anomaly Detection System 🚨

## 🌟 Overview

The **RF Anomaly Detection System** is a cutting-edge tool designed to monitor radio frequency (RF) spectrums and identify unusual signal patterns. Using powerful machine learning algorithms (especially unsupervised learning techniques), it can detect potential security threats, interference sources, and unauthorized transmissions—without prior knowledge of the specific threats.

This tool is perfect for **cybersecurity professionals**, **TSCM (Technical Surveillance Countermeasures)** experts, and **RF engineers** to detect anomalous signals that may pose security risks.

---

## 🚀 Key Features

- **⚡ Real-time Analysis**: Continuous monitoring of the RF spectrum for rapid anomaly detection.
- **🧠 Unsupervised Anomaly Detection**: Advanced machine learning algorithms detect unusual signal patterns without the need for pre-existing threat data.
- **🔍 Signal Classification**: Automatically categorizes detected anomalies based on signal characteristics.
- **🔧 Hardware Integration**: Compatible with RTL-SDR hardware for capturing real-world RF signals (optional).
- **📊 Spectral Visualization**: Rich visualization tools like waterfall displays and heatmaps to simplify signal analysis.
- **🚨 Alert System**: Configurable notifications to keep you updated on detected anomalies.

---

## 📹 Working Demo

Check out the video below to see the RF Anomaly Detection System in action! 🎥


https://github.com/user-attachments/assets/29ccf836-5dfb-472a-8148-fd51227416fc


---

## ⚙️ How It Works

The RF Anomaly Detection System processes radio signals through a multi-stage pipeline:

1. **Signal Capture**: In a fully deployed environment, the system captures raw RF signals via an SDR (Software Defined Radio) device. However, for the current development and demonstration phase, a **synthetic dataset** is used to simulate real-world radio frequency data.

2. **Preprocessing**: The captured (or synthetic) signals undergo preprocessing steps such as **noise reduction**, **normalization**, and **resampling**, ensuring the data is clean and consistent for analysis.

3. **Feature Extraction**: Key characteristics like **spectral density**, **peak frequency**, **bandwidth**, and **temporal patterns** are extracted to represent the signal in a structured form.

4. **Anomaly Detection**: The extracted features are fed into an **unsupervised machine learning model**, primarily the **Isolation Forest algorithm**. This model learns what "normal" looks like and assigns an **anomaly score** to new incoming signals based on their deviation from typical behavior.

5. **Anomaly Classification**: Signals flagged as anomalous are further classified using **feature similarity** and known RF signal profiles. This helps differentiate between benign outliers and potential threats like:
   - Frequency hopping transmissions  
   - Burst transmissions  
   - Unauthorized frequency usage

This architecture allows the system to work effectively **without requiring any prior labeled data**, making it ideal for detecting unknown or evolving RF threats in dynamic environments.

---

## 🖥️ Hardware Requirements

To run the system with full functionality (optional hardware setup), you will need:

- **🔌 RTL-SDR Device**: Compatible with RTL2832U-based SDR receivers.
  - Recommended: RTL-SDR Blog V3 R860 RTL2832U 1PPM TCXO HF Bias Tee SMA.
  - Frequency range: 500 kHz to 1.7 GHz.
  - Sample rate: Up to 2.4 MS/s (typically 2.048 MS/s).
  
- **📡 Antenna**: Select based on your target frequency bands.
  - A telescopic antenna is provided for general use.
  - Consider specialized antennas for specific applications.

- **💻 Computing Hardware**:
  - CPU: Modern quad-core processor (Intel i5/i7 or AMD equivalent).
  - RAM: Minimum 8GB, 16GB recommended for optimal performance.
  - Storage: 100GB+ SSD for signal recording and analysis.
  - GPU: Optional but recommended for faster processing (CUDA support).

---

## 📦 Software Dependencies

Make sure you have the following installed:

- **Node.js** (v14.0.0+)
- **React** (18+)
- **Python** (3.8+)
- Scientific Python stack:
  - **NumPy**
  - **SciPy**
  - **scikit-learn**
  - **TensorFlow** or **PyTorch** (optional for advanced models)
- RTL-SDR libraries and drivers.

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-organization/rf-anomaly-detection.git
   cd rf-anomaly-detection
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install and configure RTL-SDR hardware** (optional):
   - Follow the installation instructions based on your operating system.
   - Connect the RTL-SDR device and antenna.
   - Verify device recognition:
     ```bash
     rtl_test -t
     ```

5. **Configure application settings**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to match your hardware and environment settings.

---

## 🧑‍💻 Usage

1. **Start the backend server**:
   ```bash
   python server/main.py
   ```

2. **Launch the frontend application**:
   ```bash
   npm start
   ```

3. **Access the app**: Open your browser and go to `http://localhost:3000`.

4. **Set up monitoring**:
   - Use the frequency selector to specify ranges of interest.
   - Adjust sensitivity and threshold settings.
   - Start monitoring to collect and analyze RF data.

5. **Respond to alerts**:
   - Investigate flagged anomalies by examining their signal details.
   - Use the spectrum analyzer for deeper analysis.
   - Record and export relevant signals for further examination.

---

## ⚖️ Ethical Considerations and Legal Compliance

This tool is intended for **legitimate cybersecurity**, **network protection**, and **signal intelligence** applications. Users must ensure compliance with the following:

- **📜 Follow local laws**: Radio frequency monitoring may be restricted in some regions. Do not monitor protected frequencies without proper authorization.
- **🔒 Respect privacy**: Do not intercept private communications. This tool should not be used for unauthorized surveillance.
- **👮 Operate within legal boundaries**: Only monitor your own networks or with explicit permission from network owners.
- **🚨 Responsible disclosure**: Report any vulnerabilities responsibly following proper protocols.

---

## 📝 License

This project is licensed under the MIT License. For more details, check the [LICENSE](LICENSE) file.

---

## 💬 Support

For technical support or bug reports, feel free to open an issue on the GitHub repository or reach out to me directly at [Anushka](mailto:anushkeaa@gmail.com)
