import type { Metadata } from 'next';
import { show } from '@/content/show';
import { episodes } from '@/content/episodes';
import { EpisodeList } from '@/components/episode/EpisodeList';

export const metadata: Metadata = {
  title: 'Episodes',
  description: `Every episode of ${show.title} — ${episodes.length} conversations about craft, creativity, and the habits behind remarkable work.`,
  alternates: { canonical: '/episodes' },
  openGraph: {
    title: `Episodes — ${show.title}`,
    description: `All ${episodes.length} episodes of ${show.title}.`,
    images: [show.artworkUrl],
  },
};

export default function EpisodesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">The catalog</p>
        <h1 className="mt-3 font-display text-headline text-cream">All episodes</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {episodes.length} conversations, newest first. Every episode is
          recorded, mixed, and published by {show.title}.
        </p>
      </header>
      <section aria-label="Episode catalog" className="mt-10">
        <EpisodeList episodes={episodes} />
      </section>
    </div>
  );
}
