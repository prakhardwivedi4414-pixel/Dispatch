import { describe, it, expect } from 'vitest';
import { countWords, computeReadingTime } from '../utils/validation';
import { calculateReadingTimeMinutes } from '../utils/motion';

describe('Reading Time & Word Count Calculations', () => {
  it('counts words in clean text accurately', () => {
    const text = 'The Dispatch is an independent student newsroom.';
    expect(countWords(text)).toBe(7);
  });

  it('strips markdown headings, quotes, and links before counting', () => {
    const markdown = `
      # Main Headline
      > This is a pull quote.
      Here is a [link to document](https://example.com) and some **bold** text.
    `;
    const count = countWords(markdown);
    // "Main Headline This is a pull quote Here is a link to document and some bold text" = 17 words
    expect(count).toBe(17);
  });

  it('computes reading time based on 225 words per minute benchmark', () => {
    // 450 words -> 2 minutes
    const text = new Array(450).fill('word').join(' ');
    expect(computeReadingTime(text)).toBe(2);
    expect(calculateReadingTimeMinutes(text)).toBe(2);
  });

  it('returns minimum 1 minute for short articles', () => {
    const shortText = 'Brief dispatch.';
    expect(computeReadingTime(shortText)).toBe(1);
    expect(calculateReadingTimeMinutes(shortText)).toBe(1);
  });

  it('handles empty and whitespace-only text gracefully', () => {
    expect(countWords('')).toBe(0);
    expect(computeReadingTime('')).toBe(1);
  });
});
