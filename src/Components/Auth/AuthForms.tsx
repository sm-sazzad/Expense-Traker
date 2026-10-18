"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { inputClass, labelClass, primaryButton } from "@/Utils/ui";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";

export type SocialProvider = "google" | "github";

const SocialButtons = ({ providers }: { providers: SocialProvider[] }) => {
  if (providers.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        {providers.includes("google") && (
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
                errorCallbackURL: "/sign-in",
              })
            }
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50"
          >
            <FcGoogle className="text-lg" />
            Google
          </button>
        )}

        {providers.includes("github") && (
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                errorCallbackURL: "/sign-in",
              })
            }
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50"
          >
            <FaGithub className="text-lg" />
            GitHub
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
};

const Alert = ({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) => (
  <div
    className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
      tone === "error"
        ? "border-expense/30 bg-expense/10 text-expense"
        : "border-income/30 bg-income/10 text-income"
    }`}
  >
    {tone === "error" ? (
      <HiOutlineExclamationCircle className="mt-px shrink-0 text-base" />
    ) : (
      <HiOutlineCheckCircle className="mt-px shrink-0 text-base" />
    )}
    <span className="leading-relaxed">{children}</span>
  </div>
);

export const SignInForm = ({
  providers,
}: {
  providers: SocialProvider[];
}) => {
  const params = useSearchParams();
  const requestedRedirect = params.get("redirect");
  const oauthError = params.get("error");
  // Only allow same-origin, absolute paths — never `//evil.com` or a full URL.
  const redirectTo =
    requestedRedirect &&
    requestedRedirect.startsWith("/") &&
    !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNeedsVerification(false);
    setResent(false);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      if (signInError.status === 403) {
        setNeedsVerification(true);
        setError("Please verify your email address before signing in.");
      } else {
        setError(signInError.message ?? "Unable to sign in.");
      }
      setPending(false);
      return;
    }

    // Hard navigation so the server re-renders with the fresh session cookie.
    window.location.assign(redirectTo);
  };

  const resend = async () => {
    setResent(false);
    await authClient.sendVerificationEmail({ email, callbackURL: redirectTo });
    setResent(true);
  };

  return (
    <div className="space-y-5">
      {oauthError && (
        <Alert tone="error">
          Sign-in with the provider failed ({oauthError}). Please try again.
        </Alert>
      )}

      <SocialButtons providers={providers} />

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        {resent && (
          <Alert tone="success">Verification email sent. Check your inbox.</Alert>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`${primaryButton} w-full py-3`}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>

        {needsVerification && (
          <button
            type="button"
            onClick={resend}
            className="w-full cursor-pointer text-xs font-semibold text-accent hover:underline"
          >
            Resend verification email
          </button>
        )}
      </form>
    </div>
  );
};

export const SignUpForm = ({ providers }: { providers: SocialProvider[] }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create your account.");
      setPending(false);
      return;
    }

    setDone(true);
    setPending(false);
  };

  if (done) {
    return (
      <div className="space-y-4">
        <Alert tone="success">
          Account created. We sent a verification link to{" "}
          <span className="font-semibold">{email}</span>. Open it to activate your
          account, then sign in.
        </Alert>
        <a href="/sign-in" className={`${primaryButton} w-full py-3`}>
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SocialButtons providers={providers} />

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}

        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`${primaryButton} w-full py-3`}
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
};
