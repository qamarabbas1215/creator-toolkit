export type Plan = "free" | "pro";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  plan: Plan;
  created_at: number;
}
