import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useNewsroom } from '../context/NewsroomContext';
import { StoryCard } from '../components/story/StoryCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Search, Filter, RefreshCw, BookOpen, ShieldCheck } from 'lucide-react';
import { StoryFormat } from '../types';

export const SectionPage: React.FC = () => {
  const { category, sectionName } = useParams<{ category?: string; sectionName?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stories } = useNewsroom();

  const activeSection = (category || sectionName || 'latest').toLowerCase();
  const queryParam = searchParams.get('q') || '';
  const formatParam = searchParams.get('format') || 'all';

  const [localSearch, setLocalSearch] = useState(queryParam);
  const [selectedFormat, setSelectedFormat] = useState<string>(formatParam);

  // Sync with searchParams
  useEffect(() => {
    setLocalSearch(queryParam);
    setSelectedFormat(formatParam);
  }, [queryParam, formatParam]);

  // Determine section metadata
  const sectionMeta = useMemo(() => {
    switch (activeSection) {
      case 'long-reads':
        return {
          title: 'Long Reads & In-Depth Reporting',
          description: 'Substantive investigative reporting and narrative journalism exceeding 1,000 words or deep audio documentaries.',
          formatFilter: 'long-read' as StoryFormat,
          categoryFilter: null,
          isInvestigations: false,
        };
      case 'short-stories':
        return {
          title: 'Short Stories & Dispatches',
          description: 'Compact dispatches, short video reports, and curated photographic features capturing focused community moments.',
          formatFilter: 'short' as StoryFormat,
          categoryFilter: null,
          isInvestigations: false,
        };
      case 'campus':
        return {
          title: 'Campus Life & Governance',
          description: 'Inside the operational machinery, student labor, facilities management, and administrative transparency.',
          formatFilter: null,
          categoryFilter: 'Campus',
          isInvestigations: false,
        };
      case 'society':
        return {
          title: 'Society & Mutual Aid',
          description: 'Grassroots community responses, student food security, cost-of-living realities, and urban solidarity networks.',
          formatFilter: null,
          categoryFilter: 'Society',
          isInvestigations: false,
        };
      case 'culture':
        return {
          title: 'Culture & The Arts',
          description: 'Independent artistic practice, analog darkroom craft, student creative subcultures, and aesthetic counter-movements.',
          formatFilter: null,
          categoryFilter: 'Culture',
          isInvestigations: false,
        };
      case 'investigations':
        return {
          title: 'Investigative & Accountability',
          description: 'Documentary research, public records audits, institutional memory, and algorithmic accountability reporting.',
          formatFilter: null,
          categoryFilter: 'Investigations',
          isInvestigations: true,
        };
      case 'multimedia':
        return {
          title: 'Multimedia Desk',
          description: 'All audio documentary podcasts, video field reports, and documentary photographic sequences.',
          formatFilter: null,
          categoryFilter: null,
          multimediaOnly: true,
          isInvestigations: false,
        };
      case 'latest':
      default:
        return {
          title: 'Latest Dispatches',
          description: 'All published reporting, multimedia features, and investigative dispatches from The Dispatch newsroom.',
          formatFilter: null,
          categoryFilter: null,
          isInvestigations: false,
        };
    }
  }, [activeSection]);

  // Update document title
  useEffect(() => {
    document.title = `${sectionMeta.title} — The Dispatch`;
  }, [sectionMeta.title]);

  // Filter published stories
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      if (story.status !== 'published') return false;

      // 1. Section Format Filter (e.g., long-reads or short-stories)
      if (sectionMeta.formatFilter && story.format !== sectionMeta.formatFilter) {
        return false;
      }

      // 2. Section Category Filter
      if (sectionMeta.categoryFilter && story.category.toLowerCase() !== sectionMeta.categoryFilter.toLowerCase()) {
        return false;
      }

      // 3. Multimedia only
      if (sectionMeta.multimediaOnly) {
        const isMulti = story.format === 'audio' || story.format === 'video' || story.format === 'photo';
        if (!isMulti) return false;
      }

      // 4. Format selector toolbar
      if (selectedFormat !== 'all') {
        if (story.format !== selectedFormat) return false;
      }

      // 5. Search query
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchesHeadline = story.headline.toLowerCase().includes(q);
        const matchesSummary = story.summary.toLowerCase().includes(q);
        const matchesBody = story.body.toLowerCase().includes(q);
        const matchesCategory = story.category.toLowerCase().includes(q);
        const matchesAuthors = story.authors?.some(a => a.name.toLowerCase().includes(q));
        if (!matchesHeadline && !matchesSummary && !matchesBody && !matchesCategory && !matchesAuthors) {
          return false;
        }
      }

      return true;
    });
  }, [stories, sectionMeta, selectedFormat, localSearch]);

  const updateFilters = (newSearch: string, newFmt: string) => {
    const params: Record<string, string> = {};
    if (newSearch.trim()) params.q = newSearch.trim();
    if (newFmt !== 'all') params.format = newFmt;
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    updateFilters(val, selectedFormat);
  };

  const handleFormatChange = (fmt: string) => {
    setSelectedFormat(fmt);
    updateFilters(localSearch, fmt);
  };

  const resetFilters = () => {
    setLocalSearch('');
    setSelectedFormat('all');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Sections' }, { label: sectionMeta.title }]} />

      {/* Header */}
      <div className="pb-6 mb-8 border-b-2 border-ink-900">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
          <span className="text-xs uppercase font-mono tracking-widest text-editorial-red font-bold">
            Editorial Desk
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink-950 mb-3">
          {sectionMeta.title}
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 max-w-3xl leading-relaxed">
          {sectionMeta.description}
        </p>
      </div>

      {/* INVESTIGATIONS METHODOLOGY NOTE */}
      {sectionMeta.isInvestigations && (
        <div className="mb-10 p-5 bg-paper-100 border border-ink-950 text-ink-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-editorial-red flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-sans leading-relaxed">
            <strong className="font-mono uppercase text-ink-950 font-bold block mb-1">
              Methodology & Source Verification Note
            </strong>
            <p className="text-ink-700 font-serif">
              Investigations at The Dispatch rely on multi-source verification: Freedom of Information (FOI) public records, direct fieldwork recordings, and cross-referenced primary documents. Every source is audited and catalogued in our reporting transparency ledger.
            </p>
          </div>
        </div>
      )}

      {/* SEARCH & FORMAT FILTER TOOLBAR */}
      <div className="bg-paper-200 border border-rule p-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Filter current section by keyword..."
            className="w-full pl-9 pr-4 py-2 bg-paper-50 border border-rule text-xs font-mono text-ink-900 focus:outline-hidden focus:border-ink-900"
          />
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono">
          <span className="text-ink-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Format:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'long-read', label: 'Long Read' },
            { id: 'short', label: 'Short Story' },
            { id: 'audio', label: 'Audio' },
            { id: 'video', label: 'Video' },
            { id: 'photo', label: 'Photo' },
          ].map(fmt => (
            <button
              key={fmt.id}
              onClick={() => handleFormatChange(fmt.id)}
              className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-ink-900 text-white border-ink-900 font-bold'
                  : 'bg-paper-50 text-ink-700 border-rule hover:border-ink-600'
              }`}
            >
              {fmt.label}
            </button>
          ))}

          {(localSearch || selectedFormat !== 'all') && (
            <button
              onClick={resetFilters}
              className="ml-2 flex items-center gap-1 text-[11px] text-editorial-red hover:underline cursor-pointer"
              title="Reset search and filters"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* STORIES GRID */}
      {filteredStories.length > 0 ? (
        <div className={
          activeSection === 'short-stories'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        }>
          {filteredStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              variant={activeSection === 'short-stories' ? 'compact' : activeSection === 'long-reads' ? 'lead' : 'secondary'}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-paper-100 border-2 border-dashed border-rule p-12 text-center max-w-xl mx-auto my-12">
          <BookOpen className="w-10 h-10 text-ink-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-ink-950 mb-2">
            No Dispatches Published Yet
          </h3>
          <p className="text-sm text-ink-600 font-serif mb-6 leading-relaxed">
            No published stories in this section currently match your query or filter criteria. Check back for upcoming editorial reporting or clear your filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-ink-950 text-paper-100 text-xs font-mono uppercase tracking-wider font-bold hover:bg-editorial-red transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
