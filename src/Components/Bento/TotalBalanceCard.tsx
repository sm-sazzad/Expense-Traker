"use client";
import { useState } from "react";
import AddBalanceBtn from "@/Components/AddBalanceBtn/AddBalanceBtn";
import { useExpense, useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { card, ghostButton, inputClass, labelClass, primaryButton } from "@/Utils/ui";
import { FiArrowUpRight, FiEdit3 } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

const TotalBalanceCard = () => {
  const { totalExpenses, totalBalance, remaining, carryForward } =
    useExpenseStats();
  const { setIncome } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");

  const handleSave = () => {
    const value = Number(dialogValue);
    if (!Number.isFinite(value) || value < 0) return;
    setIncome(value - carryForward);
    setIsDialogOpen(false);
    setDialogValue("");
  };

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
          <div className="mt-3 flex items-baseline gap-2">
            <p className="truncate text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {formatCurrency(totalBalance)}
            </p>
            <button
              onClick={() => {
                setDialogValue(formatCurrency(totalBalance).replace("৳ ", ""));
                setIsDialogOpen(true);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:bg-accent hover:text-white hover:border-accent"
              aria-label="Edit total balance"
            >
              <FiEdit3 className="text-lg" />
            </button>
          </div>
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

      {isDialogOpen && (
        <div
          onClick={() => setIsDialogOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 pointer-events-auto opacity-100"
          aria-hidden="false"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-2xl transition-all duration-300 sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-ink">Edit Total Balance</h2>
                <p className="mt-0.5 text-sm text-muted">
                  Adjust your current available balance
                </p>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                type="button"
                aria-label="Close"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:text-ink"
              >
                <RxCross1 size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div>
                <label htmlFor="edit-total-amount" className={labelClass}>
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                    ৳
                  </span>
                  <input
                    id="edit-total-amount"
                    autoFocus
                    onChange={(e) => setDialogValue(e.target.value.replace(/[^0-9.-]/g, ""))}
                    type="number"
                    min="0"
                    step="0.01"
                    value={dialogValue}
                    placeholder="0.00"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className={`${ghostButton} w-full`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!Number.isFinite(Number(dialogValue)) || Number(dialogValue) < 0}
                  className={`${primaryButton} w-full py-3`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TotalBalanceCard;
