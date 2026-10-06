import Link from 'next/link';
import { show } from '@/content/show';
import { SiteNav } from './SiteNav';

export function SiteHeader() {
  return (
    <header className="border-b border-line/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-cream hover:text-gold transition-colors"
        >
          {show.title}
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
