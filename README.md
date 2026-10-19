# Expensely

> A Next.js App Router expense tracker with real per-user accounts. Track spending, set monthly balances, and visualize your money with charts — all stored per-user in MongoDB.

## Live Demo: [Expensely](http://my-expensely.vercel.app/)

## Features

- **Authentication** — Email + password with email verification, plus optional Google and GitHub OAuth sign-in.
- **Per-user data isolation** — Every expense and balance is stored per-user in MongoDB; every read and write is scoped to the signed-in user.
- **Expense management** — Add, filter, and delete expenses across 14 categories with BDT (৳) currency.
- **Monthly balance tracking** — Add to your balance at any time; remaining balance carries forward automatically when a new month begins.
- **Dashboard** — Bento-grid layout with total balance, remaining balance, weekly/monthly charts, category breakdown, and recent transactions.
- **Charts** — Weekly spending bars, monthly trend bars, and an all-time expense trend line chart.
- **Profile** — Update your display name and profile picture; sign out securely.
- **Dark-only theme** — Carefully crafted semantic dark palette (violet accents, emerald income, coral expenses).

---

## Tech Stack

| Layer     | Technology                                            |
| --------- | ----------------------------------------------------- |
| Framework | Next.js 16.3.6 (App Router, React 19.2.8)             |
| Language  | TypeScript (strict)                                   |
| Styling   | Tailwind CSS v4 (config-less, `@tailwindcss/postcss`) |
| Compiler  | React Compiler (enabled)                              |
| Auth      | Better Auth 1.7 + `@better-auth/mongo-adapter`        |
| Database  | MongoDB (official driver, no ORM)                     |
| Email     | Nodemailer (SMTP / Gmail app password)                |
| Icons     | React Icons (v5)                                      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (MongoDB Atlas recommended)
- `BETTER_AUTH_SECRET` (32+ characters, high entropy)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sm-sazzad/Expense-Traker.git
cd Expense-Traker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your real values (see table below)

# 4. Generate a secure auth secret (if you don't have one)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable                                    | Required | Default                              | Purpose                                                 |
| ------------------------------------------- | -------- | ------------------------------------ | ------------------------------------------------------- |
| `MONGODB_URI`                               | Yes      | —                                    | MongoDB connection string (`MONGODB_URL` also accepted) |
| `MONGODB_DB`                                | No       | `espensely`                          | Database name                                           |
| `BETTER_AUTH_SECRET`                        | Yes      | —                                    | Session signing secret (32+ chars)                      |
| `BETTER_AUTH_URL`                           | No       | `http://localhost:3000`              | App base URL                                            |
| `SMTP_HOST`                                 | No       | —                                    | SMTP host for verification/reset mail                   |
| `SMTP_PORT`                                 | No       | `587`                                | SMTP port                                               |
| `SMTP_USER`                                 | No       | —                                    | SMTP username                                           |
| `SMTP_PASS`                                 | No       | —                                    | SMTP password                                           |
| `SMTP_FROM`                                 | No       | `Expensely <no-reply@expensely.app>` | Sender email                                            |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD`         | No       | —                                    | Gmail fallback credentials                              |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No       | —                                    | Google OAuth (redirect: `/api/auth/callback/google`)    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No       | —                                    | GitHub OAuth (redirect: `/api/auth/callback/github`)    |

> Without SMTP configured, verification links are printed to the server console instead of being emailed. Without OAuth keys, the social sign-in buttons are hidden automatically.

### Available Scripts

| Command                          | Description                                 |
| -------------------------------- | ------------------------------------------- |
| `npm run dev`                    | Start dev server on `http://localhost:3000` |
| `npm run build`                  | Production build                            |
| `npm start`                      | Serve the production build                  |
| `npm run lint`                   | Run ESLint                                  |
| `node_modules/.bin/tsc --noEmit` | TypeScript typecheck (no npm script)        |

---

## Project Structure

```
src/
├─ app/                  # App Router routes, server actions, auth API
│  ├─ actions/           # The only write path (server actions)
│  ├─ api/auth/[...all]  # Better Auth handler
│  ├─ page.tsx           # Dashboard (Bento grid)
│  ├─ transactions/      # Transactions list
│  ├─ category/          # Category breakdown
│  ├─ chart/             # Charts page
│  ├─ profile/           # User profile
│  ├─ about/             # About + developer info
│  ├─ sign-in/           # Sign-in page
│  ├─ sign-up/           # Sign-up page
│  └─ not-found.tsx      # 404 page
├─ Components/           # Reusable UI components
│  ├─ AppShell/          # Responsive shell (sidebar + drawer + modals)
│  ├─ Auth/              # Auth shell + forms
│  ├─ Bento/             # Dashboard cards (balance, metrics, budget progress)
│  ├─ UI/                # Panel card wrapper
│  ├─ Charts/            # Weekly, monthly, trend charts
│  ├─ Bi/                # Bilingual text component
│  ├─ Navbar.tsx         # Navigation sidebar
│  ├─ UserMenu/          # User menu + profile link
│  ├─ TransactionList/   # Expense list with filters
│  ├─ CategoryBreakdown/ # Category spending breakdown
│  ├─ AddExpenseBtn/     # Expense button + form modal
│  └─ AddBalanceBtn/     # Balance button + form modal
├─ Context/              # Global expense/budget store (useSyncExternalStore)
├─ Data/categories.ts    # Category metadata (label/emoji/color)
├─ lib/                  # Auth, DB, email plumbing
├─ Type/Type.ts          # Global ambient IForm interface
├─ Utils/                # Pure helpers + UI class tokens
└─ proxy.ts              # Optimistic cookie-only route gate (Next 16 middleware)
```

---

## Architecture & Key Conventions

- **All routes are dynamic** — the root layout reads `headers()`, so nothing is statically prerendered.
- **Optimistic proxy gate** — `src/proxy.ts` checks for a session cookie; real authorization happens server-side in every action and layout.
- **Server actions** — `src/app/actions/expenses.ts` is the only write path; every action calls `requireUserId()` and scopes queries by `userId`.
- **Optimistic updates** — The Context store updates immediately, then persists through server actions. A failed write invalidates the seed and refreshes from the server.
- **No `useEffect` setState** — state is seeded from the server and re-seeds on user change; mutations flow through the store directly.
- **Global `IForm`** — declared ambiently in `src/Type/Type.ts` (no import/export); do not add module syntax.
- **Mobile-first** — sidebar collapses to a drawer below `lg`; Bento grid is 12-column at `xl`, 1 column on mobile.
- **Currency** — BDT (`৳`).

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add all environment variables from the table above.
4. Deploy. The live site is at [http://my-expensely.vercel.app/](http://my-expensely.vercel.app/).

> `next build` does not require a database connection since all routes are dynamic.

---

## License

MIT © 2026 Sheikh Md Sazzad Hossain

---

Made with ❤️ using Next.js, Tailwind CSS, Better Auth, and MongoDB.
