"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import Panel from "@/Components/UI/Panel";
import { useExpense } from "@/Context/ContextProvider";
import { CATEGORIES, getCategory } from "@/Data/categories";
import { amountOf, formatCurrency, formatDate } from "@/Utils/expense";
import { panelSubtitle, panelTitle } from "@/Utils/ui";
import { RiDeleteBin6Line } from "react-icons/ri";

interface TransactionListProps {
  limit?: number;
  showFilters?: boolean;
  showClear?: boolean;
  showViewAll?: boolean;
}

const selectClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:w-auto";

const TransactionList = ({
  limit,
  showFilters = false,
  showClear = false,
  showViewAll = false,
}: TransactionListProps) => {
  const { ExpenseList, deleteExpense, clearExpenses } = useExpense();
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("all");

  const months = useMemo(() => {
    const unique = new Set(
      ExpenseList.map((expense) => expense.date.slice(0, 7)),
    );
    return [...unique].sort().reverse();
  }, [ExpenseList]);

  const filtered = useMemo(() => {
    return [...ExpenseList]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter(
        (expense) =>
          (category === "all" || expense.category === category) &&
          (month === "all" || expense.date.slice(0, 7) === month),
      );
  }, [ExpenseList, category, month]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  const handleClear = () => {
    if (window.confirm("Delete all expenses? This cannot be undone.")) {
      clearExpenses();
    }
  };

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>
            {limit ? "Recent Transactions" : "Transactions"}
          </h2>
          <p className={panelSubtitle}>
            {filtered.length} {filtered.length === 1 ? "expense" : "expenses"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showViewAll && (
            <Link
              href="/transactions"
              className="shrink-0 text-xs font-semibold text-accent hover:text-[#a78bfa]"
            >
              View all
            </Link>
          )}

          {showClear && ExpenseList.length > 0 && (
            <button
              onClick={handleClear}
              className="cursor-pointer rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-expense transition hover:border-expense/40 hover:bg-expense/10"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={selectClass}
          >
            <option value="all">All months</option>
            {months.map((option) => (
              <option key={option} value={option}>
                {new Date(`${option}-01`).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="mt-5 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl bg-surface px-4 py-10 text-center">
          <p className="text-sm font-medium text-muted">Nothing here yet</p>
          <p className="mt-1 text-xs text-muted/70">
            Add your first expense to get started
          </p>
        </div>
      ) : (
        <ul className="mt-1 min-h-0 flex-1 divide-y divide-line overflow-y-auto pr-1">
          {visible.map((expense) => {
            const info = getCategory(expense.category);
            return (
              <li key={expense.id} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base"
                  style={{ backgroundColor: `${info.color}1f` }}
                >
                  {info.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {expense.title}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {info.label} · {formatDate(expense.date)}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-expense">
                  {formatCurrency(amountOf(expense))}
                </span>

                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-expense/10 hover:text-expense"
                  aria-label={`Delete ${expense.title}`}
                >
                  <RiDeleteBin6Line size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
};

export default TransactionList;
