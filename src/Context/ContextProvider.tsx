"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import {
  addToBalance as addToBalanceAction,
  clearExpenses as clearExpensesAction,
  createExpense as createExpenseAction,
  deleteExpense as deleteExpenseAction,
  migrateLocalData,
  setIncome as setIncomeAction,
} from "@/app/actions/expenses";
import {
  getCategorySeries,
  getDailySeries,
  getMonthlySeries,
  isSameMonth,
  sumAmounts,
  type CategoryPoint,
  type DailyPoint,
  type MonthlyPoint,
} from "@/Utils/expense";

export const DEFAULT_INCOME = 0;

// Pre-auth storage. Only read once, to migrate into the signed-in account.
const EXPENSES_KEY = "expensely.expenses";
const INCOME_KEY = "expensely.income";

type Listener = () => void;
const listeners = new Set<Listener>();

const EMPTY_EXPENSES: IForm[] = [];

// Module-level cache keeps snapshots referentially stable between renders,
// which useSyncExternalStore requires to avoid infinite re-render loops.
let expensesSnapshot: IForm[] = EMPTY_EXPENSES;
let incomeSnapshot = DEFAULT_INCOME;
// `undefined` means "never seeded", so the first render always seeds.
let seededFor: string | null | undefined = undefined;

const emit = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getExpensesSnapshot = () => expensesSnapshot;
const getIncomeSnapshot = () => incomeSnapshot;
const getServerExpenses = () => EMPTY_EXPENSES;
const getServerIncome = () => DEFAULT_INCOME;

/**
 * Seeds the store from the server-rendered snapshot. Idempotent, so an extra
 * render (React Compiler / StrictMode) is harmless, and it re-seeds whenever
 * the signed-in user changes (sign in, sign out, switch account).
 */
const seedStore = (
  userId: string | null,
  expenses: IForm[],
  income: number,
) => {
  if (seededFor === userId) return;
  seededFor = userId;
  expensesSnapshot = expenses;
  incomeSnapshot = income;
};

/** Forces the next render to re-seed from the server snapshot. */
const invalidateSeed = () => {
  seededFor = undefined;
};

const clearLocalSnapshot = () => {
  try {
    window.localStorage.removeItem(EXPENSES_KEY);
    window.localStorage.removeItem(INCOME_KEY);
  } catch {
    // Storage can be unavailable (private mode); ignore.
  }
};

interface contextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBalanceOpen: boolean;
  setIsBalanceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ExpenseList: IForm[];
  setExpenseList: React.Dispatch<React.SetStateAction<IForm[]>>;
  income: number;
  setIncome: (value: number) => void;
  addToBalance: (amount: number) => void;
  addExpense: (expense: Omit<IForm, "id">) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
}

export const ExpenseContext = createContext<contextType>({
  isOpen: false,
  setIsOpen: () => {},
  isBalanceOpen: false,
  setIsBalanceOpen: () => {},
  ExpenseList: [],
  setExpenseList: () => {},
  income: DEFAULT_INCOME,
  setIncome: () => {},
  addToBalance: () => {},
  addExpense: () => {},
  deleteExpense: () => {},
  clearExpenses: () => {},
});

export const useExpense = () => useContext(ExpenseContext);

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const ContextProvider = ({
  children,
  userId,
  initialExpenses,
  initialIncome,
}: {
  children: React.ReactNode;
  userId: string | null;
  initialExpenses: IForm[];
  initialIncome: number;
}) => {
  seedStore(userId, initialExpenses, initialIncome);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState<boolean>(false);

  const ExpenseList = useSyncExternalStore(
    subscribe,
    getExpensesSnapshot,
    getServerExpenses,
  );
  const income = useSyncExternalStore(
    subscribe,
    getIncomeSnapshot,
    getServerIncome,
  );

  // A write that failed to reach MongoDB: drop the optimistic state and pull
  // the authoritative snapshot back down from the server.
  const persistFailed = useCallback(
    (error: unknown) => {
      console.error("[expenses] failed to persist to MongoDB", error);
      invalidateSeed();
      router.refresh();
    },
    [router],
  );

  const setExpenseList = useCallback<
    React.Dispatch<React.SetStateAction<IForm[]>>
  >((action) => {
    expensesSnapshot =
      typeof action === "function"
        ? (action as (previous: IForm[]) => IForm[])(expensesSnapshot)
        : action;
    emit();
  }, []);

  // Optimistic first, persisted right after: the UI never waits on the network.
  const addExpense = useCallback(
    (expense: Omit<IForm, "id">) => {
      const created: IForm = { ...expense, id: makeId() };
      expensesSnapshot = [created, ...expensesSnapshot];
      emit();
      createExpenseAction(created).catch(persistFailed);
    },
    [persistFailed],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      expensesSnapshot = expensesSnapshot.filter(
        (expense) => expense.id !== id,
      );
      emit();
      deleteExpenseAction(id).catch(persistFailed);
    },
    [persistFailed],
  );

  const clearExpenses = useCallback(() => {
    expensesSnapshot = [];
    emit();
    clearExpensesAction().catch(persistFailed);
  }, [persistFailed]);

  const setIncome = useCallback(
    (value: number) => {
      incomeSnapshot = Number.isFinite(value) && value > 0 ? value : 0;
      emit();
      setIncomeAction(incomeSnapshot).catch(persistFailed);
    },
    [persistFailed],
  );

  const addToBalance = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      incomeSnapshot = incomeSnapshot + amount;
      emit();
      addToBalanceAction(amount).catch(persistFailed);
    },
    [persistFailed],
  );

  // One-time hand-off of the pre-auth localStorage data into the account.
  useEffect(() => {
    if (!userId) return;
    if (expensesSnapshot.length > 0 || incomeSnapshot > 0) return;

    let rawExpenses: string | null = null;
    let rawIncome: string | null = null;
    try {
      rawExpenses = window.localStorage.getItem(EXPENSES_KEY);
      rawIncome = window.localStorage.getItem(INCOME_KEY);
    } catch {
      return;
    }

    if (!rawExpenses && !rawIncome) return;

    let parsed: unknown = [];
    try {
      parsed = rawExpenses ? JSON.parse(rawExpenses) : [];
    } catch {
      parsed = [];
    }

    const list = Array.isArray(parsed) ? (parsed as IForm[]) : [];
    const parsedIncome = rawIncome ? Number(rawIncome) : 0;
    const localIncome =
      Number.isFinite(parsedIncome) && parsedIncome > 0 ? parsedIncome : 0;

    if (list.length === 0 && localIncome === 0) {
      clearLocalSnapshot();
      return;
    }

    migrateLocalData(list, localIncome)
      .then((migrated) => {
        if (migrated) clearLocalSnapshot();
        invalidateSeed();
        router.refresh();
      })
      .catch(() => {
        // Leave localStorage untouched; the next visit retries.
      });
  }, [router, userId]);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      isBalanceOpen,
      setIsBalanceOpen,
      ExpenseList,
      setExpenseList,
      income,
      setIncome,
      addToBalance,
      addExpense,
      deleteExpense,
      clearExpenses,
    }),
    [
      isOpen,
      isBalanceOpen,
      ExpenseList,
      setExpenseList,
      income,
      setIncome,
      addToBalance,
      addExpense,
      deleteExpense,
      clearExpenses,
    ],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export interface ExpenseStats {
  totalExpenses: number;
  remaining: number;
  currentMonthTotal: number;
  weekTotal: number;
  todayTotal: number;
  expenseCount: number;
  daily: DailyPoint[];
  monthly: MonthlyPoint[];
  byCategory: CategoryPoint[];
  recent: IForm[];
}

export const useExpenseStats = (): ExpenseStats => {
  const { ExpenseList, income } = useExpense();

  return useMemo(() => {
    const now = new Date();
    const daily = getDailySeries(ExpenseList);
    const monthly = getMonthlySeries(ExpenseList);
    const totalExpenses = sumAmounts(ExpenseList);

    return {
      totalExpenses,
      remaining: income - totalExpenses,
      currentMonthTotal: sumAmounts(
        ExpenseList.filter((expense) => isSameMonth(expense.date, now)),
      ),
      weekTotal: daily.reduce((sum, day) => sum + day.total, 0),
      todayTotal: daily[daily.length - 1]?.total ?? 0,
      expenseCount: ExpenseList.length,
      daily,
      monthly,
      byCategory: getCategorySeries(ExpenseList),
      recent: [...ExpenseList].sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [ExpenseList, income]);
};

export default ContextProvider;
