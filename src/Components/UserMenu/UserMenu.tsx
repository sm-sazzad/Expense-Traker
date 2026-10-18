"use client";

import Link from "next/link";

export interface ShellUser {
  name: string;
  email: string;
  image: string | null;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const UserMenu = ({ user }: { user: ShellUser | null }) => {
  const name = user?.name?.trim() || "Guest";

  return (
    <Link
      href="/profile"
      title={user ? `Signed in as ${name}` : "Guest"}
      className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl border border-line bg-card py-1.5 pl-1.5 pr-3 transition hover:border-accent/50"
    >
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-accent/15 text-[11px] font-semibold text-accent">
        {getInitials(name)}
        {user?.image && (
          <span
            aria-hidden
            className="absolute inset-0 bg-cover object-cover object-center bg-center"
            style={{ backgroundImage: `url("${user.image}")` }}
          />
        )}
      </span>

      <span className="hidden max-w-36 truncate text-sm font-semibold text-ink sm:block">
        {name}
      </span>
    </Link>
  );
};

export default UserMenu;
