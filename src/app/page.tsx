"use client";
import BudgetProgressCard from "@/Components/Bento/BudgetProgressCard";
import MetricCard from "@/Components/Bento/MetricCard";
import TotalBalanceCard from "@/Components/Bento/TotalBalanceCard";
import CategoryBreakdown from "@/Components/CategoryBreakdown/CategoryBreakdown";
import MonthlyChart from "@/Components/Charts/MonthlyChart";
import WeeklyChart from "@/Components/Charts/WeeklyChart";
import TransactionList from "@/Components/TransactionList/TransactionList";
import { useExpense, useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const DashboardPage = () => {
  const { income } = useExpense();
  const { totalExpenses, expenseCount } = useExpenseStats();

  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Overview</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Dashboard
        </h1>
      </div>

      {/* Bento grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:auto-rows-[10rem] xl:grid-cols-12">
        <div className="xl:col-span-5 xl:row-span-2">
          <TotalBalanceCard />
        </div>

        <div className="xl:col-span-4">
          <MetricCard
            label="Income"
            value={formatCurrency(income)}
            hint="Available balance"
            tone="income"
            icon={<FiTrendingUp className="text-lg" />}
          />
        </div>

        <div className="xl:col-span-3">
          <MetricCard
            label="Expenses"
            value={formatCurrency(totalExpenses)}
            hint={`${expenseCount} ${
              expenseCount === 1 ? "transaction" : "transactions"
            }`}
            tone="expense"
            icon={<FiTrendingDown className="text-lg" />}
          />
        </div>

        <div className="xl:col-span-7">
          <BudgetProgressCard />
        </div>

        <div className="xl:col-span-7 xl:row-span-2">
          <WeeklyChart />
        </div>

        <div className="xl:col-span-5 xl:row-span-2">
          <CategoryBreakdown limit={6} />
        </div>

        <div className="xl:col-span-12 xl:row-span-2">
          <MonthlyChart />
        </div>

        <div className="xl:col-span-12 xl:row-span-2">
          <TransactionList limit={6} showViewAll />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
