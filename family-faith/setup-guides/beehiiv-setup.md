# beehiiv Setup Guide — Family Faith

Follow these steps to create your newsletter and connect your domain. Total time: ~20 minutes.

---

## 1. Create your beehiiv account

1. Go to [beehiiv.com](https://www.beehiiv.com) and click **Get started**.
2. Sign up with Google or email.
3. When prompted for **Publication name**, enter: **Family Faith** (or **The Sunday Table** — pick one and use it everywhere).
4. Choose **Newsletter** as the publication type.

---

## 2. Configure branding and newsletter settings

### Branding (Settings → Publication → Branding)

- **Publication name:** Family Faith
- **Tagline:** Ready-to-use family Bible lessons and devotionals — every week.
- **Logo:** Upload a simple logo or use text. Warm, family-friendly feel.
- **Primary color:** Use a warm accent (e.g. soft blue, green, or burgundy) for CTAs and links.
- **Font:** Clean, readable (default is fine).

### Newsletter settings (Settings → Newsletter)

- **From name:** Family Faith (or your name if you want a personal brand).
- **From email:** Use a domain email once connected (e.g. `hello@familyfaith.co`).
- **Reply-to:** Same or a personal email for reader replies.
- **Send time:** Pick one weekday (e.g. Tuesday or Wednesday morning).
- **Timezone:** Set your correct timezone.

### Content default structure

- **Header:** Short intro (e.g. "Your weekly dose of family faith — no prep required.")
- **Footer:** Unsubscribe link, address, link to your Gumroad store and/or curriculum page.

---

## 3. Connect a custom domain

### Option A: You already own a domain

1. In beehiiv: **Settings → Domains → Add custom domain**.
2. Enter your domain (e.g. `familyfaith.co` or `thesundaytable.com`).
3. beehiiv will show **CNAME** and **TXT** records.

4. In your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - Add the **CNAME** record exactly as beehiiv shows.
   - Add the **TXT** record for verification if shown.
5. Wait 5–60 minutes, then click **Verify** in beehiiv.
6. Set this domain as the **primary sending domain**.

### Option B: You don’t have a domain yet

1. Register a domain (e.g. familyfaith.co, thesundaytable.com).
2. Follow Option A steps 1–6.

---

## 4. Create your first audience (list)

1. Go to **Audience → Subscribers**.
2. Use the default list (e.g. "Everyone" or "Main list") for your main newsletter.

---

## 5. Build your signup form / landing page

1. Go to **Growth → Signup forms**.
2. Create an **Inline** or **Embedded** form for your site.
3. Create a **Hosted signup page** — you get a URL like `familyfaith.beehiiv.com/subscribe`.
4. You can replace this later with your custom landing page from `../landing-page/` and embed the same form.

---

## 6. Checklist before first send

- [ ] Publication name and tagline set
- [ ] From name/email and reply-to set
- [ ] Custom domain connected and verified (or using beehiiv default for now)
- [ ] Signup form or hosted page live and tested
- [ ] Welcome sequence added (see `content/welcome-sequence/` in this repo)

Once this is done, add the welcome sequence and publish Issue #1.
