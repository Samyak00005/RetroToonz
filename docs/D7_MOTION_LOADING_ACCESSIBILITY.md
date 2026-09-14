# D7 — Motion, Loading & Accessibility

D7 standardizes interaction feedback and accessibility without changing protected RetroToonz brand elements.

## Added

- Keyboard-visible **Skip to content** link.
- SPA route announcements and focus management for screen readers/keyboard users.
- Lazy route loading with an accessible loading fallback.
- Calmer page transitions (short fade only).
- Toasts now use `status`/`alert` semantics and a 44px dismiss target.
- Media frames expose loading state with `aria-busy`.
- Interactive chips and key playback controls use practical 44px touch targets.
- Forced-colors support for focus and borders.
- Stronger reduced-motion handling.

## Motion rules

- Normal navigation: short opacity fade only.
- Loading shimmer/spinners exist only to communicate waiting.
- Touch devices do not receive unnecessary hover-lift transforms.
- Auth doodles remain an approved visual exception, but are disabled when reduced motion is requested.

## About page cleanup

Older decorative hover scaling, pulse animation, long transitions, and misleading pointer styling were removed or reduced.

## Protected UI

D7 does not redesign:

- SearchBar
- Start Watching CTA
- Surprise Me CTA
