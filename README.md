## White-Label E-Commerce App (React + Node)

Monorepo with `frontend/` (React + TypeScript + Tailwind) and `backend/` (Node.js + Express). Multi-tenant via config.

### Quickstart

- Terminal 1:
  - `cd backend`
  - `npm install`
  - `npm run dev`
- Terminal 2:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

Open `http://localhost:5173/?tenant=brandA` (or `?tenant=brandB`).

### Sample Accounts
- brandA admin: `admin@aurora.test` / `admin`
- brandA user: `alice@aurora.test` / `password`
- brandB admin: `admin@nimbus.test` / `admin`
- brandB user: `noah@nimbus.test` / `password`

### Notes
- Demo only. Passwords are plain text and data persists in memory.
- Use the Admin screen to create categories/products (requires admin).