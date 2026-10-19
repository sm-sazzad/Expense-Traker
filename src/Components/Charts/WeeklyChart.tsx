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
    <Panel className="flex h-full w-full min-w-0 flex-col">
      {/* Header */}
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
            const percent =
              day.total > 0 ? Math.max((day.total / max) * 100, 4) : 0;

            return (
              <div
                key={day.date}
                className="group relative flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                {/* Hover Tooltip */}
                <div className="pointer-events-none absolute bottom-full z-20 mb-3 whitespace-nowrap rounded-xl border border-border bg-surface px-3 py-2.5 opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                  <p className="text-[11px] text-muted">{day.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(day.total)}
                  </p>
                </div>

                {/* Bar */}

                {/* Bar */}
                <div className="flex w-full flex-1 items-end">
                  <div className="flex h-full w-full items-end">
                    <div
                      style={{
                        height: `${percent > 0 ? percent : 3}%`,
                      }}
                      className={[
                        "w-full rounded-t-lg transition-all duration-300 ease-out",
                        day.total > 0
                          ? "bg-gradient-to-t from-accent/50 to-accent group-hover:brightness-110 group-hover:shadow-[0_0_14px_rgba(139,92,246,0.20)]"
                          : "bg-accent/10 group-hover:bg-accent/20",
                      ].join(" ")}
                    />
                  </div>
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-medium text-muted transition-colors duration-200 group-hover:text-foreground">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl bg-surface text-center">
          <p className="text-sm font-medium text-muted">
            No spending this week
          </p>
          <p className="mt-1 text-xs text-muted/70">
            Add an expense to see your weekly trend
          </p>
        </div>
      )}
    </Panel>
  );
};

export default WeeklyChart;
