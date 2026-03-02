# Fix 404 on sundayschool-khaki.vercel.app

Your app is building successfully, but the domain is pointing at the wrong deployment.

## Step 1: Get the working URL

1. Go to **https://vercel.com** → open project **sundayschool**
2. Click **Deployments**
3. Find the **top** deployment that has a **green dot (Ready)** and a recent commit like "Middleware: avoid process.env..." or "Fix Edge middleware..."
4. Click that deployment
5. In the right panel under **Domains**, you'll see 2 URLs. Click the one that looks like:
   - **sundayschool-XXXXXXXX-jordan-matthews-projects.vercel.app**
6. That link should open your app (home page with "Family Faith"). If it loads, the app works — the issue is only the main domain.

## Step 2: Point sundayschool-khaki.vercel.app to that deployment

1. In Vercel, go to **Settings** (top) → **Domains** (left sidebar)
2. You'll see **sundayschool-khaki.vercel.app** in the list
3. Click the **⋯** (three dots) next to it → **Edit** or **Configure**
4. If there's an option to **Assign to deployment**, choose the **latest Ready** deployment (the one that worked in Step 1)
5. Save

**OR** (simpler):

1. Go to **Deployments** → click the **latest Ready** deployment
2. In that deployment's page, find **"Promote to Production"** or **"Set as Production"** (or under ⋯ menu)
3. Click it — that makes this deployment the one served by your production domain

## Step 3: Wait and test

Wait ~30 seconds, then open **https://sundayschool-khaki.vercel.app** again. You should see the Family Faith home page.

---

**If you can't find "Promote to Production":** Just use the deployment URL from Step 1 as your app URL for now (e.g. `sundayschool-7ovg07p8c-jordan-matthews-projects.vercel.app`). You can add a custom domain later.
