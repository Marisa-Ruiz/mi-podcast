import Link from 'next/link';
import { show } from '@/content/show';
import { getFeaturedEpisode } from '@/lib/episodes';
import { FeaturedEpisode } from '@/components/episode/FeaturedEpisode';

export default function LandingPage() {
  const featured = getFeaturedEpisode();

  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <section className="flex flex-col items-start gap-6 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          A podcast about craft &amp; creativity
        </p>
        <h1 className="max-w-3xl font-display text-display text-cream">
          {show.tagline}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          {show.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/episodes/"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-strong"
          >
            Browse all episodes
          </Link>
          <Link
            href="/about/"
            className="rounded-full border border-line px-7 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold"
          >
            About the show
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="pb-20">
        <h2 id="featured-heading" className="sr-only">
          Featured episode
        </h2>
        <FeaturedEpisode episode={featured} />
      </section>
    </div>
  );
}
