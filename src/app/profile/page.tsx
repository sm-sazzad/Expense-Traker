import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Panel from "@/Components/UI/Panel";
import ProfileForm from "@/Components/Profile/ProfileForm";
import SignOutButton from "@/Components/Profile/SignOutButton";
import { auth } from "@/lib/auth";
import { badge, panelSubtitle, panelTitle } from "@/Utils/ui";

export const metadata = { title: "Profile — Expensely" };

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { user } = session;
  const name = user.name?.trim() || "Guest";
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Account</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Profile
        </h1>
        {/* <p className="mt-1 text-sm text-muted">
          Your account details are stored in MongoDB.
        </p> */}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className={panelTitle}>Your details</h2>
          <p className={panelSubtitle}>
            Update your display name and profile picture.
          </p>
          <ProfileForm initialName={name} initialImage={user.image ?? ""} />
        </Panel>

        <div className="space-y-4">
          <Panel>
            <div className="flex items-center gap-4">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-accent/15 text-base font-semibold text-accent">
                {getInitials(name)}
                {user.image && (
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${user.image}")` }}
                  />
                )}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {name}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={
                  user.emailVerified
                    ? "rounded-lg border border-income/30 bg-income/10 px-2.5 py-1 text-xs font-semibold text-income"
                    : "rounded-lg border border-expense/30 bg-expense/10 px-2.5 py-1 text-xs font-semibold text-expense"
                }
              >
                {user.emailVerified ? "Email verified" : "Email not verified"}
              </span>

              {joined && <span className={badge}>Joined {joined}</span>}
            </div>
          </Panel>

          <Panel>
            <h2 className={panelTitle}>Session</h2>
            <p className={`${panelSubtitle} mb-4`}>Sign out of this browser.</p>
            <SignOutButton />
          </Panel>
        </div>
      </div>
    </>
  );
}
