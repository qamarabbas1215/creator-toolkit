import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getFavoriteSlugs,
  getProjects,
  getRecentToolSlugs,
  getTopToolSlugs,
  getUsageStats,
} from "@/lib/user-data";
import { getCategory, getTool } from "@/data/tools";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const [favoriteSlugs, recentSlugs, topTools, stats, projects] = [
    getFavoriteSlugs(user.id),
    getRecentToolSlugs(user.id, 8),
    getTopToolSlugs(user.id, 5),
    getUsageStats(user.id),
    getProjects(user.id),
  ];

  const favorites = favoriteSlugs
    .map((slug) => getTool(slug))
    .filter((tool) => tool !== undefined);

  const recent = recentSlugs
    .map((slug) => getTool(slug))
    .filter((tool) => tool !== undefined);

  const topToolsWithMeta = topTools
    .map((t) => {
      const tool = getTool(t.slug);
      if (!tool) return null;
      const cat = getCategory(tool.category);
      return {
        slug: t.slug,
        runs: t.runs,
        name: tool.name,
        icon: tool.icon,
        categoryName: cat.name,
        color: cat.color,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const projectsSummary = projects.map((p) => {
    const tool = getTool(p.tool_slug);
    return {
      id: p.id,
      toolSlug: p.tool_slug,
      title: p.title,
      content: p.content,
      toolName: tool?.name ?? "Unknown tool",
      toolIcon: tool?.icon ?? "🧰",
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  });

  return NextResponse.json({
    favorites,
    recent,
    topTools: topToolsWithMeta,
    stats: {
      totalRuns: stats.totalRuns,
      distinctTools: stats.distinctTools,
      thisWeekRuns: stats.thisWeekRuns,
      favoritesCount: favorites.length,
      projectsCount: projects.length,
    },
    projects: projectsSummary,
  });
}
