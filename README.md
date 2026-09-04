# GifsApp — Search & Discover GIFs

A fast, accessible GIF search app built with **React** and **TypeScript**, powered by the
[Giphy API](https://developers.giphy.com/). Search once, open a lightbox with one-click copy,
and jump straight to Giphy.

## Features

- **Confirmed search only** — queries run on **Enter or the Search button** (no per-keystroke
  requests), and the field clears after each search.
- **Caching & history** — in-memory response cache, plus **previous searches** persisted in
  `localStorage` (max 8) rendered as clickable chips.
- **Stale-response cancellation** — the latest query always wins, even if an earlier request
  resolves later.
- **Full result states** — responsive grid with lazy-loaded cards, skeleton shimmer loading,
  a friendly empty state, and an error state with a "Try again" action.
- **Lightbox** — open any GIF with **Copy URL** (inline "Copied!" feedback), **Open on Giphy**,
  close via Esc, overlay click or the ✕ button, with scroll lock and a focus trap.
- **Accessibility-minded** — `role="status"` live region, landmarks, visible focus states,
  `prefers-reduced-motion` support, and AA-contrast colors.

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 7** (SWC for Fast Refresh)
- **axios** for the Giphy API
- **Vitest** + **Testing Library** + **jsdom** for testing
- **ESLint 9** with type-aware rules (`recommendedTypeChecked`)
- Custom **CSS design tokens** (dark premium theme, Montserrat Alternates + Sora)

## Project Structure

```text
src/
├─ gifs/
│  ├─ actions/        # getGifsByQuery — API call + mapping to the domain model
│  ├─ api/            # axios instance for the Giphy endpoint
│  ├─ components/     # GifCard, GifList, GifGridSkeleton, states, GifModal, PreviousSearches
│  ├─ hooks/          # useGifs — cache, request dedup, stale-response guard, persistence
│  ├─ interfaces/     # Gif + Giphy response types
│  └─ utils/          # previous-searches (localStorage helpers)
├─ shared/
│  └─ components/     # CustomHeader, SearchBar
├─ GifsApp.tsx        # composition + results orchestration
├─ index.css          # design tokens + component styles
└─ main.tsx           # app entry point
tests/
└─ mocks/             # fixture data shared by the test suite
```

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   git clone <your-repo-url>
   cd react-gifs-app
   npm install
   ```

2. Create a `.env` file with your Giphy API key (get one at
   [Giphy Developers](https://developers.giphy.com/)):

   ```bash
   echo "VITE_GIPHY_API_KEY=your_key_here" > .env
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

> [!NOTE]
> The app needs a valid `VITE_GIPHY_API_KEY` to respond — without it, searches will surface
> the built-in error state instead of results.

## Scripts

| Script          | Description                                |
| --------------- | ------------------------------------------ |
| `dev`           | Start the Vite dev server (HMR)            |
| `build`         | Run tests → type-check → production build  |
| `lint`          | Run ESLint (type-aware)                    |
| `test`          | Run Vitest in watch mode                   |
| `test:only`     | Run the test suite once                    |
| `test:ui`       | Run Vitest with the UI dashboard           |
| `coverage`      | Run the test suite with coverage report    |
| `preview`       | Preview the production build locally       |

## Testing

The suite (37 tests across 8 files) covers the search flow, caching, stale-response handling,
history persistence, and component behavior. The action layer is mocked with `vi.mock`, so tests
are **deterministic and run offline** — no network or real API key required.

## Acknowledgments

- [Giphy API](https://developers.giphy.com/) — GIF search and media URLs.
- [Montserrat Alternates](https://fonts.google.com/specimen/Montserrat+Alternates) and
  [Sora](https://fonts.google.com/specimen/Sora) from Google Fonts.