# Carnest API

Express + Sequelize + MySQL backend for the Carnest marketplace.

## MySQL connection

1. Start MySQL (8.x recommended).
2. Create the database (UTF-8):

   ```bash
   mysql -u root -p < sql/init-mysql.sql
   ```

   Or run the `CREATE DATABASE` statement from [`sql/init-mysql.sql`](sql/init-mysql.sql) in MySQL Workbench / CLI.
3. Copy `.env.example` to `.env` and set **`DB_HOST`**, **`DB_PORT`**, **`DB_NAME`**, **`DB_USER`**, **`DB_PASSWORD`**.
4. **India (IST):** default `DB_TIMEZONE=+05:30` in `.env` — change if your DB server uses UTC only.
5. **Cloud MySQL (RDS, Azure, etc.):** set `DB_SSL=true` (and optionally `DB_SSL_REJECT_UNAUTHORIZED=false` for dev certs).
6. Run `npm run dev` — on success you should see `[DB] MySQL connection OK` and tables created via `sequelize.sync` (development uses `alter: true`).

Pool tuning: `DB_POOL_MAX`, `DB_POOL_MIN`, `DB_POOL_ACQUIRE`, `DB_POOL_IDLE` (see `.env.example`).

## Setup

1. Ensure MySQL is configured as above.
2. Copy `.env.example` to `.env` and set `DB_*`, `JWT_SECRET`, and `CLIENT_URL`.
3. Install and run:

```bash
npm install
npm run dev
```

Default API URL: `http://localhost:4000`.

## Seed (development)

After the database is configured:

```bash
npm run seed
```

This creates an **admin** user (development credentials printed in the console; change in production), **four demo buyer accounts** (`rahul@demo.com`, `sneha@demo.com`, `vikram@demo.com`, `ananya@demo.com` — password `User123!`), inserts **~30 sample cars** if the `cars` table is empty (Petrol/Diesel/Electric/Hybrid/**CNG**, Automatic/Manual, major cities), and seeds a default **`site_settings`** row (homepage CMS) if missing. Sample cars include **`is_featured: true`** rows so the client home “Featured” / “Luxury Collection” sections populate when you call `GET /api/cars?featured=true`.

If **Browse Cars** shows `0 cars available`, the API is running but the database has no rows: run `npm run seed` with MySQL up, or **`npm run seed:refresh`** to replace the catalog after seed data changes. The Vite dev app proxies `/api` to `http://localhost:4000`; for `vite preview`, the same proxy is configured—still start the API, or set `VITE_API_URL` to your API origin.

**Replace existing listings** (deletes all bookings and saved cars, then cars, then re-inserts the catalog):

```bash
npm run seed:refresh
```

Same as `npm run seed` with `--force`, or set `FORCE_RESEED_CARS=true` in the environment before `npm run seed`.

## Endpoints

- `GET /api/health` — DB connectivity
- `POST /api/auth/register` | `POST /api/auth/login`
- `GET /api/cars` — query: `page`, `limit`, `brand`, `minPrice`, `maxPrice`, `fuel_type`, `transmission`, `location`, `featured`, `sort`, `order`
- `GET /api/cars/:id` — car + similar list
- `POST|PUT|DELETE /api/cars` — admin + JWT
- `POST /api/bookings` — JWT user
- `GET /api/bookings/user` — JWT user
- `POST /api/sell` — multipart (`name`, `phone`, `car_details`, `images[]`)
- `GET|POST|DELETE /api/wishlist` — JWT
- `POST /api/upload` — JWT, multipart `files[]`
- `POST /api/contact` — public; JSON `name`, `email`, `message`, optional `phone` (stores `contact_inquiries`)
- `GET /api/site/public` — public; homepage CMS JSON (`hero`, `testimonials`, `contact`)
- `GET /api/admin/stats` — admin + JWT
- `GET /api/admin/sell-requests` — admin; query `page`, `limit`, `status`
- `PATCH /api/admin/sell-requests/:id` — admin; body `status`, `admin_notes`
- `GET /api/admin/bookings` — admin; query `page`, `limit`, `status`
- `PATCH /api/admin/bookings/:id` — admin; body `status`
- `GET /api/admin/site` — admin; full CMS document
- `PUT /api/admin/site` — admin; body `{ content }` partial merge (top-level keys)

Static uploads are served at `/uploads/...` when not using Cloudinary.
