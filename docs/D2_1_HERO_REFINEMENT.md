# D2.1 — Hero Refinement

This refinement keeps the D2 Header/Hero direction while addressing two visual issues found during desktop review.

## Changes

- Moved desktop Hero carousel arrows higher into the artwork zone so the left arrow does not overlap the metadata/title copy.
- Kept the existing `Start Watching` CTA styling unchanged.
- Replaced the abrupt featured-artwork swap with a 480ms opacity crossfade.
- Preloads the neighboring Hero images to reduce transition flashes.
- Added a restrained 260ms / 4px copy entrance so show metadata/title changes feel synchronized with the artwork.
- No scale/zoom transition is used.
- `prefers-reduced-motion` disables the Hero artwork and copy animations.

## Responsive ratios

- Mobile: 3:4
- Tablet: 4:3
- Desktop: 21:9
