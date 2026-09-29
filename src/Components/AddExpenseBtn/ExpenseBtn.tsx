"use client";
import { ExpenseContext } from "@/Context/ContextProvider";
import React, { useContext, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";

const ExpenseBtn = () => {
  const { isOpen, setIsOpen } = useContext(ExpenseContext);

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center cursor-pointer gap-1.5 rounded-xl bg-[#5b33e8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d29ce]"
    >
      <HiOutlinePlusSm className="text-xl" />
      Add Expense
    </button>
  );
};

export default ExpenseBtn;

const ExpenseForm = () => {
  const { isOpen, setIsOpen, ExpenseList, setExpenseList } =
    useContext(ExpenseContext);

  const onSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as IForm;
    console.log(data);
    setExpenseList((pre) => [...pre, data]);
    e.currentTarget.reset();
  };
  console.log(ExpenseList);

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed flex justify-center items-center inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-10 bottom-10 left-4 right-4 min-[400px]:top-auto min-[400px]:left-auto min-[400px]:right-auto min-[400px]:bottom-auto min-[400px]:h-140 min-[400px]:w-100 rounded-2xl bg-white p-5 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Expense</h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep track of your spending
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <RxCross1 size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={onSumbit} className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Expense Title
            </label>

            <input
              required
              type="text"
              name="title"
              id="title"
              placeholder="e.g. Lunch, Bus fare..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                ৳
              </span>

              <input
                required
                type="number"
                name="amount"
                id="amount"
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              required
              name="category"
              id="category"
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select a category</option>
              <option value="food">🍔 Food</option>
              <option value="transport">🚌 Transport</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="housing">🏠 Rent / Housing</option>
              <option value="bills">💡 Bills & Utilities</option>
              <option value="health">💊 Health</option>
              <option value="education">🎓 Education</option>
              <option value="entertainment">🎮 Entertainment</option>
              <option value="subscription">📱 Subscription</option>
              <option value="clothing">👕 Clothing</option>
              <option value="travel">✈️ Travel</option>
              <option value="gifts">🎁 Gifts</option>
              <option value="technology">💻 Technology</option>
              <option value="others">💰 Others</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date
            </label>

            <input
              required
              type="date"
              name="date"
              id="date"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Submit */}
          <button
            onClick={() => setIsOpen(false)}
            type="submit"
            className="cursor-pointer mt-2 w-full rounded-xl bg-[#5b33e8] py-3 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-[0.98]"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export { ExpenseForm };
