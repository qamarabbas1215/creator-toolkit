import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { tools } from "@/data/tools";

const gmailMode =
  Boolean(process.env.GMAIL_USER) &&
  Boolean(process.env.GMAIL_APP_PASSWORD ?? process.env.GMAIL_PASS);

const smtpHost = gmailMode ? "smtp.gmail.com" : process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = gmailMode ? process.env.GMAIL_USER : process.env.SMTP_USER;
const smtpPass = gmailMode
  ? (process.env.GMAIL_APP_PASSWORD ?? process.env.GMAIL_PASS)
  : process.env.SMTP_PASS;
const configuredFrom = process.env.EMAIL_FROM?.trim();
const from =
  configuredFrom ||
  (gmailMode && process.env.GMAIL_USER
    ? `${SITE_NAME} <${process.env.GMAIL_USER}>`
    : `${SITE_NAME} <support@example.com>`);

export function isEmailConfigured(): boolean {
  return Boolean(smtpHost && smtpPass);
}

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  });
}

function baseHtml(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 12px;color:#18181b">${title}</h2>
      ${bodyHtml}
    </div>
  `;
}

const FOOTER =
  '<p style="color:#a1a1aa;font-size:12px;line-height:1.6;margin:24px 0 0">© ' +
  new Date().getFullYear() +
  ` ${SITE_NAME}. You received this email because this address was used on ${SITE_NAME}.</p>`;

async function deliver(email: string, subject: string, text: string, html: string): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email sending is not configured; cannot send email.");
    }
    console.log("[mail] (dev) " + subject + " -> " + email);
    console.log(text);
    return;
  }
  const transporter = createTransporter();
  await transporter.sendMail({ from, to: email, subject, text, html });
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
  const html = baseHtml(
    `Reset your ${SITE_NAME} password`,
    `<p style="color:#52525b;line-height:1.6">Your verification code is:</p>
      <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f4f4f5;text-align:center;font-size:28px;font-weight:700;letter-spacing:6px;color:#18181b">${otp}</p>
      <p style="color:#71717a;font-size:13px;line-height:1.6">Enter this code to choose a new password. It is valid for <strong>10 minutes</strong> and can only be used once. If you didn't request this, you can safely ignore this email.</p>`
  );
  try {
    await deliver(email, subject, text, html);
  } catch (err) {
    if (process.env.NODE_ENV === "production" || isEmailConfigured()) {
      console.error("[mail] Failed to send password reset email.", err);
      throw err;
    }
  }
}

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
  const link = `${SITE_URL.replace(/\/$/, "")}/verify-email?token=${token}`;
  const subject = `Verify your ${SITE_NAME} email`;
  const text = [
    `Hi ${name},`,
    "",
    `Welcome to ${SITE_NAME}! Please confirm your email address to activate your account.`,
    "",
    `Open this link to verify: ${link}`,
    "",
    "This link expires in 24 hours.",
    "If you didn't create an account, you can safely ignore this email.",
  ].join("\n");
  const html = baseHtml(
    `Confirm your ${SITE_NAME} email`,
    `<p style="color:#52525b;line-height:1.6">Hi ${escapeHtml(name)},<br/><br/>Welcome to ${SITE_NAME}! Please confirm your email address to activate your account.</p>
      <p style="margin:24px 0">
        <a href="${escapeAttr(link)}" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:600">Verify my email</a>
      </p>
      <p style="color:#71717a;font-size:13px;line-height:1.6">Or copy and paste this link into your browser:<br/><span style="color:#7c3aed;word-break:break-all">${escapeHtml(link)}</span></p>
      <p style="color:#a1a1aa;font-size:13px">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>${FOOTER}`
  );
  await deliver(email, subject, text, html);
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const subject = `You're in — welcome to ${SITE_NAME} 🎉`;
  const text = [
    `Hi ${name},`,
    "",
    `Your ${SITE_NAME} account is now verified and ready to use.`,
    "",
    `Browse ${tools.length} free tools for creators, writers and developers.`,
    "",
    "Sign in any time at " + SITE_URL,
  ].join("\n");
  const html = baseHtml(
    `You're verified, ${escapeHtml(name)} 🎉`,
    `<p style="color:#52525b;line-height:1.6">Your ${SITE_NAME} account is now verified and ready to use. Explore ${tools.length} tools for creators, writers and developers — free, fast, and private.</p>
      <p style="margin:24px 0">
        <a href="${escapeAttr(SITE_URL.replace(/\/$/, ""))}" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:600">Browse tools</a>
      </p>${FOOTER}`
  );
  await deliver(email, subject, text, html);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;");
}