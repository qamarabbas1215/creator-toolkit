import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { SITE_NAME } from "@/data/site";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM ?? `${SITE_NAME} <no-reply@creator-toolkit.com>`;

export function isEmailConfigured(): boolean {
  return Boolean(smtpHost);
}

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  });
}

export async function sendPasswordResetOtp(email: string, otp: string): Promise<void> {
  const subject = `Your ${SITE_NAME} verification code`;
  const text = [
    `Your ${SITE_NAME} password reset code is:`,
    "",
    otp,
    "",
    "Enter this code to choose a new password.",
    "It is valid for 10 minutes and can only be used once.",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");
  const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#18181b">Reset your ${SITE_NAME} password</h2>
        <p style="color:#52525b;line-height:1.6">Your verification code is:</p>
        <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f4f4f5;text-align:center;font-size:28px;font-weight:700;letter-spacing:6px;color:#18181b">${otp}</p>
        <p style="color:#71717a;font-size:13px;line-height:1.6">Enter this code to choose a new password. It is valid for <strong>10 minutes</strong> and can only be used once. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

  if (!smtpHost) {
    if (process.env.NODE_ENV === "production") {
      console.error("[mail] SMTP_HOST is not configured; cannot send password reset email.");
    } else {
      console.log(`[password-reset] OTP for ${email}: ${otp}`);
    }
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({ from, to: email, subject, text, html });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      console.error("[mail] Failed to send password reset email.", err);
      throw err;
    }
    console.error("[mail] Failed to send email (dev). Falling back to console.", err);
    console.log(`[password-reset] OTP for ${email}: ${otp}`);
  }
}
