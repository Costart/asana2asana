# Next.js + Supabase Template

A production-ready full-stack template with authentication, dashboard, and clean architecture.

## Stack

- **Next.js 16** - React framework
- **Supabase** - Database + Auth
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Hosting (recommended)

## Features

- ✅ Email/password authentication
- ✅ Protected routes with middleware
- ✅ Dashboard layout with navigation
- ✅ Reusable UI components
- ✅ Type-safe Supabase client
- ✅ Auto-redirect based on auth state
- ✅ Clean folder structure

## Quick Start

### 1. Clone the template

```bash
# Use this template on GitHub, then:
git clone https://github.com/YOUR_USERNAME/your-project-name
cd your-project-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # Protected pages
│   ├── api/             # API routes
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Auth forms
│   └── layout/          # Layout components
├── lib/
│   ├── supabase/        # Supabase client setup
│   └── hooks/           # React hooks
└── types/               # TypeScript types
```

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy

Vercel will auto-deploy on every push to main.

## What's Next?

- Add your database tables in Supabase
- Build features in the dashboard
- Customize the UI components
- Add more pages and routes

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
