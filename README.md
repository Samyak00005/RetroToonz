# 🎬 RetroToonz

A modern, Netflix-style web platform to relive your childhood cartoons.
Built with a **high-performance frontend stack**, immersive UI, and smooth interactions.

---


## Current design refresh

- **D1 — Foundation & Design Tokens:** complete.
- **D2 — Header, Navigation & Hero:** complete.
- **D3 — Homepage & Content Cards:** complete.
- **D4 — Discovery UX:** complete in this package.
- See `docs/D1_FOUNDATION.md`, `docs/D2_HEADER_HERO.md`, `docs/D3_HOMEPAGE_CONTENT_CARDS.md`, and `docs/D4_DISCOVERY_UX.md`.

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

## Design quality workflow

RetroToonz includes project-local design guardrails for AI-assisted development.

Before UI work, read:

- `DESIGN.md`
- `AGENTS.md`
- `docs/DESIGN_REVIEW_WORKFLOW.md`
- `docs/MOTION_GUIDELINES.md`

Run after UI changes:

```bash
npm run design:audit
```

Strict mode treats review warnings as failures:

```bash
npm run design:audit:strict
```

These development checks are not included in the viewer-facing runtime bundle.


## D4 Discovery UX

Search and All Shows now share a lightweight, URL-aware discovery system with quick genre filters, responsive mobile filters, relevance-preserving search refinement, and cleaner result hierarchy. See `docs/D4_DISCOVERY_UX.md`.


## Design refresh — D5

D5 refines Show Details and the Video Player while preserving the original Show Details identity and all protected brand UI. See `docs/D5_SHOW_DETAILS_VIDEO_PLAYER.md`.


## D5.1 — Search brand lock

- Restored the user-approved SearchBar implementation as protected RetroToonz brand UI.
- Kept its dark pill field, cyan search accent, integrated cyan-to-blue Search button, recent searches, suggestions and keyboard behavior.
- Reduced the cyan focus border to a subtle `0.5px` treatment.
- Logged remaining Video Player bugs as intentionally deferred for a later stabilization pass.

See `docs/D5_1_SEARCH_BRAND_LOCK.md` and `docs/D5_DEFERRED_VIDEO_PLAYER_BUGS.md`.

## Design Refresh — D6
Account, authentication, watchlist and footer were refined in `docs/D6_ACCOUNT_AUTH_FOOTER.md`. Protected brand elements remain unchanged.

### D6.1 auth refinement
The auth screens restore the slow-moving doodle treatment, place Forgot Password below the password input, and use the refined cyan-to-blue RetroToonz primary CTA style.


## D7 — Motion, Loading & Accessibility

See `docs/D7_MOTION_LOADING_ACCESSIBILITY.md` for the accessibility and interaction-feedback pass.

## D7.1 loading refinement

- Route-level spinner replaced with page-shaped skeletons.
- Removed the thin top navigation progress sweep because it could visibly complete after page content was already rendered.
- Skeletons use a soft opacity breathe rather than a left-to-right shimmer.
- Poster loading placeholders are removed immediately once artwork is ready.

## D7.2 — Loading, Watchlist and pill consistency

- Home and All Shows now use page-shaped skeleton states on each page entry.
- Logged-out Watchlist visitors see an in-page sign-in state instead of an automatic redirect.
- Sign-in opened from Watchlist returns to Watchlist after authentication.
- User-facing action/utility buttons use consistent pill geometry; circular icon controls remain circular.
- Player Previous/Next/Speed/Quality controls now use pill styling.
- Protected SearchBar and brand CTAs are unchanged.

## D7.4 player-core fix

Video playback now uses a declarative React-owned `<video src>` lifecycle rather than imperative `video.src/load/play` mutation. The temporary legacy-path fallback is not included. If playback fails, the player distinguishes URL/network problems from codec/decode problems and reports the exact configured source.
