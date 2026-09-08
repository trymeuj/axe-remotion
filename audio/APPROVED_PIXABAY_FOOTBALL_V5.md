# Approved music checkpoint: Pixabay Football V5

Approved on 2026-09-08 as the final music version for the locked Axe launch
film.

## Keeper files

- Video: `out/keepers/AXE-launch-approved-pixabay-football-v5.mp4`
- Audio master: `out/keepers/AXE-approved-pixabay-football-v5.wav`

The `out/` directory is intentionally Git-ignored because rendered media is
large. These named keeper files must remain in the local project archive.

## Integrity

- Approved MP4 SHA-256: `4831f9b4de4c6a0418d49cebb40d301129cbe7bb7880989c9a08a66e346197cb`
- Approved WAV SHA-256: `c216baa2aec0b89be0876658c0ba367ba7067845b44d97ad6595bf5414c15d6c`
- Source MP3 SHA-256: `6d726554fe438d8b30955b8fd431015aa5564ccc1a9c391e8a5ae31a4fdc075c`
- Locked video-stream MD5: `b42343e2e552a8b061e2983fb0952d47`

The approved MP4 video stream is byte-identical to the locked silent master.
Only its audio stream differs.

## Reproduction

1. Place the licensed source at
   `audio/reference-pixabay-football-551346.mp3`.
2. Run `audio/build_pixabay_football_v5.py` with the bundled Python runtime.
3. Mux the resulting WAV with `out/axe-launch-master-timeline-silent.mp4`
   using video stream copy (`-c:v copy`) and AAC audio at 256 kbps.

The source MP3 is deliberately excluded from Git to avoid redistributing the
licensed music as a standalone asset. Its provenance and license notes are in
`audio/SOURCE_PIXABAY_FOOTBALL_551346.md`.
