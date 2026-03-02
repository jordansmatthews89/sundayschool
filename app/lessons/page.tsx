import Link from 'next/link';
import { PromoBanner, SiteHeader, ValueBar } from '@/components/SiteHeader';

const LESSONS = [
  {
    slug: 'fruit-of-spirit-01-love',
    title: 'Love (Week 1)',
    series: 'Fruit of the Spirit',
    description: 'Discover what love really means through Galatians 5:22 and real family examples.',
    verse: 'Galatians 5:22',
  },
  {
    slug: 'jesus-calms-the-storm',
    title: 'Jesus Calms the Storm',
    series: 'Jesus: Life & Teachings',
    description: 'Learn how Jesus has power over fear and storms — and how that changes everything for us.',
    verse: 'Mark 4:35-41',
  },
];

const SERIES = Array.from(new Set(LESSONS.map((l) => l.series)));

export default function LessonsPage() {
  return (
    <>
      <PromoBanner />
      <SiteHeader />
      <ValueBar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-serif text-gray-900 mb-3">Kids Bible Studies</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Lessons by topic. Open the leader guide, student sheet, or family take-home. Print or copy from each page.
          </p>
        </section>

        {SERIES.map((series) => (
          <section key={series} className="mb-12">
            <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-100 pb-2">{series}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {LESSONS.filter((l) => l.series === series).map((lesson) => (
                <div key={lesson.slug} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <p className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">{lesson.series}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{lesson.description}</p>
                  <p className="text-xs text-gray-400 mb-4">Key verse: {lesson.verse}</p>
                  <div className="flex flex-wrap gap-2">
                    {(['leader-guide', 'student-sheet', 'family-take-home'] as const).map((type) => (
                      <Link
                        key={type}
                        href={`/lessons/${lesson.slug}/${type}`}
                        className="text-xs px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors font-medium"
                      >
                        {type.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
