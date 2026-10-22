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

  // Animation and physics state stored in refs for maximum performance
  const phaseRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const hoveredCardIndexRef = useRef<number | null>(null);

  // Speed constants (radians per second)
  const BASE_SPEED = 0.09;
  const HOVER_SPEED = 0.025; // Gentle readable drift on hover — NEVER freezes!
  const currentSpeedRef = useRef<number>(BASE_SPEED);

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const totalDragDistanceRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);

  // Watchdog timer ref
  const watchdogTimerRef = useRef<number | null>(null);

  // React states for UI-only presentation
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [reducedMotion] = useState(() => getPrefersReducedMotion());

  // Update card DOM transforms directly via refs (no React state updates in RAF loop)
  const updateCardTransforms = useCallback(() => {
    if (count === 0) return;
    const Rx = 360;
    const Rz = 230;
    const Ry = 28;

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
      const isCardHovered = hoveredCardIndexRef.current === i;
      
      // Slight scale bump on hover for the specific card
      const baseScale = 0.72 + depthRatio * 0.35;
      const scale = isCardHovered ? baseScale * 1.05 : baseScale;
      const rotateY = -sinA * 28;
      const opacity = 0.38 + depthRatio * 0.62;
      const zIndex = isCardHovered ? 120 : Math.round(depthRatio * 60);

      cardEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
      cardEl.style.opacity = `${opacity.toFixed(2)}`;
      cardEl.style.zIndex = `${zIndex}`;
      cardEl.style.filter = depthRatio < 0.22 ? 'blur(1.2px)' : 'none';
    });
  }, [count, publishedStories]);

  // Main single requestAnimationFrame loop
  useEffect(() => {
    if (reducedMotion || count <= 1) return;

    let isRunning = true;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!isRunning) return;

      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1); // Guard against tab sleep delta jumps
      lastTimeRef.current = now;

      // Handle drag inertia
      if (Math.abs(dragVelocityRef.current) > 0.001) {
        phaseRef.current = (phaseRef.current + dragVelocityRef.current) % (Math.PI * 2);
        dragVelocityRef.current *= 0.92;
        updateCardTransforms();
      } else if (
        isVisibleRef.current &&
        !isPausedRef.current &&
        !isDraggingRef.current &&
        !document.hidden
      ) {
        // Continuous organic rotation: slows to a gentle readable crawl on hover without freezing
        const targetSpeed = isHoveredRef.current ? HOVER_SPEED : BASE_SPEED;
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.08;
        phaseRef.current = (phaseRef.current + delta * currentSpeedRef.current) % (Math.PI * 2);
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

  // Bulletproof Pointer Release & Hover Tracking
  const releaseHover = useCallback(() => {
    isHoveredRef.current = false;
    hoveredCardIndexRef.current = null;
    setHoveredCardIndex(null);
    if (watchdogTimerRef.current) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    updateCardTransforms();
  }, [updateCardTransforms]);

  const triggerHover = useCallback((index?: number) => {
    isHoveredRef.current = true;
    if (typeof index === 'number') {
      hoveredCardIndexRef.current = index;
      setHoveredCardIndex(index);
    }
    // Safety watchdog: reset hover if no pointer movement occurs for 2.5s
    if (watchdogTimerRef.current) window.clearTimeout(watchdogTimerRef.current);
    watchdogTimerRef.current = window.setTimeout(() => {
      releaseHover();
    }, 2500);
    updateCardTransforms();
  }, [releaseHover, updateCardTransforms]);

  // Window listeners for pointer leaving viewport, blur, and tab visibility
  useEffect(() => {
    const handleBlur = () => {
      releaseHover();
      isDraggingRef.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        releaseHover();
        isDraggingRef.current = false;
      }
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isHoveredRef.current && !isDraggingRef.current) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isOutside = (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
      if (isOutside) {
        releaseHover();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      if (watchdogTimerRef.current) window.clearTimeout(watchdogTimerRef.current);
    };
  }, [releaseHover]);

  // Pointer drag interactions
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

    const angularDelta = (deltaX / 320) * 0.75;
    phaseRef.current = (phaseRef.current + angularDelta) % (Math.PI * 2);
    if (phaseRef.current < 0) phaseRef.current += Math.PI * 2;
    dragVelocityRef.current = angularDelta * 0.35;
    updateCardTransforms();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
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

  // Fallback for users preferring reduced motion
  if (reducedMotion) {
    return (
      <section className="my-16 py-12 px-4 sm:px-8 bg-[#0F1012] text-paper-100 border-y border-white/10" aria-label="Curated Dispatches Overview">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between pb-4 border-b border-white/10 mb-8">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-editorial-red font-bold mb-1">
                CURATED DISPATCHES
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">Explore the Stories</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedStories.map(story => (
              <article key={story.id} className="bg-[#18191D] border border-white/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/3] bg-black mb-3 overflow-hidden border border-white/10">
                    <img src={story.cover.src} alt={story.cover.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-editorial-red font-bold block mb-1">
                    {story.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mb-2">
                    <button onClick={() => navigate(`/story/${story.slug || story.id}`)} className="text-left hover:text-editorial-red transition-colors">
                      {story.headline}
                    </button>
                  </h3>
                  <p className="text-xs text-paper-300 font-sans line-clamp-2 mb-4 leading-relaxed">{story.summary}</p>
                </div>
                <button
                  onClick={() => navigate(`/story/${story.slug || story.id}`)}
                  className="pt-2 border-t border-white/10 text-xs font-mono font-bold uppercase text-editorial-red hover:text-white flex items-center justify-between transition-colors"
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
      onPointerLeave={releaseHover}
      className="my-16 py-16 bg-[#0E0F12] border-y border-white/10 relative overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(26, 29, 36, 0.85) 0%, rgba(14, 15, 18, 1) 100%)',
      }}
      aria-label="Story Spatial Orbit Discovery"
    >
      {/* Subtle atmospheric vignette and fine hairline grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20">
        
        {/* Editorial Section Header */}
        <div className="flex flex-wrap items-end justify-between pb-6 border-b border-white/10 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-editorial-red/15 border border-editorial-red/30 text-[10px] font-mono tracking-widest uppercase text-editorial-red font-bold mb-2">
              <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
              <span>EDITORIAL FIELD • {count} STORIES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Spatial Story Orbit
            </h2>
            <p className="font-serif text-sm text-paper-300 mt-1 max-w-xl leading-relaxed">
              A continuous 3D field of published dispatches. Tap any card to read immediately, or drag horizontally to inspect the orbital field.
            </p>
          </div>

          {/* Calm Editorial Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleStep('prev')}
              className="p-2 bg-[#18191E] hover:bg-[#22242B] border border-white/15 text-paper-200 hover:text-white transition-colors"
              aria-label="Previous story angle"
              title="Previous story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleUserPause}
              className={`flex items-center gap-1.5 px-3 py-2 border transition-colors ${
                isUserPaused
                  ? 'bg-editorial-red text-white border-editorial-red'
                  : 'bg-[#18191E] hover:bg-[#22242B] border-white/15 text-paper-200 hover:text-white'
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
              className="p-2 bg-[#18191E] hover:bg-[#22242B] border border-white/15 text-paper-200 hover:text-white transition-colors"
              aria-label="Next story angle"
              title="Next story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Orbit Stage (CSS 3D Transforms, touch-action pan-y so vertical page scroll is never blocked) */}
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={e => {
            handlePointerUp(e);
            releaseHover();
          }}
          onPointerLeave={e => {
            handlePointerUp(e);
            releaseHover();
          }}
          style={{
            touchAction: 'pan-y', // Keep vertical page scrolling completely unblocked
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
          className="relative w-full h-[480px] flex items-center justify-center my-4 cursor-grab active:cursor-grabbing overflow-hidden sm:overflow-visible"
        >
          {publishedStories.map((story, i) => {
            const storyUrl = `/story/${story.slug || story.id}`;
            const authorsText = story.authors?.map(a => a.name).join(' and ') || 'The Dispatch';
            const isHovered = hoveredCardIndex === i;

            return (
              <div
                key={story.id}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  width: '280px',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                  transition: 'filter 0.2s ease',
                }}
                className="group focus:outline-hidden"
              >
                <article
                  tabIndex={0}
                  role="button"
                  aria-label={`Read story: ${story.headline}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(storyUrl);
                    }
                  }}
                  onPointerEnter={() => triggerHover(i)}
                  onPointerLeave={releaseHover}
                  onClick={() => {
                    // Suppress click if user was dragging
                    if (totalDragDistanceRef.current > 6) return;
                    setSelectedIndex(i);
                    navigate(storyUrl);
                  }}
                  onFocus={() => {
                    setSelectedIndex(i);
                    triggerHover(i);
                  }}
                  onBlur={releaseHover}
                  className={`bg-[#18191E] border p-4 shadow-xl transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'border-editorial-red shadow-2xl shadow-black/80 ring-1 ring-editorial-red/50'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-[4/3] bg-black overflow-hidden mb-3 border border-white/10">
                    <img
                      src={story.cover.src}
                      alt={story.cover.alt}
                      width={story.cover.width || 1200}
                      height={story.cover.height || 900}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/90 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold border border-white/10">
                      {story.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/85 text-paper-200 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
                      {getFormatIcon(story.format)}
                      <span>{story.readingTime} min</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-editorial-red transition-colors mb-2">
                    {story.headline}
                  </h3>

                  <p className="text-xs font-serif text-paper-300 line-clamp-2 leading-relaxed mb-3">
                    {story.summary}
                  </p>

                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-paper-400">
                    <span className="truncate max-w-[130px]">{authorsText}</span>
                    <span className="text-editorial-red font-bold inline-flex items-center gap-1 group-hover:underline">
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
          <div className="mt-6 pt-6 border-t border-white/10 bg-[#141519] border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-editorial-red font-bold uppercase tracking-widest mb-1.5">
                <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                <span>SELECTED DISPATCH • {selectedStory.category}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-snug">
                {selectedStory.headline}
              </h3>
              <p className="font-serif text-sm text-paper-300 line-clamp-2 leading-relaxed">
                {selectedStory.summary}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/story/${selectedStory.slug || selectedStory.id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-editorial-red hover:bg-editorial-red-dark text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex-shrink-0"
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

