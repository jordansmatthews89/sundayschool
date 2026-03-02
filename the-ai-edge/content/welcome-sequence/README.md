# Welcome sequence — Set up in beehiiv

This folder contains the 3 emails for your automated welcome sequence.

## Flow

1. **Email 1** — Sends immediately when someone subscribes. Welcome + what to expect.
2. **Email 2** — Sends 1 day after signup. One copy-paste prompt to use while they wait.
3. **Email 3** — Sends 3 days after signup. Soft pitch for your 3 Gumroad products.

## How to add in beehiiv

1. Go to **Automations** in the left sidebar.
2. Click **Create automation**.
3. **Trigger:** Choose **Subscriber added** → select your main audience/list.
4. Add three steps:
   - **Step 1:** Send email → delay **0 minutes** → use `email-1-welcome.md` (copy body, pick subject).
   - **Step 2:** Wait **1 day** → Send email → use `email-2-value.md`.
   - **Step 3:** Wait **3 days** (from signup, so 2 days after step 2) → Send email → use `email-3-products.md`.
5. Before publishing Email 3, replace `[Link to Gumroad]` with your real product URLs from Gumroad.
6. Turn the automation **On**.

Test by subscribing with a second email and checking that all 3 arrive on schedule.
