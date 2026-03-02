import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readFile } from '@/lib/github';

interface Props {
  params: Promise<{ date: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { date } = await params;
  const base = `agent/output/${date}`;

  try {
    const [newsletter, subject, linkedin, twitter, meta] = await Promise.allSettled([
      readFile(`${base}/newsletter.md`),
      readFile(`${base}/subject.md`),
      readFile(`${base}/social-linkedin.md`),
      readFile(`${base}/social-x.md`),
      readFile(`${base}/meta.json`),
    ]);

    return NextResponse.json({
      date,
      newsletter: newsletter.status === 'fulfilled' ? newsletter.value.content : '',
      subject: subject.status === 'fulfilled' ? subject.value.content : '',
      linkedin: linkedin.status === 'fulfilled' ? linkedin.value.content : '',
      twitter: twitter.status === 'fulfilled' ? twitter.value.content : '',
      meta: meta.status === 'fulfilled' ? JSON.parse(meta.value.content) : {},
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
