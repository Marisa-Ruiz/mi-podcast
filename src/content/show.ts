import { Show } from '@/content/types';

export const show: Show = {
  title: 'Mi Podcast',
  tagline: 'Conversations that linger after the mic turns off.',
  description:
    'Mi Podcast is a weekly interview show about craft, creativity, and the quiet habits behind remarkable work. Each episode is a slow, considered conversation with makers, writers, and builders — recorded with care and published without noise.',
  artworkUrl: '/images/show-artwork.svg',
  hosts: [
    {
      name: 'Mara Iversen',
      role: 'Host & Producer',
      bio: 'Mara has spent a decade interviewing artists and engineers. She believes the best questions are the ones you only think of after the recording stops.',
    },
    {
      name: 'Jonah Reyes',
      role: 'Sound Designer',
      bio: 'Jonah shapes the sound of every episode — field recordings, subtle scores, and the kind of silence that lets a sentence land.',
    },
  ],
  releaseCadence: 'New episode every Thursday',
  contactEmail: 'hello@mipodcast.example',
  socialLinks: [
    { label: 'Newsletter', url: 'https://example.com/newsletter' },
    { label: 'Press kit', url: 'https://example.com/press' },
  ],
};
