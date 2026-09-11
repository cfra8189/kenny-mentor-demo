# Kenny Mentor Demo

A polished, interactive presentation MVP showing how Kenny could guide mentees from focused learning through reflection, assessment, meeting preparation, and mentor review.

This repository uses fictional demo data stored only in the browser. It does not connect to production authentication, Supabase persistence, email, file uploads, Zoom, payments, or a community backend.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:5173/demo/](http://127.0.0.1:5173/demo/).

Use **Reset Demo** in the presentation toolbar to restore the fictional mentees, assessment results, feedback, and meeting schedule to their defaults.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See [the presentation guide](docs/demo/mentor-mvp-presentation.md) for the five-minute walkthrough, functional interactions, simulated features, and production roadmap.
