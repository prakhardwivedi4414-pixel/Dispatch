import { describe, it, expect, beforeEach } from 'vitest';
import { contentRepository, AuthUser } from '../services/contentRepository';
import { INITIAL_STORIES } from '../data/initialStories';
import { sanitizeStoredUser, DEMO_STAFF_ACCOUNTS } from '../context/AuthContext';

describe('Content Repository Role Permissions & Storage Quota Handling', () => {
  const contributorUser: AuthUser = { id: 'contrib-1', name: 'Arpita Singh', role: 'contributor' };
  const editorUser: AuthUser = { id: 'editor-1', name: 'Editor', role: 'editor' };
  const adminUser: AuthUser = { id: 'admin-1', name: 'Samridhi', role: 'admin' };

  beforeEach(() => {
    contentRepository.resetToDefaults();
  });

  it('allows contributors to save their drafts', async () => {
    const newStory = {
      ...INITIAL_STORIES[0],
      id: 'contrib-draft-1',
      slug: 'contrib-draft-1',
      status: 'draft' as const,
      headline: 'Contributor Draft Story',
    };
    const saved = await contentRepository.save(newStory, contributorUser);
    expect(saved.headline).toBe('Contributor Draft Story');
  });

  it('prevents contributors from directly publishing stories', async () => {
    await expect(
      contentRepository.publish('dispatch-du-hidden-struggles', contributorUser)
    ).rejects.toThrow(/Permission denied/);
  });

  it('prevents contributors from setting the homepage lead story', async () => {
    await expect(
      contentRepository.setLead('dispatch-du-hidden-struggles', contributorUser)
    ).rejects.toThrow(/Permission denied/);
  });

  it('allows editors to publish stories and set lead story', async () => {
    const published = await contentRepository.publish('dispatch-delhi-daily-commute', editorUser);
    expect(published.status).toBe('published');

    const leadStory = await contentRepository.setLead('dispatch-delhi-daily-commute', editorUser);
    expect(leadStory.isLead).toBe(true);

    // Verify other stories are no longer marked isLead
    const all = await contentRepository.list('all', editorUser);
    const otherLeads = all.filter(s => s.id !== 'dispatch-delhi-daily-commute' && s.isLead);
    expect(otherLeads.length).toBe(0);
  });

  it('prevents contributors and editors from modifying newsroom contributor roster', async () => {
    const newContributor = { id: 'reporter-x', name: 'New Reporter', role: 'Writer' };
    await expect(
      contentRepository.saveContributor(newContributor, contributorUser)
    ).rejects.toThrow(/Permission denied/);

    await expect(
      contentRepository.saveContributor(newContributor, editorUser)
    ).rejects.toThrow(/Permission denied/);
  });

  it('allows admins full roster and story control', async () => {
    const newContributor = { id: 'reporter-admin', name: 'Staff Columnist', role: 'Writer' };
    const saved = await contentRepository.saveContributor(newContributor, adminUser);
    expect(saved.id).toBe('reporter-admin');
  });

  it('exports and imports backup JSON data reliably', () => {
    const exportedJson = contentRepository.exportData();
    expect(exportedJson).toContain('dispatch-du-hidden-struggles');

    const importRes = contentRepository.importData(exportedJson);
    expect(importRes.success).toBe(true);
  });
});

describe('LocalStorage Authentication Sanitization & Anti-Tampering', () => {
  it('strictly prevents contributors from escalating to admin via localStorage role modification', () => {
    // Attacker modifies localStorage entry for Arpita Singh to have role: admin
    const tampered = {
      id: 'demo_staff_arpita',
      name: 'Arpita Singh',
      role: 'admin',
    };
    const sanitized = sanitizeStoredUser(tampered);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.role).toBe('contributor');
    expect(sanitized?.name).toBe('Arpita Singh');
  });

  it('prevents arbitrary unknown users from acquiring admin privileges via localStorage', () => {
    const maliciousPayload = {
      id: 'fake_admin_999',
      name: 'Attacker',
      role: 'admin',
    };
    const sanitized = sanitizeStoredUser(maliciousPayload);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.role).toBe('contributor');
  });

  it('preserves Samridhi as the sole verified administrator', () => {
    const validSamridhi = {
      id: DEMO_STAFF_ACCOUNTS.samridhi.id,
      name: 'Samridhi',
      role: 'admin',
    };
    const sanitized = sanitizeStoredUser(validSamridhi);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.role).toBe('admin');
    expect(sanitized?.name).toBe('Samridhi');
  });

  it('handles corrupted, null, or malformed localStorage payloads safely', () => {
    expect(sanitizeStoredUser(null)).toBeNull();
    expect(sanitizeStoredUser('random string')).toBeNull();
    expect(sanitizeStoredUser({})).toBeNull();
  });
});

