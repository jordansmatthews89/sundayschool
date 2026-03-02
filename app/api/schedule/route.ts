import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readJson, writeJson } from '@/lib/github';

export interface LessonEntry {
  slug: string;
  title: string;
  series: string;
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [scheduleResult, configResult] = await Promise.all([
      readJson<LessonEntry[]>('agent/lesson-schedule.json'),
      readJson<{ nextLessonIndex: number }>('agent/config.json'),
    ]);
    return NextResponse.json({
      schedule: scheduleResult.data,
      scheduleSha: scheduleResult.sha,
      nextLessonIndex: configResult.data.nextLessonIndex,
      configSha: configResult.sha,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { schedule, scheduleSha, nextLessonIndex, configSha } = await request.json() as {
    schedule: LessonEntry[];
    scheduleSha: string;
    nextLessonIndex: number;
    configSha: string;
  };

  const [, configResult] = await Promise.all([
    writeJson('agent/lesson-schedule.json', scheduleSha, schedule, 'Dashboard: update lesson schedule'),
    readJson<Record<string, unknown>>('agent/config.json'),
  ]);

  const updatedConfig = { ...configResult.data, nextLessonIndex };
  await writeJson('agent/config.json', configSha, updatedConfig, 'Dashboard: set next lesson index');

  return NextResponse.json({ ok: true });
}
