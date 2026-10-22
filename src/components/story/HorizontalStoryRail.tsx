import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../types';
import { ArrowRight, Play, Headphones, Camera, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface HorizontalStoryRailProps {
  stories: Story[];
}

export const HorizontalStoryRail: React.FC<HorizontalStoryRailProps> = ({ stories }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScrollDistance, setMaxScrollDistance] = useState(0);
  const [isMobileOrReducedMotion, setIsMobileOrReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  // Filter published stories
  const displayStories = stories.filter(s => s.status === 'published');
  const count = displayStories.length;

  const updateDimensions = useCallback(() => {
    if (!trackRef.current) return;
    const currentViewportW = window.innerWidth;
    setViewportWidth(currentViewportW);
    const isMobile = currentViewportW < 1024;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsMobileOrReducedMotion(isMobile || prefersReduced);

    const trackWidth = trackRef.current.scrollWidth;
    // Provide 80px breathing room after the last card
    const overflow = Math.max(0, trackWidth - currentViewportW + 80);
    setMaxScrollDistance(overflow);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    // Scroll progress handler for desktop vertical-to-horizontal pinning
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const totalDistance = rect.height - window.innerHeight;

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

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [count, updateDimensions]);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'audio':
        return <Headphones className="w-3.5 h-3.5" />;
      case 'video':
        return <Play className="w-3.5 h-3.5 fill-current" />;
      case 'photo':
        return <Camera className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
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

  // Manual step button support for desktop and accessibility
  const handleManualStep = (direction: 'left' | 'right') => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowTop = window.scrollY;
    const sectionTop = windowTop + rect.top;
    const totalDistance = rect.height - window.innerHeight;
    const stepAmount = Math.max(totalDistance * 0.35, 250);

    const newTargetScroll = direction === 'right'
      ? Math.min(windowTop + stepAmount, sectionTop + totalDistance)
      : Math.max(windowTop - stepAmount, sectionTop);

    window.scrollTo({
      top: newTargetScroll,
      behavior: 'smooth',
    });
  };

  // MOBILE OR REDUCED-MOTION: Responsive horizontal touch rail with native scroll snap
  if (isMobileOrReducedMotion || count <= 1) {
    return (
      <section className="py-12 px-4 sm:px-8 border-b border-rule bg-paper-100" aria-label="Curated Story Rail">
        <div className="max-w-7xl mx-auto mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
              <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
                Curated Sequence
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950">
              The Reporting Rail
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-500">
            Swipe to explore ({count} stories)
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory focus:outline-hidden">
          {displayStories.map(story => {
            const authorsText = story.authors?.map(a => a.name).join(', ') || 'The Dispatch';
            const storyUrl = `/story/${story.slug}`;

            return (
              <article
                key={story.id}
                className="flex-shrink-0 w-80 sm:w-96 snap-start bg-paper-50 border border-ink-950 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 mb-3 border border-rule">
                    <img
                      src={story.cover.src}
                      alt={story.cover.alt || story.headline}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-ink-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                      {getFormatIcon(story.format)}
                      {getFormatLabel(story.format)}
                    </div>
                    {story.media?.duration && (
                      <div className="absolute bottom-2 right-2 bg-ink-950/85 text-paper-200 text-[10px] font-mono px-2 py-0.5">
                        {story.media.duration}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-editorial-red font-bold mb-1">
                    <span>{story.category}</span>
                    <span className="text-ink-400">•</span>
                    <span className="text-ink-600 font-normal">{story.readingTime} min read</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink-950 leading-snug mb-2 line-clamp-2">
                    <Link to={storyUrl} className="hover:text-editorial-red transition-colors">
                      {story.headline}
                    </Link>
                  </h3>

                  <p className="text-xs text-ink-700 font-serif line-clamp-2 mb-4 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-rule flex items-center justify-between text-xs font-mono text-ink-600 mt-2">
                  <span className="truncate max-w-[170px]">{authorsText}</span>
                  <Link
                    to={storyUrl}
                    className="font-bold text-editorial-red hover:text-ink-950 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  // DESKTOP: PROPORTIONAL PINNED RAIL (NEVER TRAPS THE USER)
  // If maxScrollDistance is negligible (< 80px), all cards comfortably fit the screen:
  // Render as an elegant horizontal flex band without any pinning!
  const needsPinning = maxScrollDistance > 80;
  // Calculate section height strictly based on overflow distance needed:
  // 1 viewport height + maxScrollDistance + 120px buffer for a gentle release into the next section
  const extraScrollDistance = needsPinning ? maxScrollDistance + 140 : 0;
  const horizontalOffset = needsPinning ? -scrollProgress * maxScrollDistance : 0;

  return (
    <section
      ref={sectionRef}
      style={{
        height: needsPinning ? `calc(100vh + ${extraScrollDistance}px)` : 'auto',
      }}
      className="relative border-b-2 border-ink-950 bg-paper-100"
      aria-label="Curated Featured Story Track"
    >
      {/* Sticky viewport window */}
      <div className={`${needsPinning ? 'sticky top-14 h-[calc(100vh-3.5rem)]' : 'relative py-12'} w-full overflow-hidden flex flex-col justify-between py-6`}>
        
        {/* Rail Header with Manual Controls & Progress Indicator */}
        <div className="max-w-7xl w-full mx-auto px-8 flex items-end justify-between pb-3 border-b border-rule z-10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-editorial-red font-bold mb-1">
              <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
              <span>Curated Sequence</span>
              <span className="text-ink-400">•</span>
              <span className="text-ink-600 font-normal">{count} Selected Stories</span>
            </div>
            <h2 className="font-serif text-3xl font-black text-ink-950">
              The Reporting Rail
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-ink-600">
            {/* Visual Controls: Left/Right Manual Step Buttons */}
            {needsPinning && (
              <div className="flex items-center gap-1 bg-paper-50 border border-rule p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleManualStep('left')}
                  className="p-1 hover:bg-paper-200 text-ink-800 hover:text-editorial-red transition-colors"
                  title="Scroll rail backwards"
                  aria-label="Previous rail story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleManualStep('right')}
                  className="p-1 hover:bg-paper-200 text-ink-800 hover:text-editorial-red transition-colors"
                  title="Scroll rail forwards"
                  aria-label="Next rail story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {needsPinning && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-1.5 bg-paper-200 border border-rule overflow-hidden">
                  <div
                    className="h-full bg-editorial-red transition-all duration-75"
                    style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-ink-500">{Math.round(scrollProgress * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Track Canvas */}
        <div className="relative w-full flex-grow flex items-center overflow-hidden my-auto py-4">
          <div
            ref={trackRef}
            className="flex items-center gap-8 px-12 will-change-transform"
            style={{
              transform: `translate3d(${horizontalOffset}px, 0, 0)`,
              transition: needsPinning ? 'none' : 'none',
            }}
          >
            {displayStories.map((story, index) => {
              // Alternating deliberate editorial rhythm
              const isLarge = index % 2 === 0;
              const cardWidth = isLarge ? 430 : 360;
              const authorsText = story.authors?.map(a => a.name).join(', ') || 'The Dispatch';
              const storyUrl = `/story/${story.slug}`;

              // Parabolic trajectory from lower-right viewport
              const cardApproxX = horizontalOffset + index * 410;
              const normalizedPos = (cardApproxX + 200) / (viewportWidth || 1200);
              const isEnteringFromRight = normalizedPos > 0.75;
              const curveY = isEnteringFromRight ? Math.min((normalizedPos - 0.75) * 30, 24) : 0;
              const tiltDeg = isEnteringFromRight ? Math.min((normalizedPos - 0.75) * 2, 1.5) : 0;

              return (
                <article
                  key={story.id}
                  style={{
                    width: `${cardWidth}px`,
                    height: '465px',
                    transform: `translate3d(0, ${curveY}px, 0) rotate(${tiltDeg}deg)`,
                  }}
                  className="flex-shrink-0 bg-paper-50 border border-ink-950 p-6 flex flex-col justify-between shadow-md transition-shadow duration-150 hover:shadow-xl group"
                >
                  {/* Card Media & Editorial Text */}
                  <div className="overflow-hidden flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 border border-rule mb-4 flex-shrink-0">
                      <img
                        src={story.cover.src}
                        alt={story.cover.alt || story.headline}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-ink-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                        {getFormatIcon(story.format)}
                        {getFormatLabel(story.format)}
                      </div>
                      {story.media?.duration && (
                        <div className="absolute bottom-2 right-2 bg-ink-950/85 text-paper-200 text-[10px] font-mono px-2 py-0.5 border border-white/20">
                          {story.media.duration}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono mb-2">
                      <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                      <span className="text-editorial-red font-bold uppercase tracking-wider">
                        {story.category}
                      </span>
                      <span className="text-ink-400">•</span>
                      <span className="text-ink-500 font-normal">{story.readingTime} min read</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 leading-snug mb-2 group-hover:text-editorial-red transition-colors line-clamp-2">
                      <Link to={storyUrl}>
                        {story.headline}
                      </Link>
                    </h3>

                    <p className="font-serif text-xs sm:text-sm text-ink-700 leading-relaxed line-clamp-3">
                      {story.summary}
                    </p>
                  </div>

                  {/* Card Footer: Strictly inside card border */}
                  <div className="pt-3 border-t border-rule flex items-center justify-between text-xs font-mono text-ink-600 flex-shrink-0 mt-3">
                    <span className="truncate max-w-[190px]">{authorsText}</span>
                    <Link
                      to={storyUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-950 text-paper-100 text-[11px] font-bold uppercase tracking-wider group-hover:bg-editorial-red transition-colors shadow-2xs"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 text-paper-200" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Rail Footer Navigation Hint */}
        <div className="max-w-7xl w-full mx-auto px-8 pt-3 border-t border-rule flex items-center justify-between text-xs font-mono text-ink-500 flex-shrink-0">
          <span>Explore all dispatches in sequence</span>
          <span>{scrollProgress < 0.92 ? 'Scroll down to continue' : 'End of sequence — continuous scroll below'}</span>
        </div>
      </div>
    </section>
  );
};

