import type { ReactNode } from "react";
import { card } from "@/Utils/ui";

const tones = {
  income: "bg-income/10 text-income",
  expense: "bg-expense/10 text-expense",
  accent: "bg-accent/12 text-accent",
} as const;

const MetricCard = ({
  label,
  value,
  hint,
  icon,
  tone = "accent",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: keyof typeof tones;
}) => (
  <section className={`${card} flex h-full flex-col justify-between p-5`}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-medium text-muted">{label}</p>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </span>
    </div>

    <div>
      <p className="text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  </section>
);

export default MetricCard;
