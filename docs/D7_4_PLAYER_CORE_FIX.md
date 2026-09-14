# D7.4 — Video Player Core Fix

This build removes the temporary legacy-path compatibility experiment and fixes the media source lifecycle itself.

## Root issue addressed

The player previously mutated the HTMLVideoElement imperatively from React effects:

- `video.src = ...`
- `video.load()`
- `video.play()`

That makes source changes brittle around React remounts, episode navigation, StrictMode development cycles, and quality changes. It also treated every media error as a missing file.

## New source lifecycle

The active source is now React state and is rendered directly on the video element:

```jsx
<video src={activeSourceUrl} ... />
```

Changing episode/quality updates state; React owns the element/source lifecycle.

## Error diagnostics

Only after a real HTMLMediaElement error, RetroToonz probes the configured URL with a lightweight HEAD request and combines that result with `HTMLMediaElement.error.code`.

The player can distinguish:

- configured URL returns HTTP error (path/server problem)
- source cannot be reached (network/CORS problem)
- file exists but decode failed (codec problem)
- file exists but browser reports unsupported source/container

The exact source URL is displayed in the development fallback and logged to the console.

## No legacy paths

There is no legacy video path map or automatic old-folder fallback in this build. `Shows.json` remains the source of truth for episode `videoUrl` values.
