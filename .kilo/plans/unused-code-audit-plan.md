# Unused Code Audit Plan — Expensely

## Goal
Remove only code confirmed to be unused/dead. Make smallest possible changes. Preserve all existing functionality.

## Confirmed Unused Code (safe to remove)

### 1. Delete entire file: `src/Components/BalanceCard/Balance.tsx`
- **Evidence**: Grep for `from "@/Components/BalanceCard"` and `from "@/Components/BalanceCard/Balance"` returned zero matches across `src/`. Not imported by any page, layout, or component.
- **What it is**: A standalone Balance card component (hero card + expenses + remaining balance) that is never rendered.
- **Action**: Delete the file. No other changes needed.

### 2. Remove unused function: `loadIncome` in `src/lib/expenses-data.ts` (lines 61-67)
- **Evidence**: Grep for `loadIncome` returned only the definition in `expenses-data.ts`. Not imported by `layout.tsx` (which uses `loadMonthlyIncomes` + `currentMonthKey` instead) or any other file.
- **Action**: Remove lines 61-67 (the `loadIncome` async function). Keep `BudgetDoc` interface — it is used by `budgetsCollection()` return type on line 29.

### 3. Remove unused destructured export: `useSession` in `src/lib/auth-client.ts` (line 5)
- **Evidence**: Grep for `useSession` returned only the destructuring line in `auth-client.ts`. Not imported anywhere in `src/`.
- **Evidence for keeping others**: `signIn` (AuthForms), `signUp` (AuthForms), `signOut` (SignOutButton), `updateUser` (ProfileForm) are all used.
- **Action**: Change line 5 from `export const { signIn, signUp, signOut, useSession, updateUser } = authClient;` to `export const { signIn, signUp, signOut, updateUser } = authClient;`

### 4. Remove unused import: `FaPlus` in `src/Components/AddExpenseBtn/ExpenseBtn.tsx` (line 8)
- **Evidence**: Grep for `FaPlus` returned only the import (line 8) and a commented-out reference `{/* <FaPlus /> */}` (line 26). The component uses `<HiOutlinePlusSm />` and `<h1>+</h1>` instead.
- **Action**: Remove line 8: `import { FaPlus } from "react-icons/fa";`

### 5. Remove commented-out code blocks (cosmetic, low risk)
- `src/Components/AddExpenseBtn/ExpenseBtn.tsx` line 26: `{/* <FaPlus /> */}` — references the import being removed in #4.
- `src/Components/AppShell/AppShell.tsx` line 88: `{/* <p className="text-[11px] font-medium text-muted"></p> */}` — empty commented-out JSX.
- `src/app/profile/page.tsx` lines 41-43: Commented-out paragraph about account details.

## Uncertain — Left Untouched

### `mongoClient` export in `src/lib/db.ts` (line 41)
- **Evidence**: Exported but grep returned only the definition line. Not imported anywhere in `src/`.
- **Reason for leaving**: Cannot verify it isn't imported by external code or used for direct MongoDB access outside the scanned `src/` tree. It is a harmless export; removing it risks breaking unknown consumers.

### Duplicate `getInitials` function
- **Locations**: `src/Components/UserMenu/UserMenu.tsx` (lines 11-18) and `src/app/profile/page.tsx` (lines 11-18)
- **Reason for leaving**: Consolidating would require extracting to a shared utility and updating both import sites — a refactoring change, not a safe removal. Out of scope for this cleanup task.

### `react-dom` dependency in `package.json`
- **Evidence**: Not imported anywhere in `src/`, but it is a required peer dependency for Next.js rendering.
- **Reason for leaving**: Next.js requires `react-dom`; removing it would break the project.

## Checks to Run After Changes

1. `cmd /c "node_modules\.bin\tsc.cmd --noEmit"` — TypeScript typecheck (0 errors expected)
2. `npm run lint` — ESLint (0 errors expected; pre-existing `FaPlus` warning in ExpenseBtn.tsx will be resolved by removing the import)
3. `npm run build` — Production build (must succeed)

## Rollback
All changes are localized deletions. If any check fails, revert the specific file change and re-verify.

## Files Modified/Deleted

| File | Change |
|------|--------|
| `src/Components/BalanceCard/Balance.tsx` | Delete entire file |
| `src/lib/expenses-data.ts` | Remove `loadIncome` function (lines 61-67) |
| `src/lib/auth-client.ts` | Remove `useSession` from destructuring (line 5) |
| `src/Components/AddExpenseBtn/ExpenseBtn.tsx` | Remove `FaPlus` import (line 8) |
| `src/Components/AddExpenseBtn/ExpenseBtn.tsx` | Remove commented `{/* <FaPlus /> */}` (line 26) |
| `src/Components/AppShell/AppShell.tsx` | Remove commented empty `<p>` (line 88) |
| `src/app/profile/page.tsx` | Remove commented-out paragraph (lines 41-43) |
