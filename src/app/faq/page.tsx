import type { Metadata } from 'next';
import { show } from '@/content/show';
import { faqItems } from '@/content/faq';
import { FaqAccordion } from '@/components/ui/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Frequently asked questions about ${show.title} — how to listen, release schedule, and how to get in touch.`,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: `FAQ — ${show.title}`,
    description: `Frequently asked questions about ${show.title}.`,
    images: [show.artworkUrl],
  },
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          Frequently asked
        </p>
        <h1 className="mt-3 font-display text-headline text-cream">
          Questions, answered
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          The things listeners ask most, in one place. Anything else — write to
          the address on the About page.
        </p>
      </header>
      <section aria-label="Frequently asked questions" className="mt-10">
        <FaqAccordion items={faqItems} />
      </section>
    </div>
  );
}
