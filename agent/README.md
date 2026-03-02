# Family Faith — Weekly Agent

Semi-automated weekly run: picks the next lesson from the curriculum, generates newsletter + social posts via OpenAI, saves output. Optionally creates a beehiiv draft.

## Setup

```bash
cd agent
npm install
```

## Environment variables

Put secrets in **environment variables** only (never in `config.json` or committed files). For local runs you can use a `.env` file in the `agent/` folder (or project root); the script loads it automatically. Add `.env` to `.gitignore` (already done) so it is never committed.

- **OPENAI_API_KEY** — Required. Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
- **BEEHIIV_API_KEY** — Optional. For `--draft` and for revenue summary (subscriber count).
- **TWITTER_API_KEY**, **TWITTER_API_SECRET**, **TWITTER_ACCESS_TOKEN**, **TWITTER_ACCESS_TOKEN_SECRET** — Optional. To post the generated tweet to X automatically.
- **DISCORD_WEBHOOK_URL** — Optional. To send a weekly revenue summary (subscribers, Gumroad sales) to a Discord channel.
- **GUMROAD_TOKEN** — Optional. For revenue summary (sales in last 7 days). Create at Gumroad → Settings → Advanced → API.

## Config

Edit `config.json`:

- **nextLessonIndex** — Advanced by the script each run (wraps around the schedule).
- **beehiivPublicationId** — Your publication ID (e.g. `pub_xxx`). Required for `--draft`.
- **signupUrl** — Your newsletter signup URL (used in social post placeholders).

Edit `lesson-schedule.json` to change the order of lessons or add new ones (use the `slug` of a folder under `curriculum/lessons/`).

## Run

**Generate only (save to `output/YYYY-MM-DD/`):**

```bash
npm run run-weekly
```

**Generate and create a beehiiv draft:**

```bash
npm run run-weekly:draft
```

Or:

```bash
node run-weekly.js --draft
```

Output files: `newsletter.md`, `subject.md`, `social-linkedin.md`, `social-x.md`, `meta.json`.

## GitHub Actions

The workflow `.github/workflows/run-weekly.yml` runs every Monday (9 AM UTC). Add these repo secrets:

- **OPENAI_API_KEY** (required)
- **BEEHIIV_API_KEY** (optional, for draft)
- **TWITTER_*** (optional, for X post)
- **DISCORD_WEBHOOK_URL** (optional, for weekly summary)
- **GUMROAD_TOKEN** (optional, for summary sales)

Output is uploaded as an artifact and `agent/config.json` / `agent/output/` are committed so the next run picks the next lesson.

## Note on beehiiv API

The beehiiv Posts API (create post/draft) is in beta and may require an Enterprise plan. If draft creation fails, use the generated markdown files and paste into beehiiv manually.
