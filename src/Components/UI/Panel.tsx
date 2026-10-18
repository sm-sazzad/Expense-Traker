import type { ReactNode } from "react";
import { card } from "@/Utils/ui";

const Panel = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section className={`${card} p-5 sm:p-6 ${className}`}>{children}</section>
);

export default Panel;
