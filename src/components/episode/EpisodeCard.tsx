import Image from 'next/image';
import { Episode } from '@/content/types';
import { AudioPlayer } from './AudioPlayer';
import { formatDate, formatDuration } from '@/lib/episodes';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <article
      data-testid="episode-card"
      data-slug={episode.slug}
      className="grid gap-6 rounded-3xl border border-line bg-surface/60 p-5 sm:p-7 md:grid-cols-[minmax(0,140px)_minmax(0,1fr)] md:items-start"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-xl border border-line">
        <Image
          src={episode.artworkUrl ?? '/images/show-artwork.svg'}
          alt={`Artwork for episode ${episode.number}: ${episode.title}`}
          fill
          sizes="140px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p
          data-testid="episode-number"
          className="text-xs uppercase tracking-[0.3em] text-gold"
        >
          No. {episode.number}
        </p>
        <h2
          data-testid="episode-title"
          className="mt-2 font-display text-2xl leading-snug text-cream"
        >
          {episode.title}
        </h2>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <time
            data-testid="episode-date"
            dateTime={episode.publishedAt}
            className="tabular-nums"
          >
            {formatDate(episode.publishedAt)}
          </time>
          <span aria-hidden="true"> · </span>
          <span data-testid="episode-duration" className="tabular-nums">
            {formatDuration(episode.durationSeconds)}
          </span>
        </p>
        <p
          data-testid="episode-description"
          className="mt-3 text-base leading-relaxed text-muted"
        >
          {episode.description}
        </p>
        <div className="mt-5">
          <AudioPlayer src={episode.audioUrl} title={episode.title} />
        </div>
      </div>
    </article>
  );
}
