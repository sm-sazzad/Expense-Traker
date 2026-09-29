"use client";
import { ExpenseContext } from "@/Context/ContextProvider";
import { useContext } from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { IoMdTrendingDown } from "react-icons/io";
import { RiGeminiFill } from "react-icons/ri";

const Balance = () => {
  const { ExpenseList, setExpenseList } = useContext(ExpenseContext);
  const totalExpenses = ExpenseList.reduce(
    (acc, n) => acc + Number(n.amount),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Balance */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-500">Total Balance</h1>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FaMoneyCheckAlt size={18} />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          <span className="font-extrabold">৳</span> 3,000
        </h1>

        <p className="mt-1 text-xs text-gray-400">Available balance</p>
      </div>

      {/* Total Expenses */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-500">Total Expenses</h1>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <IoMdTrendingDown size={20} />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          <span className="font-extrabold">৳</span> {totalExpenses}
        </h1>

        <p className="mt-1 text-xs text-gray-400">Total spending</p>
      </div>

      {/* Remaining Balance */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-500">
            Remaining Balance
          </h1>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <RiGeminiFill size={18} />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          <span className="font-extrabold">৳</span> 3,000
        </h1>

        <p className="mt-1 text-xs text-gray-400">Balance after expenses</p>
      </div>
    </div>
  );
};

export default Balance;
