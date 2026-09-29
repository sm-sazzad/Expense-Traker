"use client";
import React, { createContext, useState } from "react";

interface contextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ExpenseList: IForm[];
  setExpenseList: React.Dispatch<React.SetStateAction<IForm[]>>;
}

export const ExpenseContext = createContext<contextType>({
  isOpen: false,
  setIsOpen: () => {},
  ExpenseList: [],
  setExpenseList: () => {},
});

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ExpenseList, setExpenseList] = useState<IForm[]>([]);

  return (
    <ExpenseContext.Provider
      value={{ isOpen, setIsOpen, ExpenseList, setExpenseList }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ContextProvider;
