import { Story, StoryStatus, Contributor } from '../types';
import { INITIAL_STORIES, CONTRIBUTORS } from '../data/initialStories';
import { calculateReadingTimeMinutes } from '../utils/motion';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export type UserRole = 'contributor' | 'editor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

const STORAGE_KEY_STORIES = 'the_dispatch_stories_v9';
const STORAGE_KEY_CONTRIBUTORS = 'the_dispatch_contributors_v9';

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
  deleteContributor(id: string, user: AuthUser): Promise<void>;
  exportData(): string;
  importData(jsonData: string): { success: boolean; error?: string };
  resetToDefaults(): void;
  isLiveDatabase(): boolean;
  getConnectionStatus(): { isConnected: boolean; mode: string };
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
 * LocalContentRepository
 * Operates in localStorage when Supabase environment variables are not configured.
 */
class LocalContentRepository implements IContentRepository {
  private getStoriesFromStorage(): Story[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY_STORIES);
      if (raw) {
        const parsed: Story[] = JSON.parse(raw);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any legacy prototype/demo stories so only authentic PDF stories remain
          const authenticOnly = parsed.filter(s => !s.isDemo);
          if (authenticOnly.length > 0 && authenticOnly.some(s => s.id === 'dispatch-du-hidden-struggles')) {
            return authenticOnly;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read stories from storage', e);
    }
    safeStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }

  private saveStoriesToStorage(stories: Story[]): void {
    safeStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(stories));
  }

  private getContributorsFromStorage(): Contributor[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY_CONTRIBUTORS);
      if (raw) {
        const parsed: Contributor[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(c => c.name.toLowerCase() !== 'prakhar' && c.id !== 'prakhar');
        }
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
      throw new Error('Permission denied: Only Administrators may manage the newsroom contributor roster.');
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

  async deleteContributor(id: string, user: AuthUser): Promise<void> {
    if (user.role !== 'admin') {
      throw new Error('Permission denied: Only Administrators may delete contributors from the roster.');
    }
    const all = this.getContributorsFromStorage();
    const filtered = all.filter(c => c.id !== id);
    this.saveContributorsToStorage(filtered);
  }

  exportData(): string {
    const stories = this.getStoriesFromStorage();
    const contributors = this.getContributorsFromStorage();
    return JSON.stringify({
      publication: 'The Dispatch',
      tagline: 'Stories That Matter',
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

  isLiveDatabase(): boolean {
    return false;
  }

  getConnectionStatus() {
    return {
      isConnected: false,
      mode: 'Local Demo Storage (Configure .env with Supabase credentials for production database)',
    };
  }
}

/**
 * SupabaseContentRepository
 * Connects directly to Supabase when valid environment variables are present.
 */
class SupabaseContentRepository implements IContentRepository {
  private localFallback = new LocalContentRepository();

  isLiveDatabase(): boolean {
    return true;
  }

  getConnectionStatus() {
    return {
      isConnected: true,
      mode: 'Managed Supabase Database (Live Relational Persistence)',
    };
  }

  async list(statusFilter?: StoryStatus | 'all', user?: AuthUser | null): Promise<Story[]> {
    if (!supabase) return this.localFallback.list(statusFilter, user);

    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          article_contributors (
            contributor_id,
            contribution_role,
            display_order
          )
        `)
        .order('published_at', { ascending: false });

      if (!user) {
        query = query.eq('status', 'published');
      } else if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        // Fallback to local if database empty
        return this.localFallback.list(statusFilter, user);
      }

      const contributors = await this.listContributors();
      const contribMap = new Map(contributors.map(c => [c.id, c]));

      return data.map(row => this.mapRowToStory(row, contribMap));
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local:', err);
      return this.localFallback.list(statusFilter, user);
    }
  }

  async get(slugOrId: string, user?: AuthUser | null): Promise<Story | undefined> {
    if (!supabase) return this.localFallback.get(slugOrId, user);

    try {
      const isUuidOrId = slugOrId.startsWith('dispatch-');
      let query = supabase
        .from('articles')
        .select(`
          *,
          article_contributors (
            contributor_id,
            contribution_role,
            display_order
          )
        `);

      if (isUuidOrId) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }

      if (!user) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) return this.localFallback.get(slugOrId, user);

      const contributors = await this.listContributors();
      const contribMap = new Map(contributors.map(c => [c.id, c]));

      return this.mapRowToStory(data, contribMap);
    } catch {
      return this.localFallback.get(slugOrId, user);
    }
  }

  async save(story: Story, user: AuthUser): Promise<Story> {
    if (!supabase) return this.localFallback.save(story, user);

    try {
      const readingTime = calculateReadingTimeMinutes(story.body);
      const payload = {
        id: story.id,
        slug: story.slug,
        headline: story.headline,
        subheading: story.subheading || null,
        summary: story.summary,
        body: story.body,
        category: story.category,
        format: story.format,
        cover_src: story.cover.src,
        cover_alt: story.cover.alt,
        cover_credit: story.cover.credit,
        cover_caption: story.cover.caption,
        media: story.media || null,
        sources: story.sources || [],
        status: story.status,
        published_at: story.publishedAt,
        reading_time: readingTime,
        is_lead: story.isLead,
        is_demo: story.isDemo,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('articles')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      // Update article_contributors
      if (story.authors && story.authors.length > 0) {
        await supabase.from('article_contributors').delete().eq('article_id', story.id);
        const rows = story.authors.map((a, idx) => ({
          article_id: story.id,
          contributor_id: a.id,
          contribution_role: a.contributionRole || a.role || 'Contributor',
          display_order: idx,
        }));
        await supabase.from('article_contributors').insert(rows);
      }

      // Also mirror to local storage
      await this.localFallback.save(story, user);
      return { ...story, readingTime };
    } catch (err) {
      console.warn('Supabase save failed, saving locally:', err);
      return this.localFallback.save(story, user);
    }
  }

  async publish(id: string, user: AuthUser): Promise<Story> {
    if (!supabase) return this.localFallback.publish(id, user);

    const now = new Date().toISOString().split('T')[0];
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published', published_at: now, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await this.localFallback.publish(id, user);
      const story = await this.get(id, user);
      return story!;
    } catch {
      return this.localFallback.publish(id, user);
    }
  }

  async unpublish(id: string, user: AuthUser): Promise<Story> {
    if (!supabase) return this.localFallback.unpublish(id, user);

    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'draft', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await this.localFallback.unpublish(id, user);
      const story = await this.get(id, user);
      return story!;
    } catch {
      return this.localFallback.unpublish(id, user);
    }
  }

  async delete(id: string, user: AuthUser): Promise<void> {
    if (!supabase) return this.localFallback.delete(id, user);

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      await this.localFallback.delete(id, user);
    } catch {
      await this.localFallback.delete(id, user);
    }
  }

  async setLead(id: string, user: AuthUser): Promise<Story> {
    if (!supabase) return this.localFallback.setLead(id, user);

    try {
      await supabase.from('articles').update({ is_lead: false });
      await supabase.from('articles').update({ is_lead: true }).eq('id', id);
      await this.localFallback.setLead(id, user);
      const story = await this.get(id, user);
      return story!;
    } catch {
      return this.localFallback.setLead(id, user);
    }
  }

  async listContributors(): Promise<Contributor[]> {
    if (!supabase) return this.localFallback.listContributors();

    try {
      const { data, error } = await supabase.from('contributors').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return this.localFallback.listContributors();

      return data.map(r => ({
        id: r.id,
        name: r.display_name,
        role: r.role,
        bio: r.bio || undefined,
        profileImage: r.profile_image || undefined,
        profileLink: r.profile_link || undefined,
      }));
    } catch {
      return this.localFallback.listContributors();
    }
  }

  async saveContributor(contributor: Contributor, user: AuthUser): Promise<Contributor> {
    if (user.role !== 'admin') {
      throw new Error('Permission denied: Only Administrators may manage the newsroom contributor roster.');
    }
    if (!supabase) return this.localFallback.saveContributor(contributor, user);

    try {
      const { error } = await supabase.from('contributors').upsert({
        id: contributor.id,
        display_name: contributor.name,
        role: contributor.role,
        bio: contributor.bio || null,
        profile_image: contributor.profileImage || null,
        profile_link: contributor.profileLink || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await this.localFallback.saveContributor(contributor, user);
      return contributor;
    } catch {
      return this.localFallback.saveContributor(contributor, user);
    }
  }

  async deleteContributor(id: string, user: AuthUser): Promise<void> {
    if (user.role !== 'admin') {
      throw new Error('Permission denied: Only Administrators may delete contributors from the roster.');
    }
    if (!supabase) return this.localFallback.deleteContributor(id, user);

    try {
      await supabase.from('contributors').delete().eq('id', id);
      await this.localFallback.deleteContributor(id, user);
    } catch {
      await this.localFallback.deleteContributor(id, user);
    }
  }

  exportData(): string {
    return this.localFallback.exportData();
  }

  importData(jsonData: string) {
    return this.localFallback.importData(jsonData);
  }

  resetToDefaults(): void {
    this.localFallback.resetToDefaults();
  }

  private mapRowToStory(row: any, contribMap: Map<string, Contributor>): Story {
    const rawContribs = (row.article_contributors || []).sort(
      (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    const authors: Contributor[] = rawContribs.map((ac: any, idx: number) => {
      const base = contribMap.get(ac.contributor_id) || {
        id: ac.contributor_id,
        name: ac.contributor_id,
        role: ac.contribution_role,
      };
      return {
        ...base,
        isPrimary: idx === 0,
        contributionRole: ac.contribution_role,
      };
    });

    return {
      id: row.id,
      slug: row.slug,
      headline: row.headline,
      subheading: row.subheading || undefined,
      summary: row.summary,
      body: row.body,
      category: row.category,
      format: row.format,
      publishedAt: row.published_at || '',
      status: row.status,
      readingTime: row.reading_time || 1,
      isLead: Boolean(row.is_lead),
      isDemo: Boolean(row.is_demo),
      cover: {
        src: row.cover_src,
        alt: row.cover_alt,
        credit: row.cover_credit,
        caption: row.cover_caption,
      },
      media: row.media || undefined,
      sources: row.sources || [],
      sourcePdf: row.source_pdf || undefined,
      pdfPages: row.pdf_pages || undefined,
      authors: authors.length > 0 ? authors : [CONTRIBUTORS.samridhi],
    };
  }
}

// Export singleton instance based on environment configuration
export const contentRepository: IContentRepository = isSupabaseConfigured
  ? new SupabaseContentRepository()
  : new LocalContentRepository();
