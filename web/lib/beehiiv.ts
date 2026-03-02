const BASE = 'https://api.beehiiv.com/v2';

function headers() {
  return {
    Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function getPublication(publicationId: string) {
  const resp = await fetch(`${BASE}/publications/${publicationId}`, { headers: headers() });
  if (!resp.ok) throw new Error(`beehiiv error ${resp.status}`);
  return resp.json();
}

export async function getSubscriberStats(publicationId: string): Promise<{ total: number }> {
  try {
    const resp = await fetch(
      `${BASE}/publications/${publicationId}/subscriptions?limit=1`,
      { headers: headers() }
    );
    if (!resp.ok) return { total: 0 };
    const data = await resp.json();
    return { total: data.total_results ?? 0 };
  } catch {
    return { total: 0 };
  }
}

export async function createDraft(
  publicationId: string,
  subject: string,
  content: string
): Promise<{ id: string; url: string }> {
  const resp = await fetch(`${BASE}/publications/${publicationId}/posts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      subject,
      content_json: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: content }],
          },
        ],
      },
      status: 'draft',
      platform: 'email',
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`beehiiv error ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  return { id: data.data?.id ?? '', url: data.data?.web_url ?? '' };
}
