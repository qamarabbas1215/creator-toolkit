import { NextResponse } from "next/server";
import { getUserById } from "@/lib/auth";
import {
  getApiKeyByHash,
  hashApiKey,
  rateLimitForPlan,
  recordApiRequest,
  requestsInWindow,
  touchApiKey,
} from "@/lib/api-keys";
import { apiToolHandlers, isApiTool } from "@/lib/api-tools";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(data, {
    status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!isApiTool(slug)) {
    return json(
      {
        error: `Tool '${slug}' is not available through the API. See GET /api/v1/tools for the list of supported tools.`,
      },
      404
    );
  }

  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return json(
      { error: "Missing X-API-Key header. Create a key in Account settings." },
      401,
      { "WWW-Authenticate": "ApiKey" }
    );
  }

  const keyRow = await getApiKeyByHash(hashApiKey(apiKey));
  if (!keyRow) {
    return json({ error: "Invalid API key." }, 401);
  }

  const user = await getUserById(keyRow.user_id);
  if (!user) {
    return json({ error: "API key owner not found." }, 401);
  }

  const limit = rateLimitForPlan(user.plan);
  const used = await requestsInWindow(keyRow.id);
  if (used >= limit) {
    return json(
      {
        error: `Rate limit exceeded (${limit}/hour). Upgrade to Pro for a higher limit.`,
        limit,
        used,
      },
      429,
      {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "Retry-After": "3600",
      }
    );
  }

  let params: Record<string, unknown>;
  try {
    const body = await request.json();
    params = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  try {
    const result = apiToolHandlers[slug](params);
    await touchApiKey(keyRow.id);
    await recordApiRequest(keyRow.id, slug, 200, request.headers.get("x-forwarded-for"));
    return json({
      ok: true,
      tool: slug,
      result,
      meta: {
        remaining: Math.max(0, limit - used - 1),
        limit,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool execution failed.";
    return json({ error: message }, 400);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}