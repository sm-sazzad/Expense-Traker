"use client";
import { useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { card } from "@/Utils/ui";

const BudgetProgressCard = () => {
  const { remaining, currentMonthIncome, currentMonthTotal } =
    useExpenseStats();

  const used =
    currentMonthIncome > 0
      ? Math.min((currentMonthTotal / currentMonthIncome) * 100, 100)
      : 0;
  const over = remaining < 0;

  return (
    <section
      className={`${card} flex h-full flex-col justify-center gap-3 p-5`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted">Budget Used</p>
        <span
          className={`text-xs font-semibold ${
            over ? "text-expense" : "text-ink"
          }`}
        >
          {used.toFixed(0)}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            over ? "bg-expense" : "bg-accent"
          }`}
          style={{ width: `${used}%` }}
        />
      </div>

      <p className="text-xs text-muted">
        {formatCurrency(currentMonthTotal)} of {formatCurrency(
          currentMonthIncome,
        )}
      </p>
    </section>
  );
};

export default BudgetProgressCard;
