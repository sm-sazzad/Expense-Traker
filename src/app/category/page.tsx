import CategoryBreakdown from "@/Components/CategoryBreakdown/CategoryBreakdown";

const page = () => {
  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Insights</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted">
          See how much you spend in each category.
        </p>
      </div>

      <div className="mt-5">
        <CategoryBreakdown />
      </div>
    </>
  );
};

export default page;
