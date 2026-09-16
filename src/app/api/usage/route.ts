import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordToolUsage } from "@/lib/user-data";
import { getTool } from "@/data/tools";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let toolSlug: string;
  try {
    const body = await request.json();
    toolSlug = typeof body.toolSlug === "string" ? body.toolSlug.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!toolSlug || toolSlug.length > 120) {
    return NextResponse.json(
      { error: "A valid tool slug is required." },
      { status: 400 }
    );
  }
  if (!getTool(toolSlug)) {
    return NextResponse.json(
      { error: "Unknown tool slug." },
      { status: 400 }
    );
  }

  await recordToolUsage(user.id, toolSlug);
  return NextResponse.json({ ok: true });
}