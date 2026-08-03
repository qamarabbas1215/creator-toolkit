<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git workflow
- After every commit, always `git push origin master` so changes are live on GitHub.

# Phase 3 plan (from blueprint + owner decisions)
Order of work: **Dashboard → Tools → API → Browser Extension**
1. **Personal dashboard**: favorites, recent tools, saved projects (cloud), usage analytics — uses existing accounts backend.
2. **Tools**: close the gap from ~93 to 150+ (developer formatters, writing tools, YouTube/SEO/social generators, image prompt tools). Reuse `Card/Textarea/OutputArea` primitives.
3. **Public Tools API (v1)**: REST API with API keys + rate limits; Pro monetization.
4. **Browser extension**: lightweight Manifest V3 wrapper (defer to end of phase).

# Deployment / data layer decisions
- Keep **SQLite (`node:sqlite`) + custom auth** for dev and Phase 1/2.
- For Phase 3 cloud features (sync, projects, subscriptions): **migrate to PostgreSQL (Neon or Supabase)**.
- Production Phase 3 target: **Vercel + Neon PostgreSQL**.
- Keep the data layer **modular**: isolate DB access behind small modules (see `src/lib/db.ts`, `src/lib/auth.ts`) and avoid SQLite-specific SQL where possible to make the Postgres migration straightforward.


