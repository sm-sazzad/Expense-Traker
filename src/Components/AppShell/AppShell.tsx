"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useExpense } from "@/Context/ContextProvider";
import logo from "@/assets/expensely_logo_cutout2.png";
import Navbar from "@/Components/Navbar";
import ExpenseBtn, { ExpenseForm } from "@/Components/AddExpenseBtn/ExpenseBtn";
import { BalanceForm } from "@/Components/AddBalanceBtn/AddBalanceBtn";
import UserMenu, { type ShellUser } from "@/Components/UserMenu/UserMenu";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";

const AppShell = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ShellUser | null;
}) => {
  const [open, setOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const close = () => setOpen(false);
  const { userId } = useExpense();

  const pathname = usePathname();
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  // Sign-in / sign-up render without the sidebar, header, or app modals.
  if (isAuthRoute) {
    return <div className="min-h-screen bg-app text-ink">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-app text-ink">
      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-0 h-screen p-4">
            <Navbar user={user} />
          </div>
        </aside>

        {/* Mobile drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            open ? "" : "pointer-events-none"
          }`}
          aria-hidden={!open}
        >
          <div
            onClick={close}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute inset-y-0 left-0 w-72 max-w-[82%] p-3 transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Navbar user={user} onNavigate={close} onClose={close} />
          </div>
        </div>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-app px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink transition hover:border-accent/50"
              >
                <HiOutlineMenuAlt4 className="text-xl" />
              </button>

              <Image
                src={logo}
                alt="Expensely"
                className="h-7 w-fit brightness-125"
                priority
              />
            </div>

            <div className="hidden lg:block">
              {/* <p className="text-[11px] font-medium text-muted"></p> */}
              <h1 className="text-3xl font-semibold text-ink">
                Hi {user?.name || "Guest"} 👋
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden sm:block">
                <ExpenseBtn />
              </div>
              <div className="sm:hidden">
                <ExpenseBtn compact />
              </div>

              {userId === null ? (
                <Link
                  href="/sign-in"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50 hover:text-accent"
                >
                  Sign in
                </Link>
              ) : (
                <UserMenu user={user} />
              )}

              <button
                aria-label="Notifications"
                className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-muted transition hover:border-accent/50 hover:text-ink sm:flex"
              >
                <IoMdNotificationsOutline className="text-xl" />
              </button>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            {userId === null && !bannerDismissed && (
              <div className="mx-auto w-full max-w-350 mb-4">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3">
                  <p className="text-sm text-ink">
                    Your data is saved locally only.{" "}
                    <Link
                      href="/sign-in"
                      className="text-accent font-semibold hover:underline"
                    >
                      Sign in to save permanently
                    </Link>{" "}
                    .
                  </p>
                  <button
                    onClick={() => setBannerDismissed(true)}
                    aria-label="Dismiss"
                    className="shrink-0 text-muted hover:text-ink"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <div className="mx-auto w-full max-w-350">{children}</div>
          </main>
        </div>
      </div>

      {/* Modals are mounted once so every route can open them */}
      <ExpenseForm />
      <BalanceForm />
    </div>
  );
};

export default AppShell;
