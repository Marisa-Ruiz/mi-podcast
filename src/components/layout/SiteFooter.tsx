import { show } from '@/content/show';
import { navLinks } from '@/content/nav';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/70 bg-surface/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="font-display text-xl text-cream">{show.title}</p>
          <p className="mt-2 text-sm text-muted">{show.tagline}</p>
          {show.contactEmail && (
            <p className="mt-3 text-sm text-muted">
              <a
                className="underline decoration-gold/60 underline-offset-4 hover:text-gold"
                href={`mailto:${show.contactEmail}`}
              >
                {show.contactEmail}
              </a>
            </p>
          )}
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {show.title}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
