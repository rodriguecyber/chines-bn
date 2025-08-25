## Backend Server

APIs for products and order submission (no checkout). Uses Express, PostgreSQL (Sequelize), Nodemailer, and JWT-based admin auth.

### Setup
1. Copy `.env.example` to `.env` and fill values
   - Use either `DATABASE_URL` or the `PG*` variables
   - Optionally set SMTP vars to send emails; otherwise emails are logged via JSON transport
2. Install deps and run dev server

```bash
npm install
npm run dev
```

Build and run production:
```bash
npm run build
npm start
```

### Environment
- `DATABASE_URL=postgres://user:pass@host:5432/dbname` (preferred) or:
  - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGSSL`
- `PORT` (default 4000)
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`
 - Auth: `JWT_SECRET` (>=16 chars), `JWT_EXPIRES_IN` (default `1d`)
 - Seeding (optional): `SEED_ADMIN_EMAIL` (default `admin@example.com`), `SEED_ADMIN_PASSWORD` (default `admin123`)

On startup, the server authenticates to PostgreSQL and runs `sequelize.sync()` to create/update tables. It also seeds an initial admin user if none exists with `SEED_ADMIN_EMAIL`.

### Endpoints
- GET `/api/health`
- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products` (admin)
- PUT `/api/products/:id` (admin)
- DELETE `/api/products/:id` (admin)
- POST `/api/orders` (submit order with user + items)
- GET `/api/orders/:id`
- GET `/api/orders?limit=50`
- POST `/api/auth/login` (body: `{ email, password }`) → `{ token }`

### Order payload
```json
{
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "+11234567890",
  "contact_message": "Please call me",
  "items": [
    { "product_id": 1, "quantity": 2, "price_cents": 1299 }
  ]
}
```