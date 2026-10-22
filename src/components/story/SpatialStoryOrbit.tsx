import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../types';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight, Headphones, Video, Camera, FileText } from 'lucide-react';
import { getPrefersReducedMotion } from '../../utils/motion';

interface SpatialStoryOrbitProps {
  stories: Story[];
}

export const SpatialStoryOrbit: React.FC<SpatialStoryOrbitProps> = ({ stories }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const publishedStories = stories.filter(s => s.status === 'published');
  const count = publishedStories.length;

  // Animation and drag state stored in refs to avoid per-frame setState re-renders
  const phaseRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  // Drag tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const totalDragDistanceRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);

  // Watchdog timer ref
  const watchdogTimerRef = useRef<number | null>(null);

  // React states for UI-only elements
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [reducedMotion] = useState(() => getPrefersReducedMotion());

  // Update card DOM transforms directly via refs (no React state updates in RAF loop!)
  const updateCardTransforms = useCallback(() => {
    if (count === 0) return;
    const Rx = 360;
    const Rz = 240;
    const Ry = 25;

    publishedStories.forEach((_, i) => {
      const cardEl = cardRefs.current[i];
      if (!cardEl) return;

      const angleOffset = (Math.PI * 2 * i) / count;
      const currentAngle = phaseRef.current + angleOffset;

      const sinA = Math.sin(currentAngle);
      const cosA = Math.cos(currentAngle);

      const x = Rx * sinA;
      const z = Rz * cosA;
      const y = -Ry * cosA;

      const depthRatio = (cosA + 1) / 2; // 0 (back) to 1 (front)
      const scale = 0.72 + depthRatio * 0.34; // 0.72 -> 1.06
      const rotateY = -sinA * 36;
      const opacity = 0.4 + depthRatio * 0.6;
      const zIndex = Math.round(depthRatio * 50);

      cardEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
      cardEl.style.opacity = `${opacity.toFixed(2)}`;
      cardEl.style.zIndex = `${zIndex}`;
      cardEl.style.filter = depthRatio < 0.3 ? 'blur(1px)' : 'none';
    });
  }, [count, publishedStories]);

  // Main single requestAnimationFrame loop
  useEffect(() => {
    if (reducedMotion || count <= 1) return;

    let isRunning = true;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!isRunning) return;

      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Handle drag inertia
      if (Math.abs(dragVelocityRef.current) > 0.001) {
        phaseRef.current = (phaseRef.current + dragVelocityRef.current) % (Math.PI * 2);
        dragVelocityRef.current *= 0.9;
        updateCardTransforms();
      } else if (
        isVisibleRef.current &&
        !isPausedRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !document.hidden
      ) {
        // Continuous organic rotation (~0.12 radians/second)
        phaseRef.current = (phaseRef.current + delta * 0.12) % (Math.PI * 2);
        updateCardTransforms();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [count, reducedMotion, updateCardTransforms]);

  // IntersectionObserver to pause loop when section is offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Watchdog & Pointer Leave release
  const releaseHover = useCallback(() => {
    isHoveredRef.current = false;
    if (watchdogTimerRef.current) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  const triggerHover = useCallback(() => {
    isHoveredRef.current = true;
    // Watchdog timer: automatically release after 6s of inactivity in case pointer leave was missed
    if (watchdogTimerRef.current) window.clearTimeout(watchdogTimerRef.current);
    watchdogTimerRef.current = window.setTimeout(() => {
      releaseHover();
    }, 6000);
  }, [releaseHover]);

  // Global blur listener
  useEffect(() => {
    const handleBlur = () => {
      releaseHover();
      isDraggingRef.current = false;
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [releaseHover]);

  // Drag interaction with movement threshold to avoid accidental click
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    totalDragDistanceRef.current = 0;
    dragVelocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragStartXRef.current = e.clientX;
    totalDragDistanceRef.current += Math.abs(deltaX);

    const angularDelta = (deltaX / 300) * 0.75;
    phaseRef.current = (phaseRef.current + angularDelta) % (Math.PI * 2);
    if (phaseRef.current < 0) phaseRef.current += Math.PI * 2;
    dragVelocityRef.current = angularDelta * 0.4;
    updateCardTransforms();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Step buttons
  const handleStep = (direction: 'prev' | 'next') => {
    const step = (Math.PI * 2) / Math.max(count, 1);
    phaseRef.current = (phaseRef.current + (direction === 'next' ? step : -step)) % (Math.PI * 2);
    if (phaseRef.current < 0) phaseRef.current += Math.PI * 2;
    updateCardTransforms();
  };

  const toggleUserPause = () => {
    const next = !isUserPaused;
    setIsUserPaused(next);
    isPausedRef.current = next;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'audio':
        return <Headphones className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'photo':
        return <Camera className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  if (count === 0) return null;

  // Reduced motion fallback: static list of stories on paper background
  if (reducedMotion) {
    return (
      <section className="my-16 py-12 px-4 sm:px-8 bg-paper-200 border-y border-rule" aria-label="Stories Overview">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between pb-4 border-b border-rule mb-8">
            <div>
              <div className="dispatch-stamp mb-1">CURATED DISPATCHES</div>
              <h2 className="font-serif text-3xl font-bold text-ink-950">Explore the Stories</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedStories.map(story => (
              <article key={story.id} className="bg-paper-100 border border-rule p-4 flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/3] bg-ink-950 mb-3 overflow-hidden">
                    <img src={story.cover.src} alt={story.cover.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-editorial-red font-bold block mb-1">
                    {story.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-ink-950 mb-2">
                    <button onClick={() => navigate(`/story/${story.slug || story.id}`)} className="text-left hover:text-editorial-red">
                      {story.headline}
                    </button>
                  </h3>
                  <p className="text-xs text-ink-700 font-sans line-clamp-2 mb-4">{story.summary}</p>
                </div>
                <button
                  onClick={() => navigate(`/story/${story.slug || story.id}`)}
                  className="pt-2 border-t border-rule text-xs font-mono font-bold uppercase text-editorial-red hover:underline flex items-center justify-between"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const selectedStory = publishedStories[selectedIndex] || publishedStories[0];

  return (
    <section
      ref={containerRef}
      className="my-16 py-16 bg-paper-200 border-y border-rule relative overflow-hidden"
      aria-label="Story Orbit Discovery"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20">
        
        {/* Editorial Section Header */}
        <div className="flex flex-wrap items-end justify-between pb-6 border-b border-rule mb-6 gap-4">
          <div>
            <div className="dispatch-stamp mb-1">
              FIELD DISCOVERY • {count} STORIES
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
              Explore the Stories
            </h2>
            <p className="font-serif text-sm text-ink-700 mt-1 max-w-xl">
              An interactive 3D field of published dispatches. Tap or click any card to read immediately, or drag horizontally to rotate.
            </p>
          </div>

          {/* Calm Editorial Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleStep('prev')}
              className="p-1.5 bg-paper-100 hover:bg-paper-300 border border-rule text-ink-800 transition-colors"
              aria-label="Previous story angle"
              title="Previous story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleUserPause}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
                isUserPaused
                  ? 'bg-editorial-red text-white border-editorial-red'
                  : 'bg-paper-100 hover:bg-paper-300 border-rule text-ink-800'
              }`}
              aria-label={isUserPaused ? 'Resume rotation' : 'Pause rotation'}
            >
              {isUserPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                {isUserPaused ? 'Resume' : 'Pause'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStep('next')}
              className="p-1.5 bg-paper-100 hover:bg-paper-300 border border-rule text-ink-800 transition-colors"
              aria-label="Next story angle"
              title="Next story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Orbit Stage (Pure CSS 3D Transforms, touch-action pan-y so vertical page scroll is never blocked) */}
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={e => {
            handlePointerUp(e);
            releaseHover();
          }}
          onPointerEnter={triggerHover}
          onPointerLeave={e => {
            handlePointerUp(e);
            releaseHover();
          }}
          style={{
            touchAction: 'pan-y', // Never block vertical page scroll!
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
          className="relative w-full h-[480px] flex items-center justify-center my-4 select-none cursor-grab active:cursor-grabbing overflow-hidden sm:overflow-visible"
        >
          {publishedStories.map((story, i) => {
            const storyUrl = `/story/${story.slug || story.id}`;
            const authorsText = story.authors?.map(a => a.name).join(' and ') || 'The Dispatch';

            return (
              <div
                key={story.id}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  width: '270px',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                  transition: 'filter 0.2s ease',
                }}
                className="group focus:outline-hidden"
              >
                <article
                  onClick={() => {
                    // Suppress click if user was dragging
                    if (totalDragDistanceRef.current > 6) return;
                    setSelectedIndex(i);
                    navigate(storyUrl);
                  }}
                  onFocus={() => {
                    setSelectedIndex(i);
                    triggerHover();
                  }}
                  onBlur={releaseHover}
                  className="bg-paper-50 border border-ink-950 p-3.5 shadow-lg proof-frame transition-all duration-150 hover:shadow-xl hover:border-editorial-red cursor-pointer"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-[4/3] bg-ink-950 overflow-hidden mb-2.5 border border-rule">
                    <img
                      src={story.cover.src}
                      alt={story.cover.alt}
                      width={story.cover.width || 1200}
                      height={story.cover.height || 900}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-ink-950 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                      {story.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-ink-950/80 text-paper-100 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-1">
                      {getFormatIcon(story.format)}
                      <span>{story.readingTime} min</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-ink-950 leading-snug line-clamp-2 group-hover:text-editorial-red transition-colors mb-2">
                    {story.headline}
                  </h3>

                  <p className="text-xs font-serif text-ink-700 line-clamp-2 leading-relaxed mb-3">
                    {story.summary}
                  </p>

                  <div className="pt-2 border-t border-rule flex items-center justify-between text-[11px] font-mono text-ink-600">
                    <span className="truncate max-w-[130px]">{authorsText}</span>
                    <span className="text-editorial-red font-bold inline-flex items-center gap-0.5 group-hover:underline">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Selected Story Summary Drawer below orbit */}
        {selectedStory && (
          <div className="mt-4 pt-6 border-t border-rule bg-paper-100 border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="max-w-3xl">
              <div className="dispatch-stamp mb-1.5">
                ACTIVE DISPATCH • {selectedStory.category}
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink-950 mb-2 leading-snug">
                {selectedStory.headline}
              </h3>
              <p className="font-serif text-sm text-ink-700 line-clamp-2 leading-relaxed">
                {selectedStory.summary}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/story/${selectedStory.slug || selectedStory.id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex-shrink-0"
            >
              <span>Read Selected Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
