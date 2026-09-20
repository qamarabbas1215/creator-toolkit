import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/layout/Analytics";
import { SiteShell } from "@/components/layout/SiteShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free Tools for Creators, Writers & Developers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "creator tools",
    "content creator tools",
    "character counter",
    "word counter",
    "AI token calculator",
    "YouTube title generator",
    "SEO tools",
    "JSON formatter",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [{ url: "/logo.webp", width: 256, height: 256, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    images: ["/logo.webp"],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
