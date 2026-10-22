import { Story, StoryStatus, Contributor } from '../types';
import { INITIAL_STORIES, CONTRIBUTORS } from '../data/initialStories';
import { calculateReadingTimeMinutes } from '../utils/motion';

export type UserRole = 'contributor' | 'editor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

const STORAGE_KEY_STORIES = 'the_dispatch_stories_v5';
const STORAGE_KEY_CONTRIBUTORS = 'the_dispatch_contributors_v5';

export interface IContentRepository {
  list(statusFilter?: StoryStatus | 'all', user?: AuthUser | null): Promise<Story[]>;
  get(slugOrId: string, user?: AuthUser | null): Promise<Story | undefined>;
  save(story: Story, user: AuthUser): Promise<Story>;
  publish(id: string, user: AuthUser): Promise<Story>;
  unpublish(id: string, user: AuthUser): Promise<Story>;
  delete(id: string, user: AuthUser): Promise<void>;
  setLead(id: string, user: AuthUser): Promise<Story>;
  listContributors(): Promise<Contributor[]>;
  saveContributor(contributor: Contributor, user: AuthUser): Promise<Contributor>;
  exportData(): string;
  importData(jsonData: string): { success: boolean; error?: string };
  resetToDefaults(): void;
}

const memoryStorage = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryStorage.get(key) || null;
      }
    }
    return memoryStorage.get(key) || null;
  },
  setItem: (key: string, val: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.setItem(key, val);
        return;
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'QuotaExceededError') {
          throw new Error('Local browser storage quota exceeded. Please reduce image sizes or export data.');
        }
      }
    }
    memoryStorage.set(key, val);
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    memoryStorage.delete(key);
  },
};

/**
 * LocalStorage Demo Content Repository
 * NOTE: For demo mode only. Data is saved strictly in this browser's localStorage.
 * True multi-user security and persistence requires a production backend.
 */
class LocalContentRepository implements IContentRepository {
  private getStoriesFromStorage(): Story[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY_STORIES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read stories from storage', e);
    }
    return INITIAL_STORIES;
  }

  private saveStoriesToStorage(stories: Story[]): void {
    safeStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(stories));
  }

  private getContributorsFromStorage(): Contributor[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY_CONTRIBUTORS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read contributors from storage', e);
    }
    return Object.values(CONTRIBUTORS);
  }

  private saveContributorsToStorage(contributors: Contributor[]): void {
    safeStorage.setItem(STORAGE_KEY_CONTRIBUTORS, JSON.stringify(contributors));
  }

  async list(statusFilter?: StoryStatus | 'all', user?: AuthUser | null): Promise<Story[]> {
    const all = this.getStoriesFromStorage();

    // Public / unauthenticated readers can ONLY view published stories
    if (!user) {
      return all.filter(s => s.status === 'published');
    }

    // Contributors can view published stories + their own drafts/reviews
    if (user.role === 'contributor') {
      return all.filter(s => {
        if (s.status === 'published') return true;
        return s.authors?.some(a => a.name.toLowerCase() === user.name.toLowerCase());
      });
    }

    // Editors and Admins can view all stories across draft, review, and published
    if (statusFilter && statusFilter !== 'all') {
      return all.filter(s => s.status === statusFilter);
    }

    return all;
  }

  async get(slugOrId: string, user?: AuthUser | null): Promise<Story | undefined> {
    const all = this.getStoriesFromStorage();
    const found = all.find(s => s.slug === slugOrId || s.id === slugOrId);

    if (!found) return undefined;

    // Public view only permits published stories
    if (!user && found.status !== 'published') {
      return undefined;
    }

    // Contributor can only view draft if they are an author
    if (user && user.role === 'contributor' && found.status !== 'published') {
      const isAuthor = found.authors?.some(a => a.name.toLowerCase() === user.name.toLowerCase());
      if (!isAuthor) return undefined;
    }

    return found;
  }

  async save(story: Story, user: AuthUser): Promise<Story> {
    const all = this.getStoriesFromStorage();
    const existingIndex = all.findIndex(s => s.id === story.id);

    // Permission check for contributor
    if (user.role === 'contributor' && existingIndex !== -1) {
      const existing = all[existingIndex];
      const isAuthor = existing.authors?.some(a => a.name.toLowerCase() === user.name.toLowerCase());
      if (!isAuthor) {
        throw new Error('Permission denied: Contributors can only edit their own stories.');
      }
      if (existing.status === 'published') {
        throw new Error('Permission denied: Contributors cannot modify already published stories.');
      }
    }

    // Compute reading time automatically from body text
    const updatedStory: Story = {
      ...story,
      readingTime: calculateReadingTimeMinutes(story.body),
    };

    if (existingIndex !== -1) {
      all[existingIndex] = updatedStory;
    } else {
      all.push(updatedStory);
    }

    this.saveStoriesToStorage(all);
    return updatedStory;
  }

  async publish(id: string, user: AuthUser): Promise<Story> {
    if (user.role === 'contributor') {
      throw new Error('Permission denied: Only Editors and Admins may publish stories.');
    }

    const all = this.getStoriesFromStorage();
    const index = all.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Story not found');

    all[index] = {
      ...all[index],
      status: 'published',
      publishedAt: all[index].publishedAt || new Date().toISOString().split('T')[0],
    };

    this.saveStoriesToStorage(all);
    return all[index];
  }

  async unpublish(id: string, user: AuthUser): Promise<Story> {
    if (user.role === 'contributor') {
      throw new Error('Permission denied: Only Editors and Admins may unpublish stories.');
    }

    const all = this.getStoriesFromStorage();
    const index = all.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Story not found');

    all[index] = {
      ...all[index],
      status: 'draft',
    };

    this.saveStoriesToStorage(all);
    return all[index];
  }

  async delete(id: string, user: AuthUser): Promise<void> {
    if (user.role === 'contributor') {
      throw new Error('Permission denied: Only Editors and Admins may delete stories.');
    }

    const all = this.getStoriesFromStorage();
    const filtered = all.filter(s => s.id !== id);
    this.saveStoriesToStorage(filtered);
  }

  async setLead(id: string, user: AuthUser): Promise<Story> {
    if (user.role === 'contributor') {
      throw new Error('Permission denied: Only Editors and Admins may assign homepage lead stories.');
    }

    const all = this.getStoriesFromStorage();
    const targetIndex = all.findIndex(s => s.id === id);
    if (targetIndex === -1) throw new Error('Story not found');

    // Remove isLead from others, set on target
    const updated = all.map((s, idx) => ({
      ...s,
      isLead: idx === targetIndex,
    }));

    this.saveStoriesToStorage(updated);
    return updated[targetIndex];
  }

  async listContributors(): Promise<Contributor[]> {
    return this.getContributorsFromStorage();
  }

  async saveContributor(contributor: Contributor, user: AuthUser): Promise<Contributor> {
    if (user.role !== 'admin') {
      throw new Error('Permission denied: Only Admins may manage contributors.');
    }

    const all = this.getContributorsFromStorage();
    const index = all.findIndex(c => c.id === contributor.id);

    if (index !== -1) {
      all[index] = contributor;
    } else {
      all.push(contributor);
    }

    this.saveContributorsToStorage(all);
    return contributor;
  }

  exportData(): string {
    const stories = this.getStoriesFromStorage();
    const contributors = this.getContributorsFromStorage();
    return JSON.stringify({
      publication: 'The Dispatch',
      exportedAt: new Date().toISOString(),
      stories,
      contributors,
    }, null, 2);
  }

  importData(jsonData: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.stories || !Array.isArray(parsed.stories)) {
        return { success: false, error: 'Invalid JSON format: missing stories array.' };
      }
      this.saveStoriesToStorage(parsed.stories);
      if (parsed.contributors && Array.isArray(parsed.contributors)) {
        this.saveContributorsToStorage(parsed.contributors);
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'JSON parse failure' };
    }
  }

  resetToDefaults(): void {
    safeStorage.removeItem(STORAGE_KEY_STORIES);
    safeStorage.removeItem(STORAGE_KEY_CONTRIBUTORS);
  }
}

export const contentRepository = new LocalContentRepository();
