# Umrah Quotation (prototype)

Next.js (App Router) + MongoDB (Mongoose) + Tailwind. Auth is bcrypt + JWT, with the token kept in localStorage.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI and JWT_SECRET
npm run dev                  # http://localhost:3000
```

- `MONGODB_URI`: your Atlas connection string, including a database name.
- `JWT_SECRET`: a long random string (`openssl rand -base64 48`).
- In Atlas > Network Access, allow `0.0.0.0/0` (Vercel's IPs aren't fixed).

## Make the first admin

Signup always creates a normal user (`isAdmin: false`). In Atlas, open the `users`
collection, edit your user and set `isAdmin` to `true`, then log in again.
Admins land on `/admin`; everyone else lands on `/dashboard`.

## Load the price data (seed)

```bash
npm run seed             # adds whatever is missing; never overwrites existing rows
npm run seed -- --reset  # deletes all price data first, then loads it fresh
```

It fills hotels, transport, vehicles, airlines, visa fees and settings. Users and
quotations are never touched, and quotations keep their own saved prices, so a
reset is safe. The data in `scripts/seed-data.json` is **dummy** (invented rates).
To use real rates without committing them, copy it to
`scripts/seed-data.local.json` (gitignored), edit it, and run the seed again:
the local file is used automatically when it exists.

## Deploy to Vercel

Import the repo, add the same two env vars (`MONGODB_URI`, `JWT_SECRET`) under
Project Settings > Environment Variables, and deploy.

## Layout

```
src/app/          pages and API routes
src/components/   ui/, layout/, quotation/, admin/
src/lib/          db, auth (JWT + withAuth), session, api client, cache
src/models/       Mongoose schemas
scripts/          seed script and sample data
```
