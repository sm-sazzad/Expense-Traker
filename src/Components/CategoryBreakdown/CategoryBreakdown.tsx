"use client";
import Link from "next/link";
import Panel from "@/Components/UI/Panel";
import { useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { badge, panelSubtitle, panelTitle } from "@/Utils/ui";

const CategoryBreakdown = ({ limit }: { limit?: number }) => {
  const { byCategory, totalExpenses } = useExpenseStats();
  const categories = limit ? byCategory.slice(0, limit) : byCategory;

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>By Category</h2>
          <p className={panelSubtitle}>Where your money goes</p>
        </div>
        {limit ? (
          <Link
            href="/category"
            className="shrink-0 text-xs font-semibold text-accent hover:text-[#a78bfa]"
          >
            View all
          </Link>
        ) : (
          <span className={`${badge} shrink-0`}>
            {formatCurrency(totalExpenses)}
          </span>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="mt-5 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl bg-surface text-center">
          <p className="text-sm font-medium text-muted">No data yet</p>
          <p className="mt-1 text-xs text-muted/70">
            Add an expense to see the breakdown
          </p>
        </div>
      ) : (
        <ul className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {categories.map((category) => (
            <li key={category.value}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                    style={{ backgroundColor: `${category.color}1f` }}
                  >
                    {category.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {category.label}
                    </p>
                    <p className="text-[11px] text-muted">
                      {category.count}{" "}
                      {category.count === 1 ? "expense" : "expenses"}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-ink">
                    {formatCurrency(category.total)}
                  </p>
                  <p className="text-[11px] text-muted">
                    {category.percent.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${category.percent}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default CategoryBreakdown;
