# D6 — Account, Auth & Footer

D6 reduces account-page and auth visual noise while preserving the RetroToonz identity.

## Auth
- Preserves the original dark-blue/confetti/glow auth background.
- Replaces the heavy glass form panel with a calmer layered surface.
- Keeps password visibility controls and frontend-only local auth behavior.
- Removes inactive Google sign-in from the active login/signup flow until it is connected.
- Simplifies copy and validation messages.
- Keeps the temporary local password reset flow clearly labelled as frontend-only.

## Profile
- Keeps identity, viewing metrics, account settings, admin tools, activity, and recommendations separated by purpose.
- Removes decorative avatar gradients and unnecessary glass/blur treatment.
- Keeps Admin tools separate from personal account controls.
- Viewing cards remain content-first and preserve progress/history behavior.

## Watchlist
- Removes the boxed desktop filter panel.
- Uses lightweight category chips and a compact sort control.
- Logged-out users still redirect to Sign in.
- Keeps the shared RetroToonz ShowGrid.

## Footer
- Reduced to essential navigation.
- Help with chai remains accessible but no longer competes as a large CTA.
- Uses the same shared content gutter as public pages.

## Protected elements
D6 does not modify:
- SearchBar
- Start Watching
- Surprise Me

## D6.1 auth refinement

- Restored the user-approved slow moving doodle treatment on auth screens.
- Moved Forgot password below the password input.
- Upgraded Sign in/Create account/Update password primary actions to a restrained cyan-to-blue RetroToonz gradient CTA with white text and subtle press/hover feedback.
- Motion respects the existing global `prefers-reduced-motion` rule.
