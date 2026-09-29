import ExpenseBtn, { ExpenseForm } from "@/Components/AddExpenseBtn/ExpenseBtn";
import Balance from "@/Components/BalanceCard/Balance";
import { IoMdNotificationsOutline } from "react-icons/io";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252b3a]">Hi Sazzad 👋</h1>
          <p className="mt-1 text-sm text-[#7b8497]">
            Here's your financial overview for this month.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#6b7790] hover:text-[#5b33e8] cursor-pointer bg-white border border-gray-400 p-1.5 rounded-xl">
            <IoMdNotificationsOutline className="text-2xl" />
          </button>

          <ExpenseBtn />
        </div>
      </div>
      <ExpenseForm />
      <Balance />
    </>
  );
};

export default page;
