export const SITE_NAME = "Creator Toolkit";
export const SITE_TAGLINE =
  "Free tools for creators, writers, YouTubers and developers";
export const SITE_DESCRIPTION =
  "Creator Toolkit is the all-in-one toolbox for content creators. Free character counters, word counters, AI token estimators, YouTube title generators, SEO tools, JSON formatters and more — fast, private, and built to run in your browser.";
const DEV_SITE_URL = `http://localhost:${process.env.PORT ?? 3000}`;
const PRODUCTION_SITE_URL = "https://creator-toolkit-smoky.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return explicit || DEV_SITE_URL;
  }

  if (explicit && !isTestHost(explicit)) {
    return explicit;
  }

  const vercelProject = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProject) {
    return `https://${vercelProject.replace(/^https?:\/\//, "")}`;
  }

  const vercelDeployment = process.env.VERCEL_URL?.trim();
  if (vercelDeployment && !isTestHost(vercelDeployment)) {
    return `https://${vercelDeployment.replace(/^https?:\/\//, "")}`;
  }

  return PRODUCTION_SITE_URL;
}

function isTestHost(url: string): boolean {
  return /(^|\.)localhost$|(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(new URL(url).hostname);
}

export const SITE_URL = resolveSiteUrl();
export const SITE_SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com";
export const SITE_TWITTER = "@creatortoolkit";
