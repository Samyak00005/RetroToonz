# D5 — Show Details & Video Player

D5 refines the show-to-playback journey without changing protected RetroToonz brand UI.

## Show Details
- Preserves the existing/original artwork-first composition.
- Reduces unnecessary shadow/glass effects.
- Keeps title, rating, metadata, tags and description readable without adding extra panels.
- Mobile description is clamped with Show more / Show less; desktop remains fully readable.
- Season controls are quieter and episode cards use artwork-first 16:9 thumbnails.
- Episode titles stay on artwork; synopsis stays outside; saved playback progress remains visible.
- Desktop episode density remains five cards across where space allows.

## Watch Page
- Player remains the primary full-width focal surface.
- Desktop player keeps the 23:9 ratio; mobile/tablet remain 16:9.
- Show and episode metadata use the normal content safe zone below the player.
- Removes decorative page glows around playback.
- Player controls use solid layered surfaces with less blur/shadow.
- Current episode, progress and season browsing remain intact.
- Mobile synopsis stays two lines with Show more / Show less.
- Recommendations continue using the shared Homepage ShowCard/ShowSection UI.

## Protected UI
D5 does not alter:
- Hero Start Watching CTA.
- Surprise Me CTA.
- The current expanded Search Bar design and interaction treatment.

## Validation
Run:

```bash
npm run design:audit
```

Player gradients used for control legibility and the missing-media artwork state are intentional media-readability layers, not decorative page styling.
