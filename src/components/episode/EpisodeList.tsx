import { Episode } from '@/content/types';
import { sortEpisodesByDateDesc } from '@/lib/episodes';
import { EpisodeCard } from './EpisodeCard';

interface EpisodeListProps {
  episodes: Episode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  const sorted = sortEpisodesByDateDesc(episodes);

  return (
    <ul data-testid="episode-list" className="flex flex-col gap-6">
      {sorted.map((episode) => (
        <li key={episode.slug}>
          <EpisodeCard episode={episode} />
        </li>
      ))}
    </ul>
  );
}
