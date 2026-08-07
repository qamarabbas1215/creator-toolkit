import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteProject, updateProject } from "@/lib/user-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  let body: { title?: unknown; content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fields: { title?: string; content?: string } = {};
  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: "Title cannot be empty." },
        { status: 400 }
      );
    }
    fields.title = title.slice(0, 200);
  }
  if (body.content !== undefined) {
    const content = typeof body.content === "string" ? body.content : "";
    if (content.length > 200_000) {
      return NextResponse.json(
        { error: "Content is too large to save." },
        { status: 400 }
      );
    }
    fields.content = content;
  }

  const project = updateProject(user.id, projectId, fields);
  if (!project) {
    return NextResponse.json(
      { error: "Project not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ project });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  const ok = deleteProject(user.id, projectId);
  if (!ok) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
