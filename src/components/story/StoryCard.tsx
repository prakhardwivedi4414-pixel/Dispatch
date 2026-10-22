import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../types';
import { Clock, Play, Headphones, Camera, FileText, ArrowRight } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  variant?: 'hero' | 'lead' | 'secondary' | 'compact' | 'multimedia';
  showCategory?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  variant = 'secondary',
  showCategory = true,
}) => {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'audio':
        return <Headphones className="w-3 h-3" />;
      case 'video':
        return <Play className="w-3 h-3 fill-current" />;
      case 'photo':
        return <Camera className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'audio':
        return 'Audio Story';
      case 'video':
        return 'Video Report';
      case 'photo':
        return 'Photo Feature';
      case 'short':
        return 'Short Story';
      default:
        return 'Long Read';
    }
  };

  const storyUrl = `/story/${story.slug}`;
  const authorsText = story.authors?.map(a => a.name).join(', ') || 'The Dispatch';

  // HERO VARIANT (Dominant featured story layout)
  if (variant === 'hero') {
    return (
      <article className="group border-b border-rule pb-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Image with proof frame */}
          <div className="lg:col-span-7 relative overflow-hidden bg-ink-950 aspect-[16/10] border border-ink-950 shadow-sm proof-frame">
            <Link to={storyUrl} className="block w-full h-full">
              <img
                src={story.cover.src}
                alt={story.cover.alt || story.headline}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                loading="eager"
              />
            </Link>

            {/* Dateline Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-editorial-red text-white text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-sm">
                {getFormatIcon(story.format)}
                {getFormatLabel(story.format)}
              </span>
              {story.media?.duration && (
                <span className="bg-ink-950/85 backdrop-blur-xs text-paper-100 text-[11px] font-mono px-2 py-1 border border-paper-100/20">
                  {story.media.duration}
                </span>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {showCategory && (
              <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                <span className="uppercase tracking-widest font-bold text-editorial-red">
                  {story.category}
                </span>
                <span className="text-ink-400">•</span>
                <span className="text-ink-500 uppercase tracking-wider text-[11px]">
                  Dispatch
                </span>
              </div>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold text-ink-950 leading-[1.14] mb-4 group-hover:text-editorial-red transition-colors">
              <Link to={storyUrl}>{story.headline}</Link>
            </h1>

            <p className="text-ink-700 text-base sm:text-lg leading-relaxed mb-6 font-serif">
              {story.summary}
            </p>

            <div className="pt-4 border-t border-rule flex items-center justify-between text-xs text-ink-600 font-sans">
              <div>
                <span className="font-semibold text-ink-900">{authorsText}</span>
                <span className="mx-2">•</span>
                <span>{story.publishedAt}</span>
              </div>
              {story.readingTime && (
                <span className="flex items-center gap-1 font-mono text-ink-500">
                  <Clock className="w-3.5 h-3.5 text-editorial-red" />
                  {story.readingTime} min read
                </span>
              )}
            </div>

            <div className="mt-6">
              <Link
                to={storyUrl}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-ink-950 border-b-2 border-editorial-red pb-1 hover:text-editorial-red transition-colors"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-editorial-red" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // LEAD VARIANT (Visual anchor for section with warm paper styling)
  if (variant === 'lead') {
    return (
      <article className="group flex flex-col h-full bg-paper-50 border border-rule p-6 hover:border-ink-950 transition-colors shadow-xs">
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 border border-rule mb-4 proof-frame">
          <Link to={storyUrl} className="block w-full h-full">
            <img
              src={story.cover.src}
              alt={story.cover.alt || story.headline}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-3 left-3 bg-ink-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 flex items-center gap-1">
            {getFormatIcon(story.format)}
            {getFormatLabel(story.format)}
          </div>
        </div>

        {showCategory && (
          <div className="flex items-center gap-2 text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
            <span className="uppercase tracking-widest font-bold text-editorial-red">
              {story.category}
            </span>
          </div>
        )}

        <h2 className="font-serif text-2xl font-bold text-ink-950 leading-snug mb-3 group-hover:text-editorial-red transition-colors flex-grow">
          <Link to={storyUrl}>{story.headline}</Link>
        </h2>

        <p className="text-sm text-ink-700 leading-relaxed font-serif line-clamp-3 mb-5">
          {story.summary}
        </p>

        <div className="pt-3 border-t border-rule flex items-center justify-between text-xs text-ink-600 font-mono">
          <span className="font-medium text-ink-900 truncate max-w-[180px]">{authorsText}</span>
          <span className="text-ink-500 text-[11px]">{story.publishedAt}</span>
        </div>
      </article>
    );
  }

  // MULTIMEDIA VARIANT (Cinematic card on deep ink)
  if (variant === 'multimedia') {
    return (
      <article className="group bg-ink-900 text-paper-100 p-5 border border-ink-800 flex flex-col justify-between hover:border-paper-300 transition-colors shadow-sm">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 mb-4 border border-ink-800 proof-frame">
            <Link to={storyUrl} className="block w-full h-full">
              <img
                src={story.cover.src}
                alt={story.cover.alt || story.headline}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
            </Link>
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
              <div className="w-11 h-11 bg-editorial-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {getFormatIcon(story.format)}
              </div>
            </div>
            {story.media?.duration && (
              <span className="absolute bottom-2 right-2 bg-black/85 font-mono text-[10px] px-2 py-0.5 border border-white/20">
                {story.media.duration}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-2 font-mono">
            <span className="text-editorial-red font-bold">{getFormatLabel(story.format)}</span>
            <span className="text-paper-300">{story.category}</span>
          </div>

          <h3 className="font-serif text-xl font-bold leading-tight mb-2 group-hover:text-paper-100">
            <Link to={storyUrl} className="hover:underline">{story.headline}</Link>
          </h3>

          <p className="text-xs text-paper-300 line-clamp-2 font-serif mb-4 leading-relaxed">
            {story.summary}
          </p>
        </div>

        <div className="pt-3 border-t border-ink-800 flex items-center justify-between text-[11px] text-paper-400 font-mono">
          <span className="truncate max-w-[150px]">{authorsText}</span>
          <span>{story.readingTime} min</span>
        </div>
      </article>
    );
  }

  // COMPACT VARIANT (Sidebar feeds, search results, dense lists)
  if (variant === 'compact') {
    return (
      <article className="group py-4 border-b border-rule flex gap-4 items-start">
        <div className="relative w-24 h-24 flex-shrink-0 bg-ink-950 overflow-hidden border border-rule proof-frame">
          <Link to={storyUrl} className="block w-full h-full">
            <img
              src={story.cover.src}
              alt={story.cover.alt || story.headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-editorial-red">
              {story.category}
            </span>
            <span className="text-[10px] text-ink-400">•</span>
            <span className="text-[10px] font-mono text-ink-500 uppercase">{getFormatLabel(story.format)}</span>
          </div>

          <h4 className="font-serif text-base font-bold text-ink-950 leading-snug group-hover:text-editorial-red transition-colors line-clamp-2">
            <Link to={storyUrl}>{story.headline}</Link>
          </h4>

          <div className="mt-2 text-[10px] text-ink-500 font-mono flex items-center justify-between">
            <span>{story.publishedAt}</span>
            {story.media?.duration ? (
              <span>{story.media.duration}</span>
            ) : (
              <span>{story.readingTime} min read</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // STANDARD SECONDARY VARIANT
  return (
    <article className="group flex flex-col justify-between bg-paper-50 border border-rule p-4 hover:border-ink-950 transition-colors shadow-xs">
      <div>
        <div className={`relative ${story.format === 'photo' ? 'aspect-[4/3]' : 'aspect-[16/10]'} overflow-hidden bg-ink-950 border border-rule mb-3 proof-frame`}>
          <Link to={storyUrl} className="block w-full h-full">
            <img
              src={story.cover.src}
              alt={story.cover.alt || story.headline}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-2 left-2 bg-ink-950/90 text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1">
            {getFormatIcon(story.format)}
            {getFormatLabel(story.format)}
          </div>
        </div>

        {showCategory && (
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
            <span className="uppercase tracking-wider font-bold text-editorial-red">
              {story.category}
            </span>
          </div>
        )}

        <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 leading-snug mb-2 group-hover:text-editorial-red transition-colors line-clamp-2">
          <Link to={storyUrl}>{story.headline}</Link>
        </h3>

        <p className="text-xs text-ink-700 leading-relaxed font-serif line-clamp-2 mb-3">
          {story.summary}
        </p>
      </div>

      <div className="pt-2.5 border-t border-rule flex items-center justify-between text-[10px] text-ink-600 font-mono">
        <span className="truncate max-w-[130px]">{authorsText}</span>
        {story.media?.duration ? (
          <span>{story.media.duration}</span>
        ) : (
          <span>{story.readingTime} min read</span>
        )}
      </div>
    </article>
  );
};
