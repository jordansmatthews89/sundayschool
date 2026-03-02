import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readFile, writeFile } from '@/lib/github';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const base = `curriculum/lessons/${slug}`;

  try {
    const [leader, student, takeHome] = await Promise.all([
      readFile(`${base}/leader-guide.md`),
      readFile(`${base}/student-sheet.md`).catch(() => ({ content: '', sha: '', path: '' })),
      readFile(`${base}/family-take-home.md`),
    ]);
    return NextResponse.json({
      leaderGuide: leader.content, leaderGuideSha: leader.sha,
      studentSheet: student.content, studentSheetSha: student.sha,
      familyTakeHome: takeHome.content, familyTakeHomeSha: takeHome.sha,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const { type, content, sha } = await request.json() as {
    type: 'leader-guide' | 'student-sheet' | 'family-take-home';
    content: string;
    sha: string;
  };
  const filePath = `curriculum/lessons/${slug}/${type}.md`;
  await writeFile(filePath, content, sha, `Dashboard: edit ${slug}/${type}`);
  return NextResponse.json({ ok: true });
}
