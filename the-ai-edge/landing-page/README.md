# Landing page — The AI Edge

A single-page signup landing page for the newsletter.

## Setup

1. In beehiiv: **Growth → Signup forms** → Create or edit a form → copy the **Embed** code.
2. Open `index.html` and find the div with `id="beehiiv-embed"`.
3. Replace the placeholder paragraph inside it with your full beehiiv embed code (the `<script>` tag and the `<iframe>`).
4. Optionally update the Privacy link in the footer to point to your privacy page or beehiiv’s.

## Hosting

- **Option A:** Upload `index.html` to any static host (Netlify, Vercel, GitHub Pages, or your domain’s host). Point your domain or subdomain to it.
- **Option B:** Use the same content to build a page in Webflow, Framer, or Squarespace and embed the beehiiv form there.
- **Option C:** Use beehiiv’s own **Hosted signup page** (Growth → Signup forms → Hosted page) and share that URL instead — no hosting needed.

## Customization

- Edit the headline, tagline, and benefits in `index.html` to match your voice.
- Colors are in the `:root` CSS block at the top; change `--accent` to your brand color.
