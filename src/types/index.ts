/**
 * The Dispatch — Public Content & Editorial Types
 * Strictly public domain model: contains NO academic assessment/syllabus metadata.
 */

export type StoryCategory = 'Campus' | 'Society' | 'Culture' | 'Investigations';

export type StoryFormat = 'long-read' | 'short' | 'photo' | 'audio' | 'video';

export type StoryStatus = 'draft' | 'review' | 'published';

export interface Contributor {
  id: string;
  name: string;
  role: string;
  bio?: string;
  contribution?: string;
}

export interface StoryCover {
  src: string;
  alt: string;
  credit: string;
  caption: string;
  width?: number;
  height?: number;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  photographer: string;
  altText?: string;
  location?: string;
}

export interface SourceItem {
  id: string;
  title: string;
  organization?: string;
  url?: string;
  date?: string;
  note?: string;
  verified: boolean;
}

export interface StoryMedia {
  type: 'audio' | 'video' | 'gallery' | 'none';
  url?: string;
  duration?: string;
  photos?: PhotoItem[];
  transcript?: string;
}

export interface Story {
  id: string;
  slug: string;
  headline: string;
  subheading?: string;
  summary: string;
  body: string;
  category: StoryCategory;
  format: StoryFormat;
  authors: Contributor[];
  publishedAt: string;
  status: StoryStatus;
  readingTime: number; // in minutes, computed from body
  cover: StoryCover;
  media?: StoryMedia;
  sources?: SourceItem[];
  isLead: boolean;
  isDemo: boolean;
}
