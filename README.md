# Axe motion films

The version-controlled source for Axe launch and product films, built with Remotion.

## Project layout

- `src/` — compositions, scenes, animation logic, and styling
- `public/` — source assets used by the compositions
- `out/` — local rendered videos and frame checks; never committed
- `HUSAINPROMPTS.md` — production-reference notes for the visual direction

As the collection grows, keep each film self-contained under a named project folder in `src/projects/`, with its composition registered in `src/Root.tsx`. Shared X-native UI primitives and utilities should live in `src/shared/`.

## Working practice

1. Make a small creative or technical change.
2. Render the relevant frame checks locally.
3. Commit a meaningful checkpoint, for example `choreography: hold co-founder message before 774K zoom`.
4. Tag release-ready cuts, for example `axe-launch-v1.0`.

The video itself is reproducible from the source. Keep final deliverables in `out/` locally or upload them to an external release/archive location when needed.

For the optional X reference fetcher, keep the API key only in your shell environment or a local `.env.local`; never commit it.
