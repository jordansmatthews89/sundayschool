import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PromoBanner, SiteHeader, ValueBar } from '@/components/SiteHeader';

const TYPES = ['leader-guide', 'student-sheet', 'family-take-home'] as const;
type DocType = (typeof TYPES)[number];

function typeLabel(t: string) {
  return t.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

interface Props {
  params: Promise<{ slug: string; type: string }>;
}

export default async function LessonDocPage({ params }: Props) {
  const { slug, type } = await params;
  if (!TYPES.includes(type as DocType)) notFound();

  const lessonDir = path.join(process.cwd(), 'curriculum', 'lessons', slug);
  const filePath = path.join(lessonDir, `${type}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <>
      <PromoBanner />
      <SiteHeader />
      <ValueBar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex gap-3 mb-6 flex-wrap">
          {TYPES.map((t) => (
            <Link
              key={t}
              href={`/lessons/${slug}/${t}`}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                t === type
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-gray-200 text-gray-500 hover:border-teal-400'
              }`}
            >
              {typeLabel(t)}
            </Link>
          ))}
        </div>

        <article className="prose prose-teal max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
          >
            Print
          </button>
          <Link href="/lessons" className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            ← All lessons
          </Link>
        </div>
      </main>
    </>
  );
}
