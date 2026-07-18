# ethjkt platform — build handoff

Member platform built on top of the landing page: **Identity Hub + Testnet Faucet + Agent Chat**,
sharing one wallet (SIWE) identity. Full design/decision record: `~/.claude/plans/ok-look-at-luma-vectorized-umbrella.md`.

## Stack
SvelteKit (adapter-node) · drizzle-orm + Railway Postgres · Reown AppKit + wagmi (SIWE) ·
arctic (Discord/X OAuth) · viem (faucet) · @anthropic-ai/sdk (chat, model `claude-sonnet-4-6`).

## Routes
- Public: `/`, `/events` (Lu.ma), `/login` (wallet connect + SIWE)
- 🔒 login-gated `(app)`: `/verify` (Identity Hub), `/faucet` (gas tanks), `/chat` (agent)
- API: `/api/auth/{nonce,verify,logout}`, `/api/link/{luma,instagram}/{challenge,verify}`,
  `/api/faucet/claim`, `/api/chat`; OAuth `/auth/{discord,x}` + `/callback`

## Status — what works NOW
- ✅ **DB live on Railway** (project `ethjkt`, Postgres 18). Migrated: `users, linked_accounts, sessions, faucet_claims`.
  Connection string is in local `.env` (gitignored) as `DATABASE_URL` (public proxy). `bun run db:migrate` applies migrations.
- ✅ **SIWE login** end-to-end verified (nonce → sign → session row). `PUBLIC_REOWN_PROJECT_ID` set.
- ✅ **Discord OAuth linking** works. Captures username, avatar (`.png`), `is_member`, roles snapshot, nick into
  `linked_accounts.metadata`. Guild id set (`DISCORD_GUILD_ID=1129078950589628476`).
- ✅ **Luma + Instagram** bio-nonce linking (no keys needed).
- ✅ `bun run check` / `bun test` (13) / `bun run build` all green.
- Dev server pinned to **port 5180** (`bun run dev`). OAuth redirect URIs must use `http://localhost:5180/...`.

## ⏳ PENDING — pick up here

### 1. Finish live Discord roles (IN PROGRESS — code done, needs token)
Code is written & typechecking: `src/lib/server/discord/guild.ts` (bot-token live roles + names + colors, 60s cache),
`(app)/verify/+page.server.ts` (loads live roles), `/verify` UI (clickable "N roles" → expands names + color dots).
Live = updates on page refresh. Falls back to snapshot count when no bot token.
**TODO to activate:**
- Create a bot on the Discord app → copy token → **enable Server Members Intent**.
- Invite bot to ethjkt server (OAuth2 URL Generator, scope `bot`, no perms).
- Put `DISCORD_BOT_TOKEN=...` in `.env`, **restart `bun run dev`**, refresh `/verify`.
- Also: after guild id was set, user should hit **Reconnect** on Discord once so `is_member`/snapshot roles populate.

### 2. Wire the remaining providers/features (need external creds → put in `.env`)
- **X OAuth**: `X_CLIENT_ID`, `X_CLIENT_SECRET` (X dev portal → OAuth 2.0). Redirect `http://localhost:5180/auth/x/callback`.
- **Chat**: `ANTHROPIC_API_KEY`.
- **Faucet dispense**: `FAUCET_PK_SEPOLIA`, `FAUCET_PK_BASE_SEPOLIA` (funded testnet hot wallets). RPCs default in `.env`.
- **Auto-refill ("water pump")**: `CHAINSTACK_API_KEY` + collector wallet ≥0.08 mainnet ETH. `refill.ts` source exists;
  the scheduler/cron is NOT wired yet (deferred). See plan Appendix A for Sepolia sourcing.
- **X follow check**: `X_FOLLOW_CHECK` flag; currently honor-system stub returning `unknown` (deferred, fragile by design).

### 3. Deployment (Railway) — not done
Add an app service to the `ethjkt` Railway project (adapter-node build), set all env vars + `DATABASE_URL`
(internal `.railway.internal` URL for the app), run `drizzle-kit migrate` on deploy, register prod OAuth redirect URIs.

## Notes / gotchas
- Env changes require a dev-server **restart** (SvelteKit reads env at boot).
- `.env` is gitignored — real secrets live only there, never commit them.
- Discord avatars: always use `.png` (the `.gif` form 415s for some animated avatars).
- Discord role IDs → names/colors requires the bot token (item 1).
- Foundation contracts other modules import: `$lib/server/{db,link,ip}`, `$lib/server/auth/{session,siwe}`.
