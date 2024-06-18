# Arcadia — NUST Library Management System

A full-stack university library management platform built for NUST. Students can browse books, borrow them, and track their reading history. Admins manage the entire catalogue, user approvals, and borrow records through a dedicated dashboard.

## Features

**Student Side**
- Email/password authentication with NUST ID card verification
- Browse and search the full book catalogue with filtering
- Borrow books and receive PDF receipts
- Track borrowed books and due dates on your profile
- 3D animated book covers

**Admin Side**
- Dashboard with real-time library statistics
- User management and account approval workflow
- Book catalogue management (add, edit, delete)
- Borrow records tracking across all users
- Role-based access control (User / Admin)

**Platform**
- Automated welcome emails and borrow reminders
- Rate limiting and DDoS protection
- Media optimization via ImageKit
- Serverless-ready deployment

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + ShadCN/UI |
| Auth | NextAuth v5 (credentials) |
| Database | PostgreSQL via Neon + Drizzle ORM |
| Caching | Upstash Redis |
| Workflows | Upstash QStash |
| Media | ImageKit |
| Email | Resend |
| Deployment | Vercel |

## Getting Started

### Required Accounts (all free tier)

| Service | What For | Free Tier |
|---------|----------|-----------|
| [Neon](https://neon.tech) | PostgreSQL database | 0.5 GB forever |
| [Upstash](https://upstash.com) | Redis + QStash | 10K commands/day |
| [ImageKit](https://imagekit.io) | Image/video storage | 20 GB/month |
| [Resend](https://resend.com) | Transactional email | 3K emails/month |
| [Vercel](https://vercel.com) | Deployment | Hobby tier free |

### Environment Variables

Create `.env.local` in the project root:

```env
# App
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_PROD_API_ENDPOINT=https://your-domain.vercel.app

# Database — from Neon dashboard
DATABASE_URL=

# Auth — generate with: openssl rand -base64 32
AUTH_SECRET=

# ImageKit — from ImageKit dashboard
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Upstash Redis — from Upstash console
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Upstash QStash — from Upstash console
QSTASH_URL=
QSTASH_TOKEN=

# Resend — from Resend dashboard
RESEND_TOKEN=
```

### Install and Run

```bash
npm install

# Run database migrations
npm run db:migrate

# Seed with sample books
npm run seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Commands

```bash
npm run db:generate   # Generate a new migration after schema changes
npm run db:migrate    # Apply pending migrations
npm run db:studio     # Open Drizzle Studio (visual DB browser)
npm run seed          # Seed sample books
```

## Project Structure

```
arcadia/
├── app/
│   ├── admin/          # Admin panel (dashboard, books, users)
│   ├── api/            # API routes (auth, imagekit, workflows)
│   ├── (auth)/         # Public auth pages (sign-in, sign-up)
│   └── (root)/         # Protected user pages (home, library, profile)
├── components/         # Shared React components
│   ├── admin/          # Admin-specific components
│   └── ui/             # ShadCN base components
├── database/
│   ├── schema.ts       # Drizzle table definitions
│   └── drizzle.ts      # DB client
├── lib/
│   ├── actions/        # Server actions (auth, books)
│   ├── config.ts       # Environment variable wrapper
│   ├── ratelimit.ts    # Upstash rate limiting
│   └── workflow.ts     # Email workflow client
└── migrations/         # Drizzle SQL migrations
```

## Deployment

Deploy to Vercel. Add all environment variables from `.env.local` to your Vercel project settings, then trigger a deployment. Set `NEXT_PUBLIC_PROD_API_ENDPOINT` to your Vercel deployment URL.

## License

MIT

## Author

Built by **Asad** — NUST student, software engineering enthusiast.
