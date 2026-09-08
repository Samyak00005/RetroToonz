# 🎬 RetroToonz

A modern, Netflix-style web platform to relive your childhood cartoons.
Built with a **high-performance frontend stack**, immersive UI, and smooth interactions.

---

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

## 📁 Project Structure

The source is organized by responsibility: app boot/routing, route pages, reusable components, services, temporary static data, and global styles. See `docs/PROJECT_STRUCTURE.md` for the current structure and migration rules. UI tokens and shared component rules are documented in `docs/DESIGN_SYSTEM.md`.

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

## 📌 Next Major Work

Phase 1 now contains the complete public frontend foundation, including advanced discovery, browser-local watchlist/history, prototype accounts, frontend-only password reset, and the enhanced player experience.

Next major work is **Phase 2 — Admin CMS & persistence architecture**:

- Shows / seasons / episodes management
- Homepage collection management
- Content health and analytics cleanup
- Admin settings and content workflows
- Later backend/database/media-storage integration

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

## 🧪 Frontend Prototype Accounts (Phase 1D)

These accounts exist only for the current no-backend prototype and are visible in the frontend bundle.

**Admin**
- Email: `samyak.timepass@gmail.com`
- Username: `samyak`
- Password: `Password@123`

**Normal user**
- Email: `user@retrotoonz.com`
- Username: `retrofan`
- Password: `User@123`

Admin → Users can create and manage additional browser-local accounts. This is not production authentication.

## Phase 1 — Complete Public Frontend Foundation

Phase 1J introduced artwork-backed category cards. The final Phase 1 polish adds advanced search, filters, profile/watchlist UX, resilient media states, accessibility cleanup, and responsive consistency. See `docs/PHASE_1_FINAL.md`.

## Current working build

Phase 1Q keeps the Phase 1 public UI foundation and replaces the temporary browser FFmpeg experiment with a local native media-preparation pipeline. Source episodes may be MKV or MP4; deployed playback remains browser-safe MP4.

## Phase 1K.2 media convention

Media is now grouped by show under `public/media/shows/<show-id>/`. Episode videos use the normalized `<show-id>-sNN-eNN.mp4` naming rule. See `docs/MEDIA_GUIDE.md` and `docs/EPISODE_MEDIA_MAP.csv`.

## Phase 1L

This build includes the media-folder migration, normalized episode naming, 23:9 desktop player, episode-card cleanup, compact library/search headers, and repaired All Shows filtering. See `docs/PHASE_1L_CHANGELOG.md`.

## Phase 1M stabilization

This build adds current-episode/playback-progress treatment to the Watch-page episode rail, aligns all Homepage rails to one shared safe zone, protects Watchlist for signed-in users, and reduces the desktop wordmark weight.

---

## Current UI milestone

Phase 1N adds the final Profile polish pass: separated account/admin controls, improved Continue Watching and History cards, accurate local library metrics, and responsive empty/recommendation states. See `docs/PHASE_1N_PROFILE_POLISH.md`.

## 🎬 Local media preparation

RetroToonz does not run FFmpeg in the browser. Original episodes may be MKV or MP4, but browser delivery files are prepared locally before deployment.

```bash
npm run media:scan
npm run media:prepare
```

Put source/master files under `media-source/shows/...` using `<show-id>-sNN-eNN.<ext>`. The pipeline uses native `ffprobe`/`ffmpeg`, fast-remuxes already-compatible H.264/AAC sources, and selectively transcodes incompatible streams to browser-ready MP4/H.264/AAC in `public/media/shows/...`.

See `docs/LOCAL_MEDIA_PIPELINE.md`.
