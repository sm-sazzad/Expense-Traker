import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthShell from "@/Components/Auth/AuthShell";
import { SignUpForm } from "@/Components/Auth/AuthForms";
import { auth, enabledSocialProviders } from "@/lib/auth";

export const metadata = { title: "Create account — Expensely" };

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Create your account and start tracking every expense with ease."
      footer={
        <span className="text-muted">
          Already registered?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <SignUpForm providers={enabledSocialProviders} />
    </AuthShell>
  );
}
