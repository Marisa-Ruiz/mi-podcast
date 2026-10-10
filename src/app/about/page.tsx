import type { Metadata } from 'next';
import Image from 'next/image';
import { show } from '@/content/show';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${show.title} — ${show.tagline} Meet the hosts and how the show is made.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About — ${show.title}`,
    description: show.tagline,
    images: [show.artworkUrl],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">About the show</p>
        <h1 className="mt-3 font-display text-headline text-cream">{show.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{show.tagline}</p>
      </header>

      <section aria-labelledby="about-show" className="mt-12 max-w-3xl">
        <h2 id="about-show" className="font-display text-2xl text-cream">
          The premise
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{show.description}</p>
        {show.releaseCadence && (
          <p className="mt-4 text-base leading-relaxed text-muted">
            New episodes land {show.releaseCadence.toLowerCase()}.
          </p>
        )}
      </section>

      <section aria-labelledby="about-hosts" className="mt-14">
        <h2 id="about-hosts" className="font-display text-2xl text-cream">
          Hosts &amp; production
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {show.hosts.map((host) => (
            <li
              key={host.name}
              data-testid="host-card"
              className="rounded-3xl border border-line bg-surface/60 p-6"
            >
              {host.imageUrl && (
                <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border border-line">
                  <Image
                    src={host.imageUrl}
                    alt={`Portrait of ${host.name}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-display text-xl text-cream">{host.name}</h3>
              {host.role && (
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold">
                  {host.role}
                </p>
              )}
              {host.bio && (
                <p className="mt-3 text-base leading-relaxed text-muted">{host.bio}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-contact" className="mt-14 max-w-3xl">
        <h2 id="about-contact" className="font-display text-2xl text-cream">
          Contact
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {show.contactEmail ? (
            <>
              Questions, guest suggestions, and kind words:{' '}
              <a
                href={`mailto:${show.contactEmail}`}
                className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-strong"
              >
                {show.contactEmail}
              </a>
            </>
          ) : (
            'Questions, guest suggestions, and kind words are always welcome.'
          )}
        </p>
        {show.socialLinks && show.socialLinks.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-3">
            {show.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="rounded-full border border-line px-5 py-2 text-sm text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
