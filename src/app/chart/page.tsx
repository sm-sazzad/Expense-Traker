import CategoryBreakdown from "@/Components/CategoryBreakdown/CategoryBreakdown";
import MonthlyChart from "@/Components/Charts/MonthlyChart";
import WeeklyChart from "@/Components/Charts/WeeklyChart";

const page = () => {
  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Insights</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Charts
        </h1>
        <p className="mt-1 text-sm text-muted">
          Visualise your spending over time.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <WeeklyChart />
        <MonthlyChart />
      </div>

      <div className="mt-4">
        <CategoryBreakdown />
      </div>
    </>
  );
};

export default page;
