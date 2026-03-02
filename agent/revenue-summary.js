/**
 * Fetch subscriber count (beehiiv) and optionally Gumroad sales, then send a short summary to Discord webhook.
 * Set DISCORD_WEBHOOK_URL to enable. Optional: BEEHIIV_API_KEY + publicationId for subscribers, GUMROAD_TOKEN for sales.
 */

const BEEHIIV_API = 'https://api.beehiiv.com/v2';

export async function sendRevenueSummary(config) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return { skipped: true, reason: 'DISCORD_WEBHOOK_URL not set' };

  const lines = [`**Family Faith — weekly summary** (${new Date().toISOString().slice(0, 10)})`];

  if (config.beehiivPublicationId && process.env.BEEHIIV_API_KEY) {
    try {
      const res = await fetch(
        `${BEEHIIV_API}/publications/${config.beehiivPublicationId}`,
        { headers: { Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const subs = data?.active_subscriptions ?? data?.stat_active_subscriptions ?? '—';
        lines.push(`Subscribers: ${subs}`);
      }
    } catch (e) {
      lines.push(`Subscribers: error (${e.message})`);
    }
  }

  if (process.env.GUMROAD_TOKEN) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const after = since.toISOString().slice(0, 10);
      const res = await fetch(
        `https://api.gumroad.com/v2/sales?after=${after}`,
        { headers: { Authorization: `Bearer ${process.env.GUMROAD_TOKEN}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const list = data?.sales ?? data?.purchases ?? [];
        const count = Array.isArray(list) ? list.length : 0;
        const total = Array.isArray(list)
          ? list.reduce((s, sale) => {
              const amt = sale?.amount ?? sale?.price ?? (sale?.price_cents / 100);
              return s + (parseFloat(amt) || 0);
            }, 0)
          : 0;
        lines.push(`Gumroad (last 7d): ${count} sale(s), $${total.toFixed(2)}`);
      }
    } catch (e) {
      lines.push(`Gumroad: error (${e.message})`);
    }
  }

  const content = lines.join('\n');
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Discord webhook ${res.status}: ${await res.text()}`);
  return { ok: true };
}
