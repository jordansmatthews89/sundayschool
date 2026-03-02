'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, DollarSign, RefreshCw, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';

interface Analytics {
  subscribers: number;
  gumroadRevenue: number | null;
  gumroadSales: Array<{ price: number; product_name?: string; created_at?: string }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const resp = await fetch('/api/analytics');
    const json = await resp.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-64"><RefreshCw className="animate-spin text-teal-500" size={28} /></div>;
  }

  const recentSales = (data?.gumroadSales ?? []).slice(0, 10);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-teal-500" /> Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">Subscriber and revenue overview.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw size={14} className="mr-1" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Subscribers"
          value={data?.subscribers ?? '—'}
          sub="beehiiv"
          accent
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={data?.gumroadRevenue != null ? `$${data.gumroadRevenue.toFixed(2)}` : '—'}
          sub="Gumroad"
        />
        <StatCard
          icon={TrendingUp}
          label="Sales"
          value={data?.gumroadSales?.length ?? '—'}
          sub="all time"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Sales</h2>
        {recentSales.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {data?.gumroadRevenue === null
                ? 'Set GUMROAD_ACCESS_TOKEN in Vercel environment variables to see sales.'
                : 'No sales yet. Share your Gumroad products!'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-gray-700">{sale.product_name ?? '—'}</td>
                  <td className="py-2.5 text-gray-400 text-xs">
                    {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-2.5 text-right text-teal-600 font-medium">
                    ${((sale.price ?? 0) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 bg-sky-50 rounded-xl border border-sky-100 p-5">
        <h3 className="font-semibold text-sky-800 mb-2">beehiiv Subscribers</h3>
        {data?.subscribers ? (
          <div className="flex items-end gap-3">
            <div className="text-5xl font-bold text-sky-700">{data.subscribers.toLocaleString()}</div>
            <div className="text-sky-500 text-sm mb-2">total subscribers</div>
          </div>
        ) : (
          <p className="text-sky-600 text-sm">
            Set BEEHIIV_API_KEY and beehiivPublicationId in Settings to see subscriber count.
          </p>
        )}
      </div>
    </div>
  );
}
