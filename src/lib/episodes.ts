import { Episode } from '@/content/types';
import { episodes } from '@/content/episodes';

export function sortEpisodesByDateDesc(list: Episode[] = episodes): Episode[] {
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getLatestEpisode(list: Episode[] = episodes): Episode {
  const sorted = sortEpisodesByDateDesc(list);
  if (sorted.length === 0) throw new Error('No episodes available');
  return sorted[0];
}

export function getFeaturedEpisode(list: Episode[] = episodes): Episode {
  const flagged = list.find((e) => e.featured === true);
  return flagged ?? getLatestEpisode(list);
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

export function formatDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}
