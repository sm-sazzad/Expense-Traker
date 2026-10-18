import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import ContextProvider from "@/Context/ContextProvider";
import AppShell from "@/Components/AppShell/AppShell";
import { auth } from "@/lib/auth";
import { loadExpenses, loadIncome } from "@/lib/expenses-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expensely — Expense Tracker",
  description: "Track your expenses and understand where your money goes.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() });

  let expenses: IForm[] = [];
  let income = 0;

  if (session) {
    [expenses, income] = await Promise.all([
      loadExpenses(session.user.id),
      loadIncome(session.user.id),
    ]);
  }

  const user = session
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }
    : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-app text-ink">
        <ContextProvider
          userId={session?.user.id ?? null}
          initialExpenses={expenses}
          initialIncome={income}
        >
          <AppShell user={user}>{children}</AppShell>
        </ContextProvider>
      </body>
    </html>
  );
}
