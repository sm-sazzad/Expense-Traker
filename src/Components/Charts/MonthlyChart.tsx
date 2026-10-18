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
    <Panel className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>Monthly Spending</h2>
          <p className={panelSubtitle}>Last 6 months</p>
        </div>
        <span className={badge}>{formatCurrency(current?.total ?? 0)}</span>
      </div>

      {hasAny ? (
        <div className="mt-5 flex min-h-40 flex-1 gap-2 sm:gap-6">
          {monthly.map((month, index) => {
            const percent = Math.max((month.total / max) * 100, 4);
            const isCurrent = index === monthly.length - 1;

            return (
              <div
                key={month.month}
                className="group flex flex-1 flex-col items-center gap-2"
                title={`${formatMonth(month.month)}: ${formatCurrency(month.total)}`}
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    style={{ height: `${percent}%` }}
                    className={`w-full rounded-t-md transition-colors duration-200 ${
                      isCurrent
                        ? "bg-accent"
                        : "bg-accent/30 group-hover:bg-accent/60"
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isCurrent ? "text-accent" : "text-muted"
                  }`}
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
