'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  BookOpen,
  Library,
  BarChart3,
  Settings,
  LogOut,
  BookHeart,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/generate', label: 'Generate', icon: Sparkles },
  { href: '/dashboard/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/dashboard/content', label: 'Content Library', icon: Library },
  { href: '/dashboard/lessons', label: 'Lesson Library', icon: BookOpen },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <BookHeart className="text-teal-400" size={22} />
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Family Faith</div>
            <div className="text-slate-400 text-xs">Creator Studio</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
