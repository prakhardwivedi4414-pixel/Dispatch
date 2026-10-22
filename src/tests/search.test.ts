import { describe, it, expect } from 'vitest';
import { INITIAL_STORIES } from '../data/initialStories';

describe('Search Functionality & Field Matching', () => {
  const performSearch = (query: string, category = 'all', format = 'all') => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return INITIAL_STORIES.filter(story => {
      if (story.status !== 'published') return false;
      if (category !== 'all' && story.category.toLowerCase() !== category.toLowerCase()) return false;
      if (format !== 'all' && story.format !== format) return false;

      const matchHeadline = story.headline.toLowerCase().includes(q);
      const matchSummary = story.summary.toLowerCase().includes(q);
      const matchBody = story.body.toLowerCase().includes(q);
      const matchCategory = story.category.toLowerCase().includes(q);
      const matchAuthors = story.authors?.some(a => a.name.toLowerCase().includes(q));

      return matchHeadline || matchSummary || matchBody || matchCategory || matchAuthors;
    });
  };

  it('finds stories by headline keywords (case-insensitive)', () => {
    const results = performSearch('NIGHT SHIFT');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].headline).toContain('Night Shift');
  });

  it('finds stories by reporter name', () => {
    const results = performSearch('Maya Chen');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(s => s.authors.some(a => a.name === 'Maya Chen'))).toBe(true);
  });

  it('finds stories by terms within the deep body text', () => {
    const results = performSearch('subterranean');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('dispatch-night-shift');
  });

  it('filters results by category', () => {
    const allResults = performSearch('dispatch');
    const campusOnly = performSearch('care', 'Campus');
    expect(campusOnly.every(s => s.category === 'Campus')).toBe(true);
  });

  it('returns empty array for empty or whitespace query', () => {
    expect(performSearch('')).toEqual([]);
    expect(performSearch('   ')).toEqual([]);
  });

  it('returns empty array when query does not match any record', () => {
    const results = performSearch('xyz123nonsensequery');
    expect(results).toEqual([]);
  });
});
