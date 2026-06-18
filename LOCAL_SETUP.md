# Carnest — Local setup (PostgreSQL)

Production ane local banne **`DB_DIALECT=postgres`** use kare che. Ek j database (`carnest_db`) ma production tables + demo tables.

---

## Option A — Docker PostgreSQL (recommended)

```powershell
cd d:\car-demo\carnest
docker compose up -d
```

Postgres **host port `5433`** (tamara local PG `:5432` sathe conflict na thay).

```powershell
copy server\.env.local.example server\.env
cd server
npm install
npm run dev
```

Biji terminal:
```powershell
cd carnest\server
npm run seed:demo-hub
```

---

## Option B — Tamaro local PostgreSQL (`:5432`)

`server\.env` ma:

```env
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=carnest_db
DB_USER=your_pg_user
DB_PASSWORD=your_pg_password
```

Database create:
```sql
CREATE DATABASE carnest_db;
```

Pachi `npm run dev` ane `npm run seed:demo-hub`.

---

## Run full stack

```powershell
# API :4000
cd carnest\server
npm run dev

# Client :8080
cd carnest\client
npm run dev

# Hub :8090
cd demo-hub\client
npm run dev
```

---

## Verify

```powershell
curl http://127.0.0.1:4000/api/health
# {"ok":true,"database":"connected"}

# Hub login
curl -X POST http://127.0.0.1:4000/api/hub/auth/login -H "Content-Type: application/json" -d "{\"email\":\"you@carnest.in\",\"password\":\"HubAdmin123!\"}"
```

Browser:
- Hub: http://localhost:8090
- Demo: http://localhost:8080/d/{slug}

---

## Tables (1 DB)

| Production | Demo platform |
|------------|---------------|
| cars, users, bookings, … | demos, hub_admins, template_cars, … |

Docker ma verify:
```powershell
docker exec carnest-postgres psql -U carnest -d carnest_db -c "\dt"
```

---

## Legacy MySQL (optional)

`DB_DIALECT=mysql` + MariaDB docker (purano setup). Production PG che — local pan PG prefer karo.
