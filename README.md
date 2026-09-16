# Creator Toolkit

Free tools for creators, writers, YouTubers and developers — all-in-one toolbox with 150+ utilities: word counters, AI token estimators, YouTube title generators, SEO tools, JSON formatters and more.

## Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript strict, Tailwind CSS 4)
- **Database**: dual-mode async adapter (`src/lib/db.ts`)
  - **SQLite** (`node:sqlite`) — default for dev, zero config (Phase 1/2)
  - **PostgreSQL** (Neon/Supabase via `@neondatabase/serverless`) — set `DATABASE_URL` to enable (Phase 3+)
- **Auth**: custom email/password sessions (signed HMAC session cookies), no external auth provider
- **Email**: nodemailer (smtp transport configurable via `SMTP_*` env vars)
- **API**: public Tools API v1 with API-key auth + rate limits
- **Tests**: Vitest (`npm test`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (defaults to `http://localhost:3000`) |
| `DATABASE_URL` | Postgres connection string. If unset, SQLite (`node:sqlite`) is used automatically |
| `APP_SECRET` | HMAC secret for session cookies + API key hashing. **Required in production.** A random one is generated for dev |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Outbound email (verification, password reset) |

### Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve production build
npm run lint     # eslint
npm test         # vitest
```

## Public Tools API (v1)

Every deterministic tool in the app is callable over HTTP. Authenticate with an `X-API-Key` header (create keys in the Account page → API Keys).

- `GET /api/v1/tools` — list all tools: `{ version, count, tools: [{ slug, name, category, description }] }`
- `POST /api/v1/tools/{slug}/run` — run a tool with JSON `params`, returns `{ ok, tool, result, meta: { remaining, limit } }`

Auth/usage are enforced via rows in the SQLite/Postgres DB.

```
POST /api/v1/tools/word-counter/run
X-API-Key: ctk_…

{ "input": "hello world" }
```

Errors: `401` (missing/invalid key), `404` (unknown tool), `429` (rate limit), `400` (bad params `{ error: "..." }`).

Rate limits by plan: **free 60 req/hour, Pro 1000 req/hour**. Free accounts can hold 2 API keys, Pro 10.

> File/PDF/OCR-converter and local-storage tools (`pdf-merge`, `ocr`, `prompt-history`, …) run entirely in the browser and are intentionally excluded from the API.

## Browser extension

A lightweight Manifest V3 wrapper in `browser-extension/` that runs tools from the popup against the Public API:

1. Go to `chrome://extensions`, enable Developer mode → **Load unpacked** → select `browser-extension/`.
2. Open the extension → **API key** → create a key on the web app (Account → API Keys) and paste it in the extension's Options page.
3. Pick a tool, paste input, hit **Run tool**.

The default `SITE_URL` is `http://localhost:3000` — change it in the Options page (or edit `src/options.js`) once deployed.

## Data layer notes

DB access is isolated behind `src/lib/db.ts` (`queryRun` / `queryOne` / `queryAll`) plus small modules (`auth.ts`, `api-keys.ts`, `user-data.ts`, `rate-limit.ts`). SQL is kept portable so the SQLite → Postgres migration stays mechanical: set `DATABASE_URL` and the schema is created automatically on first run.

## Roadmap

See `AGENTS.md` — Phase 3 covers a personal dashboard (favorites, saved projects, analytics), expanding the tool set, the Public Tools API (shipped), and browser integration (shipped).