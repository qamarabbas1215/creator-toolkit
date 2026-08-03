import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "./AccountSettings";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your Creator Toolkit account.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <AccountSettings user={user} />;
}
