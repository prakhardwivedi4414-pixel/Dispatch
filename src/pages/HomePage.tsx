import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNewsroom } from '../context/NewsroomContext';
import { CinematicHero } from '../components/story/CinematicHero';
import { HorizontalStoryRail } from '../components/story/HorizontalStoryRail';
import { SpatialStoryOrbit } from '../components/story/SpatialStoryOrbit';
import { StoryCard } from '../components/story/StoryCard';
import { ArrowRight, BookOpen } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { stories, settings } = useNewsroom();

  useEffect(() => {
    document.title = 'The Dispatch — Stories That Matter';
  }, []);

  // Filter published stories: prioritize the 4 real PDF articles
  const publishedStories = stories.filter(s => s.status === 'published');
  const activeEditorialStories = publishedStories.filter(s => !s.isDemo);
  const coreStories = activeEditorialStories.length >= 4 ? activeEditorialStories : publishedStories;

  // Lead featured story and secondary dispatches
  const featuredStory = coreStories.find(s => s.isLead) || coreStories[0];
  const remainingStories = coreStories.filter(s => s.id !== featuredStory?.id);
  const secondaryLead = remainingStories.find(s => s.id === 'dispatch-beyond-the-slogans') || remainingStories[0];
  const shortStories = remainingStories.filter(s => s.id !== secondaryLead?.id);
  const multimediaStories = coreStories.filter(s => s.format === 'photo' || s.format === 'audio' || s.format === 'video');

  return (
    <div className="min-h-screen pb-16">
      {/* 1. EDITORIAL EDITION HEADER STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rule text-xs font-mono text-ink-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
            <span className="font-bold text-editorial-red uppercase tracking-widest">Front Page</span>
            <span>•</span>
            <span>Independent Digital Edition</span>
            <span>•</span>
            <span className="text-ink-500">Vol. IV • Published in Real Time</span>
          </div>

          <div className="text-xs font-mono text-ink-500 hidden sm:block">
            Stories That Matter
          </div>
        </div>
      </div>

      {/* 2. CINEMATIC LEAD STORY WITH SCROLL-LINKED TRANSFORMATION */}
      {featuredStory && (
        <CinematicHero story={featuredStory} />
      )}

      {/* 3. HORIZONTAL STORY RAIL: PARABOLIC ENTRANCE & ALTERNATING RHYTHM */}
      <HorizontalStoryRail stories={coreStories} />

      {/* 4. SIGNATURE FEATURE: THE DISPATCH ORBIT (Organic 3D field on paper palette) */}
      <SpatialStoryOrbit stories={coreStories} />

      {/* 5. EDITORIAL GRID: LATEST REPORTING & DESKS */}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <section className="mb-16" aria-label="Latest In-Depth Reporting">
          <div className="flex items-end justify-between pb-3 border-b-2 border-ink-950 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                <span className="text-xs uppercase font-mono tracking-widest text-editorial-red font-bold">
                  Desks & Dispatches
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-ink-950">
                Latest Reporting & Investigations
              </h2>
            </div>
            <Link
              to="/latest"
              className="flex items-center gap-1 text-xs font-bold font-mono uppercase tracking-wider text-ink-800 hover:text-editorial-red transition-colors"
            >
              <span>View All Dispatches</span>
              <ArrowRight className="w-3.5 h-3.5 text-editorial-red" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column: Second lead investigation */}
            <div className="lg:col-span-7">
              {secondaryLead && (
                <StoryCard story={secondaryLead} variant="lead" />
              )}
            </div>

            {/* Secondary Column: Short stories / compact feed */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-paper-200 border-t-2 border-editorial-red p-4">
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-ink-700">
                  Focused Dispatches
                </span>
                <p className="font-serif text-sm text-ink-800 mt-1">
                  Compact reporting, documentary photo sequences, and focused broadcast reports.
                </p>
              </div>

              <div className="divide-y divide-rule">
                {(shortStories.length > 0 ? shortStories : remainingStories).slice(0, 3).map(story => (
                  <StoryCard key={story.id} story={story} variant="compact" />
                ))}
              </div>

              <div className="p-4 bg-paper-100 border border-rule text-xs font-mono text-ink-600">
                <span className="text-editorial-red font-bold">Editorial Note:</span> Published by student reporters adhering to two-source verification and full documentary transparency.
              </div>
            </div>
          </div>
        </section>

        {/* 6. MULTIMEDIA & VISUAL JOURNALISM */}
        <section className="my-16" aria-label="Multimedia Showcase">
          <div className="flex items-center justify-between pb-3 border-b-2 border-ink-950 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
                  Documentary Photography & Visual Features
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950">
                Visual Journalism & Fieldwork
              </h2>
            </div>
            <Link
              to="/multimedia"
              className="text-xs font-mono uppercase tracking-wider text-editorial-red hover:underline inline-flex items-center gap-1 font-bold"
            >
              <span>Explore Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {multimediaStories.slice(0, 2).map(story => (
              <StoryCard key={story.id} story={story} variant="secondary" />
            ))}
          </div>
        </section>

        {/* 8. NEWSROOM MANIFESTO */}
        <section className="my-16 bg-paper-100 border border-ink-950 p-8" aria-label="Newsroom Manifesto">
          <div className="flex items-center gap-2 text-editorial-red font-mono text-xs uppercase tracking-widest font-bold mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Newsroom Attribution Charter</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink-950 mb-3">
            Independent. Verifiable. Student-Led.
          </h3>
          <p className="font-serif text-base text-ink-700 leading-relaxed mb-6 max-w-3xl">
            <em>{settings.brandName}</em> exists to illuminate the quiet mechanisms of campus life, institutional memory, and community solidarity. Our reporters adhere to strict verification standards: two independent sources for every factual assertion, unmanipulated documentary photography, and transparent attribution of all student team contributions.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-rule text-xs font-mono text-ink-700">
            <span>Editor: <strong>{settings.editorName}</strong></span>
            <span>•</span>
            <Link to="/about" className="text-editorial-red hover:underline font-bold transition-colors">
              Read Newsroom Charter & Masthead →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
