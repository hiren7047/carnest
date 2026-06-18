# Carnest Demo Hub

Admin dashboard to create and manage branded client demos.

## Setup (PostgreSQL — same `carnest_db` as API)

```bash
cd server
cp .env.example .env
npm install
npm run seed:demo-hub
npm run dev          # API :4000 (or :4001 in production)

cd ../client
npm install && npm run dev    # Demo site :8080

cd ../demo-hub/client
npm install && npm run dev    # Hub dashboard :8090
```

## Usage

1. Open **http://localhost:8090** — login with hub admin (`HUB_ADMIN_EMAIL` / `HUB_ADMIN_PASSWORD` from seed).
2. Create Demo → copy link `http://localhost:8080/d/{slug}`.
3. Demo logins: `admin@demo.com` / `Demo123!`, `buyer@demo.com` / `Demo123!`

## Production

- Hub: `https://hub.demo.khodi.in`
- Demos: `https://demo.khodi.in/d/{slug}`
- API: shared `demo-api` on port `4001` (see `DEPLOY-DEMO-KHODI.md`)

## Architecture

- **PostgreSQL `carnest_db`** — production tables + `demos`, `template_cars`, `hub_admins`, …
- **Hub API** — `/api/hub/*`
- **Demo runtime** — `/api/demo/:slug/*`
