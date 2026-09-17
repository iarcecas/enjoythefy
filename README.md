# Enjoythefy

> **Note on Project Status:** Development on this project has been discontinued. Spotify introduced native listening history and analytics features directly into their platform after work on this project began, rendering further development redundant.

A full-stack Spotify analytics and listening-history dashboard built with Next.js (App Router), TypeScript, tRPC, Drizzle ORM, and Tailwind CSS.

---

## Features

* **Spotify Integration:** OAuth authorization flow, token refresh handling, recently played tracks, and top tracks.
* **Listening History & Stats:** Aggregated listening patterns, track history tracking, and scheduled sync via background functions.
* **End-to-End Type Safety:** Type-safe API client and procedures powered by tRPC.
* **Database & ORM:** Drizzle ORM configured for schema definitions, migrations, and relational queries.
* **Modern UI:** Styled using Tailwind CSS, `next-themes`, and custom UI components.

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **API:** tRPC & Next.js API Routes
* **Database / ORM:** Drizzle ORM (`drizzle-kit`)
* **Styling:** Tailwind CSS, PostCSS
* **Serverless / Background Tasks:** Netlify Functions (`spotify-history.ts`)

---

## Repository Structure

```text
enjoythefy-main/
├── netlify/
│   └── functions/          # Scheduled / background tasks (Spotify history sync)
├── src/
│   ├── app/                # Next.js App Router (pages, auth routes, APIs)
│   ├── components/         # Dashboard widgets, UI components, Spotify buttons
│   ├── lib/                # Utility helpers & Spotify API client wrappers
│   ├── server/             # Backend logic: tRPC routers, context, DB schema
│   ├── styles/             # Global stylesheets
│   └── trpc/               # React Query & tRPC client integration
├── drizzle.config.ts       # Drizzle ORM configuration
└── netlify.toml            # Deployment & redirect configurations
```

---

## Getting Started

### 1. Prerequisites

* **Node.js:** v18.17+ (or v20+)
* **Package Manager:** `pnpm` (recommended) or `npm`
* **Spotify Developer Account:** To create an app and obtain API keys

---

### 2. Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Populate the required environment variables:

```ini
# Database
DATABASE_URL=

# Spotify API
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

# Auth / Next.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

### 3. Installation

Install dependencies using `pnpm`:

```bash
pnpm install
```

---

### 4. Database Setup

Push the schema migrations to your database using Drizzle:

```bash
pnpm db:push
```

---

### 5. Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

* **Netlify:** The repository includes `netlify.toml` and Netlify Functions for scheduled Spotify data syncs. Link the repository to your Netlify dashboard and configure the environment variables under **Site configuration > Environment variables**.
* **Vercel / Node Hosting:** Can be deployed to standard Node/Vercel environments (adjust scheduled jobs to Vercel Cron or external webhooks if needed).
