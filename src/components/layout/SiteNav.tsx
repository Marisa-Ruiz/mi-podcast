'use client';

import Link from 'next/link';
import { navLinks } from '@/content/nav';
import { usePathname } from 'next/navigation';

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 sm:gap-2">
      {navLinks.map((link) => {
        const isActive =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={
              'rounded-full px-4 py-2 text-sm tracking-wide transition-colors duration-200 ' +
              (isActive
                ? 'bg-gold text-ink font-medium'
                : 'text-muted hover:text-cream hover:bg-surface-raised')
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
