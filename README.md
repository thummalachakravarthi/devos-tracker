# DevOS · Mission 240

Personal study + health tracker. Java prep HQ (240-day plan, daily 3-hour target, DSA log),
habit checklist (steps, water, supplements, reading…), streaks, monthly heatmaps, weekly report card.

**Stack:** React (Vite) + Tailwind + Recharts · Supabase (Postgres + Auth) · deploys free on Vercel.

---

## 1 · Supabase setup (once, ~10 minutes)

1. Go to <https://supabase.com> → sign in with GitHub → **New project** (free tier).
   Pick any name/password, region `ap-south-1 (Mumbai)`.
2. Wait for the project to provision, then open **SQL Editor → New query**.
3. Paste the entire contents of **`schema.sql`** (in this repo) → **Run**. You should see "Success".
4. *(Recommended, since this app is just for you)*: **Authentication → Sign In / Up → Email → turn OFF "Confirm email"** — lets you sign in instantly without a confirmation mail.
5. **Project Settings → API** → copy two values:
   - `Project URL`
   - `anon public` key

## 2 · Run locally

```bash
npm install
cp .env.example .env      # then paste your URL + anon key into .env
npm run dev               # opens http://localhost:5173
```

First open → **Create your account** (any email + password). The app auto-creates your
settings row and seeds your habit list from the Excel checklist. Done — start checking things off.

## 3 · Push to GitHub

```bash
git init
git add .
git commit -m "DevOS tracker v1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/devos-tracker.git
git push -u origin main
```

`.env` is gitignored — your keys never reach GitHub.

## 4 · Deploy to Vercel (free, ~5 minutes)

1. <https://vercel.com> → sign in with GitHub → **Add New → Project** → import `devos-tracker`.
2. Framework is auto-detected as **Vite**. Before deploying, open **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
3. **Deploy.** You get a URL like `devos-tracker.vercel.app` — open it anywhere, phone or laptop.
4. On your phone: open the URL in Chrome → menu → **Add to Home screen**. Now it launches like an app.

Every future `git push` to `main` auto-redeploys. That's the whole pipeline.

## 5 · Make it yours

- **Plan phases & DSA milestones** → edit `src/config/plan.js` (plain arrays, self-explanatory).
- **Plan start date** → editable inside the app (Java HQ → pencil icon next to "started …").
- **Habits** → fully managed in-app (Habits tab): add, edit targets, reorder, archive.
- **Colours / fonts** → `tailwind.config.js`.

## Is my data safe?

- Data lives in *your own* Supabase project, protected by Row Level Security — every table
  only returns rows where `user_id = auth.uid()`.
- The anon key in the frontend is designed to be public; RLS is what enforces access.
- Backup anytime: Supabase Dashboard → Database → Backups (daily on free tier), or export CSVs.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Almost there ☕" screen | `.env` missing/empty → copy `.env.example`, fill values, restart dev server |
| "Couldn't load data" after login | `schema.sql` not run, or run partially → re-run it in SQL Editor |
| Sign-up says "check your email" | You left email confirmation ON — either confirm via the mail or disable it (step 1.4) |
| Vercel build fails | Env vars not set in Vercel → add both `VITE_*` vars, redeploy |
