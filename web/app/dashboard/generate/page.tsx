'use client';

import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Send, BookOpen, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface Lesson {
  slug: string;
  title: string;
  series: string;
}

interface GeneratedContent {
  newsletter: string;
  subjectLine: string;
  linkedinPost: string;
  tweetOptions: string[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check size={12} className="mr-1 text-green-500" /> : <Copy size={12} className="mr-1" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

export default function GeneratePage() {
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/schedule')
      .then((r) => r.json())
      .then((d) => {
        setSchedule(d.schedule ?? []);
        if (d.schedule?.length) {
          const next = d.schedule[d.nextLessonIndex ?? 0];
          if (next) setSelectedSlug(next.slug);
        }
      });
  }, []);

  const selectedLesson = schedule.find((l) => l.slug === selectedSlug);

  async function generate() {
    if (!selectedLesson) return;
    setGenerating(true);
    setContent(null);
    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedLesson),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      setContent(data.content);
      toast.success('Content generated!');
    } catch (e) {
      toast.error(`Generation failed: ${(e as Error).message}`);
    } finally {
      setGenerating(false);
    }
  }

  async function publishBeehiiv() {
    if (!content) return;
    setPublishing('beehiiv');
    try {
      const resp = await fetch('/api/publish/beehiiv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: content.subjectLine, newsletter: content.newsletter }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Draft created in beehiiv!');
    } catch (e) {
      toast.error(`beehiiv error: ${(e as Error).message}`);
    } finally {
      setPublishing(null);
    }
  }

  async function postToX(tweet: string) {
    setPublishing('x');
    try {
      const resp = await fetch('/api/post/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Posted to X!');
    } catch (e) {
      toast.error(`X post error: ${(e as Error).message}`);
    } finally {
      setPublishing(null);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Generate Content</h1>
        <p className="text-gray-400 text-sm mt-1">Pick a lesson, generate content with AI, preview and publish.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson</label>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-52">
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Select a lesson..." />
              </SelectTrigger>
              <SelectContent>
                {schedule.map((lesson) => (
                  <SelectItem key={lesson.slug} value={lesson.slug}>
                    {lesson.title} — {lesson.series}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={generate}
            disabled={generating || !selectedSlug}
          >
            {generating ? (
              <><RefreshCw size={15} className="animate-spin mr-2" />Generating…</>
            ) : (
              <><Sparkles size={15} className="mr-2" />Generate</>
            )}
          </Button>
        </div>
      </div>

      {generating && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 text-center mb-6">
          <RefreshCw className="animate-spin text-teal-500 mx-auto mb-3" size={32} />
          <p className="text-teal-700 font-medium">Generating content with GPT-4o-mini…</p>
          <p className="text-teal-500 text-sm mt-1">This usually takes 10–20 seconds.</p>
        </div>
      )}

      {content && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-teal-500" />
              <span className="font-medium text-gray-800">Generated Content</span>
              <span className="text-xs text-gray-400">— {selectedLesson?.title}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={publishBeehiiv}
                disabled={!!publishing}
              >
                {publishing === 'beehiiv' ? <RefreshCw size={13} className="animate-spin mr-1" /> : <Send size={13} className="mr-1" />}
                beehiiv Draft
              </Button>
            </div>
          </div>

          <Tabs defaultValue="newsletter" className="p-4">
            <TabsList className="mb-4">
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="subject">Subject</TabsTrigger>
              <TabsTrigger value="tweets">Tweets</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>

            <TabsContent value="newsletter">
              <div className="flex justify-end mb-2">
                <CopyButton text={content.newsletter} />
              </div>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.newsletter}</ReactMarkdown>
              </div>
            </TabsContent>

            <TabsContent value="subject">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-4 text-gray-800 font-medium">
                  {content.subjectLine}
                </div>
                <CopyButton text={content.subjectLine} />
              </div>
            </TabsContent>

            <TabsContent value="tweets">
              <div className="space-y-4">
                {content.tweetOptions.map((tweet, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm text-gray-800">{tweet}</p>
                      <CopyButton text={tweet} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{tweet.length}/280 chars</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => postToX(tweet)}
                        disabled={!!publishing}
                      >
                        {publishing === 'x' ? <RefreshCw size={11} className="animate-spin mr-1" /> : null}
                        Post to X
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="linkedin">
              <div className="flex justify-end mb-2">
                <CopyButton text={content.linkedinPost} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {content.linkedinPost}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
