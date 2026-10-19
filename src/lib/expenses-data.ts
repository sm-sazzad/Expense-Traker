import { BUDGETS_COLLECTION, EXPENSES_COLLECTION, db } from "@/lib/db";
import { toMonthKey } from "@/Utils/expense";

export interface ExpenseDoc {
  _id: string;
  userId: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  createdAt: Date;
}

export interface BudgetDoc {
  _id: string;
  userId: string;
  month: string;
  income: number;
}

export const budgetDocId = (userId: string, month: string) =>
  `${userId}#${month}`;

export const currentMonthKey = () => toMonthKey(new Date());

export const expensesCollection = () =>
  db.collection<ExpenseDoc>(EXPENSES_COLLECTION);

export const budgetsCollection = () => db.collection<BudgetDoc>(BUDGETS_COLLECTION);

export const toForm = (doc: ExpenseDoc): IForm => ({
  id: doc._id,
  title: doc.title,
  amount: doc.amount,
  category: doc.category,
  date: doc.date,
});

export const loadExpenses = async (userId: string): Promise<IForm[]> => {
  const docs = await expensesCollection()
    .find({ userId })
    .sort({ date: -1, createdAt: -1 })
    .toArray();

  return docs.map(toForm);
};

export const loadMonthlyIncomes = async (
  userId: string,
): Promise<Record<string, number>> => {
  const docs = await budgetsCollection().find({ userId }).toArray();

  const incomes: Record<string, number> = {};
  for (const doc of docs) {
    const month = doc.month || "legacy";
    incomes[month] = (incomes[month] ?? 0) + doc.income;
  }
  return incomes;
};

export const loadIncome = async (userId: string): Promise<number> => {
  const month = currentMonthKey();
  const doc = await budgetsCollection().findOne({
    _id: budgetDocId(userId, month),
  });
  return doc?.income ?? 0;
};
