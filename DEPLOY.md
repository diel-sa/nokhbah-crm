# Nokhbah CRM — Vercel deployment guide

## Architecture

| Vercel project | Root directory | Build command | Output | Domain |
| --- | --- | --- | --- | --- |
| `nokhbah-crm-app` | `apps/app` | `cd ../.. && bun install && bun run --filter=app build` | Next.js | `crm.nokhbah.sa` |
| `nokhbah-crm-api` | `apps/api` | `cd ../.. && bun install && bun run --filter=api build` | `dist/main.js` (Serverless Function) | `api.crm.nokhbah.sa` |
| `nokhbah-crm-agent` | `apps/agent` | `cd ../.. && bun install && bun run --filter=agent build` | eve sandbox | not exposed directly |

## Important constraints

- **Do not regenerate `apps/api/src/generated/server.ts` on Vercel.** It is checked in and tied to the GLIBC of the build machine. The build command above only runs `bun run build` (which does not regenerate it). If `nestjs-trpc generate` is needed, run it locally and commit.
- **Hobby cron limit:** Vercel Hobby runs cron jobs at most once per day, but `vercel.json` currently has `*/5` for mailbox sync. On Hobby this will fail silently or be downgraded. Use an external cron service (cron-job.org) hitting `POST https://api.crm.nokhbah.sa/internal/sync/mailboxes` with `Authorization: Bearer <CRON_SECRET>` every 5 minutes, plus the daily retention sweep.
- **Agent project:** `eve build` produces a production eve bundle. The Agent is reached from the app via the `/eve/v1` proxy route and the `AGENT_BRIDGE_SECRET`. Ensure `AGENT_URL` is set on the app + api projects to the agent project's internal function URL.

## Environment variables

### Shared (all three projects)
- `BETTER_AUTH_SECRET` — same value everywhere
- `AGENT_BRIDGE_SECRET` — same value everywhere
- `DATABASE_URL` — Neon pooled connection string
- `DIRECT_DATABASE_URL` — Neon direct connection string (for migrations)

### App project (`crm.nokhbah.sa`)
- `NEXT_PUBLIC_API_URL` = `https://api.crm.nokhbah.sa`
- `APP_URL` = `https://crm.nokhbah.sa`
- `API_URL` = `https://api.crm.nokhbah.sa`
- `AUTH_COOKIE_DOMAIN` = `.nokhbah.sa`

### API project (`api.crm.nokhbah.sa`)
- `APP_URL` = `https://crm.nokhbah.sa`
- `API_URL` = `https://api.crm.nokhbah.sa`
- `AUTH_COOKIE_DOMAIN` = `.nokhbah.sa`
- `ALLOWED_SIGN_IN` = `nokhbah.sa,nokhbah.diel@gmail.com`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CRON_SECRET`
- `REDIS_URL` — strongly recommended for production; use Upstash Redis via Vercel Marketplace

### Agent project
- `DATABASE_URL`
- `PERPLEXITY_API_KEY`
- `GITHUB_TOKEN`
- `AI_GATEWAY_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `AGENT_BRIDGE_SECRET`

## DNS (Cloudflare or wherever nokhbah.sa is managed)

Add two CNAME/A records pointed at Vercel:
- `crm` → `cname.vercel-dns.com` (or A record to Vercel anycast IP if CNAME not possible at apex)
- `api` → `cname.vercel-dns.com`

In Vercel dashboard → each project → Domains, add:
- `crm.nokhbah.sa` to the app project
- `api.crm.nokhbah.sa` to the api project

## First sign-in

1. Paste Context API key at Settings → General.
2. Sign in with Microsoft (primary) or Google (backup).
3. Connect mailboxes via Settings → Microsoft / Google.
4. Verify cron-job.org sync calls are returning 200.
