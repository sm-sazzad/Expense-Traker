"use client";
import AddBalanceBtn from "@/Components/AddBalanceBtn/AddBalanceBtn";
import { useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { card } from "@/Utils/ui";
import { FiArrowUpRight } from "react-icons/fi";

const TotalBalanceCard = () => {
  const { totalExpenses, totalBalance, remaining, carryForward } =
    useExpenseStats();

  return (
    <section
      className={`${card} relative flex h-full flex-col justify-between p-5 sm:p-6`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">Total Balance</p>
          {carryForward !== 0 && (
            <p className="text-[10px] text-muted mt-0.5">
              Includes {formatCurrency(carryForward)} carried forward
            </p>
          )}
          <p className="mt-3 truncate text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {formatCurrency(totalBalance)}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
          <FiArrowUpRight className="text-lg" />
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-surface p-3">
          <p className="text-[11px] text-muted">Spent</p>
          <p className="mt-1 truncate text-sm font-semibold text-expense">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3">
          <p className="text-[11px] text-muted">Remaining</p>
          <p
            className={`mt-1 truncate text-sm font-semibold ${
              remaining < 0 ? "text-expense" : "text-income"
            }`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="relative mt-5">
        <AddBalanceBtn className="w-full" />
      </div>
    </section>
  );
};

export default TotalBalanceCard;
