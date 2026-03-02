/**
 * Create a beehiiv draft post from generated newsletter content.
 * Requires: BEEHIIV_API_KEY, config.beehiivPublicationId
 * API: https://developers.beehiiv.com/api-reference/posts/create (beta / Enterprise)
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const BEEHIIV_API = 'https://api.beehiiv.com/v2';

export async function createBeehiivDraft(outDir, config) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = config.beehiivPublicationId;
  if (!apiKey || !pubId) {
    throw new Error('Set BEEHIIV_API_KEY and config.beehiivPublicationId to create a draft');
  }

  const newsletterPath = path.join(outDir, 'newsletter.md');
  const subjectPath = path.join(outDir, 'subject.md');
  if (!fs.existsSync(newsletterPath) || !fs.existsSync(subjectPath)) {
    throw new Error('Missing newsletter.md or subject.md in output dir');
  }

  const bodyMarkdown = fs.readFileSync(newsletterPath, 'utf8');
  const title = fs.readFileSync(subjectPath, 'utf8').trim();
  const bodyHtml = marked.parse(bodyMarkdown);

  const res = await fetch(`${BEEHIIV_API}/publications/${pubId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      title,
      body_content: bodyHtml,
      status: 'draft',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`beehiiv API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data;
}
