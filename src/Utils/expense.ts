import { getCategory } from "@/Data/categories";

const pad = (value: number) => String(value).padStart(2, "0");

export const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const amountOf = (expense: IForm) => {
  const value = Number(expense.amount);
  return Number.isFinite(value) ? value : 0;
};

export const formatCurrency = (value: number) =>
  `৳ ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const isSameMonth = (value: string, date: Date) =>
  value.slice(0, 7) === toMonthKey(date);

export interface DailyPoint {
  date: string;
  label: string;
  total: number;
}

export interface MonthlyPoint {
  month: string;
  label: string;
  total: number;
}

export interface CategoryPoint {
  value: string;
  label: string;
  emoji: string;
  color: string;
  total: number;
  count: number;
  percent: number;
}

export const sumAmounts = (expenses: IForm[]) =>
  expenses.reduce((sum, expense) => sum + amountOf(expense), 0);

export const getDailySeries = (expenses: IForm[], days = 7): DailyPoint[] => {
  const today = new Date();
  const points: DailyPoint[] = [];

  for (let offset = days - 1; offset >= 0; offset--) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const key = toDayKey(day);
    points.push({
      date: key,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      total: sumAmounts(expenses.filter((expense) => expense.date === key)),
    });
  }

  return points;
};

export const getMonthlySeries = (expenses: IForm[], months = 6): MonthlyPoint[] => {
  const now = new Date();
  const points: MonthlyPoint[] = [];

  for (let offset = months - 1; offset >= 0; offset--) {
    const month = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = toMonthKey(month);
    points.push({
      month: key,
      label: month.toLocaleDateString("en-US", { month: "short" }),
      total: sumAmounts(expenses.filter((expense) => expense.date.slice(0, 7) === key)),
    });
  }

  return points;
};

export const getCategorySeries = (expenses: IForm[]): CategoryPoint[] => {
  const totals = new Map<string, { total: number; count: number }>();

  for (const expense of expenses) {
    const key = expense.category || "others";
    const current = totals.get(key) ?? { total: 0, count: 0 };
    current.total += amountOf(expense);
    current.count += 1;
    totals.set(key, current);
  }

  const grandTotal = [...totals.values()].reduce((sum, entry) => sum + entry.total, 0);

  return [...totals.entries()]
    .map(([value, entry]) => {
      const category = getCategory(value);
      return {
        value,
        label: category.label,
        emoji: category.emoji,
        color: category.color,
        total: entry.total,
        count: entry.count,
        percent: grandTotal > 0 ? (entry.total / grandTotal) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
};
