'use client';

import { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Star, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Lesson {
  slug: string;
  title: string;
  series: string;
}

interface ScheduleData {
  schedule: Lesson[];
  scheduleSha: string;
  nextLessonIndex: number;
  configSha: string;
}

export default function SchedulePage() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const resp = await fetch('/api/schedule');
    const json = await resp.json() as ScheduleData;
    setData(json);
    setSchedule(json.schedule ?? []);
    setNextIndex(json.nextLessonIndex ?? 0);
    setLoading(false);
    setDirty(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(schedule);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSchedule(items);
    setDirty(true);
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const resp = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule,
          scheduleSha: data.scheduleSha,
          nextLessonIndex: nextIndex,
          configSha: data.configSha,
        }),
      });
      if (!resp.ok) throw new Error('Save failed');
      toast.success('Schedule saved and committed to GitHub');
      await load();
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <RefreshCw className="animate-spin text-teal-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Drag to reorder. Click ★ to set the next lesson. Saves directly to GitHub.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={save}
            disabled={saving || !dirty}
          >
            {saving ? <RefreshCw size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
            Save to GitHub
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="schedule">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {schedule.map((lesson, i) => (
                <Draggable key={lesson.slug} draggableId={lesson.slug} index={i}>
                  {(prov, snap) => (
                    <li
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`flex items-center gap-3 p-4 rounded-xl border bg-white transition-shadow ${
                        snap.isDragging ? 'shadow-lg border-teal-200' : 'border-gray-200 hover:border-gray-300'
                      } ${i === nextIndex ? 'border-teal-400 bg-teal-50' : ''}`}
                    >
                      <span {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab">
                        <GripVertical size={18} />
                      </span>
                      <span className="text-xs text-gray-300 font-mono w-5 text-center">{i}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                        <p className="text-xs text-gray-400">{lesson.series}</p>
                      </div>
                      <button
                        onClick={() => { setNextIndex(i); setDirty(true); }}
                        title="Set as next lesson"
                        className={`flex-shrink-0 transition-colors ${
                          i === nextIndex ? 'text-teal-500' : 'text-gray-200 hover:text-teal-400'
                        }`}
                      >
                        {i === nextIndex ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
                      </button>
                      {i === nextIndex && (
                        <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} /> Next
                        </span>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {dirty && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          You have unsaved changes. Click "Save to GitHub" to commit them.
        </div>
      )}
    </div>
  );
}
