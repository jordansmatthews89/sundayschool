import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createDraft } from '@/lib/beehiiv';
import { readJson } from '@/lib/github';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { subject, newsletter } = await request.json() as {
    subject: string;
    newsletter: string;
  };

  try {
    const { data: config } = await readJson<{ beehiivPublicationId?: string }>('agent/config.json');
    const publicationId = config.beehiivPublicationId;
    if (!publicationId) {
      return NextResponse.json({ error: 'beehiivPublicationId not set in config.json' }, { status: 400 });
    }
    const result = await createDraft(publicationId, subject, newsletter);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
