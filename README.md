# Expensely

An expense tracker with real accounts. Sign in (email + password with email
verification, or Google/GitHub) and every expense and balance is stored
per-user in MongoDB.

## Features

- Email + password auth with verification, plus optional Google and GitHub OAuth.
- Add, filter, and delete expenses across 14 categories.
- Monthly budget tracking with an "add to balance" flow.
- Dashboard with weekly/monthly charts and a category breakdown.
- Per-user data isolation — every read and write is scoped to the signed-in user.

## Tech stack

- Next.js 16 (App Router, React 19) + TypeScript (`strict`)
- Tailwind CSS v4 (`@tailwindcss/postcss`, config-less)
- React Compiler (enabled)
- Better Auth 1.7 with the MongoDB adapter
- MongoDB (official driver, no ORM)
- Nodemailer for verification/reset mail

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file from the template and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   `MONGODB_URI` and `BETTER_AUTH_SECRET` (32+ chars) are required. SMTP and the
   Google/GitHub keys are optional — without them, verification links are logged
   to the server console and the social buttons are hidden.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint with ESLint |

Typecheck (no npm script): `node_modules/.bin/tsc --noEmit`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `MONGODB_DB` | No | Database name (defaults to `espensely`) |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret, 32+ chars |
| `BETTER_AUTH_URL` | No | App base URL (defaults to `http://localhost:3000`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | No | Verification + reset email |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | GitHub OAuth |

## Project structure

```
src/
├─ app/                 # App Router routes + server actions + auth API
│  ├─ actions/          # The only write path (server actions)
│  └─ api/auth/[...all] # Better Auth handler
├─ Components/          # UI (shell, Bento cards, charts, lists, forms)
├─ Context/             # Global expense/budget store
├─ Data/categories.ts   # Category metadata
├─ lib/                 # Auth, DB, email plumbing
├─ Utils/               # Pure helpers + UI class tokens
└─ proxy.ts             # Optimistic cookie-only route gate
```

See [`AGENTS.md`](./AGENTS.md) for the deeper conventions, gotchas, and
architecture notes.

## Notes

- All routes are dynamic; `next build` does not need a database connection.
- Data is stored in the `expenses` and `budgets` collections, always keyed by
  user id.
