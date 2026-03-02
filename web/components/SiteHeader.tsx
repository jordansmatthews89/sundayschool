'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/dashboard', label: 'Admin' },
  { href: '#', label: 'Shop' },
  { href: '#', label: 'Contact' },
];

export function PromoBanner() {
  return (
    <div className="bg-teal-600 text-white py-2 px-4 flex items-center justify-center gap-4 flex-wrap text-sm text-center">
      <span className="flex-1 min-w-[200px]">Get free family devotionals when you subscribe.</span>
      <span className="flex gap-3 opacity-90">
        <a href="#" aria-label="Facebook" className="hover:opacity-100">📢</a>
        <a href="#" aria-label="Instagram" className="hover:opacity-100">📷</a>
        <a href="#" aria-label="Email" className="hover:opacity-100">✉️</a>
      </span>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center flex-wrap gap-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-0.5">
        <Link href="/" className="font-serif text-2xl text-gray-900 no-underline tracking-wide">
          Family Faith
        </Link>
        <span className="text-xs uppercase tracking-widest text-gray-400">Helping families grow in faith</span>
      </div>
      <nav className="flex items-center gap-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm no-underline transition-colors ${
              pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
                ? 'text-teal-600 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function ValueBar() {
  return (
    <div className="bg-sky-50 border-b border-sky-100 py-3 px-4">
      <div className="flex justify-center gap-8 flex-wrap max-w-6xl mx-auto text-sm text-gray-600">
        <div className="flex items-center gap-2"><span>📚</span> Bible-based resources</div>
        <div className="flex items-center gap-2"><span>💬</span> Support for families</div>
        <div className="flex items-center gap-2"><span>📦</span> Digital + print options</div>
      </div>
    </div>
  );
}
