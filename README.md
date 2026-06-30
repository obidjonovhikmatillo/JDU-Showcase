# JDU Showcase — Student Project Portfolio

Multilingual, Dribbble-style student project showcase platform built for JDU university.
Supported languages: **English**, **Uzbek**, **Russian**, and **Japanese** (locale-prefixed routes, e.g. `/en`, `/uz`).

Users can browse and search student projects, view project detail pages with image galleries, like/save projects, and leave comments. Authenticated users can upload their own projects; administrators get a full admin panel for projects, categories, comments, and users.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| i18n | next-intl (URL locale prefix) |
| Database | PostgreSQL + Prisma |
| Auth | Auth.js (credentials) |
| Forms | React Hook Form + Zod |
| Images | Vercel Blob (production) / local `public/uploads/` (dev) |

## Prerequisites

- **Node.js** 20+ (tested with Node 24)
- **npm** 10+
- **PostgreSQL** 14+ (local install, Docker, or hosted)

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and set a valid `DATABASE_URL` for your PostgreSQL instance.

For **production image uploads**, set `BLOB_READ_WRITE_TOKEN` (Vercel Blob). Local dev works without it — uploads are stored in `public/uploads/`.

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
  [locale]/           # Locale-prefixed pages (en, uz, ru, ja)
  api/                 # Route handlers (auth, categories, uploads)
components/          # Shared UI and layout components
  layout/            # Header, footer, page shell
  projects/          # Project cards, modal, gallery, like/save buttons
  comments/          # Comment list and form
  ui/                # shadcn/ui primitives
hooks/               # Custom React hooks
i18n/                # next-intl routing/navigation/request configuration
lib/                 # Utilities, server actions, and shared helpers
messages/            # Translation JSON (en, uz, ru, ja)
prisma/              # Prisma schema and migrations
  schema.prisma      # User, Category, Project, ProjectImage, Comment, CommentImage, ProjectLike, ProjectSave
public/              # Static assets
types/               # Shared TypeScript types
```

## Routes

| Route | Description |
| --- | --- |
| `/[locale]` | Home |
| `/[locale]/projects` | Project discovery — search, category/department filters, pagination |
| `/[locale]/projects/[slug]` | Project detail — gallery, comments, like/save, author card |
| `/[locale]/upload` | Authenticated project upload |
| `/[locale]/login` | Login |
| `/[locale]/register` | Registration |
| `/[locale]/profile` | User profile — own projects, likes, saves, comments |
| `/[locale]/admin` | Admin dashboard |
| `/[locale]/admin/projects` | Admin project management |
| `/[locale]/admin/categories` | Admin category management |
| `/[locale]/admin/comments` | Admin comment moderation |
| `/[locale]/admin/users` | Admin user management |

**API routes:** `/api/auth/[...nextauth]`, `/api/categories`, `/api/uploads`

## Internationalization

Locale is part of the URL path (`/en`, `/uz`, `/ru`, `/ja`) via `next-intl` with `localePrefix: "always"` (see `i18n/routing.ts`). The language switcher in the header navigates between locale-prefixed paths.

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
| `npm run db:seed` | Seed demo users, categories, projects, comments, and images |
| `npm run db:seed:verify` | Verify seeded record counts |

## Authentication

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

The seed is **safe to rerun** — it upserts users, categories, and projects by unique keys and refreshes gallery/comment images without creating duplicates.

### Protected routes

| Route | Access | Enforcement |
| --- | --- | --- |
| `/[locale]/profile` | Authenticated users only | Middleware (`proxy.ts`) redirects guests |
| `/[locale]/admin/*` | `ADMIN` role only | Middleware (`proxy.ts`) redirects non-admins |
| `/[locale]/upload` | Authenticated users only | Client-side redirect for UX; `createUserProject` server action rejects unauthenticated requests server-side |

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

`npm run db:seed` loads realistic demo content:

- 1 administrator and 3 users
- 5 multilingual categories
- 20 projects with author, department, tech stack, and gallery images
- 28 comments with ratings and optional photos

Rerun the command any time to refresh demo content without duplicating records.

| Model | Purpose |
| --- | --- |
| `User` | Accounts with `USER` / `ADMIN` roles and language preference |
| `Category` | Multilingual project categories |
| `Project` | Project listings with descriptions and details |
| `ProjectImage` | Gallery images for a project |
| `Comment` | User comments (rating 1-5 validated in app code) |
| `CommentImage` | Images attached to comments |
| `ProjectLike` | Tracks which users liked which projects |
| `ProjectSave` | Tracks which users saved (bookmarked) which projects |

**Cascade rules**

- Deleting a **project** cascades to its images and comments (and comment images).
- Deleting a **comment** cascades to its comment images.
- Deleting a **user** cascades to their comments.
- Deleting a **category** is blocked while projects reference it (`Restrict`).

**Security**

- Import `prisma` from `@/lib/prisma` for normal queries — `passwordHash` is omitted automatically.
- Use `@/lib/prisma-auth` only inside authentication logic when the password hash is required.

## Remaining work

- Clean up ~20 `no-unused-vars` ESLint warnings across `components/projects/` and `lib/actions/`
- `tests/e2e/*.spec.ts` and `tests/output/*-results.json` still test/describe an earlier restaurant-review template (`restaurants.spec.ts`, `reviews.spec.ts`, `admin-restaurants.spec.ts`) — these need to be rewritten for the actual Project/Comment/Like/Save model, or removed
- Unit tests (`npm run test:unit`) pass (21/21) and are current; `npm run typecheck` and `npm run lint` are clean

## License

University project — internal use for demonstration and coursework.
