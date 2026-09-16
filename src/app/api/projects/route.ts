import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createProject, getProjects } from "@/lib/user-data";
import { getTool } from "@/data/tools";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ projects: await getProjects(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let toolSlug: string;
  let title: string;
  let content: string;
  try {
    const body = await request.json();
    toolSlug = typeof body.toolSlug === "string" ? body.toolSlug.trim() : "";
    title = typeof body.title === "string" ? body.title.trim() : "";
    content = typeof body.content === "string" ? body.content : "";
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
  if (content.length > 200_000) {
    return NextResponse.json(
      { error: "Content is too large to save." },
      { status: 400 }
    );
  }
  if (!title) title = "Untitled project";
  if (title.length > 200) title = title.slice(0, 200);

  const project = await createProject(user.id, toolSlug, title, content);
  return NextResponse.json({ project }, { status: 201 });
}