import { readJson } from '@/lib/github';

export interface PublicConfig {
  signupUrl?: string;
  shopUrl?: string;
}

/** Read only public, safe config fields. Use in server components/layout only. */
export async function getPublicConfig(): Promise<PublicConfig> {
  try {
    const { data } = await readJson<PublicConfig & Record<string, unknown>>('agent/config.json');
    return {
      signupUrl: data.signupUrl,
      shopUrl: data.shopUrl,
    };
  } catch {
    return {};
  }
}
