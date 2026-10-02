import { Resend } from "resend";
import { env, isProduction } from "../config/env.js";
import { logger } from "./logger.js";

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendMail(input: SendMailInput): Promise<boolean> {
  if (!resend) {
    logger.info(
      { subject: input.subject, to: input.to },
      "Resend is not configured - email not sent."
    );
    if (!isProduction) {
      logger.info(input.text ?? input.html);
    }
    return false;
  }

  const { error } = await resend.emails.send({
    from: env.MAIL_FROM ?? "",
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    logger.error({ err: error, to: input.to }, "Resend failed to send mail.");
    throw error;
  }

  logger.info({ to: input.to, subject: input.subject }, "Mail sent via Resend.");
  return true;
}

export function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
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
