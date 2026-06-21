# Production deployment (Vercel + Neon/Supabase)

Deploy **TasteGuide** (`cowork-restaurant-reviews`) to Vercel with a hosted PostgreSQL database.

---

## Prerequisites

- [Vercel](https://vercel.com) account
- [Neon](https://neon.tech) or [Supabase](https://supabase.com) PostgreSQL project
- [Cloudinary](https://cloudinary.com) account (required for image uploads in production)
- Git repository connected to Vercel

---

## 1. Create the database

### Neon (recommended)

1. Create a project → copy **connection strings**.
2. Use the **pooled** string for `DATABASE_URL` (host contains `-pooler`).
3. Use the **direct** string for `DIRECT_URL` (no pooler).

### Supabase

1. Project Settings → Database.
2. `DATABASE_URL` → **Transaction pooler** (port `6543`, `?pgbouncer=true`).
3. `DIRECT_URL` → **Session mode** or direct connection (port `5432`).

---

## 2. Cloudinary

1. Cloudinary Console → copy **Cloud name**, **API Key**, **API Secret**.
2. Optional: create upload presets/folders — the app uses server-side signed uploads.

---

## 3. Auth secret

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## 4. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, set for **Production** (and Preview if needed):

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `DATABASE_URL` | Yes | Pooled Postgres URL (Neon pooler / Supabase transaction pooler) |
| `DIRECT_URL` | Yes | Direct Postgres URL for migrations |
| `AUTH_SECRET` | Yes | Output of `openssl rand -base64 32` |
| `AUTH_URL` | Yes | `https://your-app.vercel.app` (no trailing slash) |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as `AUTH_URL` |
| `CLOUDINARY_CLOUD_NAME` | Yes* | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes* | Cloudinary API secret |

\*Required for uploads (reviews, avatars, admin images). Without Cloudinary, uploads fail in production.

**Do not set** `ALLOW_PRODUCTION_SEED` on Vercel.

`VERCEL_URL` is injected automatically; `NEXT_PUBLIC_APP_URL` should still be your canonical domain.

---

## 5. Deploy to Vercel

### Option A — Git integration (recommended)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Vercel → **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: **`web-app`** (this repository is a monorepo; see root `README.md`).
5. Build command (default or from `vercel.json`): `prisma generate && next build`
6. Add environment variables from step 4.
7. Deploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # optional, for local prod debugging
vercel --prod
```

---

## 6. Run database migrations (production)

Run **once** after the first deploy (or after schema changes), from your machine with production env:

```bash
# Load production DATABASE_URL + DIRECT_URL (never commit these)
export DIRECT_URL="postgresql://..."
export DATABASE_URL="postgresql://..."

npm run db:migrate:deploy
```

Or use Neon/Supabase SQL editor only if you cannot run CLI — prefer `prisma migrate deploy`.

---

## 7. Seed production (optional, one-time demo data)

Seeding is **blocked by default** in production. Only run if you want demo restaurants/users:

```bash
export DATABASE_URL="..."
export DIRECT_URL="..."
export AUTH_SECRET="..."
export NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
export AUTH_URL="https://your-app.vercel.app"

npm run db:seed:production
```

This sets `ALLOW_PRODUCTION_SEED=true` internally. Demo logins after seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `Admin123!` |
| User | `user@example.com` | `User123!` |

**Change or remove demo passwords** before a public launch.

Ensure restaurant images exist:

```bash
npm run images:download
```

Commit `public/images/restaurants/` or run the script before deploy.

---

## 8. Validate environment locally

```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app \
AUTH_SECRET=your-secret \
DATABASE_URL=your-url \
npm run validate:env
```

---

## 9. Production verification checklist

After deploy, verify:

### Core

- [ ] `https://your-app.vercel.app/en` loads home page
- [ ] `/uz`, `/ru`, `/ja` locale prefixes work (language switcher)
- [ ] `/en/restaurants` lists seeded restaurants
- [ ] Restaurant detail page loads images from `/images/restaurants/` or Cloudinary
- [ ] Custom 404: open `/en/does-not-exist`

### Auth

- [ ] `/en/login` — login with seed user
- [ ] `/en/profile` — requires auth; shows profile card
- [ ] `/en/admin` — guest → login; user → redirect; admin → dashboard
- [ ] Logout works

### Uploads (Cloudinary)

- [ ] Upload avatar on profile edit
- [ ] Create review with image on restaurant page
- [ ] Admin restaurant image upload

### Metadata

- [ ] Browser tab title and favicon (TG icon)
- [ ] Share link preview (Open Graph) on home and restaurant pages

### Maps / Leaflet

- [ ] Restaurant detail shows **address text** (no embedded map — Leaflet is not bundled yet; T019 fallback by design)

### Errors

- [ ] Trigger a recoverable error shows locale error UI with retry

---

## 10. Local production build

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

E2E tests require a running dev server and seeded DB (`npm run test:e2e`).

---

## 11. Security notes

- Never commit `.env`, `.env.local`, or `.env.production`.
- `.gitignore` ignores all `.env*` except `.env.example`.
- Rotate `AUTH_SECRET` if leaked.
- Use strong DB passwords; restrict Supabase/Neon IP allowlists if needed.
- Remove or change default seed users before public production use.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails: `DIRECT_URL` not found | Add `DIRECT_URL` to Vercel env and local `.env` |
| Auth redirect loop | Ensure `AUTH_URL` and `NEXT_PUBLIC_APP_URL` match deployed HTTPS URL |
| Images 404 on cards | Run `npm run images:download` and redeploy, or re-run `db:seed` |
| Upload fails | Configure all three `CLOUDINARY_*` variables |
| Migrations fail on Neon | Use `DIRECT_URL` (non-pooled) for `prisma migrate deploy` |
| Prisma pool timeouts | Use pooled `DATABASE_URL` for the app; direct only for migrations |

---

## Scripts reference

| Script | Purpose |
|--------|---------|
| `npm run build` | Production Next.js build |
| `npm run postinstall` | `prisma generate` (runs on Vercel install) |
| `npm run db:migrate:deploy` | Apply migrations to production DB |
| `npm run db:seed:production` | Seed production with guard flag |
| `npm run validate:env` | Check required production env vars |
| `npm run images:download` | Download demo restaurant images to `public/` |
