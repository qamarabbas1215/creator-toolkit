import nodemailer from "nodemailer";
import { SITE_NAME } from "@/data/site";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM ?? `${SITE_NAME} <no-reply@creator-toolkit.com>`;

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  if (!smtpHost) {
    console.log(`[password-reset] RESET LINK for ${email}: ${resetUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  });

  const subject = `Reset your ${SITE_NAME} password`;
  await transporter.sendMail({
    from,
    to: email,
    subject,
    text: [
      `We received a request to reset the password for your ${SITE_NAME} account.`,
      "",
      `Open this link to choose a new password:`,
      resetUrl,
      "",
      "This link is valid for 1 hour and can only be used once.",
      "If you didn't request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#18181b">Reset your ${SITE_NAME} password</h2>
        <p style="color:#52525b;line-height:1.6">We received a request to reset the password for your account. Open the link below to choose a new password:</p>
        <p style="margin:24px 0"><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#7c3aed;color:#fff;text-decoration:none;font-weight:600">Choose a new password</a></p>
        <p style="color:#71717a;font-size:13px;line-height:1.6">This link is valid for <strong>1 hour</strong> and can only be used once. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
