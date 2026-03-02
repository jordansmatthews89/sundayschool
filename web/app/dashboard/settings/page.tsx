'use client';

import { useEffect, useState } from 'react';
import { Settings, RefreshCw, Save, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Config {
  nextLessonIndex: number;
  beehiivPublicationId?: string;
  signupUrl?: string;
  [key: string]: unknown;
}

interface KeyStatus {
  openai: boolean;
  beehiiv: boolean;
  twitter: boolean;
  gumroad: boolean;
  github: boolean;
}

function StatusDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-green-50' : 'bg-gray-50'}`}>
      {active
        ? <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
        : <XCircle size={15} className="text-gray-300 flex-shrink-0" />}
      <span className={active ? 'text-green-700' : 'text-gray-400'}>{label}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [sha, setSha] = useState('');
  const [form, setForm] = useState({ beehiivPublicationId: '', signupUrl: '' });
  const [keyStatus, setKeyStatus] = useState<KeyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [configResp, keysResp] = await Promise.all([
      fetch('/api/config'),
      fetch('/api/key-status').catch(() => null),
    ]);
    const configData = await configResp.json();
    setConfig(configData.data);
    setSha(configData.sha);
    setForm({
      beehiivPublicationId: configData.data?.beehiivPublicationId ?? '',
      signupUrl: configData.data?.signupUrl ?? '',
    });
    if (keysResp?.ok) {
      setKeyStatus(await keysResp.json());
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try {
      const resp = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: form, sha }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Config saved and committed to GitHub!');
      await load();
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-64"><RefreshCw className="animate-spin text-teal-500" size={28} /></div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={22} className="text-teal-500" /> Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Edit config.json values and check API key status.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Agent Configuration</h2>
        <div className="space-y-4">
          <div>
            <Label>beehiiv Publication ID</Label>
            <Input
              placeholder="pub_xxxxxxxx"
              value={form.beehiivPublicationId}
              onChange={(e) => setForm((f) => ({ ...f, beehiivPublicationId: e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1">Find in beehiiv Settings → Publications.</p>
          </div>
          <div>
            <Label>Newsletter Signup URL</Label>
            <Input
              placeholder="https://yoursite.com"
              value={form.signupUrl}
              onChange={(e) => setForm((f) => ({ ...f, signupUrl: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-xs text-gray-400">
            Current next lesson index: <strong>{config?.nextLessonIndex ?? '—'}</strong>
            {' '}(change via the{' '}
            <a href="/dashboard/schedule" className="text-teal-600 hover:underline">Schedule page</a>)
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={save} disabled={saving}>
            {saving ? <RefreshCw size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
            Save & Commit
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">API Key Status</h2>
        <div className="grid grid-cols-2 gap-2">
          <StatusDot active={keyStatus?.openai ?? false} label="OpenAI" />
          <StatusDot active={keyStatus?.beehiiv ?? false} label="beehiiv" />
          <StatusDot active={keyStatus?.twitter ?? false} label="Twitter / X" />
          <StatusDot active={keyStatus?.gumroad ?? false} label="Gumroad" />
          <StatusDot active={keyStatus?.github ?? false} label="GitHub Token" />
        </div>
        <div className="mt-4 flex gap-3">
          <a
            href="https://vercel.com/jordanmatthews11/sundayschool/settings/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline"
          >
            <ExternalLink size={13} /> Edit Vercel env vars
          </a>
          <a
            href="https://github.com/jordansmatthews89/sundayschool/settings/secrets/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline"
          >
            <ExternalLink size={13} /> Edit GitHub secrets
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        <p className="font-medium text-gray-700 mb-2">Required Vercel environment variables:</p>
        <ul className="space-y-1 font-mono text-xs">
          {['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'AUTH_SECRET', 'NEXTAUTH_URL', 'ALLOWED_EMAIL',
            'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'OPENAI_API_KEY',
            'BEEHIIV_API_KEY (optional)', 'TWITTER_APP_KEY (optional)', 'TWITTER_APP_SECRET (optional)',
            'TWITTER_ACCESS_TOKEN (optional)', 'TWITTER_ACCESS_SECRET (optional)',
            'GUMROAD_ACCESS_TOKEN (optional)'].map((k) => (
            <li key={k} className={k.includes('optional') ? 'text-gray-400' : 'text-gray-600'}>{k}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
