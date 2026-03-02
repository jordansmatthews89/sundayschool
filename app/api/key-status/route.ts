import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    openai: !!process.env.OPENAI_API_KEY,
    beehiiv: !!process.env.BEEHIIV_API_KEY,
    twitter: !!(process.env.TWITTER_APP_KEY && process.env.TWITTER_ACCESS_TOKEN),
    gumroad: !!process.env.GUMROAD_ACCESS_TOKEN,
    github: !!process.env.GITHUB_TOKEN,
  });
}
