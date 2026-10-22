import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../types';
import { Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { getPrefersReducedMotion } from '../../utils/motion';

interface CinematicHeroProps {
  story: Story;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ story }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion] = useState(() => getPrefersReducedMotion());

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalDistance = rect.height - windowHeight;

          if (totalDistance <= 0) {
            setScrollProgress(0);
          } else {
            const current = -rect.top;
            const progress = Math.min(Math.max(current / totalDistance, 0), 1);
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storyUrl = `/story/${story.slug || story.id}`;
  const authorsText = story.authors?.map(a => a.name).join(' and ') || 'The Dispatch';

  // Static fallback for reduced motion
  if (reducedMotion) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 border-b border-rule mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative aspect-[16/10] bg-ink-950 border border-ink-950 overflow-hidden proof-frame">
            <Link to={storyUrl} className="block w-full h-full">
              <img
                src={story.cover.src}
                alt={story.cover.alt}
                width={story.cover.width || 1600}
                height={story.cover.height || 1000}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </Link>
            <div className="absolute top-4 left-4 bg-editorial-red text-white text-xs font-mono uppercase tracking-widest px-3 py-1 font-bold">
              {story.category}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="dispatch-stamp mb-2">LEAD INVESTIGATION</div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 leading-tight mb-4">
              <Link to={storyUrl} className="hover:text-editorial-red transition-colors">
                {story.headline}
              </Link>
            </h1>
            <p className="font-serif text-ink-700 text-base leading-relaxed mb-6">
              {story.summary}
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-ink-600 border-t border-rule pt-4">
              <span>By {authorsText}</span>
              <span>{story.readingTime} min read</span>
            </div>
            <div className="mt-6">
              <Link
                to={storyUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-950 text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-editorial-red transition-colors"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Smooth CSS variable-driven transformation
  // Progress 0: cover fills viewport
  // Progress 1: cover contracts to left panel (~56% width), side overview panel emerges
  const coverWidthPercent = 100 - scrollProgress * 44; // 100% -> 56%
  const sideContentOpacity = Math.max(0, (scrollProgress - 0.2) / 0.8);
  const sideContentTranslateX = (1 - scrollProgress) * 24;
  const imageScale = 1.05 - scrollProgress * 0.05;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[120vh] border-b border-rule mb-8"
      aria-label="Lead Story Presentation"
    >
      {/* Sticky viewport frame that releases naturally after transition */}
      <div className="sticky top-14 sm:top-16 h-[calc(100vh-4rem)] w-full overflow-hidden flex items-center justify-center py-4 px-4 sm:px-8">
        <div className="w-full max-w-7xl h-[92%] flex flex-col lg:flex-row items-stretch justify-between gap-6 overflow-hidden">
          
          {/* 1. Contracting Cover Panel */}
          <div
            className="relative h-full transition-all duration-75 flex flex-col justify-end overflow-hidden border border-ink-950 bg-ink-950 shadow-md proof-frame flex-shrink-0"
            style={{
              width: window.innerWidth >= 1024 ? `${coverWidthPercent}%` : '100%',
            }}
          >
            <div className="absolute inset-0 bg-ink-950 overflow-hidden">
              <img
                src={story.cover.src}
                alt={story.cover.alt}
                width={story.cover.width || 1600}
                height={story.cover.height || 1000}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={{ transform: `scale(${imageScale})` }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/50 to-ink-950/20" />
            </div>

            {/* Badges */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-white z-20 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="bg-editorial-red text-white text-[11px] font-mono uppercase font-bold tracking-widest px-3 py-1">
                  {story.category}
                </span>
                <span className="bg-ink-950/80 text-paper-100 text-[11px] font-mono uppercase px-2.5 py-1 border border-paper-100/20">
                  Lead Story
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-paper-200 text-xs font-mono bg-ink-950/70 px-3 py-1 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-editorial-red" />
                <span>{story.readingTime} Min Read</span>
              </div>
            </div>

            {/* Initial Headline Content */}
            <div className="relative z-20 p-6 sm:p-10 max-w-3xl text-paper-100">
              <div className="dispatch-stamp text-paper-300 mb-2">
                <span>By {authorsText}</span>
                <span>•</span>
                <span>{story.publishedAt}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.12] mb-4">
                <Link to={storyUrl} className="hover:text-paper-200 transition-colors">
                  {story.headline}
                </Link>
              </h1>

              <div className="pt-2">
                <Link
                  to={storyUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-editorial-red hover:bg-editorial-red-dark text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  <span>Read Lead Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Scroll Hint */}
            {scrollProgress < 0.2 && (
              <div className="absolute bottom-4 right-6 hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-paper-300 z-20 animate-bounce pointer-events-none">
                <span>Scroll to explore</span>
                <ChevronDown className="w-3.5 h-3.5 text-editorial-red" />
              </div>
            )}
          </div>

          {/* 2. Revealed Editorial Panel Alongside */}
          <div
            className="hidden lg:flex flex-col justify-between h-full bg-paper-50 border border-rule p-8 transition-all duration-100 shadow-sm flex-grow"
            style={{
              opacity: sideContentOpacity,
              transform: `translateX(${sideContentTranslateX}px)`,
              pointerEvents: scrollProgress > 0.35 ? 'auto' : 'none',
            }}
          >
            <div>
              <div className="dispatch-stamp mb-3">
                INVESTIGATIVE DOSSIER • {story.category}
              </div>

              <h2 className="font-serif text-2xl font-bold text-ink-950 leading-snug mb-4">
                {story.subheading || 'Fieldwork Overview'}
              </h2>

              <p className="font-serif text-base text-ink-800 leading-relaxed mb-6">
                {story.summary}
              </p>

              <div className="p-4 bg-paper-200 border-l-2 border-editorial-red text-xs font-mono text-ink-800 space-y-2 mb-6">
                <div>Published on {story.publishedAt}</div>
                <div>Reporting verified through primary shift logs & recorded fieldwork</div>
              </div>
            </div>

            <div className="pt-4 border-t border-rule flex items-center justify-between">
              <div className="text-xs font-mono text-ink-600">
                <span className="font-bold text-ink-900 block">By {authorsText}</span>
                <span className="text-[11px] text-ink-500">{story.readingTime} min in-depth read</span>
              </div>

              <Link
                to={storyUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
