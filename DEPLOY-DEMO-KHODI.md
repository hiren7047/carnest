# Deploy — demo.khodi.in (PostgreSQL / carnest_db)

**carnest.in safe** — alag folder, alag PM2, port `4001`, navo nginx only.

---

## Server facts (confirmed)

| Item | Value |
|------|--------|
| DB | `carnest_db` @ `127.0.0.1:5432` |
| Production API | `carnest-api` → `:4000` |
| Demo API (navo) | `demo-api` → `:4001` |
| Production tables | 10 — **touch nahi** |
| Demo tables | `demos`, `template_cars`, `hub_admins`, … |

---

## STEP 0 — DNS

- `demo.khodi.in` → VPS IP
- `hub.demo.khodi.in` → VPS IP

---

## STEP 1 — PostgreSQL user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER carnest_demo WITH PASSWORD 'STRONG_PASSWORD';
GRANT CONNECT ON DATABASE carnest_db TO carnest_demo;
GRANT USAGE ON SCHEMA public TO carnest_demo;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO carnest_demo;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO carnest_demo;
SQL
```

---

## STEP 2 — Clone repo

```bash
mkdir -p /var/www/demo-khodi && cd /var/www/demo-khodi
git clone YOUR_REPO_URL .
```

---

## STEP 3 — Demo API `.env`

`/var/www/demo-khodi/carnest/server/.env`:

```env
NODE_ENV=production
PORT=4001

DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=carnest_db
DB_USER=carnest_demo
DB_PASSWORD=STRONG_PASSWORD
DB_SYNC_ALTER=false

DEMO_HUB_DB_HOST=127.0.0.1
DEMO_HUB_DB_PORT=5432
DEMO_HUB_DB_NAME=carnest_db
DEMO_HUB_DB_USER=carnest_demo
DEMO_HUB_DB_PASSWORD=STRONG_PASSWORD
DEMO_HUB_DB_SYNC_ALTER=true

JWT_SECRET=<openssl rand -hex 32>
CLIENT_URL=https://demo.khodi.in
CLIENT_URLS=https://demo.khodi.in,https://hub.demo.khodi.in
PUBLIC_BASE_URL=https://demo.khodi.in
DEMO_PUBLIC_BASE_URL=https://demo.khodi.in/d
HUB_ADMIN_EMAIL=you@carnest.in
HUB_ADMIN_PASSWORD=HubAdmin123!
```

```bash
cd /var/www/demo-khodi/carnest/server
npm ci && npm run build
npm run seed:demo-hub
```

Grant demo tables:
```bash
sudo -u postgres psql -d carnest_db -c "
GRANT ALL ON TABLE demos, hub_admins, demo_branding, demo_site_content, demo_contact,
  template_cars, template_users, template_staff_members, template_staff_monthly_targets,
  template_car_sales, demo_sandbox_bookings, demo_sandbox_sell_requests,
  demo_sandbox_contact_inquiries TO carnest_demo;
"
```

Set `DEMO_HUB_DB_SYNC_ALTER=false` in `.env`, then:

```bash
pm2 start dist/index.js --name demo-api
pm2 save
curl -s http://127.0.0.1:4001/api/health
```

---

## STEP 4 — Frontends

```bash
cd /var/www/demo-khodi/carnest/client && npm ci && npm run build
cd /var/www/demo-khodi/demo-hub/client && npm ci && npm run build
```

---

## STEP 5 — Nginx

Create `demo.khodi.in` + `hub.demo.khodi.in` (see prior plan) — proxy `/api` → `127.0.0.1:4001`.

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d demo.khodi.in -d hub.demo.khodi.in
```

---

## STEP 6 — Verify (no conflict)

```bash
curl -s https://carnest.in/api/health          # production OK
curl -s https://demo.khodi.in/api/health       # demo OK
pm2 status                                       # carnest-api + demo-api
sudo -u postgres psql -d carnest_db -c "\dt"   # 10 + demo tables
```

**`pm2 restart carnest-api` — NATHI.**

---

## Updates (demo only)

```bash
cd /var/www/demo-khodi/carnest/server && git pull && npm ci && npm run build && pm2 restart demo-api
cd ../client && npm ci && npm run build
cd ../../demo-hub/client && npm ci && npm run build
sudo systemctl reload nginx
```
