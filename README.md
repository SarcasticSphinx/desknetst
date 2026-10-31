# DeskNest
A minimal desk-accessory shop built with Next.js, Prisma and Neon PostgreSQL.

## Run locally
Node.js 24 is recommended. Copy `.env.example` to `.env` and configure your own database.

```sh
npm ci
npx prisma migrate deploy
npm run db:seed
npm run dev -- --port 3001
```

## Checks
```sh
npm run typecheck
npm run lint
npm run test:coverage
npm run build
```

Product photos are illustrative stock photographs. Options, prices and specifications form a student demonstration catalogue. No real payment is collected. Guest checkout stores orders in the configured database.

## Delivery
Standard delivery costs BDT 60.
