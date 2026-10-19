# Plan: Sign-in button beside Add Expense when unauthenticated

## Goal
Show a "Sign in" button beside the Add Expense button in the app header whenever `userId === null`, so unauthenticated users have an explicit path to sign in (in addition to the existing per-session banner).

## Scope
- File: `src/Components/AppShell/AppShell.tsx`
- Add a "Sign in" link/button rendered conditionally when `userId === null`, placed directly beside the `ExpenseBtn` in the header's right-side flex row (both desktop `hidden sm:block` and mobile `sm:hidden` variants).
- No changes to `ContextProvider`, `proxy.ts`, or any actions. `userId` is already available via `useExpense()` (added in the local-storage-sync plan).

## Context from prior plan
- `AppShell.tsx` already imports `Link` from `next/link` and destructures `userId` from `useExpense()`.
- `AppShell` short-circuits on `/sign-in`/`/sign-up`, so the sign-in button won't appear on auth routes anyway; the conditional on `userId === null` is the guard.
- `Link` to `/sign-in` triggers normal client navigation; the proxy redirects signed-in users away from `/sign-in`.

## Tasks
1. In `AppShell.tsx` header flex row (`<div className="flex shrink-0 items-center gap-2">`), insert a `Link href="/sign-in"` styled like the existing ghost/surface buttons, gated on `userId === null`, beside the desktop `ExpenseBtn`.
2. Insert a matching mobile variant beside the compact `ExpenseBtn` (`sm:hidden`).
3. Run `node_modules\.bin\tsc.cmd --noEmit` and `npm run lint` to verify.

## Validation
- Typecheck passes, lint reports no errors.
- Unauthenticated: "Sign in" link appears beside Add Expense in header; clicking navigates to `/sign-in`.
- Authenticated: no sign-in button shown (UserMenu/profile shown instead).
