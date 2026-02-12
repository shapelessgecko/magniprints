# 🔹 MagniPrints — Premium 3D Printing Laboratory

An immersive, interactive 3D printing e-commerce experience featuring WebGL visualizations, real-time 3D product viewers, drag-and-drop STL uploads, and live order tracking.

![3D Preview](https://img.shields.io/badge/3D-Three.js-blue)
![WebGL](https://img.shields.io/badge/WebGL-Enabled-green)
![GSAP](https://img.shields.io/badge/Animations-GSAP-purple)

## ✨ Features

### 🏠 Homepage
- Full-screen WebGL background with floating particles
- Multiple animated 3D wireframe shapes (icosahedron, torus, octahedron, ring)
- Mouse-responsive camera parallax movement
- GSAP scroll-triggered animations
- Counter animations with intersection observer
- Dark/Light mode toggle

### 🛍️ Products Page
- Live 3D product viewer in sidebar
- **7 procedural 3D product models**:
  - 📱 Phone Stand (rounded box geometry)
  - 🪴 Geometric Planter (lathe geometry)
  - 🔌 Magnetic Cable Holder (curved tube)
  - 🔑 Custom Keychain (torus ring)
  - 🎮 Dual Controller Stand
  - 📦 Modular Desk Organizer
  - 🖼️ Custom Lithophane
- OrbitControls (rotate, zoom, pan)
- 8 filament material options with live material switching
- Price calculator (real-time based on filament type)
- Auto-rotate and wireframe mode toggles
- Screenshot capture functionality

### 📤 Custom Upload Page
- Drag & drop STL file upload zone
- Three.js STL loader for instant 3D preview
- 3 built-in sample models to test:
  - Phone Stand
  - Decorative Vase (lathe geometry)
  - Abstract Figurine
- Complete print settings control:
  - Layer height (0.1mm - 0.3mm)
  - Infill percentage (10% - 100%)
  - Wall thickness (0.8mm - 2.0mm)
  - Material selector
- Real-time cost calculation (material × weight)
- Print statistics (dimensions, volume, estimated time)
- WhatsApp integration for seamless ordering

### 📊 Order Tracking Page
- Order ID tracking with demo data
- **3D layer visualization** — stacked layers showing real-time print progress
- Animated progress bar
- 5-step status tracker with 3D-style icons
- Live G-code terminal simulation
- Print statistics (nozzle/bed temp, fan speed)
- ETA countdown timer
- Real-time printer status indicators

## 🎨 Theme Support

Automatically switches between:
- **Dark Mode**: `#050505` background, white text, `#667eea` accent
- **Light Mode**: `#ffffff` background, `#1a1a1a` text, `#22c55e` accent

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Three.js r128 | All 3D rendering |
| GSAP 3.12.2 | Scroll animations & transitions |
| OrbitControls | 3D viewer navigation |
| STLLoader | STL file preview |
| Intersection Observer | Scroll reveal effects |
| CSS Variables | Dynamic theming |
| WhatsApp API | Order integration |

## 📁 Project Structure

```
magniprints/
├── index.html                 # Homepage with WebGL background
├── css/
│   └── styles.css            # All styles with CSS variables
├── products/
│   └── index.html            # Product catalog with 3D viewer
├── custom/
│   └── index.html            # STL upload & custom print page
├── track/
│   └── index.html            # Order tracking with 3D visualization
└── README.md
```

## 🚀 Quick Start

1. Clone/download the repository
2. Open `index.html` in any modern browser
3. No build step required — pure HTML/CSS/JS!

Or host on any static site platform (GitHub Pages, Netlify, Vercel, etc.)

## 📱 Mobile Support

- Responsive layouts for all screen sizes
- Simplified 3D on mobile for performance
- Touch-friendly controls
- Hamburger navigation on small screens

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit order ID in tracking page |
| Mouse | Rotate/Zoom 3D viewers |
| Drag | OrbitControls navigation |

## 📝 Demo Order IDs

Try these for the tracking page:
- `MP-2024-001` — In progress
- `MP-2024-002` — QC Check
- `MP-2024-003` — Completed
- `DEMO` — Live simulation

## 🎨 Customization

Edit these in `css/styles.css`:

```css
:root {
    --bg-dark: #050505;
    --bg-light: #ffffff;
    --accent-dark: #667eea;
    --accent-light: #22c55e;
}
```

## 🔗 Live Demo

Hosted on GitHub Pages: [magniprints.github.io](https://yourusername.github.io/magniprints/)

---

Crafted with 💜 for makers, by MagniPrints
