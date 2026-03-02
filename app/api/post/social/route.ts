import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tweet } = await request.json() as { tweet: string };

  const {
    TWITTER_APP_KEY,
    TWITTER_APP_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
  } = process.env;

  if (!TWITTER_APP_KEY || !TWITTER_APP_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    return NextResponse.json({ error: 'Twitter credentials not configured' }, { status: 400 });
  }

  try {
    const client = new TwitterApi({
      appKey: TWITTER_APP_KEY,
      appSecret: TWITTER_APP_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    });
    const result = await client.v2.tweet(tweet);
    return NextResponse.json({ ok: true, id: result.data.id });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
