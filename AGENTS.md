# AGENTS.md

Expensely — a Next.js App Router expense tracker **with accounts**. Users sign in (email + password with email verification, or Google/GitHub) and every expense and balance is stored per-user in MongoDB. No tests, no CI.

## Stack
- Next.js 16.3.6 (App Router, React 19.2.8) + TypeScript `strict`.
- Tailwind CSS v4 via `@tailwindcss/postcss` (config-less: `src/app/globals.css` only has `@import "tailwindcss";`). Do not look for `tailwind.config.js`; there isn't one.
- React Compiler is **on** (`next.config.ts` → `reactCompiler: true`, using `babel-plugin-react-compiler`). Avoid manual memoization patterns that assume the compiler is off.
- Fonts (Geist) load through `next/font/google`, so `build` needs network access.
- Auth: Better Auth 1.7 (`better-auth` + `@better-auth/mongo-adapter`); persistence: `mongodb` driver (no ORM); mail: `nodemailer`.
- Because the root layout reads `headers()`, **every route is dynamic** (`ƒ`). Do not expect static prerendering.

## Commands
- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build; `npm run start` serves it (needs a real DB)
- `npm run lint` — flat config (`eslint.config.mjs`); reports errors, not warnings-only
- Typecheck: there is no npm script. Run `node_modules\.bin\tsc.cmd --noEmit`. (`npx` is blocked on this machine because PowerShell script execution is disabled; use the `.cmd` shims under `node_modules\.bin` or `cmd /c`.)
- No test runner is configured.
- All secrets come from `.env.local` (gitignored; `.env.example` is the template). `MONGODB_URI` and `BETTER_AUTH_SECRET` (32+ chars) are required; SMTP and the Google/GitHub keys are what enable verification mail and OAuth. `MONGODB_URL` is accepted as an alias for `MONGODB_URI`, and `GMAIL_USER`/`GMAIL_APP_PASSWORD` as a fallback for `SMTP_USER`/`SMTP_PASS` (preset to `smtp.gmail.com`). With no mail configured, verification links are printed to the server console instead. Watch out: `.gitignore`'s `.env*` also ignores `.env.example`, so a commit of it needs `git add -f`.

## Layout & conventions
- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- `src/app/` — routes: `/` (dashboard), `/transactions`, `/category`, `/chart`, `/about`, `/profile`, `/sign-in`, `/sign-up`, plus `not-found.tsx`. Every route except the two auth pages is behind `src/proxy.ts`.
- Auth/data plumbing: `src/lib/auth.ts` (Better Auth config: email+password, verification, Google/GitHub, `nextCookies()` **last**), `src/lib/auth-client.ts`, `src/lib/db.ts` (HMR-safe Mongo client), `src/lib/email.ts` (nodemailer), `src/lib/expenses-data.ts` (typed collections + `loadExpenses`/`loadIncome`), `src/app/api/auth/[...all]/route.ts` (`toNextJsHandler`).
- `src/lib/db.ts` — collections are `expenses` and `budgets` (names in `EXPENSES_COLLECTION`/`BUDGETS_COLLECTION`). `budgets._id` is the `userId`, but `expenses._id` is the **client-generated UUID string** (`createExpense` sets `_id: expense.id` — no `ObjectId`s). Reads `MONGODB_URI` or the `MONGODB_URL` alias; without either it falls back to `mongodb://127.0.0.1:27017` and warns, so the app still boots. `MONGODB_DB` defaults to `espensely`.
- **Capability flags** gate optional integrations: `db.ts` → `isMongoConfigured`, `email.ts` → `isEmailConfigured` (with SMTP unset `sendEmail` just logs the message), `auth.ts` → `enabledSocialProviders` (Google/GitHub only when their keys exist). The auth UI reads these to hide unconfigured providers — follow that pattern rather than assuming an integration is present.
- `src/app/actions/expenses.ts` — the only write path. Every exported action calls `requireUserId()` (real session check) and scopes the query by `userId`.
- `src/proxy.ts` — Next 16 renamed `middleware` → `proxy` (export a function named `proxy`). It only checks that a session **cookie exists**; authorization always happens again server-side. Its `matcher` excludes `/api`, `_next/*` and static assets, and it also bounces signed-in users away from `/sign-in`/`/sign-up`.
- Sign-in/sign-up render via `src/Components/Auth/`; `AppShell` short-circuits to a bare wrapper on those two paths, so the sidebar/header never appear there.
- `src/Components/<Name>/<Name>.tsx` — reusable components (capitalized dir/file), e.g. `Charts/`, `Bento/`, `CategoryBreakdown/`, `TransactionList/`. Not all follow dir=file though: `ExpenseForm` is exported from `AddExpenseBtn/ExpenseBtn.tsx` and `BalanceForm` from `AddBalanceBtn/AddBalanceBtn.tsx`, `Navbar.tsx` sits loose in `src/Components/`, and `Auth/` holds `AuthShell.tsx` + `AuthForms.tsx`.
- `src/Components/Bento/` — the dashboard's Bento cards (`TotalBalanceCard`, `MetricCard`, `BudgetProgressCard`). The grid itself lives in `src/app/page.tsx` (`xl:grid-cols-12` + `xl:auto-rows-[10rem]`, cards placed via `xl:col-span-*`/`xl:row-span-*`). Keep row spans consistent with the 10rem row unit or cards overflow.
- `src/Components/AppShell/AppShell.tsx` — responsive shell: desktop sidebar + mobile drawer + mobile top bar. It also mounts `ExpenseForm` and `BalanceForm` **once**, so every route can open the modals; do not re-mount them per page.
- `src/Components/UI/Panel.tsx` — the standard card wrapper (uses the `card` token).
- `src/Utils/ui.ts` — shared class-string tokens built from the theme (`card`, `primaryButton`, `ghostButton`, `inputClass`, `labelClass`, `panelTitle`, `badge`, …). Reuse these instead of re-inventing button/input styles.
- Modals are opened through context flags: `isOpen`/`setIsOpen` (add expense) and `isBalanceOpen`/`setIsBalanceOpen` (add balance).
- `src/Data/categories.ts` — `CATEGORIES` metadata (label/emoji/color) + `getCategory()`. The add-expense `<select>` and all category UI render from this; add a category here, not inline.
- `src/Utils/expense.ts` — pure helpers: currency/date formatting, `getDailySeries`, `getMonthlySeries`, `getCategorySeries`, `sumAmounts`. Note `IForm.amount` is a **string** — use `amountOf()` to coerce it, never do arithmetic on it directly.
- `src/Context/ContextProvider.tsx` — global expense store + `useExpense()` and `useExpenseStats()` hooks. Also holds the budget (`income`, `setIncome`, `addToBalance`) and the modal open flags. It is **seeded from the server** (the root layout passes `userId`/`initialExpenses`/`initialIncome`), and re-seeds whenever the signed-in user changes.
- **Theme**: dark-only. Semantic colors are defined once in `src/app/globals.css` under `@theme` and consumed as Tailwind utilities — `bg-app` (#0b0b10), `bg-card` (#15151d), `bg-surface` (#1d1d28), `border-line`, `text-ink` (#f4f4f8), `text-muted` (#9696a8), `bg-accent` (#8b5cf6), `text-income` (#34d399), `text-expense` (#fb7185). Use these names; don't hardcode new hex values or reintroduce light-theme colors. Semantic rule: violet = UI/interactive, emerald = income, coral = expenses. Dynamic values (bar heights, category colors) go in inline `style`, not interpolated class names; no glassmorphism (`backdrop-blur`) on cards.
- The UI is mobile-first: shell breakpoint is `lg` (sidebar collapses to a drawer below it); the Bento grid only becomes a 12-column grid at `xl`, collapsing to 1 column on mobile. Check new layouts at narrow widths.
- Currency is BDT (`৳`).

## Gotchas
- **State/persistence**: `ContextProvider` keeps a module-level store exposed through `useSyncExternalStore` (referentially-stable snapshots; `getServerSnapshot` returns the empty snapshot so hydration always matches). Mutations update the store **optimistically** and then persist through the server actions; a failed write calls `invalidateSeed()` + `router.refresh()` to pull the truth back down. Do **not** add `useEffect(() => setState(...))` anywhere — the `react-hooks/set-state-in-effect` lint rule fails the build.
- **Authorization**: the proxy is optimistic only. Every server action must go through `requireUserId()`, and the root layout must gate its Mongo reads on a real `auth.api.getSession()` result.
- **Auth navigation**: a successful email sign-in finishes with a deliberate **hard navigation** (`window.location.assign(redirectTo)` in `AuthForms.tsx`) so the server re-renders with the new session cookie — don't "fix" it to `router.push`. The `?redirect` target is sanitized to same-origin absolute paths (rejects `//evil.com`); keep that check.
- **localStorage** keys `expensely.expenses` / `expensely.income` are now legacy: they are read once, migrated into the signed-in account by `migrateLocalData` (which refuses to run if the account already has data), and then deleted. `DEFAULT_INCOME` is `0`.
- `src/Type/Type.ts` declares `interface IForm` **globally** — the file has no `import`/`export`, so `IForm` is ambient and used without importing. Adding `export`/`import` turns it into a module and breaks every `IForm` reference. The file carries an `eslint-disable` for the resulting "unused" warning; leave it.
- Root layout uses `LayoutProps<"/">`, a Next 16 generated global type. Don't "fix" it by hand.
- Pages and components that read context/hooks must be `"use client"` (the app pages are).
- `next build` needs no database: all routes are dynamic, so nothing touches Mongo at build time.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
