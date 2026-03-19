# Car Catalog — Japanese Used Cars

A fullstack web application for browsing Japanese used cars scraped from [CarSensor.net](https://www.carsensor.net). Built with Next.js 16, Prisma 7, and Neon PostgreSQL.

## Features

- **Web Scraping** — Automated hourly scraping from CarSensor.net with Japanese → English translation
- **JWT Authentication** — Secure login with httpOnly cookie-based sessions
- **Advanced Filtering** — Search by brand, body type, fuel type, transmission, year range, price range
- **Sorting & Pagination** — Sort by price, year, mileage, or date added
- **Responsive Design** — Editorial automotive aesthetic, optimized for desktop and mobile
- **Car Detail Pages** — Image gallery with thumbnails, full specifications, external links

## Tech Stack

- **Framework**: Next.js 16.2 (App Router, React 19, TypeScript)
- **Database**: Neon PostgreSQL with Prisma 7 ORM
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Auth**: jose JWT + httpOnly cookies
- **Scraper**: cheerio + node-cron (hourly schedule)
- **Fonts**: DM Serif Display (headings) + Geist (body)

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database (or any PostgreSQL instance)

### Setup

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed admin user (admin / admin123)
npm run db:seed

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production (runs migrations first) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed admin user |
| `npm run scraper` | Start scraper with hourly cron |

## Deployment

### Vercel (Web App)

1. Connect your GitHub repo to Vercel
2. Set environment variables (`DATABASE_URL`, `JWT_SECRET`)
3. Build command is already configured: `prisma migrate deploy && next build`

### Railway (Scraper)

Deploy `npm run scraper` as a background worker on Railway with the same `DATABASE_URL`.

## Project Structure

```
app/
  api/            # REST API routes (auth, cars)
  cars/           # Car list and detail pages
  login/          # Login page
components/       # Reusable UI components
lib/              # Prisma client, auth, translations
prisma/           # Schema and migrations
scraper/          # CarSensor.net scraper + cron
```

## Login

Default credentials: `admin` / `admin123`
