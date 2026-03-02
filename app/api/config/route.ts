import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readJson, writeJson } from '@/lib/github';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, sha } = await readJson<Record<string, unknown>>('agent/config.json');
    return NextResponse.json({ data, sha });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { updates, sha } = await request.json() as { updates: Record<string, unknown>; sha: string };
  const { data: current } = await readJson<Record<string, unknown>>('agent/config.json');
  const updated = { ...current, ...updates };

  await writeJson('agent/config.json', sha, updated, 'Dashboard: update config');
  return NextResponse.json({ ok: true });
}
