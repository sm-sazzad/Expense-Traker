import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const appUrl = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000";

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    : undefined;

const github =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    : undefined;

const emailShell = (heading: string, body: string, url: string, cta: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:32px;background:#0b0b10;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#15151d;border:1px solid #272734;border-radius:16px;padding:32px;">
      <p style="margin:0 0 24px;font-size:18px;font-weight:600;color:#f4f4f8;">Expensely</p>
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#f4f4f8;">${heading}</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#9696a8;">${body}</p>
      <a href="${url}" style="display:inline-block;background:#8b5cf6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:12px;">${cta}</a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9696a8;">
        Button not working? Copy this link into your browser:<br />
        <span style="color:#8b5cf6;word-break:break-all;">${url}</span>
      </p>
    </div>
  </body>
</html>`;

export const auth = betterAuth({
  appName: "Expensely",
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [appUrl],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your Expensely password",
        text: `Reset your password: ${url}`,
        html: emailShell(
          "Reset your password",
          "Click the button below to choose a new password. If you did not request this, you can ignore this email.",
          url,
          "Reset password",
        ),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email — Expensely",
        text: `Verify your email: ${url}`,
        html: emailShell(
          "Verify your email",
          `Welcome to Expensely${user.name ? `, ${user.name}` : ""}! Confirm this address to activate your account.`,
          url,
          "Verify email",
        ),
      });
    },
  },
  socialProviders: {
    ...(google ? { google } : {}),
    ...(github ? { github } : {}),
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;

/** Providers that actually have credentials configured, for the sign-in UI. */
export const enabledSocialProviders: Array<"google" | "github"> = [
  ...(google ? (["google"] as const) : []),
  ...(github ? (["github"] as const) : []),
];
