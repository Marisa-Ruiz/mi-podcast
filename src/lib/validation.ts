import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  Episode,
  FaqItem,
  NavLink,
  Show,
  ISO_DATE_PATTERN,
  SLUG_PATTERN,
} from '@/content/types';

const PLACEHOLDER_PATTERN = /\bTODO\b|\bTBD\b|\[placeholder\]/i;
const PUBLIC_DIR = path.join(process.cwd(), 'public');
export const EXPECTED_EPISODE_COUNT = 20;
export const REQUIRED_NAV_HREFS = ['/', '/episodes', '/about', '/faq'];

function assetExists(url: string): boolean {
  if (/^https?:\/\//.test(url)) return true;
  return existsSync(path.join(PUBLIC_DIR, url.replace(/^\//, '')));
}

function isValidDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export interface ContentBundle {
  show: Show;
  episodes: Episode[];
  faqItems: FaqItem[];
  navLinks: NavLink[];
}

export function validateContent(bundle: ContentBundle): string[] {
  const errors: string[] = [];
  const { show, episodes, faqItems, navLinks } = bundle;

  // INV-1: exactly 20 episodes
  if (episodes.length !== EXPECTED_EPISODE_COUNT) {
    errors.push(
      `INV-1: expected exactly ${EXPECTED_EPISODE_COUNT} episodes, found ${episodes.length}`,
    );
  }

  // INV-2: unique slug, unique number
  const slugs = new Set<string>();
  const numbers = new Set<number>();
  episodes.forEach((ep, i) => {
    if (!SLUG_PATTERN.test(ep.slug)) {
      errors.push(`INV-2: episode[${i}] invalid slug "${ep.slug}"`);
    }
    if (slugs.has(ep.slug)) {
      errors.push(`INV-2: duplicate slug "${ep.slug}"`);
    }
    slugs.add(ep.slug);
    if (!Number.isInteger(ep.number) || ep.number <= 0) {
      errors.push(
        `INV-2: episode "${ep.slug}" number must be an integer > 0, got ${ep.number}`,
      );
    }
    if (numbers.has(ep.number)) {
      errors.push(`INV-2: duplicate episode number ${ep.number}`);
    }
    numbers.add(ep.number);
  });

  // INV-3: ISO-8601 dates
  episodes.forEach((ep) => {
    if (!isValidDate(ep.publishedAt)) {
      errors.push(
        `INV-3: episode "${ep.slug}" invalid publishedAt "${ep.publishedAt}" (expected YYYY-MM-DD)`,
      );
    }
  });

  // INV-4: at most one featured
  const featuredCount = episodes.filter((e) => e.featured === true).length;
  if (featuredCount > 1) {
    errors.push(`INV-4: ${featuredCount} episodes flagged featured (max 1)`);
  }

  // INV-5: asset paths exist; audioUrl null allowed
  episodes.forEach((ep) => {
    if (ep.audioUrl !== null && !assetExists(ep.audioUrl)) {
      errors.push(`INV-5: episode "${ep.slug}" audioUrl not found: ${ep.audioUrl}`);
    }
    if (ep.artworkUrl && !assetExists(ep.artworkUrl)) {
      errors.push(`INV-5: episode "${ep.slug}" artworkUrl not found: ${ep.artworkUrl}`);
    }
    if (!Number.isInteger(ep.durationSeconds) || ep.durationSeconds <= 0) {
      errors.push(
        `INV-6 duration: episode "${ep.slug}" durationSeconds must be > 0`,
      );
    }
    if (!ep.title.trim() || !ep.description.trim()) {
      errors.push(`INV-6: episode "${ep.slug}" missing title/description`);
    }
  });
  if (!assetExists(show.artworkUrl)) {
    errors.push(`INV-5: show artworkUrl not found: ${show.artworkUrl}`);
  }
  show.hosts.forEach((h, i) => {
    if (!h.name.trim()) errors.push(`INV-6: host[${i}] missing name`);
    if (h.imageUrl && !assetExists(h.imageUrl)) {
      errors.push(`INV-5: host[${i}] imageUrl not found: ${h.imageUrl}`);
    }
  });

  // INV-6: nav covers exactly the four routes
  const hrefs = navLinks.map((n) => n.href).sort();
  const expected = [...REQUIRED_NAV_HREFS].sort();
  if (JSON.stringify(hrefs) !== JSON.stringify(expected)) {
    errors.push(
      `INV-6: nav hrefs [${hrefs.join(', ')}] must exactly cover [${expected.join(', ')}]`,
    );
  }

  // INV-7: no placeholder markers in shipped content
  const textBlobs = [
    show.title,
    show.tagline,
    show.description,
    ...episodes.flatMap((e) => [e.title, e.description, e.longDescription ?? '']),
    ...faqItems.flatMap((f) => [f.question, f.answer]),
    ...show.hosts.map((h) => h.bio ?? ''),
  ];
  textBlobs.forEach((text) => {
    if (PLACEHOLDER_PATTERN.test(text)) {
      errors.push(`INV-7: placeholder marker found in content: "${text.slice(0, 60)}..."`);
    }
  });

  // INV-8: FAQ unique order, non-empty Q/A; sorting stable
  const orders = new Set<number>();
  faqItems.forEach((f, i) => {
    if (!f.question.trim() || !f.answer.trim()) {
      errors.push(`INV-8: faq[${i}] missing question/answer`);
    }
    if (!Number.isInteger(f.order)) {
      errors.push(`INV-8: faq[${i}] order must be an integer`);
    }
    if (orders.has(f.order)) {
      errors.push(`INV-8: duplicate FAQ order ${f.order}`);
    }
    orders.add(f.order);
  });

  return errors;
}
