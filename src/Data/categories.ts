export interface ICategory {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: ICategory[] = [
  { value: "food", label: "Food", emoji: "🍔", color: "#f97316" },
  { value: "transport", label: "Transport", emoji: "🚌", color: "#3b82f6" },
  { value: "shopping", label: "Shopping", emoji: "🛍️", color: "#ec4899" },
  { value: "housing", label: "Rent / Housing", emoji: "🏠", color: "#8b5cf6" },
  { value: "bills", label: "Bills & Utilities", emoji: "💡", color: "#eab308" },
  { value: "health", label: "Health", emoji: "💊", color: "#ef4444" },
  { value: "education", label: "Education", emoji: "🎓", color: "#06b6d4" },
  { value: "entertainment", label: "Entertainment", emoji: "🎮", color: "#a855f7" },
  { value: "subscription", label: "Subscription", emoji: "📱", color: "#14b8a6" },
  { value: "clothing", label: "Clothing", emoji: "👕", color: "#f43f5e" },
  { value: "travel", label: "Travel", emoji: "✈️", color: "#0ea5e9" },
  { value: "gifts", label: "Gifts", emoji: "🎁", color: "#d946ef" },
  { value: "technology", label: "Technology", emoji: "💻", color: "#64748b" },
  { value: "others", label: "Others", emoji: "💰", color: "#22c55e" },
];

const FALLBACK: ICategory = {
  value: "others",
  label: "Uncategorized",
  emoji: "❓",
  color: "#94a3b8",
};

export const getCategory = (value: string): ICategory =>
  CATEGORIES.find((category) => category.value === value) ?? FALLBACK;
