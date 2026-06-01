# Repository Guidelines

## Project Structure & Module Organization

This repository is a Remotion/React TypeScript video project. The Remotion entry point is `src/index.ts`, with compositions registered in `src/Root.tsx`. The main timeline is assembled in `src/parts/FullVideo.tsx`; individual segments live in `src/parts/Part*.tsx`, and shared UI belongs in `src/components/`. Global constants are in `src/constants.ts`. Generated narration data is under `src/generated/`, while editable narration sources are under `src/parts/`. Static media assets, including images, audio, and video clips, are stored in `public/`.

## Build, Test, and Development Commands

- `npm install`: install project dependencies from `package-lock.json`.
- `npm start`: open Remotion Studio for local preview and timeline inspection.
- `npm run build`: render the `Root` composition to `Video.mp4`.
- `npm run upgrade`: run Remotion's upgrade helper.

There is no dedicated test, lint, or format script currently declared in `package.json`.

## Coding Style & Naming Conventions

Use TypeScript with React functional components. Keep files consistent with the existing style: two-space indentation, double quotes, semicolons, and named exports. Component files use PascalCase, for example `BilingualSubtitle.tsx`; part files follow the existing `PartA_Economy.tsx` pattern. Keep reusable values in `src/constants.ts` instead of duplicating dimensions, colors, or frame settings. Prefer small, local changes over broad refactors.

## Testing Guidelines

No automated test framework is configured. For changes to visuals, timing, or media, verify in Remotion Studio with `npm start`. For render-sensitive changes, run `npm run build` and inspect the generated `Video.mp4`. When adding tests in the future, colocate them near the code they cover or place them in a clearly named `tests/` directory, and add the corresponding `npm test` script.

## Commit & Pull Request Guidelines

This directory is not currently a Git repository, so no local commit history is available to infer conventions. Use concise, imperative commit messages such as `Add bilingual subtitle styling` or `Fix economy segment timing`. Pull requests should include a short summary, the commands used for verification, any media assets added or replaced, and screenshots or preview notes when visual output changes.

## Agent-Specific Instructions

Before editing, identify the smallest change that satisfies the request. State assumptions when behavior is ambiguous, avoid unrelated cleanup, and keep generated or temporary files out of the project unless they are required deliverables.
