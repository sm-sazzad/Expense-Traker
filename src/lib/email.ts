import nodemailer, { type Transporter } from "nodemailer";

type MailConfig = { host: string; user: string; pass: string; gmail: boolean };

// Explicit SMTP wins; otherwise fall back to a Gmail app-password pair
// (`GMAIL_USER` + `GMAIL_APP_PASSWORD`) so that config just works. Empty
// values count as unset.
const credentials: MailConfig | null = (() => {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  if (smtpHost && smtpUser && smtpPass) {
    return { host: smtpHost, user: smtpUser, pass: smtpPass, gmail: false };
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
  if (gmailUser && gmailPass) {
    return { host: "smtp.gmail.com", user: gmailUser, pass: gmailPass, gmail: true };
  }

  return null;
})();

const port = Number(process.env.SMTP_PORT ?? 587);

// Gmail only lets you send as the authenticated account (or a verified alias),
// so don't use a custom `SMTP_FROM` with the Gmail fallback.
const from = credentials?.gmail
  ? `Expensely <${credentials.user}>`
  : process.env.SMTP_FROM?.trim() ||
    (credentials ? `Expensely <${credentials.user}>` : "Expensely <no-reply@expensely.app>");

export const isEmailConfigured = Boolean(credentials);

const transporter: Transporter | null = credentials
  ? nodemailer.createTransport({
      host: credentials.host,
      port,
      secure: port === 465,
      auth: { user: credentials.user, pass: credentials.pass },
    })
  : null;

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async ({ to, subject, text, html }: MailInput) => {
  if (!transporter) {
    // Dev fallback: without SMTP the link still has to reach the developer.
    console.warn(
      `\n[email] SMTP is not configured — email NOT sent.\n  to: ${to}\n  subject: ${subject}\n  ${text}\n`,
    );
    return;
  }

  await transporter.sendMail({ from, to, subject, text, html });
};
