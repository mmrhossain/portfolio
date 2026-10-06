# Monir Hossain — Portfolio Platform

Personal portfolio and content platform for [mmrhossain.com](https://mmrhossain.com). Public site, admin dashboard, REST API, and PostgreSQL-backed CMS in one repository.

This is a multi-app workspace, not a monorepo with a root `package.json`. Install, develop, build, and deploy `client/` and `server/` independently.

## Live

- Site: [https://mmrhossain.com](https://mmrhossain.com)
- API health: `GET /api/v1/health`

## What it does

**Public**

- Home, about, projects, blogs, and contact
- Experience and education timelines on Home and About
- Contact form with message inbox in the dashboard
- SEO: metadata, canonical URLs, Open Graph, Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`

**Admin (`/dashboard`)**

- Projects, blogs, skills, experience, education
- Contact messages, users, site settings, analytics
- Cookie-based admin auth with access and refresh tokens

**API (`server/`)**

- Express REST API under `/api/v1`
- Prisma + PostgreSQL
- JWT in HttpOnly cookies
- Password reset via Resend

## Architecture

```mermaid
flowchart LR
  Browser["Browser"]
  Next["Next.js client :3000"]
  API["Express API :4000"]
  DB["PostgreSQL"]
  Mail["Resend"]

  Browser -->|"pages and /api rewrite"| Next
  Next -->|"server fetch API_URL"| API
  Browser -->|"same-origin /api cookies"| Next
  Next -->|"proxy /api/:path*"| API
  API --> DB
  API --> Mail
```

Browser API calls stay same-origin (`/api/...`). Next.js rewrites them to Express so auth cookies are first-party (`SameSite=Lax`). Server-side Next.js fetches use `API_URL` (default `http://localhost:4000`).

Do not point the browser client at a cross-origin API URL. That breaks cookies.

## Tech stack

| Layer    | Stack                                                                       |
| -------- | --------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Zustand   |
| Backend  | Express, TypeScript, Zod, Prisma 7.10.0, Pino, Helmet, rate limiting        |
| Database | PostgreSQL                                                                  |
| Auth     | JWT access + refresh tokens in HttpOnly cookies                             |
| Email    | Resend                                                                      |
| SEO      | Next.js Metadata API, JSON-LD Person / WebSite / CreativeWork / BlogPosting |

Prisma packages must stay on **7.10.0** (`prisma`, `@prisma/client`, `@prisma/adapter-pg`).

## Repository layout

```text
.
├── client/                 Next.js App Router
│   ├── src/app/(site)/     Public pages
│   ├── src/app/(admin)/    Dashboard
│   ├── src/app/(auth)/     Login, forgot, reset password
│   ├── src/lib/seo/        Metadata and structured data
│   └── next.config.ts      /api rewrite to Express
└── server/                 Express API
    ├── prisma/             Schema and migrations
    ├── src/modules/        Feature modules
    ├── src/config/env.ts   Validated environment
    └── src/shared/mailer.ts
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 14+
- A Resend API key if password-reset email must actually send

## Local setup

### 1. Clone and install

```bash
git clone <repository-url>
cd <repository>

# API
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. PostgreSQL

Create a database and user, then set `DATABASE_URL`.

```bash
createdb devmonir
```

Example URL:

```text
postgresql://USER:PASSWORD@127.0.0.1:5432/devmonir
```

### 3. Environment

There are no committed `.env.example` files. Create them locally.

**`server/.env`**

```env
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
CLIENT_URL=http://localhost:3000
APP_URL=http://localhost:3000

DATABASE_URL=postgresql://USER:PASSWORD@127.0.0.1:5432/devmonir

JWT_ACCESS_SECRET=replace-with-at-least-16-chars
JWT_REFRESH_SECRET=replace-with-at-least-16-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=dev-monir-api
JWT_AUDIENCE=dev-monir-client

COOKIE_SECURE=false

RESEND_API_KEY=
MAIL_FROM=Dev Monir <noreply@your-domain.com>

SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-me-now
```

**`client/.env.local`**

```env
API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` drives canonical URLs, Open Graph, robots, and sitemap. Use `https://mmrhossain.com` in production.

### 4. Database migrations

From `server/`:

```bash
# Apply committed migrations
npx prisma migrate deploy

# Generate client after schema or Prisma version changes
npx prisma generate
```

Use `npx prisma migrate deploy` on existing or production databases.

Use `npx prisma migrate dev` only when you are adding a new migration during development.

Check status:

```bash
npx prisma migrate status
```

Optional seed (script: `npm run prisma:seed`). The seed directory is gitignored; run it only if you have a local seed file.

### 5. Run

Two terminals.

```bash
# server/
npm run dev
```

```bash
# client/
npm run dev
```

| Service   | URL                                 |
| --------- | ----------------------------------- |
| Site      | http://localhost:3000               |
| API       | http://localhost:4000               |
| Health    | http://localhost:4000/api/v1/health |
| Dashboard | http://localhost:3000/dashboard     |

Login at `/login`. Admin CRUD lives under `/dashboard`.

## Scripts

### `server/`

| Script                    | Purpose                       |
| ------------------------- | ----------------------------- |
| `npm run dev`             | Watch mode (`tsx`)            |
| `npm run build`           | Compile TypeScript to `dist/` |
| `npm run start`           | Run `node dist/server.js`     |
| `npm run prisma:generate` | Generate Prisma client        |
| `npm run prisma:migrate`  | `prisma migrate dev`          |
| `npm run prisma:studio`   | Prisma Studio                 |
| `npm run prisma:seed`     | Seed database                 |

### `client/`

| Script               | Purpose                 |
| -------------------- | ----------------------- |
| `npm run dev`        | Next.js dev server      |
| `npm run build`      | Production build        |
| `npm run start`      | Start production server |
| `npm run type-check` | `tsc --noEmit`          |

## Environment reference

### API (`server/`)

| Variable              | Required   | Notes                                        |
| --------------------- | ---------- | -------------------------------------------- |
| `DATABASE_URL`        | yes        | PostgreSQL connection string                 |
| `JWT_ACCESS_SECRET`   | yes        | Min 16 characters                            |
| `JWT_REFRESH_SECRET`  | yes        | Min 16 characters                            |
| `NODE_ENV`            | no         | `development` \| `test` \| `production`      |
| `PORT`                | no         | Default `4000`                               |
| `API_PREFIX`          | no         | Default `/api/v1`                            |
| `CLIENT_URL`          | no         | CORS allowlist, comma-separated              |
| `APP_URL`             | no         | Used in password-reset links                 |
| `COOKIE_SECURE`       | no         | Set `true` behind HTTPS                      |
| `COOKIE_DOMAIN`       | no         | Usually unset when using same-origin rewrite |
| `RESEND_API_KEY`      | prod email | Without it, reset mail is logged only        |
| `MAIL_FROM`           | no         | Verified Resend sender                       |
| `SEED_ADMIN_EMAIL`    | seed       | Default used only if seeding                 |
| `SEED_ADMIN_PASSWORD` | seed       | Min 8 characters                             |

### Frontend (`client/`)

| Variable               | Required    | Notes                                                        |
| ---------------------- | ----------- | ------------------------------------------------------------ |
| `API_URL`              | yes in prod | Express origin for SSR and `/api` rewrite. No trailing path. |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | Canonical site origin, no trailing slash                     |

## Auth model

- Access token: short-lived JWT, HttpOnly cookie `accessToken`
- Refresh token: longer-lived JWT, HttpOnly cookie `refreshToken`, persisted hashed in PostgreSQL
- Dashboard gate (`client/src/proxy.ts`) treats either cookie as a session
- Browser client uses same-origin `/api`; Next rewrites to Express
- CORS allows `CLIENT_URL`, localhost, and `*.monkeycode-ai.live` preview hosts

Production cookies:

- Serve the site and API behind HTTPS
- Set `COOKIE_SECURE=true`
- Keep the `/api` rewrite so cookies stay first-party
- Leave `COOKIE_DOMAIN` unset unless you intentionally share cookies across subdomains

## API surface

Base path: `/api/v1`

| Area       | Path          | Access                                                 |
| ---------- | ------------- | ------------------------------------------------------ |
| Health     | `GET /health` | Public                                                 |
| Auth       | `/auth`       | Public login/refresh/forgot/reset; `/me` authenticated |
| Projects   | `/projects`   | Public list/detail; writes admin                       |
| Blogs      | `/blogs`      | Public published only; writes admin                    |
| Skills     | `/skills`     | Public active; writes admin                            |
| Experience | `/experience` | Public active; writes admin                            |
| Education  | `/education`  | Public active; writes admin                            |
| Messages   | `/messages`   | Public create; inbox admin                             |
| Settings   | `/settings`   | Admin                                                  |
| Users      | `/users`      | Admin                                                  |
| Analytics  | `/analytics`  | Admin                                                  |
| Dashboard  | `/dashboard`  | Admin                                                  |

Public list endpoints already filter unpublished or inactive records. Draft project and blog slugs 404 and are omitted from the sitemap.

## Content and SEO

Canonical host is `https://mmrhossain.com` when `NEXT_PUBLIC_SITE_URL` is set.

- `createPageMetadata()` owns title, description, canonical, Open Graph, Twitter, and robots
- Root layout emits Person + WebSite JSON-LD
- Project pages emit `CreativeWork`; blog posts emit `BlogPosting`
- Filtered/paginated query URLs keep a clean canonical and `noindex, follow`
- `robots.txt` disallows `/dashboard`, `/login`, `/forgot-password`, `/reset-password`, `/api/`
- `sitemap.xml` includes static routes plus published projects and blogs

After publishing content, confirm `/sitemap.xml` and `/robots.txt`.

Experience and education appear only on Home and About. They have no public listing routes. Empty timelines mean no dashboard entries yet.

## Production deploy

Deploy frontend and API as two services. Point the Next.js rewrite at the API origin.

### Frontend

1. Build from `client/`
2. Set `API_URL` to the public or private API origin (`https://api.example.com`, no `/api/v1` suffix)
3. Set `NEXT_PUBLIC_SITE_URL=https://mmrhossain.com`
4. Confirm `next.config.ts` rewrites `/api/:path*` to `$API_URL/api/:path*`

### API

1. Provision PostgreSQL
2. Set production secrets (`DATABASE_URL`, JWT secrets, `RESEND_API_KEY`)
3. Set `NODE_ENV=production`, `COOKIE_SECURE=true`
4. Set `CLIENT_URL` and `APP_URL` to `https://mmrhossain.com`
5. Run `npx prisma migrate deploy` then `npx prisma generate`
6. `npm run build` and `npm run start`
7. Confirm `GET /api/v1/health`

Recommended order on each release:

```bash
cd server
npx prisma migrate deploy
npx prisma generate
npm run build
npm run start
```

### Reverse proxy

If you terminate TLS on nginx, Caddy, or a load balancer:

- Public host: `https://mmrhossain.com`
- Forward `/api/*` to Express, or keep the Next.js rewrite
- Forward everything else to Next.js
- Preserve `Host` and `X-Forwarded-*` so cookies and redirects stay correct

`server/vercel.json` exists for a Node serverless entry. Prefer a long-running Node process plus PostgreSQL unless you have already validated that path.

## Security notes

- Never commit `.env` files or JWT secrets
- Rotate `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` if they leak
- Use a verified Resend domain in production; the default `beth.t@example.com` will not deliver
- Change seed admin credentials before any shared or production database
- Helmet, compression, request IDs, and rate limits are enabled on the API
- JSON body limit is 1mb

## Operations checklist

- [ ] PostgreSQL reachable from the API
- [ ] `prisma migrate deploy` succeeded
- [ ] `GET /api/v1/health` returns `{ "success": true }`
- [ ] Login sets `accessToken` and `refreshToken` on the site origin
- [ ] Dashboard loads after login
- [ ] `/robots.txt` and `/sitemap.xml` use `https://mmrhossain.com`
- [ ] Password reset sends mail when `RESEND_API_KEY` is set
- [ ] Home/About timelines have experience and education entries

## Troubleshooting

| Symptom                                          | Likely cause                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Login succeeds but dashboard bounces to `/login` | Cross-origin API calls; cookies not on the site origin. Use the `/api` rewrite. |
| `Invalid environment configuration` on API boot  | Missing `DATABASE_URL` or JWT secrets shorter than 16 chars                     |
| Empty experience/education on Home and About     | No active rows in dashboard                                                     |
| Reset email never arrives                        | `RESEND_API_KEY` unset or `MAIL_FROM` not verified                              |
| Sitemap host is wrong                            | `NEXT_PUBLIC_SITE_URL` missing at build/runtime                                 |
| Prisma client out of date                        | Run `npx prisma generate` after schema or version changes                       |
| Schema drift                                     | Run `npx prisma migrate status`, then `migrate deploy`                          |

## License

Private. All rights reserved unless a license file is added to this repository.
