# D7.2 — Loading, Watchlist gate, and pill consistency

- Home and All Shows now show page-shaped skeletons on every mount for a short 180ms transition window, in addition to route-level Suspense fallbacks.
- Logged-out Watchlist now stays on `/watchlist` and presents a Sign in / Create account empty state rather than forcing a redirect.
- Login/Signup can return users to the Watchlist when opened from that state.
- User-facing action/utility buttons now use pill geometry more consistently, including More Info and player Previous/Next/Speed/Quality controls.
- Protected SearchBar and brand CTAs remain unchanged.
