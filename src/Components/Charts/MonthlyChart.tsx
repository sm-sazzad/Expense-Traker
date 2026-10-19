"use client";

import Panel from "@/Components/UI/Panel";
import { useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency, formatMonth } from "@/Utils/expense";
import { badge, panelSubtitle, panelTitle } from "@/Utils/ui";

const MonthlyChart = () => {
  const { monthly } = useExpenseStats();

  const max = Math.max(...monthly.map((month) => month.total), 1);
  const current = monthly[monthly.length - 1];
  const hasAny = monthly.some((month) => month.total > 0);

  return (
    <Panel className="flex h-full w-full min-w-0 flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>Monthly Spending</h2>
          <p className={panelSubtitle}>Last 12 months</p>
        </div>

        <span className={badge}>{formatCurrency(current?.total ?? 0)}</span>
      </div>

      {hasAny ? (
        <div className="mt-5 flex min-h-40 flex-1 gap-1.5 sm:gap-3">
          {monthly.map((month, index) => {
            const percent =
              month.total > 0 ? Math.max((month.total / max) * 100, 4) : 0;

            const isCurrent = index === monthly.length - 1;
            const hasSpending = month.total > 0;

            return (
              <div
                key={month.month}
                className="group relative flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                {/* Hover Tooltip */}
                <div className="pointer-events-none absolute bottom-full z-20 mb-3 whitespace-nowrap rounded-xl border border-border bg-surface px-3 py-2.5 opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                  <p className="text-[11px] text-muted">
                    {formatMonth(month.month)}
                    {isCurrent ? " · Current" : ""}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(month.total)}
                  </p>
                </div>

                {/* Bar */}
                <div className="flex w-full flex-1 items-end">
                  <div className="flex h-full w-full items-end">
                    <div
                      style={{
                        height: `${hasSpending ? percent : 3}%`,
                      }}
                      className={[
                        "w-full rounded-t-md transition-all duration-300 ease-out sm:rounded-t-lg",
                        hasSpending
                          ? isCurrent
                            ? "bg-gradient-to-t from-accent/70 to-accent group-hover:brightness-110 group-hover:shadow-[0_0_14px_rgba(139,92,246,0.20)]"
                            : "bg-gradient-to-t from-accent/30 to-accent/70 group-hover:from-accent/50 group-hover:to-accent"
                          : "bg-accent/10 group-hover:bg-accent/20",
                      ].join(" ")}
                    />
                  </div>
                </div>

                {/* Month Label */}
                <span
                  className={[
                    "text-[10px] font-medium transition-colors duration-200 sm:text-[11px]",
                    isCurrent
                      ? "text-accent"
                      : "text-muted group-hover:text-foreground",
                  ].join(" ")}
                >
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl bg-surface text-center">
          <p className="text-sm font-medium text-muted">No monthly data yet</p>
          <p className="mt-1 text-xs text-muted/70">
            Your monthly totals will appear here
          </p>
        </div>
      )}
    </Panel>
  );
};

export default MonthlyChart;
