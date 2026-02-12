# MagniPrints — Immersive 3D Printing Website

[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=flat&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green?style=flat)](https://greensock.com/gsap/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

A complete immersive 3D interactive website for MagniPrints, featuring full Three.js integration, procedural 3D models, STL upload support, live print tracking, and WhatsApp order integration.

![MagniPrints Preview](preview.png)

## 🚀 Live Demo

Try "DEMO" in the order tracker to see live print simulation!

## ✨ Features

### 1. Homepage (`index.html`)
- **Full-screen WebGL Hero Background** — Morphing sphere/particle system with dynamic connections
- **3D Responsive Text** — Title responds to mouse movement with 3D perspective transform
- **Interactive Showcase** — Switch between products with live 3D preview
- **Scroll-triggered Animations** — GSAP-powered reveal animations
- **Dark/Light Mode** — Full theme toggle with CSS custom properties
- **Mobile-first Design** — iOS Safari optimized with simplified rendering

### 2. Products Page (`products/`)
- **Interactive 3D Product Viewer** — Sidebar with OrbitControls (rotate, zoom, pan)
- **7 Procedural 3D Models**:
  - Phone Stand
  - Geometric Planter
  - Cable Holder Set
  - Custom Keychain
  - Controller Stand
  - Desk Organizer
  - 3D Lithophane
- **Filament Selector** — PLA, PETG, TPU with dynamic material properties
- **Color Picker** — 10+ color options per filament type
- **Price Calculator** — Real-time price updates based on filament + quantity
- **WhatsApp Integration** — Direct order links with pre-filled details

### 3. Custom Print Page (`custom/`)
- **Drag & Drop STL Upload** — Full Three.js STL loader integration
- **3D Preview** — Real-time preview of uploaded files
- **Sample Models** — Phone Stand, Zen Vase, Robo Figurine for testing
- **Print Settings**:
  - Layer height (0.1mm - 0.4mm)
  - Infill density (0% - 100%)
  - Support options (None/Touching/Everywhere)
- **Filament Cost Calculator** — Price per gram based on material
- **Model Statistics** — Dimensions, volume, triangle count, estimated weight

### 4. Track Order Page (`track/`)
- **Order ID Search** — Search orders or use "DEMO" for live preview
- **5-Step Progress Tracker**:
  1. Confirmed
  2. Preparing
  3. Printing (with LIVE badge)
  4. Quality Check
  5. Shipped
- **Live Print Visualization** — Real-time 3D layer growth simulation
- **G-Code Stream** — Animated terminal showing real-time commands
- **Print Stats** — Layer progress, nozzle/bed temperature, print speed
- **ETA Countdown** — Real-time countdown to completion

## 🎨 Design System

### Colors

**Dark Mode (Default):**
- Background: `#050505`
- Text: `#ffffff`
- Accent: `#667eea` (purple) → `#764ba2` gradient

**Light Mode:**
- Background: `#ffffff`
- Text: `#1a1a1a`
- Accent: `#22c55e` (green)

### Typography
- **Headlines**: Space Grotesk (700)
- **Body**: Inter (400, 600)

## 🛠 Technical Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Three.js | r128 | 3D rendering & WebGL |
| GSAP | 3.12.2 | Animations & scroll effects |
| OrbitControls | r128 | Camera navigation |
| STLLoader | r128 | STL file import |
| No CSS frameworks | — | Pure custom CSS with CSS Grid/Flexbox |

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+ (iOS Safari with simplified rendering)
- Edge 90+

## 🚀 Getting Started

### Option 1: Direct Git Push (Recommended)

```bash
# Clone/navigate to the repository
cd magniprints

# Add your GitHub remote (if not already configured)
git remote add origin https://github.com/shapelessgecko/magniprints.git

# Push to GitHub (requires authentication)
git push -u origin main
```

**Authentication options:**
1. **Personal Access Token**: Use token as password when prompted
2. **SSH**: Set up SSH keys and use SSH URL
3. **GitHub CLI**: `gh auth login` then `gh repo create`

### Option 2: GitHub Web Upload

1. Go to https://github.com/shapelessgecko/magniprints
2. Click "Add file" → "Upload files"
3. Drag and drop all files from the `magniprints` folder
4. Commit changes

### Option 3: Local Preview

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000

## 📂 Project Structure

```
magniprints/
├── index.html              # Homepage
├── products/
│   └── index.html          # Products with 3D viewer
├── custom/
│   └── index.html          # STL upload & custom prints
├── track/
│   └── index.html          # Order tracking
├── css/
│   ├── main.css            # Global styles & themes
│   ├── products.css        # Products page styles
│   ├── custom.css          # Custom order styles
│   └── track.css           # Tracking page styles
├── js/
│   ├── main.js             # Shared utilities & theme toggle
│   ├── hero-3d.js          # Homepage 3D effects
│   ├── products-3d.js      # Product viewer & calculator
│   ├── custom-3d.js        # STL loader & price estimator
│   └── track.js            # Live print tracking
└── README.md
```

## 🎮 Interactive Elements

### Mouse Interactions
- **3D Text**: Rotates based on mouse position
- **Particle System**: Responds to mouse proximity
- **Product Cards**: 3D tilt effect on hover

### Scroll Animations
- Hero fade-in
- Feature cards stagger animation
- Stats counter animation
- Section reveals with GSAP ScrollTrigger

### 3D Controls
- **OrbitControls**: Left-click rotate, right-click pan, scroll zoom
- **Auto-rotate**: Toggle with button
- **Wireframe mode**: Toggle materials
- **Reset view**: Return to default camera

## 💰 Pricing Model

The site includes a dynamic pricing calculator:

| Filament | Cost/g | Properties |
|----------|--------|------------|
| PLA | ₹2 | Standard, matte finish |
| PETG | ₹3 | Strong, durable |
| TPU | ₹5 | Flexible, rugged |

Additional costs:
- Setup fee: ₹50 per order
- Print time: ₹50/hour

## 🔗 Order Integration

WhatsApp integration pre-fills:
- Product details
- Selected filament & color
- Quantity
- Estimated price

Format: `https://wa.me/918800000000?text={message}`

## 📊 Performance

- **iOS Safari**: Simplified particle system (800 vs 2000 particles)
- **Mobile**: 30fps target vs 60fps desktop
- **Lazy loading**: 3D scenes load on demand
- **Code splitting**: Page-specific JS files

## 🐛 Known Limitations

1. **STL Upload**: Files up to 50MB only
2. **Browser Storage**: No persistency (orders not actually stored)
3. **WhatsApp**: Requires user's WhatsApp to be active
4. **Print Simulation**: Demo mode only for preview

## 🔮 Future Enhancements

- [ ] Stripe/PayPal payment integration
- [ ] User accounts with order history
- [ ] Real print farm API integration
- [ ] AR product preview
- [ ] Image-to-lithophane conversion

## 📝 License

MIT License - feel free to use for your own 3D printing business!

## 🙏 Credits

- 3D rendering: [Three.js](https://threejs.org/)
- Animations: [GSAP](https://greensock.com/)
- Icons: Custom SVG
- Fonts: Google Fonts (Inter, Space Grotesk)

---

**Made with 💜 for MagniPrints** — Bring ideas into reality!
