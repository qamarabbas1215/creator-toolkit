import { NextResponse } from "next/server";
import { API_TOOL_SLUGS } from "@/lib/api-tools";
import { getTool } from "@/data/tools";

export const dynamic = "force-static";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function GET() {
  const items = API_TOOL_SLUGS.map((slug) => {
    const meta = getTool(slug);
    return {
      slug,
      name: meta?.name ?? slug,
      category: meta?.category ?? null,
      description: meta?.description ?? null,
    };
  });
  return NextResponse.json(
    {
      version: "v1",
      count: items.length,
      tools: items,
    },
    { headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
