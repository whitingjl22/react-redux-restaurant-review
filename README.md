# Let’s eat

A responsive restaurant discovery and review journal, rebuilt from the original React/Redux project. Add a restaurant, find it by cuisine or location, share a five-star review, and keep your collection between visits.

## Run locally

Use **Node.js 22.22.2+ (22 LTS), 24.15+ (24 LTS), or 26+**. Node 22 is used in CI; `nvm use` selects that major version.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. No account, API keys, database, or paid services are needed.

```sh
npm run check                 # TypeScript, unit/component tests, production build
npx playwright install chromium
npm run test:e2e              # Desktop and mobile Chromium journeys
npm run preview              # Preview the production build after npm run build
```

## First milestone

- React + TypeScript + Vite, React Router, and Redux Toolkit with typed hooks.
- Restaurant creation, viewing, editing, and confirmed deletion, preserving the original URLs.
- Reviews with trimmed text validation and integer ratings from 1 through 5.
- Search by name, cuisine, or location; cuisine and rating filters; name, rating, and review-count sorting. Filters are stored in the URL.
- Optional descriptions, locations, and price ranges.
- Responsive layout, keyboard-accessible controls, labeled fields, inline errors, route focus management, and empty/not-found states.
- Versioned browser persistence validated with Zod. Storage errors are visible; unreadable saved data is never silently overwritten.
- Automated state, validation, form, routing, persistence, and desktop/mobile browser tests, plus GitHub Actions CI.
- Locally bundled food photography, a compact editorial header, and responsive photo-led cards. Optional Google Fonts have system-font fallbacks.

This is a **local demo**. Data belongs to this browser and origin, is not shared between users, and is not synchronized across devices or open tabs. Closing a tab after a storage failure can lose unsaved changes. Clearing site storage removes the collection. Don’t use it to store sensitive information. The Vite development server binds to loopback only.

## Architecture

| File             | Responsibility                                                      |
| ---------------- | ------------------------------------------------------------------- |
| `src/model.ts`   | Shared domain types, Zod validation, filtering, averages, demo seed |
| `src/store.ts`   | Typed Redux actions, state updates, versioned persistence           |
| `src/App.tsx`    | Routes, restaurant directory/detail, restaurant and review forms    |
| `src/styles.css` | Responsive layout, original CSS illustrations, focus states         |
| `tests/`         | Vitest/Testing Library tests and Playwright browser journeys        |

The store validates mutations as well as forms. Restaurant edits preserve reviews; deletion removes nested reviews. Unknown IDs render a recovery page, and deleting an unknown ID is a no-op. UUIDs replace the original global counter. No browser storage is read at module import time, making state logic independently testable.

The `lets-eat:v1` localStorage record contains `{ version: 1, restaurants: [...] }`. Invalid or incompatible data triggers a warning and demo fallback without replacing the stored record. If it happens, export the existing record using browser developer tools before repairing or removing it, then refresh. Future schema changes should add explicit migrations rather than silently discard records.

## Routes

| Route                     | Screen                 |
| ------------------------- | ---------------------- |
| `/`                       | Redirect to collection |
| `/restaurants`            | Searchable collection  |
| `/restaurants/new`        | Add restaurant         |
| `/restaurants/:id`        | Restaurant and reviews |
| `/restaurants/:id/edit`   | Edit restaurant        |
| `/restaurants/:id/review` | Add review             |

A future static host must serve `index.html` for these client-side routes. No hosting or deployment is configured by this milestone.

## Preserving the original

The original application and dependency manifest/lockfile are retained under `legacy/` for reference. They are excluded from the current build and should not be used as the supported application. Git history is preserved, and this work is delivered on a feature branch.

The original Back-A-Yard and Taco Bell names and review text remain in the demo. The original out-of-range Taco Bell ratings (10 and 6) are capped at 5; synthetic dates are used only as internal seed metadata. Price tiers are demo defaults, not verified business information. The original app had only in-memory state, so there is no previous persisted user database to migrate.

## Next milestone: shared persistence

A Node.js/Fastify API, PostgreSQL/Prisma schema and migrations, and Docker-based local setup are deliberately deferred to keep this first milestone runnable and fully tested. A complete backend milestone should include:

1. Restaurant/review API contracts using shared validation, database migrations, seed data, and cascade-delete behavior.
2. API integration tests against PostgreSQL and client loading/error/retry states.
3. Authentication and authorization before exposing editing/deletion to multiple users; rate limits and request-size limits.
4. A documented migration/export path for local collections and environment-based configuration.

There is no placeholder API or partial database wiring in this branch. No deployment or paid service is required.

## Development references

- [Vite setup and runtime requirements](https://vite.dev/guide/)
- [Redux Toolkit TypeScript guidance](https://redux-toolkit.js.org/usage/usage-with-typescript/)

The tests are the acceptance criteria for this milestone. CI runs the same checks on pull requests; browser traces are uploaded on failure.

## Photography credits

The bundled images are illustrative food photography, not verified photos of the listed businesses. Unknown cuisines use a neutral placeholder.

- `public/images/grilled-chicken.jpg`: [Quilia on Unsplash](https://unsplash.com/photos/fried-chickens-on-plate-8Cerf3zW8hA), under the [Unsplash License](https://unsplash.com/license).
- `public/images/tacos.jpg`: [John Guccione on Pexels](https://www.pexels.com/photo/tacos-in-close-up-photography-7904958/), under the [Pexels License](https://www.pexels.com/license/).

Images are served locally without runtime requests to a photo service.
