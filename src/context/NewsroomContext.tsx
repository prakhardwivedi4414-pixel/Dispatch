import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Story, StoryFormat } from '../types';
import { contentRepository } from '../services/contentRepository';

export interface NewsroomSettings {
  brandName: string;
  tagline: string;
  editorName: string;
  editionLabel: string;
}

interface NewsroomContextType {
  stories: Story[];
  publishedStories: Story[];
  settings: NewsroomSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  activeFormat: StoryFormat | 'all' | null;
  setActiveFormat: (fmt: StoryFormat | 'all' | null) => void;
  refreshStories: () => Promise<void>;
  updateSettings: (newSettings: Partial<NewsroomSettings>) => void;
  getStoryBySlug: (slug: string) => Story | undefined;
  getStoryById: (id: string) => Story | undefined;
}

const STORAGE_KEY_SETTINGS = 'the_dispatch_public_settings_v5';

const DEFAULT_SETTINGS: NewsroomSettings = {
  brandName: 'The Dispatch',
  tagline: 'Stories That Matter',
  editorName: 'Siya',
  editionLabel: 'Independent Multimedia Edition',
};

const NewsroomContext = createContext<NewsroomContextType | undefined>(undefined);

export const NewsroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [settings, setSettings] = useState<NewsroomSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<StoryFormat | 'all' | null>(null);

  const refreshStories = useCallback(async () => {
    const list = await contentRepository.list('published', null);
    setStories(list);
  }, []);

  useEffect(() => {
    refreshStories();
  }, [refreshStories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<NewsroomSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getStoryBySlug = (slug: string): Story | undefined => {
    return stories.find(s => s.slug === slug || s.id === slug);
  };

  const getStoryById = (id: string): Story | undefined => {
    return stories.find(s => s.id === id);
  };

  const publishedStories = stories.filter(s => s.status === 'published');

  return (
    <NewsroomContext.Provider
      value={{
        stories,
        publishedStories,
        settings,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        activeFormat,
        setActiveFormat,
        refreshStories,
        updateSettings,
        getStoryBySlug,
        getStoryById,
      }}
    >
      {children}
    </NewsroomContext.Provider>
  );
};

export const useNewsroom = (): NewsroomContextType => {
  const context = useContext(NewsroomContext);
  if (!context) {
    throw new Error('useNewsroom must be used within a NewsroomProvider');
  }
  return context;
};
