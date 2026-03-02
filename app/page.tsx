import Link from 'next/link';
import { getPublicConfig } from '@/lib/public-config';

export default async function HomePage() {
  const { shopUrl } = await getPublicConfig();
  const shopHref = shopUrl?.trim() || '/shop';
  const shopExternal = !!shopUrl?.trim();
  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Kids Bible Studies</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Ready-to-use family Bible lessons — every week. One email. No prep. A lesson, a verse,
            and a family take-home you can use at the table or at bedtime.
          </p>
          <p className="text-gray-500">
            Wondering how to study together as a family?{' '}
            <Link href="/lessons" className="text-teal-600 hover:underline font-medium">
              Browse lessons by topic
            </Link>
            .
          </p>
        </section>

        <div className="bg-gray-50 rounded-xl p-8 mb-12 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-1">Join families getting the weekly lesson. Free.</p>
          <p className="text-gray-500 text-sm mb-4">One email a week. Unsubscribe anytime.</p>
          <div className="text-gray-400 text-sm italic">
            Add your beehiiv embed form here (Growth → Signup forms → copy embed code).
          </div>
        </div>

        <h2 className="text-2xl font-serif text-gray-900 mb-2">Digital products</h2>
        <p className="text-gray-500 text-sm mb-6">Replace the links below with your Gumroad product URLs.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Family Devotionals Pack',
              desc: 'Short devotionals — read, talk, pray together in 10 minutes. No prep.',
            },
            {
              title: 'Fruit of the Spirit Curriculum',
              desc: '9-week series with leader guide and family take-homes for each week.',
            },
            {
              title: 'Starter Lesson Bundle',
              desc: '3 ready-to-use lessons with leader guide, student sheet, and family take-home.',
            },
          ].map((p) => (
            <div key={p.title} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="font-semibold text-gray-900">{p.title}</div>
              <p className="text-gray-500 text-sm flex-1">{p.desc}</p>
              <a href="#" className="text-teal-600 text-sm font-medium hover:underline">Get it →</a>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-serif text-gray-900 mb-4">Shop</h2>
        {shopExternal ? (
          <a href={shopHref} target="_blank" rel="noopener noreferrer" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
            Shop our designs
          </a>
        ) : (
          <Link href={shopHref} className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
            Shop our designs
          </Link>
        )}

        <footer className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          Unsubscribe anytime. We never sell your email.{' '}
          <a href="#" className="text-teal-600 hover:underline">Privacy</a>
        </footer>
      </main>
    </>
  );
}
