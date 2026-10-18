"use client";
import Panel from "@/Components/UI/Panel";
import { useExpenseStats } from "@/Context/ContextProvider";
import { formatCurrency } from "@/Utils/expense";
import { badge, panelSubtitle, panelTitle } from "@/Utils/ui";

const WeeklyChart = () => {
  const { daily, weekTotal } = useExpenseStats();
  const max = Math.max(...daily.map((day) => day.total), 1);
  const hasAny = weekTotal > 0;

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>Weekly Spending</h2>
          <p className={panelSubtitle}>Last 7 days</p>
        </div>
        <span className={badge}>{formatCurrency(weekTotal)}</span>
      </div>

      {hasAny ? (
        <div className="mt-5 flex min-h-40 flex-1 gap-2 sm:gap-3">
          {daily.map((day) => {
            const percent = Math.max((day.total / max) * 100, 4);

            return (
              <div
                key={day.date}
                className="group flex flex-1 flex-col items-center gap-2"
                title={`${day.label}: ${formatCurrency(day.total)}`}
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    style={{ height: `${percent}%` }}
                    className="w-full rounded-t-md bg-accent/70 transition-colors duration-200 group-hover:bg-accent"
                  />
                </div>
                <span className="text-[11px] font-medium text-muted">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl bg-surface text-center">
          <p className="text-sm font-medium text-muted">No spending this week</p>
          <p className="mt-1 text-xs text-muted/70">
            Add an expense to see your weekly trend
          </p>
        </div>
      )}
    </Panel>
  );
};

export default WeeklyChart;
