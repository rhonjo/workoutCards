# Workout Cards

A workout companion app that surfaces randomised exercise cards by difficulty level. Users can browse the full exercise library, customise individual exercises, and save their edits to a personal account.

---

## Features

- **Daily workout draw** — generates one Beginner, one Intermediate, and one Advanced card at a time
- **Exercise library** — browsable grid of all exercises sorted by difficulty
- **In-app editing** — edit any exercise's name, difficulty, reps/time, and cue with a live preview
- **User accounts** — register and log in to persist your customisations across sessions
- **Difficulty colour coding** — green / amber / red accent bars and badges for instant visual scanning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| UI components | Material UI (MUI) 7 |
| Styling | CSS (glassmorphism, CSS custom properties) + MUI `sx` |
| State | React `useState` (no external store) |
| Data | `exercises.json` — static file, in-memory at runtime |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install and run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other scripts

```bash
npm run build      # Production build (output to dist/)
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

---

## Project Structure

```
src/
  components/
    ExerciseCard.tsx      # Card UI with difficulty accent bar
  types/
    Exercise.ts           # Exercise type definition
    User.ts               # User type definition
  utils/
    exerciseUtils.ts      # Exercise helpers (random draw, labels, colours)
    userUtils.ts          # User helpers (create, authenticate, update)
  App.tsx                 # Root component — all views and modals
  App.css                 # App-wide styles (dark theme, glassmorphism)
  main.tsx                # React entry point, MUI theme
exercises.json            # Exercise data — categories, difficulties, cues
```

---

## Exercise Data

Exercises are grouped into six categories:

- Lower Body
- Upper Body
- Core
- Full Body
- Cardio / Plyometrics
- Mobility & Balance

Each exercise has a `difficulty` of `1` (Beginner), `2` (Intermediate), or `3` (Advanced), a `repsTime` field, and a `cue` describing proper technique.

---

## Notes

**In-memory storage** — user accounts and exercise edits are stored in memory only. All data resets on page refresh. A backend integration would be required for persistence.

---

## Planned

- Forgot password flow with token-based reset
