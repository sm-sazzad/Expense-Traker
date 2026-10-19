"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { getCategorySeries, getDailySeries, getMonthlySeries, isSameMonth, sumAmounts, toMonthKey, type CategoryPoint, type DailyPoint, type MonthlyPoint } from "@/Utils/expense";

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
let monthlyIncomesSnapshot: Record<string, number> = {};
const EMPTY_MONTHLY_INCOMES: Record<string, number> = {};
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
const getMonthlyIncomesSnapshot = () => monthlyIncomesSnapshot;
const getServerExpenses = () => EMPTY_EXPENSES;
const getServerIncome = () => DEFAULT_INCOME;
const getServerMonthlyIncomes = () => EMPTY_MONTHLY_INCOMES;

/**
 * Seeds the store from the server-rendered snapshot. Idempotent, so an extra
 * render (React Compiler / StrictMode) is harmless, and it re-seeds whenever
 * the signed-in user changes (sign in, sign out, switch account).
 */
const seedStore = (
  userId: string | null,
  expenses: IForm[],
  income: number,
  monthlyIncomes: Record<string, number>,
) => {
  if (seededFor === userId) return;
  seededFor = userId;
  expensesSnapshot = expenses;
  incomeSnapshot = income;
  monthlyIncomesSnapshot = monthlyIncomes;
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

const writeLocalExpenses = (list: IForm[]) => {
  try {
    window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode); ignore.
  }
};

const writeLocalIncome = (value: number) => {
  try {
    window.localStorage.setItem(INCOME_KEY, String(value));
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
  monthlyIncomes: Record<string, number>;
  setIncome: (value: number) => void;
  addToBalance: (amount: number) => void;
  addExpense: (expense: Omit<IForm, "id">) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  userId: string | null;
}

export const ExpenseContext = createContext<contextType>({
  isOpen: false,
  setIsOpen: () => {},
  isBalanceOpen: false,
  setIsBalanceOpen: () => {},
  ExpenseList: [],
  setExpenseList: () => {},
  income: DEFAULT_INCOME,
  monthlyIncomes: {},
  setIncome: () => {},
  addToBalance: () => {},
  addExpense: () => {},
  deleteExpense: () => {},
  clearExpenses: () => {},
  userId: null,
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
  initialMonthlyIncomes,
}: {
  children: React.ReactNode;
  userId: string | null;
  initialExpenses: IForm[];
  initialIncome: number;
  initialMonthlyIncomes: Record<string, number>;
}) => {
  seedStore(userId, initialExpenses, initialIncome, initialMonthlyIncomes);

  const router = useRouter();
  const prevUserIdRef = useRef(userId);
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
  const monthlyIncomes = useSyncExternalStore(
    subscribe,
    getMonthlyIncomesSnapshot,
    getServerMonthlyIncomes,
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
    if (!userId) writeLocalExpenses(expensesSnapshot);
  }, [userId]);

  // Optimistic first, persisted right after: the UI never waits on the network.
  const addExpense = useCallback(
    (expense: Omit<IForm, "id">) => {
      const created: IForm = { ...expense, id: makeId() };
      expensesSnapshot = [created, ...expensesSnapshot];
      emit();
      if (userId) {
        createExpenseAction(created).catch(persistFailed);
      } else {
        writeLocalExpenses(expensesSnapshot);
      }
    },
    [userId, persistFailed],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      expensesSnapshot = expensesSnapshot.filter(
        (expense) => expense.id !== id,
      );
      emit();
      if (userId) {
        deleteExpenseAction(id).catch(persistFailed);
      } else {
        writeLocalExpenses(expensesSnapshot);
      }
    },
    [userId, persistFailed],
  );

  const clearExpenses = useCallback(() => {
    expensesSnapshot = [];
    emit();
    if (userId) {
      clearExpensesAction().catch(persistFailed);
    } else {
      try {
        window.localStorage.removeItem(EXPENSES_KEY);
      } catch {
        // Storage can be unavailable (private mode); ignore.
      }
    }
  }, [userId, persistFailed]);

  const setIncome = useCallback(
    (value: number) => {
      const month = toMonthKey(new Date());
      const income = Number.isFinite(value) && value > 0 ? value : 0;
      monthlyIncomesSnapshot = {
        ...monthlyIncomesSnapshot,
        [month]: income,
      };
      incomeSnapshot = monthlyIncomesSnapshot[month] ?? 0;
      emit();
      if (userId) {
        setIncomeAction(income).catch(persistFailed);
      } else {
        writeLocalIncome(incomeSnapshot);
      }
    },
    [userId, persistFailed],
  );

  const addToBalance = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      const month = toMonthKey(new Date());
      monthlyIncomesSnapshot = {
        ...monthlyIncomesSnapshot,
        [month]: (monthlyIncomesSnapshot[month] ?? 0) + amount,
      };
      incomeSnapshot = monthlyIncomesSnapshot[month] ?? 0;
      emit();
      if (userId) {
        addToBalanceAction(amount).catch(persistFailed);
      } else {
        writeLocalIncome(incomeSnapshot);
      }
    },
    [userId, persistFailed],
  );

  // Hydrate the optimistic store from localStorage while unauthenticated so a
  // refresh keeps the user's pre-auth data on screen.
  useEffect(() => {
    if (userId !== null) return;

    let nextExpenses: IForm[] | null = null;
    let nextIncome: number | null = null;

    try {
      const rawExpenses = window.localStorage.getItem(EXPENSES_KEY);
      if (rawExpenses) {
        let parsed: unknown = [];
        try {
          parsed = JSON.parse(rawExpenses);
        } catch {
          parsed = [];
        }
        nextExpenses = Array.isArray(parsed) ? (parsed as IForm[]) : [];
      }

      const rawIncome = window.localStorage.getItem(INCOME_KEY);
      if (rawIncome) {
        const parsedIncome = Number(rawIncome);
        if (Number.isFinite(parsedIncome) && parsedIncome > 0) {
          nextIncome = parsedIncome;
        }
      }
    } catch {
      return;
    }

    if (nextExpenses === null && nextIncome === null) return;

    if (nextExpenses !== null) expensesSnapshot = nextExpenses;
    if (nextIncome !== null) incomeSnapshot = nextIncome;
    emit();
  }, [userId]);

  // Sign in: hand localStorage data over to the account (migrateLocalData
  // skips accounts that already hold data). Sign out: drop localStorage.
  useEffect(() => {
    const prev = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (!userId) {
      if (prev !== null) clearLocalSnapshot();
      return;
    }

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
        // Leave localStorage untouched; the next sign-in retries.
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
      monthlyIncomes,
      setIncome,
      addToBalance,
      addExpense,
      deleteExpense,
      clearExpenses,
      userId,
    }),
    [
      isOpen,
      isBalanceOpen,
      ExpenseList,
      setExpenseList,
      income,
      monthlyIncomes,
      setIncome,
      addToBalance,
      addExpense,
      deleteExpense,
      clearExpenses,
      userId,
    ],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export interface ExpenseStats {
  totalExpenses: number;
  totalBalance: number;
  remaining: number;
  carryForward: number;
  currentMonthIncome: number;
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
  const { ExpenseList, monthlyIncomes } = useExpense();

  return useMemo(() => {
    const now = new Date();
    const currentMonth = toMonthKey(now);
    const currentMonthIncome = monthlyIncomes[currentMonth] ?? 0;
    const daily = getDailySeries(ExpenseList);
    const monthly = getMonthlySeries(ExpenseList, 12);
    const totalExpenses = sumAmounts(ExpenseList);
    const currentMonthExpenses = sumAmounts(
      ExpenseList.filter((expense) => isSameMonth(expense.date, now)),
    );
    const allTimeIncome = Object.values(monthlyIncomes).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    // Expenses recorded before the current month (all prior months).
    const expensesBeforeCurrentMonth = sumAmounts(
      ExpenseList.filter((expense) => expense.date.slice(0, 7) < currentMonth),
    );

    // Total Balance = opening balance (carried forward) + current month additions.
    // This does NOT decrease when the user records an expense in the current month.
    const totalBalance = allTimeIncome - expensesBeforeCurrentMonth;

    // Remaining Balance = Total Balance − current month expenses.
    // Equivalent to all-time income − all-time expenses, which naturally
    // carries forward the previous month's remaining balance.
    const remaining = allTimeIncome - totalExpenses;

    // Opening balance carried forward from the previous month.
    const carryForward = totalBalance - currentMonthIncome;

    return {
      totalExpenses,
      totalBalance,
      remaining,
      carryForward,
      currentMonthIncome,
      currentMonthTotal: currentMonthExpenses,
      weekTotal: daily.reduce((sum, day) => sum + day.total, 0),
      todayTotal: daily[daily.length - 1]?.total ?? 0,
      expenseCount: ExpenseList.length,
      daily,
      monthly,
      byCategory: getCategorySeries(ExpenseList),
      recent: [...ExpenseList].sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [ExpenseList, monthlyIncomes]);
};

export default ContextProvider;
