import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNewsroom } from '../../context/NewsroomContext';
import { Bell, X, ArrowRight } from 'lucide-react';

const SESSION_KEY = 'dispatch_news_brief_dismissed_v1';

export const NewsBriefBanner: React.FC = () => {
  const { stories } = useNewsroom();
  const [dismissed, setDismissed] = useState(true);

  // Find the most recently published genuine story
  const latestStory = React.useMemo(() => {
    const published = stories.filter(s => s.status === 'published');
    if (published.length === 0) return null;
    return [...published].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )[0];
  }, [stories]);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem(SESSION_KEY);
      if (!isDismissed && latestStory) {
        setDismissed(false);
      }
    } catch {
      // sessionStorage unavailable, default to not showing to be safe
    }
  }, [latestStory]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (dismissed || !latestStory) return null;

  return (
    <div
      role="region"
      aria-label="Editorial News Brief"
      className="bg-paper-200 border-b border-ink-900 text-ink-900 text-xs py-2 px-4 sm:px-8 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-editorial-red text-white font-mono text-[10px] uppercase font-bold tracking-wider flex-shrink-0">
            <Bell className="w-3 h-3" />
            Editorial Dispatch
          </span>

          <span className="text-[11px] font-mono text-ink-500 hidden sm:inline flex-shrink-0">
            {latestStory.publishedAt}
          </span>

          <span className="text-rule-dark hidden sm:inline">•</span>

          <Link
            to={`/story/${latestStory.slug}`}
            className="font-serif font-bold hover:text-editorial-red truncate text-ink-950 inline-flex items-center gap-1 transition-colors"
          >
            <span className="truncate">{latestStory.headline}</span>
            <ArrowRight className="w-3 h-3 text-editorial-red flex-shrink-0 ml-1 inline" />
          </Link>
        </div>

        <button
          onClick={handleDismiss}
          className="text-ink-500 hover:text-ink-900 p-1 flex-shrink-0 transition-colors cursor-pointer"
          aria-label="Dismiss editorial update"
          title="Dismiss update banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
