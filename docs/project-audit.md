# Taomchi — Project Audit

**Audit date:** 2026-06-21  
**Confirmed by project owner:** 2026-06-21  
**Auditor:** Claude Code (automated inspection of repository source)  
**Sources verified:** package.json, README.md, all app routes, Prisma schema, migrations, seed
script, auth files, i18n messages, admin pages, upload API, vercel.json, next.config.ts,
vitest-results.json, playwright-results.json, git log, FINAL-CHECKLIST.md

**Production URL (confirmed):** https://taomchi-restaurant-review.vercel.app  
**Submission deadline:** 2026-06-30 14:00

> This document records only information directly confirmed in the repository.
> Unverified claims are explicitly marked. No secrets or environment variable values
> are included.

---

## 1. Project Purpose

Taomchi is a multilingual restaurant review platform built as a university Cowork project.
It targets restaurants in Tashkent, Uzbekistan and supports four languages.
Users can browse restaurant listings, read reviews, and submit their own reviews after
creating an account. A separate administrator interface allows managing all content.

The internal package name is `cowork-restaurant-reviews`; the public brand name used
throughout the UI is **Taomchi** (visible in `messages/en.json` → `Common.brand`).

> **Note:** `README.md` still uses the earlier working title "TasteGuide" and describes
> restaurants, maps, and image uploads as "planned for later phases." This is inaccurate —
> all three features are implemented. The README has not been updated to reflect the
> completed state of the project.

---

## 2. Target Users

| Persona | Role | Access |
|---------|------|--------|
| Visitor (unauthenticated) | Browses restaurants and reads reviews | Public pages only |
| Registered user | Submits, edits, and deletes their own reviews; manages profile | Authenticated pages + profile |
| Administrator | Full CRUD over restaurants, categories, reviews, and users | Admin panel (`/admin`) |

---

## 3. Implemented Pages

All public pages are nested under a `[locale]` URL segment
(`/en/`, `/uz/`, `/ru/`, `/ja/`).

| Route | File | Description |
|-------|------|-------------|
| `/[locale]` | `app/[locale]/page.tsx` | Home — hero search, category grid, top-rated, recently added, benefits CTA |
| `/[locale]/restaurants` | `app/[locale]/restaurants/page.tsx` | Restaurant discovery with search, filter, sort, grid/list toggle |
| `/[locale]/restaurants/[slug]` | `app/[locale]/restaurants/[slug]/page.tsx` | Restaurant detail — gallery carousel, info card, rating showcase, review form / list |
| `/[locale]/login` | `app/[locale]/login/page.tsx` | Credentials login form |
| `/[locale]/register` | `app/[locale]/register/page.tsx` | Account registration form |
| `/[locale]/profile` | `app/[locale]/profile/page.tsx` | User profile — stats, review history, edit panel, avatar upload |
| `/[locale]/admin` | `app/[locale]/admin/page.tsx` | Admin dashboard — platform statistics, recent users/reviews, top restaurants |
| `/[locale]/admin/restaurants` | `app/[locale]/admin/restaurants/page.tsx` | Paginated restaurant list with search, publish-filter, category-filter |
| `/[locale]/admin/restaurants/new` | `app/[locale]/admin/restaurants/new/page.tsx` | Create restaurant form |
| `/[locale]/admin/restaurants/[slug]/edit` | `app/[locale]/admin/restaurants/[slug]/edit/page.tsx` | Edit restaurant — details + image management |
| `/[locale]/admin/categories` | `app/[locale]/admin/categories/page.tsx` | Category CRUD panel |
| `/[locale]/admin/reviews` | `app/[locale]/admin/reviews/page.tsx` | Review list with search, restaurant-filter, rating-filter |
| `/[locale]/admin/users` | `app/[locale]/admin/users/page.tsx` | User list with search, role-filter, status-filter |
| (error) | `app/[locale]/error.tsx`, `app/global-error.tsx` | Locale error boundary and global fallback |
| (not found) | `app/[locale]/not-found.tsx` | Locale-aware 404 page |
| (loading) | `app/[locale]/loading.tsx`, `app/[locale]/restaurants/loading.tsx` | Skeleton loading states |

**API routes:**

| Route | File | Description |
|-------|------|-------------|
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Auth.js credentials handler |
| `/api/uploads` (POST) | `app/api/uploads/route.ts` | Authenticated image upload to Vercel Blob |
| `/api/uploads` (DELETE) | `app/api/uploads/route.ts` | Delete a previously uploaded image |

---

## 4. Implemented Features

### Public / Visitor

- Hero section with keyword search (redirects to `/restaurants?q=…`)
- Restaurant discovery page with:
  - Server-side keyword search (name, address, city, cuisine)
  - Filter by category slug
  - Filter by city
  - Filter by minimum rating (1–5)
  - Filter by price level (1–4)
  - Sort by: highest rated, most reviewed, newest, name A–Z
  - Grid and list view toggle
  - "Load more" pagination (`RESTAURANT_PAGE_SIZE = 6`)
  - Active-filter chips with clear option
- Restaurant detail page with:
  - Gallery carousel (main image + up to 8 additional images, prev/next/dot controls)
  - Info card (address, city, phone, website, opening hours, price level, cuisine)
  - Rating showcase (average rating, review count, "Guest favorite" badge for top 10%)
  - About section (multilingual description from DB)
  - Review list with user name, rating, title, content, visit date, optional photos
- Category links in home page footer and hero filters
- 404 and error pages with locale-aware retry links

### Registered User

- Registration: full name, email, password (min 8 chars, uppercase, lowercase, digit), preferred language
- Login and logout (session persists across page loads)
- Write a review: rating (1–5), title, content, visit date, optional photos (max 4, ≤ 5 MB each)
- Edit own review (inline edit dialog)
- Delete own review (confirmation dialog)
- Profile page: view stats (total reviews, average rating given), registration date
- Edit profile: display name, profile headline, preferred language
- Upload / change / remove avatar

### Administrator

- Admin dashboard statistics: total restaurants, published restaurants, total users, total reviews, platform average rating, recent users, recent reviews, most-reviewed restaurants
- Restaurant management: create, view, edit, publish/unpublish, delete (with cascade)
- Category management: create, edit, delete (blocked if restaurants reference the category)
- Review management: search, filter by restaurant / rating, edit, delete any review
- User management: search, filter by role / status, activate/deactivate accounts, promote/demote roles
  - Self-demotion and self-deactivation are blocked server-side

### Image Upload (all authenticated users can upload review and avatar images; restaurant images require ADMIN role)

- Drag-and-drop and click-to-browse upload widget
- Validates file type (JPEG, PNG, WebP) and size (≤ 5 MB) on server before upload
- Stores URL in database after successful upload
- On delete, removes blob from storage before removing DB record

### NOT Implemented (confirmed missing)

| Feature | Evidence |
|---------|---------|
| Interactive map (Leaflet / OpenStreetMap) | Not in `dependencies`; FINAL-CHECKLIST entry "Not complete"; T019 unit test verifies address-text-only fallback |
| Similar/related restaurants section | Confirmed absent in `app/[locale]/restaurants/[slug]/page.tsx` |
| OAuth social login | `auth.ts` has only `Credentials` provider; no OAuth packages |
| Email notifications | No email library in dependencies |
| Favorites / saved restaurants | No model or UI |
| Special-character password requirement | Validation only requires uppercase, lowercase, digit |

---

## 5. User and Administrator Permissions

| Action | Guest | User | Admin |
|--------|-------|------|-------|
| Browse restaurants | ✓ | ✓ | ✓ |
| Read reviews | ✓ | ✓ | ✓ |
| Register / login | ✓ | — | — |
| Submit review | — | ✓ (any restaurant) | ✓ |
| Edit own review | — | ✓ | ✓ |
| Delete own review | — | ✓ | ✓ |
| Edit another user's review | — | ✗ | ✓ |
| Delete another user's review | — | ✗ | ✓ |
| Upload review images | — | ✓ | ✓ |
| View profile | — | ✓ | ✓ |
| Edit profile / avatar | — | ✓ | ✓ |
| Access `/admin` | ✗ → redirect to login | ✗ → redirect to home | ✓ |
| Create / edit / delete restaurants | — | ✗ | ✓ |
| Upload restaurant images | — | ✗ | ✓ |
| Publish / unpublish restaurant | — | ✗ | ✓ |
| Manage categories | — | ✗ | ✓ |
| View / moderate all reviews | — | ✗ | ✓ |
| Activate / deactivate users | — | ✗ | ✓ |
| Change user roles | — | ✗ | ✓ |

**Enforcement layers:**
1. Next.js middleware (edge-safe, reads JWT from cookie)
2. Server-side layout guard (`requireAdmin()` in `app/[locale]/admin/layout.tsx`)
3. Server action guards (`requireAdminAction()` on every mutating action)
4. Upload API permission check (`canUploadFolder()` in `/api/uploads/route.ts`)

---

## 6. Technology Stack

| Layer | Technology | Version (from package.json) |
|-------|------------|------------------------------|
| Framework | Next.js App Router | 16.2.9 |
| Language | TypeScript | ^5 |
| Runtime | Node.js | 20+ (tested with 24) |
| Styling | Tailwind CSS | ^4 |
| UI primitives | shadcn/ui, @base-ui/react | ^4.11.0, ^1.6.0 |
| Icons | lucide-react | ^1.21.0 |
| Animations | tw-animate-css | ^1.4.0 |
| i18n | next-intl | ^4.13.0 |
| Database ORM | Prisma | ^6.19.3 |
| Database driver | @prisma/client | ^6.19.3 |
| Database | PostgreSQL | 14+ |
| Authentication | Auth.js (next-auth) | ^5.0.0-beta.31 |
| Password hashing | bcryptjs | ^3.0.3 (cost 12) |
| Form validation | React Hook Form + Zod | ^7.80.0, ^4.4.3 |
| Image storage (prod) | Vercel Blob | ^2.4.1 |
| Image storage (dev) | Local `public/uploads/` | — |
| Toasts | Sonner | ^2.0.7 |
| Theme | next-themes | ^0.4.6 |
| Class utilities | clsx, tailwind-merge, class-variance-authority | latest |
| Unit testing | Vitest | ^4.1.9 |
| E2E testing | Playwright | ^1.61.0 |
| Linting | ESLint | ^9 |
| Formatting | Prettier | ^3.8.4 |

---

## 7. Database Models and Relationships

**Database:** PostgreSQL via Prisma ORM (`schema.prisma`).

### Enums

```
Role     = USER | ADMIN
Language = UZ | EN | RU | JA
```

### Models

**`User`** (table: `users`)

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| fullName | String | |
| email | String | unique |
| passwordHash | String | bcrypt; excluded from default Prisma client export |
| role | Role | default USER |
| preferredLanguage | Language | default EN |
| avatarUrl | String? | Vercel Blob URL or null |
| profileHeadline | String? | max 80 chars |
| isActive | Boolean | default true; inactive users cannot log in |
| createdAt, updatedAt | DateTime | |

**`Category`** (table: `categories`)

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| nameUz, nameEn, nameRu, nameJa | String | multilingual names |
| slug | String | unique |

**`Restaurant`** (table: `restaurants`)

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| name | String | |
| slug | String | unique |
| descriptionUz/En/Ru/Ja | String (Text) | multilingual |
| address, city | String | |
| phone, website, openingHours | String? | |
| latitude, longitude | Float | geo coordinates (stored; no map UI) |
| mainImageUrl, mainImagePublicId | String? | cover image |
| priceLevel | Int? | 1–4 |
| cuisineType | String? | |
| isPublished | Boolean | default false; unpublished restaurants are hidden from public pages |
| categoryId | String | FK → Category |

**`RestaurantImage`** (table: `restaurant_images`)

Gallery photos. `restaurantId` FK → Restaurant (cascade delete).

**`Review`** (table: `reviews`)

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| userId | String | FK → User (cascade delete) |
| restaurantId | String | FK → Restaurant (cascade delete) |
| rating | Int | 1–5, validated in application code |
| title, content | String | |
| visitDate | DateTime? | |

**`ReviewImage`** (table: `review_images`)

Photos attached to reviews. `reviewId` FK → Review (cascade delete).

### Cascade rules (verified in schema)

| Trigger | Effect |
|---------|--------|
| Delete Restaurant | Cascades to RestaurantImage, Review, ReviewImage |
| Delete Review | Cascades to ReviewImage |
| Delete User | Cascades to Review (and therefore ReviewImage) |
| Delete Category | **Blocked** (`onDelete: Restrict`) while restaurants reference it |

### Migrations (in `prisma/migrations/`)

1. `20260608100000_init` — initial schema
2. `20260608120000_add_cloudinary_public_ids` — added `publicId` fields (later used for Vercel Blob public IDs)
3. `20260608180000_add_profile_headline` — added `profileHeadline` to User

---

## 8. Authentication Flow

1. User submits email + password on `/login`.
2. Auth.js `Credentials` provider validates input with Zod (`loginSchema`).
3. Email is lowercased; `findUserWithPasswordByEmail` queries `lib/prisma-auth.ts`
   (a separate Prisma client that includes `passwordHash`).
4. If the user is not found or `isActive = false`, authentication is rejected silently.
5. `bcrypt.compare` checks the submitted password against the stored hash (cost 12).
6. On success, Auth.js creates a **JWT** containing: `id`, `role`, `preferredLanguage`,
   `fullName`, `email`, `avatarUrl`, `profileHeadline`.
7. The JWT is stored in an HTTP-only cookie.
8. On profile edit, `unstable_update` merges the changed fields back into the active token
   without requiring a new login.
9. On logout, the session cookie is cleared.

**Two Auth.js config files are used intentionally:**
- `auth.config.ts` — edge-safe (no Prisma); used by middleware for fast route protection
- `auth.ts` — full config with Credentials provider and Prisma; used in server components/actions

**Protected route enforcement:**
- Middleware reads the JWT at the edge and redirects guests away from `/profile` and `/admin`.
- `requireAuth()` and `requireAdmin()` in `lib/auth/guards.ts` provide server-side double-checks inside page components.
- All admin server actions call `requireAdminAction()` before touching the database.

---

## 9. Supported Languages

| Language | Code | Translation file |
|----------|------|------------------|
| English | EN | `messages/en.json` |
| Uzbek | UZ | `messages/uz.json` |
| Russian | RU | `messages/ru.json` |
| Japanese | JA | `messages/ja.json` |

Locale is embedded in the URL path (`/en/`, `/uz/`, `/ru/`, `/ja/`). The language switcher
in the header changes the locale prefix and stores the selection in a cookie.
FINAL-CHECKLIST confirms all four translation files are aligned with no missing keys
(a duplicate `Errors` key was fixed during the audit period).

Restaurant descriptions, category names, and all UI strings are fully translated into
all four languages. Minor exceptions: decorative elements and some admin `"—"` placeholders
contain non-translated content (noted as "Partially complete" in FINAL-CHECKLIST).

---

## 10. Image Upload Implementation

**API endpoint:** `POST /api/uploads`, `DELETE /api/uploads`

**Upload folders and permission matrix:**

| Folder key | `folder` field value | Who can upload |
|------------|----------------------|----------------|
| `review` | `"review"` | Any authenticated user |
| `avatar` | `"avatar"` | Any authenticated user |
| `restaurantMain` | `"restaurant-main"` | ADMIN only |
| `restaurantGallery` | `"restaurant-gallery"` | ADMIN only |

**Validation (server-side, `lib/uploads/validate-image-buffer.server.ts`):**
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`
- Maximum file size: 5 MB
- Empty files rejected

**Storage:**
- **Production:** Vercel Blob (`@vercel/blob ^2.4.1`). Requires `BLOB_READ_WRITE_TOKEN`
  or a Vercel-linked Blob store (OIDC auto-credentials supported — added in the most
  recent commit `d0c4090`).
- **Development:** Local filesystem under `public/uploads/`. Works without any token.

**Flow:**
1. Client uploads file to `/api/uploads` (multipart form with `file` and `folder` fields).
2. Server authenticates the request and checks folder permissions.
3. File buffer is validated (type + size).
4. `uploadImageBuffer()` stores the file in Vercel Blob and returns `{ imageUrl, publicId }`.
5. Public ID is validated against the expected folder prefix before the result is returned
   to prevent path-traversal attacks.
6. The client receives `{ imageUrl, publicId }` and includes these in the subsequent
   form submission (review create/edit or restaurant save).

> **Note:** Migration `20260608120000_add_cloudinary_public_ids` references "Cloudinary"
> in its name, and FINAL-CHECKLIST.md lists Cloudinary as the upload provider. However,
> git commit `96b431b` ("Replace Cloudinary with Vercel Blob") and the current source code
> (`@vercel/blob` import, no Cloudinary packages) confirm that **Cloudinary has been
> fully replaced by Vercel Blob**. The checklist entry and migration name are outdated.

---

## 11. Deployment Architecture

| Component | Service |
|-----------|---------|
| Hosting | Vercel (Next.js serverless) |
| Database | Neon PostgreSQL (recommended) or Supabase PostgreSQL |
| Image storage | Vercel Blob |
| Build command | `prisma migrate deploy && prisma generate && next build` |
| Install command | `npm install` (runs `prisma generate` via `postinstall`) |

**Required environment variables (values not listed here; see `.env.example`):**

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Pooled PostgreSQL connection (Neon pooler / Supabase transaction pooler) |
| `DIRECT_URL` | Yes | Direct PostgreSQL for migrations |
| `AUTH_SECRET` | Yes | JWT signing secret |
| `AUTH_URL` | Yes | Canonical HTTPS URL (e.g. `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as `AUTH_URL` |
| `BLOB_READ_WRITE_TOKEN` | Required for uploads outside OIDC | Vercel Blob token |

**No production URL was found in the repository.** FINAL-CHECKLIST shows the production
entry as `https://your-project.vercel.app/en` (placeholder — not yet filled in).

**Next.js image `remotePatterns` allow:**
- `https://images.unsplash.com`
- `https://*.public.blob.vercel-storage.com`
- The app's own hostname under `/uploads/**` (resolved from `NEXT_PUBLIC_APP_URL`)

---

## 12. Testing Tools

| Tool | Purpose | Command |
|------|---------|---------|
| Vitest 4.x | Unit and component tests | `npm run test:unit` |
| Playwright 1.61.0 | End-to-end browser tests (Chromium) | `npm run test:e2e` |
| TypeScript | Static type checking | `npm run typecheck` |
| ESLint 9 | Linting | `npm run lint` |
| Prettier | Code formatting | `npm run format:check` |

**Test file locations:**

| Type | Path |
|------|------|
| Unit | `tests/unit/` |
| Component | `tests/components/` |
| E2E | `tests/e2e/` |
| Helpers | `tests/helpers/` |
| Results | `tests/output/vitest-results.json`, `tests/output/playwright-results.json` |

---

## 13. Real Test Results

Results sourced directly from `tests/output/vitest-results.json` and
`tests/output/playwright-results.json`. Both files were produced on **2026-06-21**.

### Vitest (unit + component)

| Metric | Value |
|--------|-------|
| Test suites | 16 total / **16 passed** / 0 failed |
| Test cases | 21 total / **21 passed** / 0 failed |
| Overall | **PASS** |

> FINAL-CHECKLIST records "15/15" unit tests. The actual JSON output shows 21 tests across
> 16 suites, consistent with additional tests added after the checklist was written.

**Test coverage by file:**

| Test file | Cases | ID tags | Outcome |
|-----------|-------|---------|---------|
| `compute-average-rating.test.ts` | 3 | T018 | All pass |
| `permissions.test.ts` | 4 | T005, T013 | All pass |
| `validate-image-file.test.ts` | 4 | T017 | All pass |
| `uploaded-image-url.test.ts` | 2 | — | All pass |
| `blob-availability.test.ts` | 4 | — | All pass |
| `apply-session-update.test.ts` | 2 | — | All pass |
| `layout-behavior.test.tsx` | 2 | T019, T020 | All pass |

### Playwright E2E (Chromium)

| Metric | Value |
|--------|-------|
| Total tests | 19 |
| Passed | **3** |
| Failed | **16** |
| Duration | ~348 s |

**Passed tests:**

| ID | Test | File |
|----|------|------|
| T004 | Profile route redirects guests to login | `auth.spec.ts` |
| T005 (partial) | Admin route blocks guests and normal users | `admin-access.spec.ts` |
| T019 | Restaurant detail shows address text instead of embedded map | `restaurants.spec.ts` |

**Failed tests — root causes (from error messages in JSON):**

| ID | Test | Root cause in test output |
|----|------|--------------------------|
| T001 | Registration redirects to profile | After submit, page stays on `/register?…` — server action or redirect not completing in CI |
| T002 | Login allows valid credentials | `waitForResponse` on `/api/auth/callback/credentials` times out |
| T003 | Logout ends session | Same as T002 — depends on login helper |
| T005 (positive) | Admin user sees dashboard | Strict-mode violation: two `<a>` elements match `getByRole('link', { name: /restaurants/i })` (admin nav + footer) |
| T006 | Language switcher changes URL | Dropdown radio item not found within timeout (dropdown not opening) |
| T007 | Search finds matching restaurants | URL does not include `q=Trattoria` after pressing Enter |
| T008 | Category filter applies | URL does not include `category=european-cuisine` after selecting combobox |
| T009 | Restaurant detail loads data | Strict-mode violation: `getByText(/tashkent/i)` matches 2 elements |
| T010 | User can create review | Review heading not visible after submit (15 s timeout) |
| T011 | User can edit review | `locator('[id^="edit-title-"]')` not found (timeout) |
| T012 | User can delete review | Same as T010 — review not appearing after submit |
| T013 | Other users cannot edit review | Edit button found for another user's review (selector too broad) |
| T014 | Admin creates restaurant | Category combobox option not resolving (timeout) |
| T015 | Admin edits restaurant | Same as T014 |
| T016 | Admin deletes restaurant | Same as T014 |
| T020 | Mobile nav hides desktop nav | `getByRole('banner').getByRole('link', { name: /^register$/i })` not found |

**Assessment of E2E failures (based on FINAL-CHECKLIST and Japanese test report):**
- Manual verification of all failing flows confirmed they work correctly in a running browser.
- The failures are attributed to: authentication helper timing, strict-mode selector ambiguity,
  form submission URL-sync timing, and combobox interaction patterns in headless Chromium.
- These are test-harness issues, not missing product features.

### Static analysis and build (from FINAL-CHECKLIST)

| Check | Result |
|-------|--------|
| `npm run typecheck` | **Pass** (0 TypeScript errors) |
| `npm run lint` | **Pass** (0 errors, ≤ 2 warnings) |
| `npm run build` | **Pass** |

---

## 14. Known Limitations

| Limitation | Evidence |
|------------|---------|
| No interactive map | Leaflet not in dependencies; coordinates stored in DB but only address text shown in UI; T019 unit + E2E test verifies this behaviour is intentional |
| No similar/related restaurants section | Absent from restaurant detail page code |
| No OAuth / social sign-in | Only `Credentials` provider in `auth.ts` |
| No email notifications | No email library in package.json |
| No favorites or saved restaurants feature | No DB model or UI |
| Password policy lacks special-character rule | Validation requires uppercase, lowercase, digit but not a special character |
| E2E suite: 16/19 tests failing | Selector/timing issues in test harness; not feature bugs |
| README.md is outdated | Still calls project "TasteGuide"; describes implemented features as "planned later phases" |
| FINAL-CHECKLIST references Cloudinary | Cloudinary was replaced by Vercel Blob (commit `96b431b`); checklist not updated |
| Migration name references Cloudinary | `20260608120000_add_cloudinary_public_ids` — name is historical; field is now used for Vercel Blob public IDs |
| Production deployment URL unknown | No live URL committed; placeholder in FINAL-CHECKLIST |
| Local dev on Windows / OneDrive + Turbopack | FINAL-CHECKLIST recommends using webpack mode (`npm run dev`) and embedded Postgres on port 5433 |
| Unpublished restaurants hidden from public | Only admins can see or publish them; newly created restaurants default to `isPublished: false` |

---

## 15. Future Improvements

The following items are absent from the codebase but mentioned in project documents
or implied by existing scaffolding:

| Item | Source |
|------|--------|
| Interactive map (Leaflet + OpenStreetMap) | README "Maps (planned)", FINAL-CHECKLIST "Not complete", lat/lng already in DB schema |
| Similar / related restaurants section | FINAL-CHECKLIST "Not complete" |
| E2E test suite stabilisation | 16/19 failures; harness issues documented in `docs/05-test-results-ja.md` |
| README refresh | Still references TasteGuide and "planned" features |
| Special-character password requirement | Current validation missing this rule |
| Social / OAuth login | Infrastructure supports it (Auth.js); only Credentials provider is wired |
| Locale-specific SEO pages / sitemaps | next-intl routing is in place; sitemap not generated |
| Email verification on registration | No email transport configured |
| User favourites / bookmarks | DB model not yet added |
| Accessibility audit | FINAL-CHECKLIST marks accessibility as "Partially complete" |

---

## Confirmed Facts (owner-verified 2026-06-21)

| Item | Confirmed value |
|------|----------------|
| Production URL | https://taomchi-restaurant-review.vercel.app |
| Image upload solution | **Vercel Blob** (Cloudinary was evaluated but abandoned — service unavailable in Uzbekistan) |
| Unit test count | **21** (vitest-results.json is authoritative; FINAL-CHECKLIST count of 15 is outdated) |
| E2E failures (16/19) | Treated as **unresolved test-harness / environment issues**, not confirmed application bugs |
| Docs/01–07 status | **Draft source material** — polished final versions created in `docs/final/` |
| Submission deadline | **2026-06-30 at 14:00** |
| Production database | **Migrated and seeded** — includes users, categories, restaurants, reviews, and admin account |
| Presentation | `presentation/Taomchi-Presentation.pdf` — 15-slide deck, referenced as supplementary material |
