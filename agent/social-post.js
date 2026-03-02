/**
 * Optional: post generated content to X (Twitter) and/or LinkedIn.
 * X: set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET.
 * LinkedIn: not implemented (use Buffer/Zapier or LinkedIn API with app approval).
 */

import fs from 'fs';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';

export async function postToX(outDir, config) {
  const {
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET,
  } = process.env;
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
    return { skipped: true, reason: 'X credentials not set' };
  }

  const xPath = path.join(outDir, 'social-x.md');
  if (!fs.existsSync(xPath)) return { skipped: true, reason: 'No social-x.md' };

  let text = fs.readFileSync(xPath, 'utf8').trim();
  // Use first tweet if multiple (separated by ---)
  if (text.includes('---')) text = text.split('---')[0].trim();
  // Replace placeholder with real signup URL
  text = text.replace(/\[INSERT LINK\]/g, config.signupUrl || '').trim();
  if (text.length > 280) text = text.slice(0, 277) + '...';

  const client = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  });

  const res = await client.v2.tweet(text);
  return { ok: true, id: res.data?.id };
}

export async function postToLinkedIn(outDir, config) {
  // LinkedIn requires app approval and different auth. Stub: log content so user can post manually or via Zapier.
  const liPath = path.join(outDir, 'social-linkedin.md');
  if (!fs.existsSync(liPath)) return { skipped: true };
  const content = fs.readFileSync(liPath, 'utf8').trim().replace(/\[INSERT LINK\]/g, config.signupUrl || '');
  console.log('LinkedIn (post manually or via Buffer/Zapier):\n' + content);
  return { skipped: true, reason: 'LinkedIn not automated; content logged above' };
}
