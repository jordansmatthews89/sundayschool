import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readFile, listDirectory } from '@/lib/github';
import { generateLessonContent } from '@/lib/openai';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, title, series } = await request.json() as {
    slug: string;
    title: string;
    series: string;
  };

  try {
    const [leaderFile, takeHomeFile] = await Promise.all([
      readFile(`curriculum/lessons/${slug}/leader-guide.md`),
      readFile(`curriculum/lessons/${slug}/family-take-home.md`),
    ]);

    const content = await generateLessonContent(
      { slug, title, series },
      leaderFile.content,
      takeHomeFile.content
    );

    return NextResponse.json({ ok: true, content });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
