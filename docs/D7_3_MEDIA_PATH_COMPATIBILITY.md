# D7.3 — Media Path Compatibility

The project previously migrated episode media from the original layout:

```text
public/media/episodes/<show-id>/season-NN/<original-filename>
```

to the current standardized layout:

```text
public/media/shows/<show-id>/seasons/sNN/episodes/<show-id>-sNN-eNN.mp4
```

Many existing local RetroToonz libraries still use the original paths. D7.3 keeps the new standardized path as the primary source, but the player now automatically tries the exact legacy path if the primary file cannot be loaded.

## Source order

1. Current canonical MP4 path
2. Current canonical MKV sibling (migration convenience)
3. Exact legacy path from the original RetroToonz catalog
4. Legacy alternate-extension sibling when applicable

MP4 H.264/AAC is still the recommended production delivery format. MKV fallback is best-effort only because browser support varies.

The compatibility map is stored in `src/data/legacyVideoPaths.json` and contains all 137 existing episode mappings.
