"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/expensely_logo_cutout2.png";
import { usePathname } from "next/navigation";

import ExpenseBtn from "@/Components/AddExpenseBtn/ExpenseBtn";
import AddBalanceBtn from "@/Components/AddBalanceBtn/AddBalanceBtn";
import { UserMenu1, type ShellUser } from "@/Components/UserMenu/UserMenu";

import {
  MdDashboard,
  MdCategory,
  MdBarChart,
  MdGroups,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import type { IconType } from "react-icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: MdDashboard },
  { href: "/transactions", label: "Transactions", icon: FaCreditCard },
  { href: "/category", label: "Categories", icon: MdCategory },
  { href: "/chart", label: "Charts", icon: MdBarChart },
  { href: "/profile", label: "Profile", icon: MdOutlineAccountCircle },
  { href: "/about", label: "About Us", icon: MdGroups },
];

const Navbar = ({
  user,
  onNavigate,
  onClose,
}: {
  user: ShellUser | null;
  onNavigate?: () => void;
  onClose?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-3.5">
      <div className="flex items-center justify-between px-1.5 py-1">
        <Image
          src={logo}
          alt="Expensely"
          className="h-9 w-fit brightness-125"
          priority
        />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:text-ink lg:hidden"
          >
            <HiOutlineX size={18} />
          </button>
        )}
      </div>

      <nav className="mt-6 flex-1">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-accent/15 text-ink ring-1 ring-inset ring-accent/25"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon
                    className={`text-[19px] ${
                      isActive ? "text-accent" : "text-current"
                    }`}
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 space-y-2 border-t border-line pt-4">
        <UserMenu1 user={user} />
        <ExpenseBtn className="w-full" />
        <AddBalanceBtn className="w-full" />
      </div>
    </div>
  );
};

export default Navbar;
