# Local source/master videos

This folder is for **local media preparation only**. It is not served by RetroToonz and source episodes should not be committed or deployed.

Put original MKV/MP4 files here using the normalized layout:

```text
media-source/
└── shows/
    └── doraemon/
        └── seasons/
            └── s01/
                └── episodes/
                    ├── doraemon-s01-e01.mkv
                    ├── doraemon-s01-e02.mp4
                    └── ...
```

Then run from the project root:

```bash
npm run media:prepare
```

Browser-ready output is written to `public/media/shows/...` as MP4.

See `docs/LOCAL_MEDIA_PIPELINE.md`.
