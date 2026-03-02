'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Library, RefreshCw, Send, Copy, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface RunContent {
  date: string;
  newsletter: string;
  subject: string;
  linkedin: string;
  twitter: string;
  meta: { lesson?: string; series?: string; generatedAt?: string };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }}>
      {copied ? <Check size={12} className="mr-1 text-green-500" /> : <Copy size={12} className="mr-1" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

function ContentLibraryInner() {
  const searchParams = useSearchParams();
  const initialRun = searchParams.get('run');

  const [runs, setRuns] = useState<string[]>([]);
  const [selectedRun, setSelectedRun] = useState<string | null>(initialRun);
  const [content, setContent] = useState<RunContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        setRuns(d.runs ?? []);
        setLoading(false);
        if (initialRun) loadContent(initialRun);
      });
  }, []); // eslint-disable-line

  const loadContent = useCallback(async (date: string) => {
    setLoadingContent(true);
    setSelectedRun(date);
    const resp = await fetch(`/api/content/${date}`);
    const data = await resp.json();
    setContent(data);
    setLoadingContent(false);
  }, []);

  async function publishBeehiiv() {
    if (!content) return;
    setPublishing(true);
    try {
      const resp = await fetch('/api/publish/beehiiv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: content.subject, newsletter: content.newsletter }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Draft created in beehiiv!');
    } catch (e) {
      toast.error(`beehiiv error: ${(e as Error).message}`);
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-64"><RefreshCw className="animate-spin text-teal-500" size={28} /></div>;
  }

  if (selectedRun && content) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedRun(null); setContent(null); }}>
            <ChevronLeft size={16} className="mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{content.meta?.lesson ?? selectedRun}</h1>
            <p className="text-gray-400 text-sm">{selectedRun} · {content.meta?.series ?? ''}</p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={publishBeehiiv} disabled={publishing}>
              {publishing ? <RefreshCw size={13} className="animate-spin mr-1" /> : <Send size={13} className="mr-1" />}
              Re-publish to beehiiv
            </Button>
          </div>
        </div>

        {loadingContent ? (
          <div className="flex items-center justify-center min-h-32"><RefreshCw className="animate-spin text-teal-500" size={24} /></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Tabs defaultValue="newsletter" className="p-4">
              <TabsList className="mb-4">
                <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                <TabsTrigger value="subject">Subject</TabsTrigger>
                <TabsTrigger value="twitter">Tweet</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
              <TabsContent value="newsletter">
                <div className="flex justify-end mb-2"><CopyButton text={content.newsletter} /></div>
                <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.newsletter}</ReactMarkdown>
                </div>
              </TabsContent>
              <TabsContent value="subject">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 text-gray-800 font-medium">{content.subject}</div>
                  <CopyButton text={content.subject} />
                </div>
              </TabsContent>
              <TabsContent value="twitter">
                <div className="flex justify-end mb-2"><CopyButton text={content.twitter} /></div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">{content.twitter}</div>
              </TabsContent>
              <TabsContent value="linkedin">
                <div className="flex justify-end mb-2"><CopyButton text={content.linkedin} /></div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">{content.linkedin}</div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Library size={22} className="text-teal-500" /> Content Library
        </h1>
        <p className="text-gray-400 text-sm mt-1">Past agent runs. Click to view and re-publish.</p>
      </div>

      {runs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Library size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No content runs yet. Generate your first lesson!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {runs.map((run) => (
            <button
              key={run}
              onClick={() => loadContent(run)}
              className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className="text-xs text-teal-500 font-medium uppercase tracking-wide mb-1">Run</div>
              <div className="text-lg font-semibold text-gray-800 group-hover:text-teal-600">{run}</div>
              <div className="text-xs text-gray-400 mt-2">Click to view content →</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><RefreshCw className="animate-spin text-teal-500" size={28} /></div>}>
      <ContentLibraryInner />
    </Suspense>
  );
}
