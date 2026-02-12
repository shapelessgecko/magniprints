# マグニプリンツ — MagniPrints

<p align="center">
  <img src="https://img.shields.io/badge/Three.js-r128-black?style=flat-square&logo=three.js&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/GSAP-3.12-green?style=flat-square" alt="GSAP">
  <img src="https://img.shields.io/badge/WebGL-2.0-purple?style=flat-square" alt="WebGL">
</p>

**Precision in Every Layer**

A premium 3D printing service website with an immersive, artistic aesthetic inspired by claygarden.jp. Built with heavy WebGL effects, smooth GSAP animations, and ultra-minimal design.

## 🎨 Design Philosophy

- **Ultra-minimal navigation** — Split letter typography (M a g n i P r i n t s)
- **Japanese typography** prominently displayed
- **Numbered sections** — 1 Products, 2 Custom, 3 Track
- **Full-screen immersive sections** with WebGL backgrounds
- **Editorial layout** — Maximum whitespace, sophisticated elegance
- **Single accent palette** — Purple (#667eea) and Green (#22c55e)

## 🚀 Pages

| Page | Description |
|------|-------------|
| `index.html` | Hero + all sections (Products, Custom, Track) |
| `products.html` | Full product gallery with 3D hover effects |
| `custom.html` | STL upload, 3D preview, instant quote calculator |
| `track.html` | Real-time order tracking with layer visualization |

## ✨ Features

- **Three.js r128** — Morphing wireframe spheres, floating particles
- **GSAP ScrollTrigger** — Smooth section transitions
- **Mouse parallax** — Interactive 3D elements
- **Drag & drop STL upload** — Custom file handling
- **Live layer visualization** — Animated 3D print progress
- **Responsive design** — Mobile-optimized experience

## 🛠️ Technical Stack

- Three.js r128 for 3D/WebGL
- GSAP 3.12 for animations
- Vanilla JavaScript (no frameworks)
- CSS Grid & Flexbox
- CSS Custom Properties

## 🎯 Colors

```css
--bg: #050505;
--bg-alt: #0a0a0a;
--text: #ffffff;
--accent-purple: #667eea;
--accent-green: #22c55e;
--border: rgba(255,255,255,0.1);
```

## 📦 Local Development

Simply open any HTML file in a browser, or serve via local server:

```bash
npx serve .
# or
python -m http.server 8000
```

## 🔗 Live Demo

https://rize-the-star.github.io/magniprints

---

Built with precision. **マグニプリンツ**
