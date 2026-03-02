const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN!;
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

function headers(): HeadersInit {
  return {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${TOKEN}`,
  };
}

export interface GitHubFile {
  content: string;
  sha: string;
  path: string;
}

export async function readFile(path: string): Promise<GitHubFile> {
  const resp = await fetch(`${BASE}/contents/${path}`, { headers: headers() });
  if (!resp.ok) throw new Error(`GitHub API ${resp.status}: ${await resp.text()}`);
  const data = (await resp.json()) as { content: string; sha: string; path: string };
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha, path };
}

export async function writeFile(
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const resp = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha,
    }),
  });
  if (!resp.ok) throw new Error(`GitHub API ${resp.status}: ${await resp.text()}`);
}

export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const resp = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
    }),
  });
  if (!resp.ok) throw new Error(`GitHub API ${resp.status}: ${await resp.text()}`);
}

export async function listDirectory(path: string): Promise<Array<{ name: string; type: string; path: string }>> {
  try {
    const resp = await fetch(`${BASE}/contents/${path}`, { headers: headers() });
    if (!resp.ok) return [];
    const data = (await resp.json()) as Array<{ name: string; type: string; path: string }>;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({ name: item.name, type: item.type, path: item.path }));
  } catch {
    return [];
  }
}

export async function readJson<T>(path: string): Promise<{ data: T; sha: string }> {
  const file = await readFile(path);
  return { data: JSON.parse(file.content) as T, sha: file.sha };
}

export async function writeJson<T>(path: string, sha: string, data: T, message: string): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2), sha, message);
}
