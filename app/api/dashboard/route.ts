import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readFile, readJson, listDirectory } from '@/lib/github';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [config, schedule, dashboardSnapshot] = await Promise.allSettled([
    readJson<{ nextLessonIndex: number; beehiivPublicationId?: string }>('agent/config.json'),
    readJson<Array<{ slug: string; title: string; series: string }>>('agent/lesson-schedule.json'),
    readFile('site/data/dashboard.json'),
  ]);

  const configData = config.status === 'fulfilled' ? config.value.data : { nextLessonIndex: 0 };
  const scheduleData = schedule.status === 'fulfilled' ? schedule.value.data : [];
  const nextIndex = configData.nextLessonIndex ?? 0;
  const nextLesson = scheduleData[nextIndex % Math.max(scheduleData.length, 1)] ?? null;

  let lastRunAt: string | null = null;
  let lastOutputDir: string | null = null;
  if (dashboardSnapshot.status === 'fulfilled') {
    try {
      const snap = JSON.parse(dashboardSnapshot.value.content);
      lastRunAt = snap.lastRunAt ?? null;
      lastOutputDir = snap.lastOutputDir ?? null;
    } catch { /* ignore */ }
  }

  let recentRuns: string[] = [];
  try {
    const outputDirs = await listDirectory('agent/output');
    recentRuns = outputDirs
      .filter((d) => d.type === 'dir')
      .map((d) => d.name)
      .sort()
      .reverse()
      .slice(0, 5);
  } catch { /* no runs yet */ }

  return NextResponse.json({
    nextLesson,
    nextLessonIndex: nextIndex,
    schedule: scheduleData,
    lastRunAt,
    lastOutputDir,
    recentRuns,
  });
}
