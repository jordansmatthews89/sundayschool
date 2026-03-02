import { Octokit } from '@octokit/rest';

function octokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;

export interface GitHubFile {
  content: string;
  sha: string;
  path: string;
}

export async function readFile(path: string): Promise<GitHubFile> {
  const kit = octokit();
  const resp = await kit.repos.getContent({ owner: OWNER, repo: REPO, path });
  const data = resp.data as { content: string; sha: string; path: string };
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha, path };
}

export async function writeFile(
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const kit = octokit();
  await kit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    sha,
  });
}

export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const kit = octokit();
  await kit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
  });
}

export async function listDirectory(path: string): Promise<Array<{ name: string; type: string; path: string }>> {
  const kit = octokit();
  try {
    const resp = await kit.repos.getContent({ owner: OWNER, repo: REPO, path });
    const data = resp.data;
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
