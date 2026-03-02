'use client';

import { useEffect, useState, useCallback } from 'react';
import { BookOpen, RefreshCw, Plus, ChevronLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface Lesson {
  slug: string;
  title: string;
  series: string;
}

interface LessonDetail {
  leaderGuide: string; leaderGuideSha: string;
  studentSheet: string; studentSheetSha: string;
  familyTakeHome: string; familyTakeHomeSha: string;
}

const TABS = [
  { key: 'leaderGuide', label: 'Leader Guide', type: 'leader-guide' },
  { key: 'studentSheet', label: 'Student Sheet', type: 'student-sheet' },
  { key: 'familyTakeHome', label: 'Family Take-Home', type: 'family-take-home' },
] as const;

function NewLessonDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    slug: '', title: '', series: '', leaderGuide: '', studentSheet: '', familyTakeHome: '',
  });
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    try {
      const resp = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Lesson created and committed to GitHub!');
      onCreated();
      onClose();
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Lesson</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug (URL-safe)</Label>
              <Input placeholder="my-lesson-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <Label>Title</Label>
              <Input placeholder="Lesson Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Series</Label>
            <Input placeholder="Series Name" value={form.series} onChange={(e) => setForm((f) => ({ ...f, series: e.target.value }))} />
          </div>
          <div>
            <Label>Leader Guide (Markdown)</Label>
            <Textarea rows={6} placeholder="# Leader Guide..." value={form.leaderGuide} onChange={(e) => setForm((f) => ({ ...f, leaderGuide: e.target.value }))} />
          </div>
          <div>
            <Label>Student Sheet (Markdown)</Label>
            <Textarea rows={4} placeholder="# Student Sheet..." value={form.studentSheet} onChange={(e) => setForm((f) => ({ ...f, studentSheet: e.target.value }))} />
          </div>
          <div>
            <Label>Family Take-Home (Markdown)</Label>
            <Textarea rows={4} placeholder="# Family Take-Home..." value={form.familyTakeHome} onChange={(e) => setForm((f) => ({ ...f, familyTakeHome: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}><X size={14} className="mr-1" /> Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={create} disabled={saving || !form.slug || !form.title}>
              {saving ? <RefreshCw size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
              Create & Commit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LessonsLibraryPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<LessonDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [editingSha, setEditingSha] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    const resp = await fetch('/api/lessons');
    const data = await resp.json();
    setLessons(data.lessons ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadLessons(); }, [loadLessons]);

  const selectLesson = useCallback(async (slug: string) => {
    setSelected(slug);
    setLoadingDetail(true);
    const resp = await fetch(`/api/lessons/${slug}`);
    const data = await resp.json();
    setDetail(data);
    setEditContent({
      leaderGuide: data.leaderGuide,
      studentSheet: data.studentSheet,
      familyTakeHome: data.familyTakeHome,
    });
    setEditingSha({
      leaderGuide: data.leaderGuideSha,
      studentSheet: data.studentSheetSha,
      familyTakeHome: data.familyTakeHomeSha,
    });
    setLoadingDetail(false);
  }, []);

  async function saveEdit(key: string, type: string) {
    setSaving(true);
    try {
      const resp = await fetch(`/api/lessons/${selected}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content: editContent[key], sha: editingSha[key] }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      toast.success('Saved to GitHub!');
      setEditMode(null);
      if (selected) selectLesson(selected);
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-64"><RefreshCw className="animate-spin text-teal-500" size={28} /></div>;

  if (selected && detail) {
    const lesson = lessons.find((l) => l.slug === selected);
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => { setSelected(null); setDetail(null); setEditMode(null); }}>
            <ChevronLeft size={16} className="mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{lesson?.title ?? selected}</h1>
            <p className="text-gray-400 text-sm">{lesson?.series}</p>
          </div>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center min-h-32"><RefreshCw className="animate-spin text-teal-500" size={24} /></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Tabs defaultValue="leaderGuide" className="p-4">
              <TabsList className="mb-4">
                {TABS.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
              </TabsList>
              {TABS.map((t) => (
                <TabsContent key={t.key} value={t.key}>
                  <div className="flex justify-end gap-2 mb-3">
                    {editMode === t.key ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(null)}>Cancel</Button>
                        <Button size="sm" className="bg-teal-600 text-white hover:bg-teal-700" onClick={() => saveEdit(t.key, t.type)} disabled={saving}>
                          {saving ? <RefreshCw size={13} className="animate-spin mr-1" /> : <Save size={13} className="mr-1" />}
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setEditMode(t.key)}>Edit</Button>
                    )}
                  </div>
                  {editMode === t.key ? (
                    <Textarea
                      rows={20}
                      className="font-mono text-sm"
                      value={editContent[t.key]}
                      onChange={(e) => setEditContent((c) => ({ ...c, [t.key]: e.target.value }))}
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{editContent[t.key]}</ReactMarkdown>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen size={22} className="text-teal-500" /> Lesson Library
          </h1>
          <p className="text-gray-400 text-sm mt-1">Browse, view, and edit all curriculum lessons.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setShowNew(true)}>
          <Plus size={15} className="mr-1" /> New Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No lessons found in curriculum/lessons/.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.slug}
              onClick={() => selectLesson(lesson.slug)}
              className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <p className="text-xs text-teal-500 font-medium uppercase tracking-wide mb-1">{lesson.series}</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-600 mb-1">{lesson.title}</p>
              <p className="text-xs text-gray-400">{lesson.slug}</p>
              <p className="text-xs text-teal-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Open →</p>
            </button>
          ))}
        </div>
      )}

      <NewLessonDialog open={showNew} onClose={() => setShowNew(false)} onCreated={loadLessons} />
    </div>
  );
}
