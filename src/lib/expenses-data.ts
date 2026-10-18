import { BUDGETS_COLLECTION, EXPENSES_COLLECTION, db } from "@/lib/db";

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
  income: number;
}

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

export const loadIncome = async (userId: string): Promise<number> => {
  const doc = await budgetsCollection().findOne({ _id: userId });
  return doc?.income ?? 0;
};
