# Delusionify App

Core web application for the Delusionify platform. Built with Next.js 14, TypeScript, Tailwind CSS, and integrated with Clerk, Supabase, and Replicate APIs.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Environment variables configured in `.env.local`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── page.tsx           # Dashboard home
│   ├── upload/            # Upload selfie
│   ├── templates/         # Browse templates
│   ├── history/           # View generation history
│   ├── billing/           # Subscription plans
│   ├── settings/          # User settings
│   ├── api/               # API routes
│   │   ├── generation/    # Create & fetch generation jobs
│   │   └── webhooks/      # Replicate & Stripe webhooks
│   └── globals.css        # Global styles
├── lib/
│   ├── supabase.ts       # Supabase client & helpers
│   └── utils.ts          # Utility functions
├── .env.local            # Environment variables
├── next.config.js        # Next.js config
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config
```

## Environment Variables

See `.env.local` for required keys:

- **Supabase:** URL, Anon Key, Service Role Key
- **Clerk:** Publishable Key, Secret Key
- **Replicate:** API Token
- **Stripe:** Publishable Key, Secret Key, Webhook Secret
- **OpenAI:** API Key

## Features

### MVP (Phase 1)

- ✅ Clerk authentication (email/password + social sign-in)
- ✅ Dashboard with navigation
- ✅ Upload selfie page
- ✅ Browse 11 curated templates (Founder, Luxury, Travel packs)
- ✅ Generation history view
- ✅ Billing & subscription management
- ✅ User settings
- 🚧 FLUX image generation (API routes ready)
- 🚧 Job status polling
- 🚧 Stripe integration

### Phase 2+

- Prompt-based generation
- Video generation (LivePortrait, Kling)
- Expanded templates
- Analytics dashboard

## API Routes

### POST `/api/generation`

Create a new generation job.

**Request:**
```json
{
  "mode": "template|prompt|transform",
  "selfie_url": "...",
  "input_template": "...",
  "input_prompt": "...",
  "input_video_url": "..."
}
```

**Response:** Job object with status `pending`

### GET `/api/generation/[id]`

Fetch job status and results.

**Response:** Job object with current status and output URLs.

### POST `/api/webhooks/replicate`

Webhook for Replicate job completion. Updates job status and stores output.

## Styling

Uses Tailwind CSS with a dark theme (slate-900 background). Color scheme:

- Primary: Blue-600
- Secondary: Slate-800
- Accent: Slate-700
- Text: White/Slate-300

## Development Notes

- TypeScript is strict (`strict: true`)
- All API routes require Clerk authentication
- Row-level security enabled on Supabase `jobs` table
- Images are optimized via Next.js `Image` component
- Responsive design with Tailwind breakpoints (md, lg)

## Deployment

Deploy to Vercel for automatic builds and serverless functions:

```bash
vercel deploy
```

Ensure environment variables are set in Vercel project settings before deploying.
