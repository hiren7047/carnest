# Carnest

Premium used-car marketplace + **multi-client demo platform**.

- **PostgreSQL** (`carnest_db`) — production + demo hub tables
- **Express API** (`server/`)
- **Public site + demo runtime** (`client/`) — `/d/:slug`
- **Demo Hub admin** (`demo-hub/client/`) — create/manage client demos

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Docker: `docker compose up -d`)

## Quick start

See [`LOCAL_SETUP.md`](LOCAL_SETUP.md).

```bash
cd server && cp .env.local.example .env && npm install && npm run dev
cd client && npm install && npm run dev
cd demo-hub/client && npm install && npm run dev
```

| App | URL |
|-----|-----|
| API | http://localhost:4000 |
| Client | http://localhost:8080 |
| Hub | http://localhost:8090 |

## Project layout

```
carnest/
├── server/           API (Express + Sequelize)
├── client/           Carnest + demo routes (/d/:slug)
├── demo-hub/client/  Hub dashboard (create demos)
├── LOCAL_SETUP.md
└── DEPLOY-DEMO-KHODI.md
```

## Production

- Main site: [`DEPLOYMENT.md`](DEPLOYMENT.md) — carnest.in
- Demo platform: [`DEPLOY-DEMO-KHODI.md`](DEPLOY-DEMO-KHODI.md) — demo.khodi.in
