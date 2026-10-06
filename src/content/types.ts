export interface Host {
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
}

export interface Show {
  title: string;
  tagline: string;
  description: string;
  artworkUrl: string;
  hosts: Host[];
  releaseCadence?: string;
  contactEmail?: string;
  socialLinks?: { label: string; url: string }[];
}

export interface Episode {
  slug: string;
  number: number;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  description: string;
  longDescription?: string;
  audioUrl: string | null;
  artworkUrl?: string;
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  order: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
