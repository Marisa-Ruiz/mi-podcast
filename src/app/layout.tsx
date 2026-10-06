import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { show } from '@/content/show';

const SITE_URL = 'https://mipodcast.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${show.title} — ${show.tagline}`,
    template: `%s — ${show.title}`,
  },
  description: show.description,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: show.title,
    type: 'website',
    images: [show.artworkUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
