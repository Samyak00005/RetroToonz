# D2 — Header, Navigation & Hero

D2 applies the RetroToonz design system to the top-level navigation and Homepage Hero.

## Header

- Keeps the Homepage header transparent until interaction/scroll makes a surface useful.
- Uses a restrained solid/blurred header surface on inner pages and after scrolling.
- Adds direct desktop navigation for All Shows and Watchlist.
- Keeps profile/account/admin actions in the profile menu rather than duplicating them in the primary navigation.
- Removes decorative shadows from search/profile controls.
- Keeps profile control pill-shaped as a utility/account control.
- Expanding Search temporarily yields space from the desktop navigation rather than crowding the header.
- Search uses the shared RetroToonz brand color instead of a decorative cyan/blue gradient.
- Header controls retain useful 44px interaction targets.

## Hero

- Responsive aspect ratios remain 3:4 mobile, 4:3 tablet and 21:9 desktop.
- Removes the continuous slow-zoom animation.
- Uses a short fade when the featured item changes.
- Extends autoplay to 7 seconds and pauses while the Hero is being interacted with.
- Establishes a clearer hierarchy: metadata → title → description → primary CTA → secondary CTA.
- Start Watching is the sole dominant CTA.
- More Info is intentionally quieter.
- Carousel arrows are reduced to 44px and positioned away from the content block.
- Carousel indicators are deliberately low emphasis.
- Swipe navigation remains on mobile.
- Motion respects prefers-reduced-motion.

## Validation

- D2 edited JSX parses successfully with TypeScript syntax checking.
- Broken relative imports: 0.
- Shows: 21.
- Episode records: 137.
- Video files intentionally included in this lightweight project ZIP: 0.

A full Vite production build could not be completed in the review environment because `npm ci` timed out while downloading packages. No partial `node_modules` directory is included.


## Protected brand buttons

`Start Watching` and `Surprise Me!` intentionally use the original RetroToonz pill CTA treatment: cyan-to-blue gradient, white icon/text, `shadow-md`, hover scale, reversed hover gradient, active scale, and the subtle cyan ping element. Do not replace them with the generic shared button style.
