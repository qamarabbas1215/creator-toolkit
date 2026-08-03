import { NextResponse } from "next/server";
import {
  getUserById,
  getCurrentUser,
  hashPassword,
  updateUserPassword,
  verifyPassword,
} from "@/lib/auth";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { currentPassword?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const row = getUserById(user.id);
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return NextResponse.json(
      { error: "Your current password is incorrect." },
      { status: 401 }
    );
  }

  updateUserPassword(user.id, await hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
