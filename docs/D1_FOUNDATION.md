# D1 — Foundation & Design Tokens

D1 establishes the shared UI foundation for the RetroToonz design refresh. `DESIGN.md` remains the source of truth.

## Implemented

- Consolidated brand, surface, text, border, spacing, radius, shadow, motion and typography tokens in `src/styles/globals.css`.
- Unified public content containers (`rt-content`, `rt-standard-content`, `rt-watch-body-content`, `rt-home-section-content`) behind one responsive gutter token.
- Reduced the radius vocabulary to four intentional roles: small, control, card, panel, plus pill/circular controls.
- Removed default card shadowing from standard surfaces; elevated shadows are now reserved for genuinely elevated content.
- Simplified the page background so artwork remains visually dominant.
- Standardized shared buttons, inputs, chips, focus states and 44px minimum controls.
- Changed the primary shared CTA to the primary RetroToonz brand color instead of introducing additional CTA colors.
- Reduced decorative navigation-progress styling to a simple brand line.
- Added shared `Button`, `IconButton`, `PageHeading` and `SectionHeading` primitives for phases D2–D6.
- Improved shared `EmptyState` typography and made the password visibility control a full 44px target.
- Kept the existing auth background/composition intact; only its shared controls now follow the token system.
- Kept the existing video-player layout rules intact; player-specific redesign belongs to D5.

## Intentionally deferred

D1 does not redesign individual screens. These remain for later phases:

- D2: Header, navigation and Hero
- D3: Homepage and cards
- D4: Search and All Shows
- D5: Show Details and Video Player
- D6: Account/Auth/Footer
- D7: Motion/loading/accessibility pass
- D8: Responsive QA and final audit

## Token principles

- Brand: `#55D6E8`
- Strong brand: `#5D8CFF`
- Accent: `#FFD166`
- Danger: `#FF637F`
- Success: `#5EE2A0`
- Primary text: `#F8FAFC`
- Muted text: `rgba(248, 250, 252, 0.54)`
- Minimum practical interactive target: 44 × 44px
- Standard motion: 180ms
- Standard public max width: 1800px
