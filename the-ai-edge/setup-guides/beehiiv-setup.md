# beehiiv Setup Guide — The AI Edge

Follow these steps to create your newsletter and connect your domain. Total time: ~20 minutes.

---

## 1. Create your beehiiv account

1. Go to [beehiiv.com](https://www.beehiiv.com) and click **Get started**.
2. Sign up with Google or email.
3. When prompted for **Publication name**, enter: **The AI Edge**.
4. Choose **Newsletter** as the publication type.

---

## 2. Configure branding and newsletter settings

### Branding (Settings → Publication → Branding)

- **Publication name:** The AI Edge
- **Tagline:** The best AI tools, workflows, and prompts — every week.
- **Logo:** Upload a simple logo (or use Canva to create one with text "The AI Edge").
- **Primary color:** Use a strong accent (e.g. `#2563eb` blue or `#059669` teal) for CTAs and links.
- **Font:** Keep default (clean, readable).

### Newsletter settings (Settings → Newsletter)

- **From name:** The AI Edge (or your name if you want a personal brand).
- **From email:** Use a domain email once connected (e.g. `hello@theaiedge.co`).
- **Reply-to:** Same or a personal email for reader replies.
- **Send time:** Pick one weekday morning (e.g. Tuesday 8:00 AM your timezone).
- **Timezone:** Set your correct timezone.

### Content default structure

- **Header:** Short intro line (e.g. "Your weekly dose of AI that actually works.")
- **Footer:** Unsubscribe link, address (use a virtual address or PO Box if needed), link to your Gumroad store and socials.

---

## 3. Connect a custom domain

### Option A: You already own a domain (e.g. theaiedge.co)

1. In beehiiv: **Settings → Domains → Add custom domain**.
2. Enter your domain (e.g. `theaiedge.co`).
3. beehiiv will show **CNAME** and **TXT** records. Keep this tab open.

4. In your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - Add the **CNAME** record exactly as beehiiv shows (usually `mail` or `send` → beehiiv’s host).
   - Add the **TXT** record for verification if shown.
5. Wait 5–60 minutes for DNS to propagate, then click **Verify** in beehiiv.
6. Set this domain as the **primary sending domain** so "From" uses `@theaiedge.co`.

### Option B: You don’t have a domain yet

1. Register a domain (e.g. [Namecheap](https://www.namecheap.com)): `theaiedge.co` or `theaiedge.io`.
2. Follow **Option A** steps 1–6 using that domain.

---

## 4. Create your first audience (list)

1. Go to **Audience → Subscribers**.
2. Your default list is usually "Everyone" or "Main list." Use this for the main newsletter.
3. Optional: Create a segment later for "Paid" if you add a premium tier.

---

## 5. Build your signup form / landing page

1. Go to **Growth → Signup forms**.
2. Create an **Inline** or **Embedded** form for your site.
3. Create a **Hosted signup page** — beehiiv gives you a URL like `theaiedge.beehiiv.com/subscribe`.
4. You can replace this later with your custom landing page (from this repo’s `landing-page/` folder) and embed the same form, or use the hosted page link in social bios.

---

## 6. Checklist before first send

- [ ] Publication name and tagline set
- [ ] From name/email and reply-to set
- [ ] Custom domain connected and verified (or using beehiiv default for now)
- [ ] Signup form or hosted page live and tested (subscribe with your own email)
- [ ] Welcome sequence added (see `content/welcome-sequence/` in this repo)

Once this is done, you’re ready to add the welcome sequence and publish Issue #1.
