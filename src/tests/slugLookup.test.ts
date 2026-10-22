import { describe, it, expect } from 'vitest';
import { INITIAL_STORIES } from '../data/initialStories';
import { contentRepository, AuthUser } from '../services/contentRepository';

describe('Story Lookup & 404 Status Verification', () => {
  const adminUser: AuthUser = { id: 'admin-1', name: 'Admin', role: 'admin' };

  it('retrieves published story by exact slug', async () => {
    const story = await contentRepository.get('hidden-struggles-du-students-beyond-classroom');
    expect(story).toBeDefined();
    expect(story?.headline).toContain('The Hidden Struggles of DU Students');
    expect(story?.category).toBe('Campus');
  });

  it('retrieves story by id fallback', async () => {
    const story = await contentRepository.get('dispatch-du-hidden-struggles');
    expect(story).toBeDefined();
    expect(story?.id).toBe('dispatch-du-hidden-struggles');
  });

  it('returns undefined for non-existent slugs', async () => {
    const story = await contentRepository.get('non-existent-headline-12345');
    expect(story).toBeUndefined();
  });

  it('hides unpublished drafts from unauthenticated readers', async () => {
    // Save a draft story
    const draftStory = {
      ...INITIAL_STORIES[0],
      id: 'test-draft-story',
      slug: 'unreleased-investigation-draft',
      status: 'draft' as const,
    };
    await contentRepository.save(draftStory, adminUser);

    // Public lookup (user = null)
    const publicResult = await contentRepository.get('unreleased-investigation-draft', null);
    expect(publicResult).toBeUndefined();

    // Authenticated admin lookup
    const adminResult = await contentRepository.get('unreleased-investigation-draft', adminUser);
    expect(adminResult).toBeDefined();
    expect(adminResult?.id).toBe('test-draft-story');
  });
});
