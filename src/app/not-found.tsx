import Link from 'next/link';
import { navLinks } from '@/content/nav';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-gold">404</p>
      <h1 className="mt-4 text-headline text-cream">This page skipped a beat.</h1>
      <p className="mt-4 max-w-md text-muted">
        The episode or page you were looking for is not here. Pick a page below
        and keep listening.
      </p>
      <nav aria-label="Not found navigation" className="mt-8 flex flex-wrap justify-center gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-line px-5 py-2 text-sm text-cream hover:border-gold hover:text-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
