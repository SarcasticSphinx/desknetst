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
Express delivery costs BDT 120.

## Interface
DeskNest uses a cobalt-blue workspace design with Space Grotesk headings and IBM Plex Sans body text. Desktop navigation is a fixed left rail; mobile navigation is a bottom bar. Product pages separate configuration from specifications. Fonts are hosted locally through Fontsource packages. The UI uses shadcn components and Lucide icons.
