import { Resend } from "resend";
import { env, isProduction } from "../config/env.js";
import { logger } from "./logger.js";

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function normalizeOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const resendApiKey = normalizeOptional(env.RESEND_API_KEY);
const mailFrom =
  normalizeOptional(env.MAIL_FROM) ?? "Dev Monir <beth.t@example.com>";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function isMailConfigured(): boolean {
  return Boolean(resend);
}

export function logMailStatus(): void {
  if (!resend) {
    logger.warn(
      "RESEND_API_KEY is missing in server/.env - password reset emails will not send.",
    );
    return;
  }

  logger.info({ from: mailFrom }, "Resend mailer is configured.");
}

function formatMailError(error: unknown): Record<string, unknown> {
  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      name?: unknown;
      statusCode?: unknown;
    };
    return {
      name: record.name,
      message: record.message,
      statusCode: record.statusCode,
    };
  }
  return { message: String(error) };
}

export async function sendMail(input: SendMailInput): Promise<boolean> {
  if (!resend) {
    logger.warn(
      { subject: input.subject, to: input.to },
      "Resend is not configured - email not sent.",
    );
    if (!isProduction && input.text) {
      logger.info({ text: input.text }, "Email body (development only).");
    }
    return false;
  }

  const { data, error } = await resend.emails.send({
    from: mailFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    logger.error(
      { err: formatMailError(error), to: input.to, from: mailFrom },
      "Resend rejected the email. Use a verified MAIL_FROM domain, or send only to the Resend account email when using beth.t@example.com.",
    );
    throw error;
  }

  logger.info(
    { to: input.to, subject: input.subject, id: data?.id },
    "Mail sent via Resend.",
  );
  return true;
}

export function sendPasswordResetEmail(
  to: string,
  resetLink: string,
): Promise<boolean> {
  return sendMail({
    to,
    subject: "Reset your Dev Monir password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin-top: 0;">Reset your password</h2>
        <p>We received a request to reset the password for your Dev Monir account.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block; background:#0f172a; color:#fff; padding:12px 20px; border-radius:9999px; text-decoration:none;">
            Reset password
          </a>
        </p>
        <p>This link is valid for <strong>60 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Reset your password using this link (valid for 60 minutes): ${resetLink}`,
  });
}
