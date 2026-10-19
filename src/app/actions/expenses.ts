"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  budgetDocId,
  budgetsCollection,
  currentMonthKey,
  expensesCollection,
  loadExpenses,
  toForm,
} from "@/lib/expenses-data";

const revalidateApp = () => {
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/category");
  revalidatePath("/chart");
  revalidatePath("/profile");
};

const requireUserId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  return session.user.id;
};

export const listExpenses = async (): Promise<IForm[]> => {
  const userId = await requireUserId();
  return loadExpenses(userId);
};

export const getIncome = async (): Promise<number> => {
  const userId = await requireUserId();
  const month = currentMonthKey();
  const doc = await budgetsCollection().findOne({
    _id: budgetDocId(userId, month),
  });
  return doc?.income ?? 0;
};

export const createExpense = async (expense: IForm): Promise<IForm> => {
  const userId = await requireUserId();

  const doc = {
    _id: expense.id,
    userId,
    title: expense.title.slice(0, 200),
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    createdAt: new Date(),
  };

  await expensesCollection().insertOne(doc);
  revalidateApp();

  return toForm(doc);
};

export const deleteExpense = async (id: string): Promise<void> => {
  const userId = await requireUserId();
  await expensesCollection().deleteOne({ _id: id, userId });
  revalidateApp();
};

export const clearExpenses = async (): Promise<void> => {
  const userId = await requireUserId();
  await expensesCollection().deleteMany({ userId });
  revalidateApp();
};

export const setIncome = async (value: number): Promise<void> => {
  const userId = await requireUserId();
  const income = Number.isFinite(value) && value > 0 ? value : 0;
  const month = currentMonthKey();

  await budgetsCollection().updateOne(
    { _id: budgetDocId(userId, month) },
    { $set: { income, userId, month } },
    { upsert: true },
  );

  revalidateApp();
};

export const addToBalance = async (amount: number): Promise<void> => {
  const userId = await requireUserId();
  if (!Number.isFinite(amount) || amount <= 0) return;
  const month = currentMonthKey();

  await budgetsCollection().updateOne(
    { _id: budgetDocId(userId, month) },
    { $inc: { income: amount }, $set: { userId, month } },
    { upsert: true },
  );

  revalidateApp();
};

/**
 * One-time move of the pre-auth localStorage data into the signed-in account.
 * Refuses to run when the account already holds any expenses or balance, so it
 * can never overwrite real data.
 */
export const migrateLocalData = async (
  localExpenses: IForm[],
  localIncome: number,
): Promise<boolean> => {
  const userId = await requireUserId();

  const month = currentMonthKey();
  const [existingCount, existingBudget] = await Promise.all([
    expensesCollection().countDocuments({ userId }),
    budgetsCollection().findOne({ _id: budgetDocId(userId, month) }),
  ]);

  if (existingCount > 0 || (existingBudget?.income ?? 0) > 0) return false;

  const valid = localExpenses.filter(
    (expense) =>
      expense &&
      typeof expense.id === "string" &&
      typeof expense.title === "string" &&
      typeof expense.amount === "string" &&
      typeof expense.category === "string" &&
      typeof expense.date === "string",
  );

  if (valid.length > 0) {
    await expensesCollection().insertMany(
      valid.map((expense) => ({
        _id: expense.id,
        userId,
        title: expense.title.slice(0, 200),
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        createdAt: new Date(),
      })),
    );
  }

  if (Number.isFinite(localIncome) && localIncome > 0) {
    await budgetsCollection().updateOne(
      { _id: budgetDocId(userId, month) },
      { $set: { income: localIncome, userId, month } },
      { upsert: true },
    );
  }

  revalidateApp();
  return true;
};
