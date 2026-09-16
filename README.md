# 🏛️ PINAXX

A responsive 3D virtual art gallery experience built with **Three.js**  

---

## 🚀 Features

* **Interactive 3D Environment**: Fully rendered classical room with dynamic skylighting, warm ambient glows, custom picture spotlights, and ceiling detail.
* **Real-time Customization Dashboard**:
  * Adjust wall colors and color intensities.
  * Fine-tune skylight, ambient glow, picture spotlight, and canvas brightness levels.
  * Control frame density per wall dynamically (1 to 6 frames per wall).
  * Upload custom images into specific frame slots in real time.
* **3D Controls & Navigation**:
  * **WASD / Arrow Keys**: Walk around the gallery room.
  * **Click & Drag (Mouse/Touch)**: Look 360° around the environment.
* **Web3 & Nimiq Integration**:
  * Mandatory owner wallet authentication via Nimiq Mainnet Hub API to unlock gallery publishing.
  * Direct share link generation that encodes gallery configurations, custom images, and recipient tipping addresses without exposing private session details.
---

## 🛠️ Project Architecture

| Component / Tool | Function |
| :--- | :--- |
| `index_2.html` | Core entry file containing scene setup, dynamic UI overlay, Three.js canvas logic, and wallet handlers. |
| **Three.js (`r128`)** | Main rendering engine for lighting, geometry, materials, and textures. |
| **OrbitControls** | Enables smooth 360-degree interactive camera pan and pitch control. |
| **Nimiq Hub API** | Handles wallet address selection and NIM transaction checkout flows. |

---

## 📦 Setup & Usage

1. **Clone the Repository**:
   ```bash
   git clone [https://github.com/your-username/grand-classical-gallery.git](https://github.com/your-username/grand-classical-gallery.git)
   cd grand-classical-gallery