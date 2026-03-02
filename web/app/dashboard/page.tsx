'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  BookOpen, Clock, Users, Sparkles, CalendarDays, RefreshCw, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardData {
  nextLesson: { slug: string; title: string; series: string } | null;
  nextLessonIndex: number;
  schedule: Array<{ slug: string; title: string; series: string }>;
  lastRunAt: string | null;
  lastOutputDir: string | null;
  recentRuns: string[];
}

interface Analytics {
  subscribers: number;
  gumroadRevenue: number | null;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()).catch(() => null),
    ]).then(([dash, analytics]) => {
      setData(dash);
      if (analytics) setAnalytics(analytics);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <RefreshCw className="animate-spin text-teal-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Your weekly content pipeline at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={BookOpen}
          label="Next lesson"
          value={data?.nextLesson?.title ?? '—'}
          sub={data?.nextLesson?.series ?? ''}
          accent
        />
        <StatCard
          icon={Clock}
          label="Last run"
          value={formatDate(data?.lastRunAt ?? null)}
          sub={data?.lastOutputDir ? `Folder: ${data.lastOutputDir}` : ''}
        />
        <StatCard
          icon={Users}
          label="Subscribers"
          value={analytics?.subscribers ?? '—'}
          sub="beehiiv"
        />
        <StatCard
          icon={Sparkles}
          label="Revenue"
          value={analytics?.gumroadRevenue != null ? `$${analytics.gumroadRevenue.toFixed(2)}` : '—'}
          sub="Gumroad"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-teal-500" />
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/generate">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Sparkles size={15} className="mr-2" /> Generate This Week's Content
              </Button>
            </Link>
            <Link href="/dashboard/schedule">
              <Button variant="outline" className="w-full">
                <CalendarDays size={15} className="mr-2" /> Edit Schedule
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            Recent Runs
          </h2>
          {data?.recentRuns?.length ? (
            <ul className="space-y-2">
              {data.recentRuns.map((run) => (
                <li key={run}>
                  <Link
                    href={`/dashboard/content?run=${run}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors group"
                  >
                    <CheckCircle2 size={14} className="text-teal-500" />
                    {run}
                    <span className="text-xs text-gray-300 group-hover:text-teal-400 ml-auto">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No runs yet. Generate your first lesson!</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-400" />
          Upcoming Schedule
        </h2>
        <div className="space-y-2">
          {data?.schedule?.length ? (
            data.schedule.map((lesson, i) => (
              <div
                key={lesson.slug}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                  i === data.nextLessonIndex ? 'bg-teal-50 border border-teal-200' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-xs font-mono w-5 text-center ${i === data.nextLessonIndex ? 'text-teal-600 font-bold' : 'text-gray-300'}`}>
                  {i}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{lesson.title}</span>
                  <span className="text-gray-400 ml-2">{lesson.series}</span>
                </div>
                {i === data.nextLessonIndex && (
                  <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">Next</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No lessons in schedule.</p>
          )}
        </div>
      </div>
    </div>
  );
}
