import type { Metadata } from "next";
import VerifyEmailView from "./VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}