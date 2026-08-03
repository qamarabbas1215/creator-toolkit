import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardView } from "./DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Creator Toolkit dashboard.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <DashboardView user={user} />;
}
