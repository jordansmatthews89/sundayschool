import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSubscriberStats } from '@/lib/beehiiv';
import { readJson } from '@/lib/github';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results: {
    subscribers: number;
    gumroadRevenue: number | null;
    gumroadSales: unknown[];
  } = { subscribers: 0, gumroadRevenue: null, gumroadSales: [] };

  try {
    const { data: config } = await readJson<{ beehiivPublicationId?: string }>('agent/config.json');
    if (config.beehiivPublicationId && process.env.BEEHIIV_API_KEY) {
      const stats = await getSubscriberStats(config.beehiivPublicationId);
      results.subscribers = stats.total;
    }
  } catch {
    // beehiiv not configured
  }

  if (process.env.GUMROAD_ACCESS_TOKEN) {
    try {
      const resp = await fetch('https://api.gumroad.com/v2/sales?page=1', {
        headers: { Authorization: `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}` },
      });
      if (resp.ok) {
        const data = (await resp.json()) as { sales?: Array<{ price: number }> };
        results.gumroadSales = data.sales ?? [];
        results.gumroadRevenue = (data.sales ?? []).reduce(
          (sum: number, s) => sum + (s.price ?? 0),
          0
        ) / 100;
      }
    } catch {
      // gumroad not configured
    }
  }

  return NextResponse.json(results);
}
