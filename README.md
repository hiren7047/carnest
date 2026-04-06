# Carnest

Premium used-car marketplace: **React (Vite) client** + **Express + Sequelize + MySQL** API.

## Prerequisites

- Node.js 20+
- MySQL 8+

## Quick start

### 1. Database

Create a database named `carnest` (or set `DB_NAME` in `server/.env`).

### 2. API (`server/`)

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL credentials and JWT_SECRET
npm install
npm run seed
npm run dev
```

API listens on **http://localhost:4000** by default.

**Development admin (after seed):** see console output from `npm run seed` — change this password in production.

### 3. Client (`client/`)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs on **http://localhost:8080** and proxies `/api` to the API in development (`vite.config.ts`).

## Project layout

- [`client/`](client/) — Vite + React + TypeScript + Tailwind + React Router + Axios + TanStack Query
- [`server/`](server/) — Express + Sequelize + JWT + Multer

## Production notes

- Set `VITE_API_URL` on the client to your public API origin.
- Set `CLIENT_URL` on the server for CORS.
- Use strong `JWT_SECRET`, HTTPS, and managed MySQL.
- Optional: configure Cloudinary in `server/.env` for uploads (see `server/.env.example`).
