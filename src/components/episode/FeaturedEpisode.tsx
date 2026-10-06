import Image from 'next/image';
import { Episode } from '@/content/types';
import { AudioPlayer } from './AudioPlayer';
import { formatDate, formatDuration } from '@/lib/episodes';

interface FeaturedEpisodeProps {
  episode: Episode;
}

export function FeaturedEpisode({ episode }: FeaturedEpisodeProps) {
  return (
    <article
      data-testid="featured-episode"
      className="grid gap-8 rounded-3xl border border-line bg-surface/70 p-6 sm:p-10 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-center"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-line">
        <Image
          src={episode.artworkUrl ?? '/images/show-artwork.svg'}
          alt={`Artwork for episode ${episode.number}: ${episode.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Featured episode · No. {episode.number}
        </p>
        <h2
          data-testid="featured-title"
          className="mt-3 font-display text-3xl leading-tight text-cream sm:text-4xl"
        >
          {episode.title}
        </h2>
        <p className="mt-3 text-sm text-muted">
          <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
          <span aria-hidden="true"> · </span>
          {formatDuration(episode.durationSeconds)} listen
        </p>
        <p data-testid="featured-description" className="mt-4 text-base leading-relaxed text-muted">
          {episode.description}
        </p>
        <div className="mt-6">
          <AudioPlayer src={episode.audioUrl} title={episode.title} />
        </div>
      </div>
    </article>
  );
}
