# Plan: Dialog-Based Total Balance Edit

## Goal
Replace inline editing in `TotalBalanceCard` with a dialog box: click edit pen icon → open dialog with one amount field + save button → user enters amount and clicks save → pen icon stays beside the displayed amount.

## Context

Current state of `src/Components/Bento/TotalBalanceCard.tsx`:
- Shows `totalBalance` as main value with inline edit (input + submit button replacing the value when `isEditing` is true)
- `setIncome` from `useExpense()` is used to adjust current month's income
- Edit logic: `setIncome(value - carryForward)` where `carryForward` is carried-forward balance from prior months
- Pen icon (`FiEdit3`) currently opens inline edit; arrow icon (`FiArrowUpRight`) is separate

Key formulas (from `useExpenseStats`):
- `totalBalance = allTimeIncome - expensesBeforeCurrentMonth`
- `remaining = totalBalance - currentMonthExpenses`
- `carryForward = totalBalance - currentMonthIncome`
- To set total balance to `X`: current month income = `X - carryForward`

## Bug Fix Required (implemented but has React warning)

The dialog input in `TotalBalanceCard.tsx` currently has both `value={dialogValue}` (controlled) and `defaultValue={...}` (uncontrolled). React throws a console error. Fix: remove `defaultValue` entirely — the input is controlled via `value` + `onChange`, with initial value seeded by setting `dialogValue` state when the dialog opens.

## Design Decisions

1. **Dialog pattern**: Create a simple, self-contained dialog inside `TotalBalanceCard.tsx` (no new shared dialog component needed — this is a single-use dialog). Backdrop overlay + centered panel, matching existing `BalanceForm`/`ExpenseForm` modal style in the codebase.

2. **Pen icon placement**: Pen icon stays beside the amount (as `1200 [edit icon]`). Clicking the pen icon opens the dialog. The amount itself is NOT clickable to open dialog — only the pen icon.

3. **Dialog contents**:
   - Label: "Edit Total Balance"
   - Amount input (pre-filled with current `totalBalance`, numeric only)
   - Save button (primary, disabled when invalid)
   - Cancel / close on backdrop click or escape

4. **Save behavior**: On save, call `setIncome(newValue - carryForward)`, close dialog, reset form.

5. **UI conventions to follow**:
   - Use existing `card`, `inputClass`, `labelClass`, `primaryButton`, `ghostButton` from `@/Utils/ui`
   - Use `FiX` or `RxCross1` for close button (matching `BalanceForm`/`ExpenseForm`)
   - Dark-only theme, `bg-card`, `border-line`, `text-ink`, `text-muted` tokens
   - No `backdrop-blur` on cards (per project convention)

## Files to Modify

| File | Change |
|------|--------|
| `src/Components/Bento/TotalBalanceCard.tsx` | Replace inline edit with dialog: add dialog state (`isDialogOpen`, `dialogValue`), pen icon always visible beside amount, dialog panel on backdrop click. **Also remove `defaultValue` from the controlled amount input (use only `value` + `onChange`).** |

## Validation

- `tsc --noEmit`: 0 errors
- `npm run lint`: 0 errors, 0 warnings
- `npm run build`: compiles successfully
- Pen icon visible beside amount in normal view
- Clicking pen opens dialog with amount field + save button
- Entering amount and clicking save updates total balance via `setIncome`
- Dialog closes after save; reopening shows updated value
- Console shows no React warning about controlled/uncontrolled input (the `defaultValue` + `value` conflict is resolved)

## Out of Scope

- Creating a reusable shared dialog component (single-use dialog in this file is fine)
- Validating against maximum/minimum balance limits beyond `value >= 0` and `Number.isFinite`
- Persisting edit history or audit trail
