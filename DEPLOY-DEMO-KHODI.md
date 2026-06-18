# Deploy — demo.khodi.in (PostgreSQL / carnest_db)

**carnest.in safe** — alag folder, alag PM2 `demo-api` port `4001`, navo nginx only.

## Repo structure (after `git clone`)

```
/var/www/demo-khodi/carnest/
├── server/           → demo-api (PM2)
├── client/           → demo.khodi.in
├── demo-hub/client/  → hub.demo.khodi.in
└── DEPLOY-DEMO-KHODI.md
```

---

## Server facts

| Item | Value |
|------|--------|
| DB | `carnest_db` @ `127.0.0.1:5432` |
| Production API | `carnest-api` → `:4000` (**touch nahi**) |
| Demo API | `demo-api` → `:4001` |
| Production tables | 10 existing |
| Demo tables | `demos`, `template_cars`, `hub_admins`, … |

---

## STEP 0 — DNS

- `demo.khodi.in` → VPS IP
- `hub.demo.khodi.in` → VPS IP

---

## STEP 1 — Clone (one repo — server + client + hub)

```bash
mkdir -p /var/www/demo-khodi
cd /var/www/demo-khodi
git clone https://github.com/hiren7047/carnest.git
cd carnest
ls server client demo-hub/client
```

---

## STEP 2 — PostgreSQL user

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
DB_TIMEZONE=+05:30
DB_SSL=false

DEMO_HUB_DB_HOST=127.0.0.1
DEMO_HUB_DB_PORT=5432
DEMO_HUB_DB_NAME=carnest_db
DEMO_HUB_DB_USER=carnest_demo
DEMO_HUB_DB_PASSWORD=STRONG_PASSWORD
DEMO_HUB_DB_SYNC_ALTER=true

JWT_SECRET=<openssl rand -hex 32>
JWT_EXPIRES_IN=7d

CLIENT_URL=https://demo.khodi.in
CLIENT_URLS=https://demo.khodi.in,https://hub.demo.khodi.in
UPLOAD_DIR=uploads
PUBLIC_BASE_URL=https://demo.khodi.in
DEMO_PUBLIC_BASE_URL=https://demo.khodi.in/d

HUB_ADMIN_EMAIL=you@carnest.in
HUB_ADMIN_PASSWORD=HubAdmin123!
```

```bash
cd /var/www/demo-khodi/carnest/server
openssl rand -hex 32
mkdir -p uploads && chmod 755 uploads
npm ci && npm run build
npm run seed:demo-hub
```

Grant demo tables:

```bash
sudo -u postgres psql -d carnest_db <<'SQL'
GRANT ALL ON TABLE
  demos, hub_admins, demo_branding, demo_site_content, demo_contact,
  template_cars, template_users, template_staff_members,
  template_staff_monthly_targets, template_car_sales,
  demo_sandbox_bookings, demo_sandbox_sell_requests,
  demo_sandbox_contact_inquiries
TO carnest_demo;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO carnest_demo;
SQL
```

Set `DEMO_HUB_DB_SYNC_ALTER=false` in `.env`, then:

```bash
pm2 start dist/index.js --name demo-api
pm2 save
curl -s http://127.0.0.1:4001/api/health
```

### Car images (template inventory)

Seed runs with empty `uploads/` → cars show Lovable placeholder. Copy production car photos **read-only** into demo uploads, then sync DB:

```bash
# Copy car folders only (production untouched)
DEMO_UP=/var/www/demo-khodi/carnest/server/uploads
PROD_UP=/var/www/carnest/server/uploads
mkdir -p "$DEMO_UP"
for d in MG alcazar "kia seltos" creta rapid "tata hexa" xcent jaguar mercedese; do
  cp -a "$PROD_UP/$d" "$DEMO_UP/" 2>/dev/null || true
done
chmod -R 755 "$DEMO_UP"

cd /var/www/demo-khodi/carnest/server
npm run sync:template-cars
```

Verify: `curl -s https://demo.khodi.in/api/demo/sitaram-car-melo/cars?limit=1 | head -c 400` — `images` should start with `/uploads/`.

---

## STEP 4 — Frontends

```bash
cd /var/www/demo-khodi/carnest/client
npm ci && npm run build

cd /var/www/demo-khodi/carnest/demo-hub/client
npm ci && npm run build
```

---

## STEP 5 — Nginx

**`/etc/nginx/sites-available/demo.khodi.in`**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name demo.khodi.in;

    root /var/www/demo-khodi/carnest/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    client_max_body_size 25M;
}
```

**`/etc/nginx/sites-available/hub.demo.khodi.in`**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hub.demo.khodi.in;

    root /var/www/demo-khodi/carnest/demo-hub/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 25M;
}
```

```bash
sudo ln -sf /etc/nginx/sites-available/demo.khodi.in /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/hub.demo.khodi.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d demo.khodi.in -d hub.demo.khodi.in
```

---

## STEP 6 — Verify

```bash
curl -s https://carnest.in/api/health
curl -s https://demo.khodi.in/api/health
curl -sI https://hub.demo.khodi.in/
pm2 status
```

**`pm2 restart carnest-api` — NATHI.**

---

## Troubleshooting

### `hub.demo.khodi.in` → **500 Internal Server Error**

Nginx `root` folder missing or empty. Hub client build **alag** che — `client` build thi hub fix nathi thatu.

```bash
ls -la /var/www/demo-khodi/carnest/demo-hub/client/dist/index.html
# "No such file" → build karo:

cd /var/www/demo-khodi/carnest/demo-hub/client
npm ci && npm run build
ls -la dist/index.html

sudo nginx -t && sudo systemctl reload nginx
```

Still 500? Check nginx error log:

```bash
sudo tail -20 /var/log/nginx/error.log
```

### Car cards show “Your app will live here” / Lovable placeholder

`template_cars.images` = `/placeholder.svg` because demo `uploads/` was empty at seed time. Fix: copy car folders from production + `npm run sync:template-cars` (see STEP 3 above).

### Demo logo too small in header/footer

Custom hub logos use larger CSS after client rebuild. Re-upload logo in hub if it still looks wrong (use PNG/SVG ~400px wide).

### `demo.khodi.in` root `/` par Carnest landing page

**Expected.** Root = main site. Client demo **`/d/{slug}`** par chale (e.g. `https://demo.khodi.in/d/your-slug`). Pehla hub ma demo create karo.

### Hub login fails (browser, not 500)

`.env` ma URLs set karo ane restart:

```env
CLIENT_URLS=https://demo.khodi.in,https://hub.demo.khodi.in
```

```bash
pm2 restart demo-api
```

---

## Updates (demo only)

```bash
cd /var/www/demo-khodi/carnest
git pull
cd server && npm ci && npm run build && pm2 restart demo-api
cd ../client && npm ci && npm run build
cd ../demo-hub/client && npm ci && npm run build
sudo systemctl reload nginx
```
