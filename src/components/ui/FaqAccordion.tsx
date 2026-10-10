import { FaqItem } from '@/content/types';

interface FaqAccordionProps {
  items: FaqItem[];
}

function sortFaqItems(items: FaqItem[]): FaqItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const sorted = sortFaqItems(items);

  return (
    <div data-testid="faq-accordion" className="flex flex-col gap-4">
      {sorted.map((item) => (
        <details
          key={item.order}
          data-testid="faq-item"
          // Answers ship expanded so core content is readable without JavaScript
          // (Constitution IV, behavioral contract #5); summary toggles in-page.
          open
          className="group rounded-2xl border border-line bg-surface/60 open:bg-surface/80"
        >
          <summary
            data-testid="faq-question"
            className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-cream marker:content-none [&::-webkit-details-marker]:hidden"
          >
            <span className="font-display text-lg leading-snug">{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-gold transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p
            data-testid="faq-answer"
            className="border-t border-line px-5 pb-5 pt-4 text-base leading-relaxed text-muted"
          >
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
