"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/expensely_logo_cutout2.png";
import { usePathname } from "next/navigation";

import { MdDashboard, MdCategory, MdBarChart, MdGroups } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";

const Navbar = () => {
  const Pathname = usePathname();

  return (
    <aside className="sticky h-screen p-6 w-60 top-0 bg-white space-y-10">
      <Image src={logo} alt="Expensely" className="h-12 w-fit" />

      <nav>
        <ul className="flex flex-col gap-1">
          {/* Dashboard */}
          <Link
            href="/"
            className={`px-3 py-2 rounded-2xl hover:bg-[#ebeef480] font-semibold flex justify-between items-center ${
              Pathname === "/"
                ? "bg-[#f3f0ff] text-[#5b33e8]"
                : "text-[#6b7790]"
            }`}
          >
            <div className="flex gap-2 items-center">
              <MdDashboard className="text-[21px]" />
              Dashboard
            </div>

            <span
              className={`${
                Pathname === "/" ? "block" : "hidden"
              } w-2 h-2 rounded-full bg-[#5b33e8]`}
            ></span>
          </Link>

          {/* Transactions */}
          <Link
            href="/transection"
            className={`px-3 py-2 rounded-2xl hover:bg-[#ebeef480] font-semibold flex justify-between items-center ${
              Pathname === "/transection"
                ? "bg-[#f3f0ff] text-[#5b33e8]"
                : "text-[#6b7790]"
            }`}
          >
            <div className="flex gap-2 items-center">
              <FaCreditCard className="text-[21px]" />
              Transactions
            </div>

            <span
              className={`${
                Pathname === "/transection" ? "block" : "hidden"
              } w-2 h-2 rounded-full bg-[#5b33e8]`}
            ></span>
          </Link>

          {/* Categories */}
          <Link
            href="/category"
            className={`px-3 py-2 rounded-2xl hover:bg-[#ebeef480] font-semibold flex justify-between items-center ${
              Pathname === "/category"
                ? "bg-[#f3f0ff] text-[#5b33e8]"
                : "text-[#6b7790]"
            }`}
          >
            <div className="flex gap-2 items-center">
              <MdCategory className="text-[21px]" />
              Categories
            </div>

            <span
              className={`${
                Pathname === "/category" ? "block" : "hidden"
              } w-2 h-2 rounded-full bg-[#5b33e8]`}
            ></span>
          </Link>

          {/* Charts */}
          <Link
            href="/chart"
            className={`px-3 py-2 rounded-2xl hover:bg-[#ebeef480] font-semibold flex justify-between items-center ${
              Pathname === "/chart"
                ? "bg-[#f3f0ff] text-[#5b33e8]"
                : "text-[#6b7790]"
            }`}
          >
            <div className="flex gap-2 items-center">
              <MdBarChart className="text-[21px]" />
              Charts
            </div>

            <span
              className={`${
                Pathname === "/chart" ? "block" : "hidden"
              } w-2 h-2 rounded-full bg-[#5b33e8]`}
            ></span>
          </Link>

          {/* About Us */}
          <Link
            href="/aboue-us"
            className={`px-3 py-2 rounded-2xl hover:bg-[#ebeef480] font-semibold flex justify-between items-center ${
              Pathname === "/aboue-us"
                ? "bg-[#f3f0ff] text-[#5b33e8]"
                : "text-[#6b7790]"
            }`}
          >
            <div className="flex gap-2 items-center">
              <MdGroups className="text-[21px]" />
              About Us
            </div>

            <span
              className={`${
                Pathname === "/aboue-us" ? "block" : "hidden"
              } w-2 h-2 rounded-full bg-[#5b33e8]`}
            ></span>
          </Link>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
