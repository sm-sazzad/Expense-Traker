# Plan: LocalStorage-first expense saving with signup sync

## Goal
Let unauthenticated users use Expensely and save expenses to localStorage, show a "please sign up to save permanently" prompt while unauthenticated, and sync localStorage data into MongoDB when the user signs up/signs in. Signup stays optional.

## Current state (verified against code)
- `src/proxy.ts` blocks **all** unauthenticated access to app routes and redirects to `/sign-in`. This must change.
- All writes (`addExpense`, `deleteExpense`, `clearExpenses`, `setIncome`, `addToBalance`) go through server actions requiring `requireUserId()`, so they throw when no session exists.
- `src/Context/ContextProvider.tsx` holds an optimistic `useSyncExternalStore` snapshot. It only **reads** localStorage (`expensely.expenses` / `expensely.income`) once, to one-time migrate into a signed-in account; the migration is gated behind "store is empty" and will not run once the user has local data.
- `src/app/actions/expenses.ts` already exports `migrateLocalData(list, localIncome)`, which refuses to overwrite an account that already has data/income — safe to call on every sign-in.
- `src/app/layout.tsx` reads `headers()` + `auth.api.getSession()`; `userId` is `null` when unauthenticated, so the app can already render public with `initialExpenses=[]`, `initialIncome=0`.

## Decisions (confirmed with user)
1. Unauthenticated users may use the app; writes go to localStorage only.
2. "Please sign up to save your data permanently" banner shows **always while unauthenticated** (on app routes, not `/sign-in`/`/sign-up`).
3. **Clear localStorage on sign-out.**
4. On sign-in, **always attempt** to migrate localStorage → MongoDB (safe: `migrateLocalData` skips non-empty accounts).

## Files to change
1. `src/proxy.ts` — remove the redirect-to-sign-in for unauthenticated users; keep redirecting signed-in users away from `/sign-in`/`/sign-up`; keep matcher unchanged.
2. `src/Context/ContextProvider.tsx` —
   - Branch every write on `userId`: `null` → mutate snapshot + write localStorage (no server call); set → current server-action behavior.
   - Add `userId: string | null` to the context value so UI can read auth state.
   - Replace the existing "store empty" migration `useEffect` with a sign-in-triggered migration: on `userId` null→set, read localStorage directly, call `migrateLocalData`; on success clear localStorage, `invalidateSeed()`, `router.refresh()`.
   - On `userId` set→null (sign-out), clear localStorage.
3. `src/Components/AppShell/AppShell.tsx` — render a dismissible "Please sign up to save your data permanently" banner (with link to `/sign-up`) when `userId === null`. AppShell already short-circuits on `/sign-in`/`/sign-up`, so the banner won't appear there.
4. (Verify) Sign-out path: ensure explicit sign-out (e.g. UserMenu) triggers the same set→null localStorage clear.

## Risks / constraints
- React Compiler + `useSyncExternalStore`: `getServerSnapshot` must keep returning the empty snapshot so hydration always matches; do not add `useEffect(() => setState(...))` (fails `react-hooks/set-state-in-effect` lint).
- Migration race: localStorage writes while unauthenticated must be read fresh on sign-in (not from a possibly-stale snapshot) — hence reading `window.localStorage` directly in the sign-in effect.
- Banner shown on every unauthenticated visit is intentional per user; make it dismissible per-session to limit annoyance.

## Validation
- `node_modules\.bin\tsc.cmd --noEmit` — typecheck passes.
- `npm run lint` — no errors.
- Manual flow:
  1. Logged out: add expense → persists in localStorage; refresh → expense still shows; banner visible.
  2. Logged out: add balance / delete expense → reflected in localStorage.
  3. Sign up/sign in → localStorage data migrates to MongoDB, localStorage cleared, banner disappears, data shows in dashboard.
  4. Sign out → localStorage cleared.

## Open questions
None — all design points resolved with the user.
