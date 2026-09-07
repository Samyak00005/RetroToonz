# RetroToonz deployed media

This directory contains media that the website can serve directly.

- `branding/` — brand and decorative UI assets.
- `defaults/` — fallback artwork.
- `shows/<show-id>/poster.jpg` — portrait poster.
- `shows/<show-id>/backdrop.jpg` — landscape/hero artwork.
- `shows/<show-id>/seasons/sNN/episodes/` — **browser-ready** episode videos.
- `unassigned/` — artwork not currently attached to a catalog show.

Deployed episode naming:

```text
<show-id>-sNN-eNN.mp4
```

Original MKV/MP4 master/source files belong under the local, Git-ignored `media-source/` directory and are prepared with:

```bash
npm run media:prepare
```

See `docs/LOCAL_MEDIA_PIPELINE.md` and `docs/MEDIA_GUIDE.md`.
