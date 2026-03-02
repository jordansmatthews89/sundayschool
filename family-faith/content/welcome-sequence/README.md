# Welcome sequence — Set up in beehiiv

Three emails that run automatically when someone subscribes.

## Flow

1. **Email 1** — Sends immediately. Welcome + what to expect.
2. **Email 2** — Sends 1 day later. One verse + one question they can use at dinner or bedtime.
3. **Email 3** — Sends 3 days later. Soft pitch for your 3 Gumroad products.

## How to add in beehiiv

1. **Automations** → **Create automation**.
2. **Trigger:** Subscriber added → your main list.
3. Add three steps:
   - **Step 1:** Send email → delay **0 minutes** → use email-1-welcome.md (body + subject).
   - **Step 2:** Wait **1 day** → Send email → use email-2-value.md.
   - **Step 3:** Wait **3 days** (from signup) → Send email → use email-3-products.md.
4. In Email 3, replace every `[Link to Gumroad]` and price `[X]` with your real product URLs and prices.
5. Turn the automation **On**.

Test by subscribing with a second email and confirming all 3 arrive on schedule.
