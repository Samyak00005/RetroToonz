# D7.1 — Skeleton Loading Cleanup

- Replaced the route-level spinner with route-shaped skeletons.
- Removed the thin navigation progress sweep from the top of the app; it was redundant once skeleton loading existed and could visibly finish after page content appeared.
- Route skeletons use a soft opacity breathe instead of a left-to-right shimmer.
- ShowCard poster shimmer is now removed from the DOM immediately after the image loads instead of continuing invisibly under an opacity transition.
- Reduced-motion users receive static skeleton placeholders.
