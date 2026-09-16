import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createApiKey,
  getApiUsage,
  listApiKeys,
  rateLimitForPlan,
  revokeApiKey,
} from "@/lib/api-keys";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const keys = await listApiKeys(user.id);
  const usage = await getApiUsage(user.id);
  const limit = rateLimitForPlan(user.plan);
  const usageByKey = new Map(usage.perKey.map((k) => [k.id, k.requests]));
  const items = keys.map((k) => ({
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    created_at: k.created_at,
    last_used_at: k.last_used_at,
    requests: usageByKey.get(k.id) ?? 0,
  }));
  return NextResponse.json({
    keys: items,
    totalRequests: usage.totalRequests,
    thisMonthRequests: usage.thisMonthRequests,
    rateLimitPerHour: limit,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const keys = await listApiKeys(user.id);
  const keyCount = keys.length;
  const maxKeys = user.plan === "pro" ? 10 : 2;
  if (keyCount >= maxKeys) {
    return NextResponse.json(
      {
        error: `API key limit reached (${maxKeys}). Revoke an existing key or upgrade to Pro for more.`,
      },
      { status: 400 }
    );
  }

  let name: string;
  try {
    const body = await request.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!name || name.length > 60) {
    return NextResponse.json(
      { error: "A key name between 1 and 60 characters is required." },
      { status: 400 }
    );
  }

  const { key, row } = await createApiKey(user.id, name);
  return NextResponse.json(
    {
      key,
      name: row.name,
      prefix: row.prefix,
      message: "Store this key securely — you won't be able to see it again.",
    },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let id: number;
  try {
    const body = await request.json();
    id = Number(body.id);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "A valid key id is required." }, { status: 400 });
  }
  if (!(await revokeApiKey(user.id, id))) {
    return NextResponse.json({ error: "API key not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}