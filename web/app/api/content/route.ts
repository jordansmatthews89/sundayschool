import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listDirectory, readFile } from '@/lib/github';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const dirs = await listDirectory('agent/output');
    const runs = dirs
      .filter((d) => d.type === 'dir' && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
      .map((d) => d.name)
      .sort()
      .reverse();
    return NextResponse.json({ runs });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
