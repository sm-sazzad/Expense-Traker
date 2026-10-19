"use client";
import { CATEGORIES } from "@/Data/categories";
import { useExpense } from "@/Context/ContextProvider";
import React, { useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { inputClass, labelClass, primaryButton } from "@/Utils/ui";
import { FaPlus } from "react-icons/fa";

const ExpenseBtn = ({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) => {
  const { setIsOpen } = useExpense();

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Add expense"
        className={`${primaryButton} h-10 w-10 px-0 ${className} flex items-center justify-center text-center`}
      >
        {/* <FaPlus /> */}
        <h1 className="font-bold text-2xl">+</h1>
      </button>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`${primaryButton} ${className}`}
    >
      <HiOutlinePlusSm className="text-xl" />
      Add Expense
    </button>
  );
};

export default ExpenseBtn;

const todayLocal = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const emptyForm = () => ({
  title: "",
  amount: "",
  category: "",
  date: todayLocal(),
});

const ExpenseForm = () => {
  const { isOpen, setIsOpen, addExpense } = useExpense();
  const [form, setForm] = useState(emptyForm());

  const onSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addExpense(form);
    setForm(emptyForm());
    setIsOpen(false);
  };

  const update = (key: keyof ReturnType<typeof emptyForm>, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  return (
    <div
      onClick={() => setIsOpen(false)}
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-card p-5 shadow-2xl transition-all duration-300 sm:p-6 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Add Expense</h2>
            <p className="mt-0.5 text-sm text-muted">
              Track where your money goes
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            type="button"
            aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:text-ink"
          >
            <RxCross1 size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={onSumbit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>
              Expense Title
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Lunch, Bus fare..."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="amount" className={labelClass}>
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                ৳
              </span>
              <input
                required
                type="number"
                name="amount"
                id="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              required
              name="category"
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={`${inputClass} appearance-none ${
                form.category ? "text-ink" : "text-muted/70"
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <input
              required
              type="date"
              name="date"
              id="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputClass}
            />
          </div>

          <button type="submit" className={`${primaryButton} mt-2 w-full py-3`}>
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export { ExpenseForm };
