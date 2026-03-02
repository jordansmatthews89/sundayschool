# Family Faith — Hub + Lesson Viewer

Static site: hub page (newsletter signup, Gumroad, shop) and lesson viewer (browse lessons, open leader guide / student sheet / family take-home; print or copy).

## Run locally

Open `index.html` in a browser, or serve the folder (e.g. `npx serve .` or your static host).

## Public URL (deploy)

To get a public URL for the site (including the admin dashboard at `admin.html`):

1. Push this repo to GitHub (if it isn’t already).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. Set **Root Directory** to `site` (Override → enter `site`).
4. Deploy. Vercel will give you a URL like `https://your-project.vercel.app`.

Then the admin dashboard is: **`https://your-project.vercel.app/admin.html`**.

## Rebuild lesson pages

When you add or edit lessons under `../curriculum/lessons/`, regenerate the HTML:

```bash
cd site
npm run build-lessons
```

Then add the new lesson to `lessons/index.html` (and to the `LESSONS` array in `build-lessons.js` if the folder name is new).

## Add a new lesson

1. Create `curriculum/lessons/[slug]/` with `leader-guide.md`, `student-sheet.md`, `family-take-home.md`.
2. In `site/build-lessons.js`, add an entry to the `LESSONS` array: `{ slug: 'your-slug', lessonTitle: 'Display Name', seriesName: 'Series Name' }`.
3. Run `npm run build-lessons`.
4. In `site/lessons/index.html`, add a link under the right series (or a new series block) to `[slug]/leader-guide.html` (and meta links for student-sheet, family-take-home).

## Hub links

Replace `#` in `index.html` with your beehiiv signup embed, Gumroad product URLs, and print store URL.
