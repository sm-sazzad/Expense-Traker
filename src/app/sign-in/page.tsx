import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthShell from "@/Components/Auth/AuthShell";
import { SignInForm } from "@/Components/Auth/AuthForms";
import { auth, enabledSocialProviders } from "@/lib/auth";

export const metadata = { title: "Sign in — Expensely" };

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <span className="text-muted">
          New to Expensely?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </span>
      }
    >
      <Suspense fallback={null}>
        <SignInForm providers={enabledSocialProviders} />
      </Suspense>
    </AuthShell>
  );
}
