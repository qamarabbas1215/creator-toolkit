import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getFavoriteSlugs,
  removeFavorite,
  toggleFavorite,
} from "@/lib/user-data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ slugs: getFavoriteSlugs(user.id) });
}

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

  const favorited = toggleFavorite(user.id, toolSlug);
  return NextResponse.json({ favorited, slugs: getFavoriteSlugs(user.id) });
}

export async function DELETE(request: Request) {
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

  if (!toolSlug) {
    return NextResponse.json(
      { error: "A valid tool slug is required." },
      { status: 400 }
    );
  }

  removeFavorite(user.id, toolSlug);
  return NextResponse.json({ favorited: false, slugs: getFavoriteSlugs(user.id) });
}
