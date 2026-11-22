<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BISD Trespass Management

Web app for managing school trespass records (Vite + React + Supabase).

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your Supabase credentials (Project URL and anon key from [Supabase](https://supabase.com/dashboard) → Project settings → API):

   ```bash
   cp .env.example .env.local
   ```

   Set at least:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. Start the dev server:

   ```bash
   npm run dev
   ```

The app listens on port 3000 by default.

**Security:** Never commit `.env` or `.env.local`. Rely on Supabase Row Level Security for data access; review policies for project ref shown in your dashboard URL.