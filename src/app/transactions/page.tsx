import TransactionList from "@/Components/TransactionList/TransactionList";

const page = () => {
  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Activity</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Every expense you have recorded, newest first.
        </p>
      </div>

      <div className="mt-5">
        <TransactionList showFilters showClear />
      </div>
    </>
  );
};

export default page;
