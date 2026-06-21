# Test Specification

Automated and manual test coverage for the TasteGuide (`cowork-restaurant-reviews`) application.

**Stack:** Vitest + React Testing Library (unit/component), Playwright (E2E), legacy HTTP scripts (`scripts/test-*.mjs`).

**Seed credentials**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `Admin123!` |
| User | `user@example.com` | `User123!` |
| Other user | `aziza@example.com` | `User123!` |

**Default locale for automated runs:** `en`

---

## Test matrix

| Test ID | Feature | Preconditions | Test steps | Expected result |
|---------|---------|---------------|------------|-----------------|
| T001 | Registration | Guest user, register page available | 1. Open `/en/register`. 2. Fill full name, unique email, valid password + confirmation, preferred language. 3. Submit form. | User is redirected to `/en/profile` and account name is visible. |
| T002 | Login | Registered seed user `user@example.com` | 1. Open `/en/login`. 2. Enter valid email/password. 3. Submit. | User lands on profile page with profile heading visible. |
| T003 | Logout | User logged in | 1. Click Sign out. 2. Open `/en/profile`. | Session ends; profile redirects to login. |
| T004 | Protected profile route | Guest session | 1. Open `/en/profile` directly. | Redirect to `/en/login` with callback URL. |
| T005 | Protected admin route | Guest and normal user; admin user for positive case | 1. Guest opens `/en/admin`. 2. Normal user opens `/en/admin`. 3. Admin opens `/en/admin`. | Guest → login; user → redirected away; admin → dashboard loads with admin navigation. |
| T006 | Language switching | Guest on restaurants page | 1. Open language switcher. 2. Select Uzbek. | URL changes to `/uz/...` locale prefix. |
| T007 | Restaurant search | Published restaurants in seed | 1. Open `/en/restaurants`. 2. Search `Trattoria`. 3. Apply search. | Results include Trattoria Amici; URL contains `q=Trattoria`. |
| T008 | Restaurant filtering | Categories seeded | 1. Open `/en/restaurants`. 2. Select `european-cuisine`. 3. Apply filters. | URL contains category filter; Trattoria Amici remains visible. |
| T009 | Restaurant detail loading | Published slug `trattoria-amici` | 1. Open `/en/restaurants/trattoria-amici`. | Restaurant name and city appear on detail page. |
| T010 | Review creation | User logged in | 1. Open restaurant detail. 2. Fill review title, content, visit date, rating. 3. Submit. | New review heading appears in review list. |
| T011 | Review editing | User logged in with own review | 1. Open restaurant detail. 2. Click Edit on own review. 3. Change title and save. | Updated title appears in list. |
| T012 | Review deletion | User logged in | 1. Create temporary review. 2. Click Delete and confirm. | Review disappears from list. |
| T013 | Unauthorized review editing | Other user logged in (`aziza@example.com`) | 1. Open restaurant with another user's review. 2. Inspect review actions. | Edit/Delete controls are not shown for another user's review. |
| T014 | Admin restaurant creation | Admin logged in | 1. Open `/en/admin/restaurants/new`. 2. Fill required fields + category. 3. Submit. | Redirect to edit page for new slug. |
| T015 | Admin restaurant editing | Admin logged in | 1. Create test restaurant. 2. Change name on edit page. 3. Save. | Updated name visible on edit page. |
| T016 | Admin restaurant deletion | Admin logged in | 1. Create test restaurant. 2. Find it in admin list. 3. Delete and confirm. | Restaurant removed from admin list. |
| T017 | Image validation | None | 1. Run Vitest `validate-image-file` tests with valid PNG, oversized file, PDF, empty file. | Valid PNG passes; oversize/type/empty fail with correct codes. |
| T018 | Average rating calculation | None | 1. Run Vitest `compute-average-rating` tests. | Empty list → `null`; ratings averaged correctly. |
| T019 | Map rendering fallback | Published restaurant detail | 1. Open restaurant detail page. 2. Inspect DOM. | Address text is shown; no map iframe/embed is rendered. |
| T020 | Mobile navigation | Mobile viewport (390×844) | 1. Open home page on mobile width. | Register link visible; desktop main nav hidden. |

---

## Manual verification checklist

Use when Playwright/browser automation is unavailable:

1. Confirm PostgreSQL is running and seed data exists (`npm run db:seed`).
2. Start app with a single dev server: `npm run dev`.
3. Walk through T001–T016 in the browser using the steps above.
4. Run unit suite: `npm run test:unit`.
5. Record outcomes in `docs/test-results.md`.

---

## Commands

```bash
npm run test:unit      # Vitest unit + component tests
npm run test:e2e       # Playwright end-to-end tests
npm run test:all       # Unit + E2E + results doc generation
npm run test:auth      # Legacy HTTP auth script (if wired)
```
