# Pixabay Football V5 — 29.23s middle-cut adaptation

Created on 2026-09-08 by adapting the approved Pixabay Football V5 mix to the
877-frame visual edit. The approved 34.6-second V5 keeper and build recipe remain
unchanged.

## Keeper files

- Video: `out/keepers/AXE-launch-middle-cut-pixabay-football-v5.mp4`
- Audio master: `out/keepers/AXE-middle-cut-pixabay-football-v5.wav`
- Silent visual master: `out/axe-launch-middle-cut-final-silent.mp4`

Rendered media remains in the Git-ignored local keeper archive. The build recipe,
cue map, source provenance, and integrity hashes are tracked by Git.

## Integrity

- Scored MP4 SHA-256: `413da75a9d8911806ad86d30d81cd2ffc417ea3495dcb968643a7917c62c60f2`
- Audio WAV SHA-256: `9084aecbcac03dd80e89afa6a0c96a0b2d5a3339affc5c3f9f9e4549eb4d3fce`
- Silent and scored video-stream MD5: `8c306fd22edd046e57e70bf858378dee`
- Licensed source MP3 SHA-256: `6d726554fe438d8b30955b8fd431015aa5564ccc1a9c391e8a5ae31a4fdc075c`

The scored MP4 video stream is byte-identical to the 29.23-second silent master.

## Audio adaptation

The music remains at its natural tempo and pitch. It was not globally sped up.
The approved V5 automation and UI sound palette were moved to the new editorial
landmarks, including:

- First co-founder message: 2.60s
- Reply send: 9.73s
- Notification run: 13.13s
- Six-reply sequence: 15.52s
- 90-day notification: 18.13s
- Final 112K notification: 22.73s
- Final co-founder message: 25.23s
- Axe reveal: 27.23s

## Reproduction

1. Keep the licensed source at `audio/reference-pixabay-football-551346.mp3`.
2. Run `audio/build_pixabay_football_v5_middle_cut.py` using Python with NumPy.
3. Mux its WAV with the silent master using video stream copy and 256kbps AAC.

The licensed source MP3 is intentionally excluded from Git. Its provenance and
license notes are recorded in `audio/SOURCE_PIXABAY_FOOTBALL_551346.md`.
