import Image from "next/image";
import type { ReactNode } from "react";
import logo from "@/assets/expensely_logo_cutout2.png";

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <div className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Image
          src={logo}
          alt="Expensely"
          className="h-10 w-fit brightness-125"
          priority
        />
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
    </div>
  </div>
);

export default AuthShell;
