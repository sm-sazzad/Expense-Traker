"use client";
import { useExpense, useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { card } from "@/Utils/ui";
import { IoMdTrendingDown } from "react-icons/io";
import { RiGeminiFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";

const Balance = () => {
  const { income, setIsBalanceOpen } = useExpense();
  const { totalExpenses, remaining } = useExpenseStats();

  const usedPercent =
    income > 0 ? Math.min((totalExpenses / income) * 100, 100) : 0;
  const overBudget = remaining < 0;

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Balance — hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#7c5cff] via-[#5b33e8] to-[#4a24d6] p-5 text-white shadow-[0_28px_60px_-28px_rgba(91,51,232,0.9)] sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/75">Total Balance</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {formatCurrency(income)}
            </p>
          </div>

          <button
            onClick={() => setIsBalanceOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/25"
          >
            <FiPlus className="text-sm" />
            Add
          </button>
        </div>

        <p className="relative mt-3 text-xs text-white/70">
          {totalExpenses > 0
            ? `${formatCurrency(totalExpenses)} spent so far`
            : "Set your budget to get started"}
        </p>
      </div>

      {/* Total Expenses */}
      <div className={`${card} flex flex-col p-5 sm:p-6`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#8a93a8]">Total Expenses</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <IoMdTrendingDown size={20} />
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold text-[#1c2333]">
          {formatCurrency(totalExpenses)}
        </p>

        <div className="mt-auto pt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f6]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#ef4444]"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#8a93a8]">
            {income > 0
              ? `${usedPercent.toFixed(0)}% of your balance used`
              : "Total spending"}
          </p>
        </div>
      </div>

      {/* Remaining Balance */}
      <div className={`${card} flex flex-col p-5 sm:p-6`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#8a93a8]">
            Remaining Balance
          </p>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <RiGeminiFill size={18} />
          </div>
        </div>

        <p
          className={`mt-4 text-2xl font-bold ${
            overBudget ? "text-red-500" : "text-[#1c2333]"
          }`}
        >
          {formatCurrency(remaining)}
        </p>

        <p
          className={`mt-auto pt-4 text-xs ${
            overBudget ? "font-medium text-red-500" : "text-[#8a93a8]"
          }`}
        >
          {overBudget ? "You are over budget" : "Balance left after expenses"}
        </p>
      </div>
    </div>
  );
};

export default Balance;
