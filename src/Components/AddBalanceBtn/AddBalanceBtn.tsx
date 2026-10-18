"use client";
import { useExpense } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { ghostButton, inputClass, labelClass, primaryButton } from "@/Utils/ui";
import React, { useEffect, useRef, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

const AddBalanceBtn = ({ className = "" }: { className?: string }) => {
  const { setIsBalanceOpen } = useExpense();

  return (
    <button
      onClick={() => setIsBalanceOpen(true)}
      className={`${ghostButton} ${className}`}
    >
      <FiPlusCircle className="text-base" />
      Add Balance
    </button>
  );
};

export default AddBalanceBtn;

const BalanceForm = () => {
  const { isBalanceOpen, setIsBalanceOpen, income, addToBalance } = useExpense();
  const [amount, setAmount] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the amount field when the dialog opens. Doing it on the open
  // transition (instead of `autoFocus`) avoids stealing focus on page load,
  // since this form is always mounted but hidden.
  useEffect(() => {
    if (isBalanceOpen) inputRef.current?.focus();
  }, [isBalanceOpen]);

  const value = Number(amount);
  const canSubmit = Number.isFinite(value) && value > 0;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    addToBalance(value);
    setAmount("");
    setIsBalanceOpen(false);
  };

  return (
    <div
      onClick={() => setIsBalanceOpen(false)}
      aria-hidden={!isBalanceOpen}
      inert={!isBalanceOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 ${
        isBalanceOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-2xl transition-all duration-300 sm:p-6 ${
          isBalanceOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Add Balance</h2>
            <p className="mt-0.5 text-sm text-muted">
              Top up your available balance
            </p>
          </div>

          <button
            onClick={() => setIsBalanceOpen(false)}
            type="button"
            aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:text-ink"
          >
            <RxCross1 size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="rounded-xl border border-accent/25 bg-accent/10 p-4">
          <p className="text-xs font-medium text-muted">Current balance</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {formatCurrency(income)}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="balance-amount" className={labelClass}>
              Amount to add
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                ৳
              </span>
              <input
                ref={inputRef}
                type="number"
                id="balance-amount"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setAmount(String(quick))}
                className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-accent/50 hover:text-ink"
              >
                +৳{quick.toLocaleString("en-US")}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`${primaryButton} w-full py-3`}
          >
            Add to Balance
          </button>
        </form>
      </div>
    </div>
  );
};

export { BalanceForm };
