# TasteGuide — Cowork Restaurant Reviews

Multilingual restaurant review platform built for the Cowork university project.  
Supported languages: **English**, **Uzbek**, **Russian**, and **Japanese**.

This repository includes **Phase 1** (UI shell), **Phase 2** (PostgreSQL + Prisma), and **Phase 3** (Auth.js authentication). Restaurant CRUD, maps, and image uploads are planned for later phases.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| i18n | next-intl |
| Database | PostgreSQL + Prisma |
| Auth | Auth.js (credentials) |
| Forms | React Hook Form + Zod |
| Maps (planned) | Leaflet + OpenStreetMap |
| Images (planned) | Cloudinary |

## Prerequisites

- **Node.js** 20+ (tested with Node 24)
- **npm** 10+
- **PostgreSQL** 14+ (local install, Docker, or hosted)

## Getting started

### 1. Clone and install

```bash
cd cowork-restaurant-reviews/web-app
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and set a valid `DATABASE_URL` for your PostgreSQL instance.

### 3. Database setup (Prisma)

**Option A — existing PostgreSQL server**

Set `DATABASE_URL` in `.env`, then:

```bash
npm run db:generate
npm run db:migrate
```

When prompted, enter a migration name such as `init`.

**Option B — embedded PostgreSQL (no system install required)**

If PostgreSQL is not installed locally, start an embedded server:

```bash
node scripts/start-postgres.mjs
```

Leave that terminal open, then in another terminal run:

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

Verify tables:

```bash
node scripts/verify-db.mjs
```

Apply migrations in production or CI:

```bash
npm run db:migrate:deploy
```

Other useful commands:

```bash
npm run db:format      # Format schema.prisma
npm run db:validate    # Validate schema
npm run db:push        # Push schema without migration files (prototyping only)
npm run db:studio      # Open Prisma Studio
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Project structure

```
app/                 # Next.js App Router pages and layout
components/          # Shared UI and layout components
  layout/            # Header, footer, page shell
  ui/                # shadcn/ui primitives
hooks/               # Custom React hooks
i18n/                # next-intl request configuration
lib/                 # Utilities and shared helpers
messages/            # Translation JSON (en, uz, ru, ja)
prisma/              # Prisma schema and migrations
  schema.prisma      # User, Category, Restaurant, Review models
public/              # Static assets
types/               # Shared TypeScript types
```

## Routes (Phase 1 placeholders)

| Route | Description |
| --- | --- |
| `/` | Home |
| `/restaurants` | Restaurant listing |
| `/restaurants/[slug]` | Restaurant detail |
| `/login` | Login |
| `/register` | Registration |
| `/profile` | User profile |
| `/admin` | Admin dashboard |

## Internationalization

Locale is stored in a `locale` cookie (`en`, `uz`, `ru`, `ja`). Use the language switcher in the header to change languages. URL paths stay the same in Phase 1; locale-prefixed routing may be added later.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Verify Prettier formatting |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:format` | Format `schema.prisma` |
| `npm run db:validate` | Validate Prisma schema |
| `npm run db:migrate` | Create and apply a dev migration |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:push` | Push schema without migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo users, categories, restaurants, reviews, and images |
| `npm run db:seed:verify` | Verify seeded record counts |

## Authentication (Phase 3)

Auth.js credentials provider with bcrypt password hashing.

### Demo credentials

Seed the database first:

```bash
npm run db:seed
```

Verify seeded data:

```bash
npm run db:seed:verify
npm run db:studio
```

| Role | Email | Password |
| --- | --- | --- |
| **ADMIN** | `admin@example.com` | `Admin123!` |
| **USER** | `user@example.com` | `User123!` |
| **USER** | `aziza@example.com` | `User123!` |
| **USER** | `kenji@example.com` | `User123!` |

The seed is **safe to rerun** — it upserts users, categories, and restaurants by unique keys and refreshes gallery/review images without creating duplicates.

### Protected routes

| Route | Access |
| --- | --- |
| `/profile` | Authenticated users only |
| `/admin` | `ADMIN` role only |

Protection is enforced in **middleware** and **server page guards** — not just in the UI.

### Auth environment variables

```env
AUTH_SECRET="your-random-secret"
AUTH_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -base64 32
```

## Database seed data

`npm run db:seed` loads realistic Tashkent demo content:

- 1 administrator and 3 users
- 8 multilingual categories
- 12 restaurants with geo coordinates, opening hours, and gallery images
- 20 reviews with optional review photos

Rerun the command any time to refresh demo content without duplicating records.

| Model | Purpose |
| --- | --- |
| `User` | Accounts with `USER` / `ADMIN` roles and language preference |
| `Category` | Multilingual restaurant categories |
| `Restaurant` | Restaurant listings with geo coordinates and descriptions |
| `RestaurantImage` | Gallery images for a restaurant |
| `Review` | User reviews (rating 1–5 validated in app code) |
| `ReviewImage` | Images attached to reviews |

**Cascade rules**

- Deleting a **restaurant** cascades to its images and reviews (and review images).
- Deleting a **review** cascades to its review images.
- Deleting a **user** cascades to their reviews.
- Deleting a **category** is blocked while restaurants reference it (`Restrict`).

**Security**

- Import `prisma` from `@/lib/prisma` for normal queries — `passwordHash` is omitted automatically.
- Use `@/lib/prisma-auth` only inside authentication logic when the password hash is required.

## Next phases

- Restaurant CRUD, reviews, and image uploads
- Leaflet maps and admin panel
- Production deployment configuration

## License

University project — internal use for demonstration and coursework.
