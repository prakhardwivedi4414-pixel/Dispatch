import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNewsroom } from '../context/NewsroomContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ReadingProgressBar } from '../components/story/ReadingProgressBar';
import { ShareBar } from '../components/story/ShareBar';
import { CreditsContributions } from '../components/story/CreditsContributions';
import { SourcesList } from '../components/story/SourcesList';
import { AudioPlayer } from '../components/media/AudioPlayer';
import { VideoPlayer } from '../components/media/VideoPlayer';
import { PhotoGallery } from '../components/media/PhotoGallery';
import { ScriptViewer } from '../components/media/ScriptViewer';
import { StoryCard } from '../components/story/StoryCard';
import { Clock, Calendar, User, ArrowLeft, ArrowUp } from 'lucide-react';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { stories, getStoryBySlug } = useNewsroom();

  const story = getStoryBySlug(slug || '');

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Update document title and meta description per editorial brief
  useEffect(() => {
    if (story && story.status === 'published') {
      document.title = `${story.headline} — The Dispatch`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', story.summary);
      }
    } else {
      document.title = 'Story Not Found — The Dispatch';
    }
  }, [story]);

  // Category visual themes: subtle hairline accent per design notes
  const categoryTheme = useMemo(() => {
    if (!story) {
      return {
        accentColor: '#9E1B1B',
        badgeClass: 'bg-editorial-red text-white',
        themeBorder: 'border-t-4 border-editorial-red',
        descriptor: 'Independent Student Journalism',
      };
    }
    switch (story.category) {
      case 'Campus':
        return {
          accentColor: '#1A365D',
          badgeClass: 'bg-ink-950 text-paper-100',
          themeBorder: 'border-t-4 border-ink-950',
          descriptor: 'Campus Reporting & Public Records Desk',
        };
      case 'Investigations':
        return {
          accentColor: '#9E1B1B',
          badgeClass: 'bg-editorial-red text-white',
          themeBorder: 'border-t-4 border-editorial-red',
          descriptor: 'Investigative & Accountability Desk',
        };
      case 'Culture':
        return {
          accentColor: '#18181A',
          badgeClass: 'bg-ink-900 text-paper-100',
          themeBorder: 'border-t-4 border-ink-900',
          descriptor: 'Visual Arts & Cultural Reporting',
        };
      case 'Society':
      default:
        return {
          accentColor: '#9E1B1B',
          badgeClass: 'bg-editorial-red text-white',
          themeBorder: 'border-t-4 border-editorial-red',
          descriptor: 'Social Policy & Community Reporting',
        };
    }
  }, [story]);

  // If story is missing or not published, return proper 404
  if (!story || story.status !== 'published') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-3 bg-paper-200 border border-rule mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">404 • Missing Dispatch</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mb-4">Story Not Found</h2>
        <p className="text-ink-600 mb-8 max-w-md mx-auto">
          The requested dispatch does not exist or is currently unpublished.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-950 text-paper-100 text-xs font-mono uppercase tracking-wider font-bold hover:bg-editorial-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>
      </div>
    );
  }

  // Related stories (other published stories)
  const relatedStories = stories
    .filter(s => s.id !== story.id && s.status === 'published')
    .slice(0, 3);

  const authorsText = story.authors?.map(a => a.name).join(', ') || 'The Dispatch';

  // Helper to parse markdown-like body into sections
  const renderFormattedBody = (content: string) => {
    const blocks = content.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H3 heading
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-10 mb-4 pt-4 border-t border-rule"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H2 heading
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-serif text-3xl font-bold text-ink-950 mt-12 mb-5"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Editorial Pullquote
      if (trimmed.includes('[Insert verified quotation:') || trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/, '').replace(/\[Insert verified quotation:\s*/, '').replace(/\]$/, '');
        return (
          <blockquote key={idx} className="pullquote my-8">
            <p>"{quoteText}"</p>
            <span className="block text-xs font-mono text-ink-600 uppercase tracking-wider mt-2">
              — Verified Field Recording
            </span>
          </blockquote>
        );
      }

      // Reporter's Transparency Note
      if (trimmed.includes("[Reporter's") || trimmed.includes('[Fieldwork') || trimmed.includes('[Note:')) {
        return (
          <aside
            key={idx}
            className="my-6 p-4 bg-paper-200 border-l-4 border-editorial-red text-xs sm:text-sm font-mono text-ink-800"
          >
            <span className="font-bold text-editorial-red block mb-1">EDITORIAL NOTE:</span>
            {trimmed}
          </aside>
        );
      }

      // First paragraph gets editorial drop cap for long-read format
      const isFirstParagraph = idx === 1 || (idx === 0 && !trimmed.startsWith('#'));
      const shouldDropCap = story.format === 'long-read' && isFirstParagraph;

      return (
        <p
          key={idx}
          className={`text-base sm:text-lg text-ink-850 font-serif leading-[1.8] mb-6 ${
            shouldDropCap ? 'drop-cap' : ''
          }`}
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className={`min-h-screen pb-20 ${categoryTheme.themeBorder} transition-colors duration-300`}>
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Breadcrumbs & Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2 mb-4">
          <Breadcrumbs
            items={[
              { label: story.category, path: `/section/${story.category.toLowerCase()}` },
              { label: story.headline },
            ]}
          />
          <Link
            to={`/section/${story.category.toLowerCase()}`}
            className="font-mono text-[11px] text-ink-600 hover:text-editorial-red transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to {story.category}</span>
          </Link>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="max-w-4xl mx-auto px-4 sm:px-8 pt-2 pb-8">
        {/* Category & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`${categoryTheme.badgeClass} text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 shadow-xs`}>
              {story.category}
            </span>
            <span className="text-xs font-mono text-ink-600 bg-paper-200 px-2.5 py-1 border border-rule">
              {story.format === 'long-read' ? 'Long Read' : story.format === 'short' ? 'Short Story' : story.format === 'photo' ? 'Photo Feature' : story.format === 'audio' ? 'Audio Story' : 'Video Report'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-ink-500 hidden sm:inline">
            {categoryTheme.descriptor}
          </span>
        </div>

        {/* Large Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-ink-950 leading-[1.12] mb-6">
          {story.headline}
        </h1>

        {/* Subheading / Summary */}
        <p className="font-serif text-lg sm:text-2xl text-ink-700 leading-relaxed font-normal mb-8 border-l-2 border-editorial-red pl-4 py-1">
          {story.summary}
        </p>

        {/* Byline & Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-rule text-xs font-sans text-ink-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-editorial-red" />
              <span className="font-semibold text-ink-950">Reporting by {authorsText}</span>
            </div>
            <span className="text-rule-dark">•</span>
            <div className="flex items-center gap-1.5 font-mono text-ink-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{story.publishedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-ink-600">
            {story.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-editorial-red" />
                {story.readingTime} min read
              </span>
            )}
            {story.media?.duration && (
              <span className="bg-paper-200 px-2 py-0.5 border border-rule text-ink-900 font-semibold">
                Media: {story.media.duration}
              </span>
            )}
          </div>
        </div>

        {/* Share Bar */}
        <ShareBar title={story.headline} />
      </header>

      {/* PRIMARY MEDIA DISPLAY (Format-dependent) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-10">
        {/* CASE 1: AUDIO */}
        {story.format === 'audio' && (
          <div>
            <AudioPlayer
              src={story.media?.url || 'https://cdn.freesound.org/previews/428/428980_5121236-lq.mp3'}
              title={story.headline}
              episodeNumber="The Dispatch Audio"
              byline={authorsText}
              duration={story.media?.duration}
              coverImage={story.cover.src}
              scriptText={story.media?.transcript}
            />
          </div>
        )}

        {/* CASE 2: VIDEO */}
        {story.format === 'video' && (
          <div>
            <VideoPlayer
              src={story.media?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              poster={story.cover.src}
              title={story.headline}
              duration={story.media?.duration}
              caption={story.cover.caption}
              credit={story.cover.credit}
              scriptText={story.media?.transcript}
            />
          </div>
        )}

        {/* CASE 3: PHOTO FEATURE */}
        {story.format === 'photo' && story.media?.photos && (
          <div>
            <PhotoGallery photos={story.media.photos} title={story.headline} />
          </div>
        )}

        {/* CASE 4: ARTICLE LEAD IMAGE */}
        {(story.format === 'long-read' || story.format === 'short') && (
          <figure className="my-8">
            <div className="aspect-[16/10] overflow-hidden bg-ink-950 border border-ink-900 proof-frame">
              <img
                src={story.cover.src}
                alt={story.cover.alt || story.headline}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-ink-600 font-sans mt-2 pt-2 border-t border-rule gap-2">
              <span className="font-serif italic text-ink-800 text-sm">
                {story.cover.caption}
              </span>
              <span className="font-mono text-[11px] text-ink-500 flex-shrink-0">
                Photo: {story.cover.credit}
              </span>
            </figcaption>
          </figure>
        )}
      </div>

      {/* ARTICLE BODY */}
      <main className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="prose-editorial">
          {renderFormattedBody(story.body)}
        </div>

        {/* SCRIPT / TRANSCRIPT SECTION (If media story has transcript) */}
        {story.media?.transcript && (story.format === 'audio' || story.format === 'video') && (
          <ScriptViewer
            scriptText={story.media.transcript}
            storyTitle={story.headline}
            mediaType={story.format === 'audio' ? 'podcast' : 'video-report'}
            duration={story.media.duration}
          />
        )}

        {/* SOURCES & REFERENCES */}
        <SourcesList sources={story.sources || []} />

        {/* EDITORIAL CREDITS */}
        <CreditsContributions contributors={story.authors} storyId={story.id} />

        {/* BOTTOM STORY NAV */}
        <div className="flex items-center justify-between pt-8 mt-12 border-t-2 border-ink-900 text-xs font-mono">
          <Link
            to={`/section/${story.category.toLowerCase()}`}
            className="flex items-center gap-1.5 text-ink-800 hover:text-editorial-red transition-colors uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {story.category}</span>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-ink-800 hover:text-editorial-red transition-colors uppercase font-bold cursor-pointer"
          >
            <span>Top of Article</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* RELATED STORIES RECOMMENDATIONS */}
      {relatedStories.length > 0 && (
        <aside className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 pt-10 border-t-2 border-ink-900">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-ink-950">
              More Stories from The Dispatch
            </h3>
            <Link
              to="/latest"
              className="text-xs font-mono uppercase tracking-wider text-editorial-red hover:underline"
            >
              All Dispatches →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedStories.map(s => (
              <StoryCard key={s.id} story={s} variant="secondary" />
            ))}
          </div>
        </aside>
      )}
    </article>
  );
};
