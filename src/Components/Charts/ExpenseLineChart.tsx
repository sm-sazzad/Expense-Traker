"use client";

import Panel from "@/Components/UI/Panel";
import { useExpense } from "@/Context/ContextProvider";
import { amountOf } from "@/Utils/expense";
import { badge, panelSubtitle, panelTitle } from "@/Utils/ui";

const ExpenseLineChart = () => {
  const { ExpenseList } = useExpense();

  const byDate = new Map<string, number>();

  for (const expense of ExpenseList) {
    const key = expense.date.slice(0, 10);
    byDate.set(key, (byDate.get(key) ?? 0) + amountOf(expense));
  }

  const points = [...byDate.entries()]
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const total = points.reduce((sum, point) => sum + point.total, 0);
  const maxValue = Math.max(...points.map((point) => point.total), 0);
  const hasAny = points.length > 0;

  const formatNumber = (value: number) =>
    value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  if (!hasAny) {
    return (
      <Panel className="flex h-full w-full min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={panelTitle}>Expense Trend</h2>
            <p className={panelSubtitle}>All expenses</p>
          </div>
          <span className={badge}>{formatNumber(0)}</span>
        </div>

        <div className="mt-5 flex min-h-52 w-full flex-1 flex-col items-center justify-center rounded-xl bg-surface text-center">
          <p className="text-sm font-medium text-muted">No expense data yet</p>
          <p className="mt-1 text-xs text-muted/70">
            Add an expense to see the trend
          </p>
        </div>
      </Panel>
    );
  }

  const width = 800;
  const height = 300;
  const left = 64;
  const right = 16;
  const top = 24;
  const bottom = 36;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  // Leave some breathing room above the highest point.
  const scaleMax = maxValue > 0 ? maxValue * 1.2 : 1;

  const getX = (index: number) =>
    points.length === 1
      ? left + plotWidth / 2
      : left + (index / (points.length - 1)) * plotWidth;

  const getY = (value: number) =>
    top + plotHeight - (value / scaleMax) * plotHeight;

  const coordinates = points.map((point, index) => ({
    x: getX(index),
    y: getY(point.total),
    ...point,
  }));

  // Build a smooth curve through the data points.
  const linePath = coordinates
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = coordinates[index - 1];
      const midX = (previous.x + point.x) / 2;

      return `C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = [
    linePath,
    `L ${coordinates[coordinates.length - 1].x} ${top + plotHeight}`,
    `L ${coordinates[0].x} ${top + plotHeight}`,
    "Z",
  ].join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    y: top + plotHeight - fraction * plotHeight,
    value: scaleMax * fraction,
  }));

  const dateIndexes = [
    0,
    Math.floor((points.length - 1) / 2),
    points.length - 1,
  ].filter((index, i, arr) => arr.indexOf(index) === i);

  return (
    <Panel className="flex h-full w-full min-w-0 flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={panelTitle}>Expense Trend</h2>
          <p className={panelSubtitle}>All expenses</p>
        </div>

        <span className={badge}>{formatNumber(total)}</span>
      </div>

      <div className="w-full min-w-0">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label="Area chart showing daily expenses"
        >
          <defs>
            <linearGradient
              id="expense-area-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {/* Horizontal grid and Y-axis labels */}
          {yTicks.map(({ y, value }) => (
            <g key={value}>
              <line
                x1={left}
                y1={y}
                x2={width - right}
                y2={y}
                stroke="var(--color-line)"
                strokeWidth="1"
                strokeDasharray={value === 0 ? "0" : "4 5"}
              />

              <text
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-muted)"
                fontSize="12"
              >
                {formatNumber(value)}
              </text>
            </g>
          ))}

          {/* Gradient area */}
          <path d={areaPath} fill="url(#expense-area-gradient)" />

          {/* Smooth trend line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {coordinates.map((point) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="var(--color-accent)"
                stroke="var(--color-panel, var(--color-surface))"
                strokeWidth="2"
              >
                <title>
                  {formatDate(point.date)}: {formatNumber(point.total)}
                </title>
              </circle>
            </g>
          ))}
        </svg>

        {/* Date labels */}
        <div className="mt-1 flex w-full justify-between pl-[8%] pr-[2%] text-[11px] text-muted">
          {dateIndexes.map((index) => (
            <span key={points[index].date}>
              {formatDate(points[index].date)}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
};

export default ExpenseLineChart;
