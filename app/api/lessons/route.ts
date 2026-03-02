import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listDirectory, readFile, createFile } from '@/lib/github';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const dirs = await listDirectory('curriculum/lessons');
    const slugs = dirs.filter((d) => d.type === 'dir').map((d) => d.name);

    const lessons = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const leaderFile = await readFile(`curriculum/lessons/${slug}/leader-guide.md`);
          const firstLine = leaderFile.content.split('\n').find((l) => l.startsWith('#')) ?? slug;
          const title = firstLine.replace(/^#+\s*/, '');
          const seriesLine = leaderFile.content.split('\n').find((l) => /series|series:/i.test(l));
          const series = seriesLine ? seriesLine.replace(/.*:\s*/, '').trim() : 'Uncategorized';
          return { slug, title, series };
        } catch {
          return { slug, title: slug, series: 'Uncategorized' };
        }
      })
    );

    return NextResponse.json({ lessons });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, title, series, leaderGuide, studentSheet, familyTakeHome } =
    await request.json() as {
      slug: string;
      title: string;
      series: string;
      leaderGuide: string;
      studentSheet: string;
      familyTakeHome: string;
    };

  const base = `curriculum/lessons/${slug}`;
  await Promise.all([
    createFile(`${base}/leader-guide.md`, leaderGuide, `Add lesson: ${title} - leader guide`),
    createFile(`${base}/student-sheet.md`, studentSheet, `Add lesson: ${title} - student sheet`),
    createFile(`${base}/family-take-home.md`, familyTakeHome, `Add lesson: ${title} - family take-home`),
  ]);

  return NextResponse.json({ ok: true });
}
