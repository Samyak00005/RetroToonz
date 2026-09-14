# 🎬 RetroToonz

A modern, Netflix-style web platform to relive your childhood cartoons.
Built with a **high-performance frontend stack**, immersive UI, and smooth interactions.

---


## Current design refresh

- **D1 — Foundation & Design Tokens:** complete.
- **D2 — Header, Navigation & Hero:** complete.
- **D3 — Homepage & Content Cards:** complete in this package.
- See `docs/D1_FOUNDATION.md`, `docs/D2_HEADER_HERO.md`, and `docs/D3_HOMEPAGE_CONTENT_CARDS.md`.

## 💡 Why This Project?

RetroToonz is built to demonstrate modern frontend architecture using React, Vite, and Tailwind v4, focusing on performance, UI polish, and scalable component design.

---

## 🚀 Live Demo

- https://retrotoonz.vercel.app
- https://www.retrotoonz.in

---

## ✨ Features

- 🎥 **Surprise Me (Random Episode Play)**
  Instantly jump into a random cartoon episode

- 🧠 **Smart Content Sections**
  - Trending Now
  - Newly Added
  - Retro Classics
  - Cartoon Comedy

- 📺 **Dynamic Hero Banner**
  Featured shows with engaging visuals

- ⚡ **Blazing Fast Performance**
  Powered by Vite 8

- 🎨 **Modern UI & UX**
  - Tailwind CSS v4
  - Smooth animations (Framer Motion)
  - Netflix-inspired layout

- 📱 **Fully Responsive**
  Works seamlessly across mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend

- React 19
- React Router DOM

### Styling & UI

- Tailwind CSS v4
- CSS Variables (custom theme system)
- Framer Motion
- Hugeicons

### Build & Tooling

- Vite 8
- @tailwindcss/vite

### Analytics

- Vercel Analytics
- Vercel Speed Insights

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/samyak1519/retrotoonz.git
cd retrotoonz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## 🎯 Key Highlight

### 🎲 Surprise Me Button

A floating action feature that:

- Selects a random playable episode
- Navigates directly to the video player
- Smart positioning to avoid UI overlap

---

## ☕ Support

If this project brought back memories or helped you:

👉 https://buymeachai.ezee.li/Samyak005

---

## 📄 License

This project is for educational and personal use.

---

## 👨‍💻 Author

**Samyak**
Frontend Developer

- Portfolio: https://portfolio-samyak.vercel.app
- GitHub: https://github.com/Samyak1519
- LinkedIn: https://www.linkedin.com/in/samyak-nimsarkar-752877176/

---

⭐ If you found this project helpful, consider giving it a star!

☕ Buy us a masaledar chai and enjoy your childhood:  
👉 https://buymeachai.ezee.li/Samyak005

---

## D2.1 Hero Refinement

Desktop Hero arrow placement and featured-artwork transitions were refined after visual review. The Start Watching CTA design was intentionally preserved unchanged. See `docs/D2_1_HERO_REFINEMENT.md`.


## D2.4 Hero pagination hotfix

Hero pagination indicators are anchored to the bottom-center at every breakpoint, so they never collide with the fixed bottom-right Surprise Me CTA.


## D3 Homepage & Content Cards

Homepage rails, poster cards, Continue Watching and Browse by Category now follow the content-first D1 design system. The protected Start Watching and Surprise Me brand CTAs remain unchanged. See `docs/D3_HOMEPAGE_CONTENT_CARDS.md`.


## D3.1 Category Revert
Browse by Category uses the pre-D3 non-poster category card design. See `docs/D3_1_CATEGORY_REVERT.md`.
