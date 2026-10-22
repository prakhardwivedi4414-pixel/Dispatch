import { Story } from '../types';

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface StoryValidation {
  isValid: boolean;
  issues: ValidationIssue[];
  wordCount: number;
  readingTime: number;
}

export function countWords(text: string): number {
  if (!text) return 0;
  const cleanText = text
    .replace(/#+\s+/g, '')
    .replace(/[*_~`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
  
  const words = cleanText.match(/\b[^\s]+\b/g);
  return words ? words.length : 0;
}

export function computeReadingTime(text: string): number {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 225));
}

export function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(':').map(p => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function validateStory(story: Partial<Story>): StoryValidation {
  const issues: ValidationIssue[] = [];
  const wordCount = countWords(story.body || '');
  const readingTime = computeReadingTime(story.body || '');

  // 1. Headline
  if (!story.headline || story.headline.trim().length < 5) {
    issues.push({
      severity: 'error',
      message: 'Headline is missing or too short (minimum 5 characters).',
    });
  }

  // 2. Summary
  if (!story.summary || story.summary.trim().length < 15) {
    issues.push({
      severity: 'warning',
      message: 'Editorial summary/standfirst should provide clear context for readers.',
    });
  }

  // 3. Category & Format
  if (!story.category) {
    issues.push({
      severity: 'error',
      message: 'Editorial category desk must be assigned.',
    });
  }
  if (!story.format) {
    issues.push({
      severity: 'error',
      message: 'Story format must be designated.',
    });
  }

  // 4. Authors
  if (!story.authors || story.authors.length === 0) {
    issues.push({
      severity: 'error',
      message: 'At least one reporter or editor must be assigned to the byline.',
    });
  }

  // 5. Cover Image
  if (!story.cover?.src) {
    issues.push({
      severity: 'error',
      message: 'Cover image is required for publication.',
    });
  } else if (!story.cover?.credit) {
    issues.push({
      severity: 'warning',
      message: 'Photographer or illustrator credit attribution is missing.',
    });
  }

  // 6. Format-specific editorial guidelines
  if (story.format === 'long-read' && wordCount < 600) {
    issues.push({
      severity: 'warning',
      message: `Current word count (${wordCount} words) is brief for a designated long-read investigation.`,
    });
  }

  if (story.format === 'audio' && !story.media?.transcript) {
    issues.push({
      severity: 'info',
      message: 'An accompanying verbatim transcript is recommended for accessibility.',
    });
  }

  const hasErrors = issues.some(i => i.severity === 'error');

  return {
    isValid: !hasErrors,
    issues,
    wordCount,
    readingTime,
  };
}
