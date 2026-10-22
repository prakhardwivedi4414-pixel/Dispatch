import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useNewsroom } from '../context/NewsroomContext';
import { StoryCard } from '../components/story/StoryCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Search, BookOpen } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { stories } = useNewsroom();

  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      document.title = `Search: "${query}" — The Dispatch`;
    } else {
      document.title = `Search Archives — The Dispatch`;
    }
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    return stories.filter(story => {
      if (story.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && story.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'all' && story.format !== selectedFormat) {
        return false;
      }

      const matchHeadline = story.headline.toLowerCase().includes(q);
      const matchSummary = story.summary.toLowerCase().includes(q);
      const matchBody = story.body.toLowerCase().includes(q);
      const matchCategory = story.category.toLowerCase().includes(q);
      const matchAuthors = story.authors?.some(a => a.name.toLowerCase().includes(q));

      return matchHeadline || matchSummary || matchBody || matchCategory || matchAuthors;
    });
  }, [stories, query, selectedCategory, selectedFormat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Search Archives' }]} />

      {/* Header */}
      <div className="pb-6 mb-8 border-b-2 border-ink-900">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
          <span className="text-xs uppercase font-mono tracking-widest text-editorial-red font-bold">
            Editorial Search
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink-950 mb-3">
          Search The Dispatch
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 max-w-2xl leading-relaxed">
          Search across all published investigations, field reporting, transcripts, and documentary photo features.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-2xl flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by topic, reporter, or keyword (e.g. nocturnal, archive, mutual aid)..."
              className="w-full pl-11 pr-4 py-3 bg-paper-50 border-2 border-ink-950 font-serif text-sm sm:text-base text-ink-950 placeholder:text-ink-400 focus:outline-hidden focus:border-editorial-red"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-ink-950 text-paper-100 font-mono text-xs uppercase tracking-wider font-bold hover:bg-editorial-red transition-colors flex-shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Row if query exists */}
      {query.trim() && (
        <div className="bg-paper-100 border border-rule p-4 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="text-ink-600">
            Found <span className="font-bold text-ink-950">{results.length}</span> {results.length === 1 ? 'dispatch' : 'dispatches'} for "{query}"
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-ink-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-paper-50 border border-rule px-2 py-1 text-ink-900 font-mono text-xs focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="campus">Campus</option>
                <option value="society">Society</option>
                <option value="culture">Culture</option>
                <option value="investigations">Investigations</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-ink-500">Format:</span>
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="bg-paper-50 border border-rule px-2 py-1 text-ink-900 font-mono text-xs focus:outline-hidden"
              >
                <option value="all">All Formats</option>
                <option value="long-read">Long Read</option>
                <option value="short">Short Story</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="photo">Photo</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results or States */}
      {!query.trim() ? (
        /* Empty Prompt State */
        <div className="bg-paper-50 border border-rule p-12 text-center max-w-xl mx-auto my-12">
          <Search className="w-10 h-10 text-ink-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-ink-950 mb-2">
            Explore the Archives
          </h3>
          <p className="text-sm text-ink-600 font-serif mb-6 leading-relaxed">
            Enter a search term above to find stories across all reporting desks. You can also explore popular topics:
          </p>
          <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
            {['Night shift', 'Archive', 'Darkroom', 'Mutual aid', 'Labor', 'Campus'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchTerm(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-3 py-1.5 bg-paper-200 border border-rule hover:border-ink-950 text-ink-800 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : results.length > 0 ? (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(story => (
            <StoryCard key={story.id} story={story} variant="secondary" />
          ))}
        </div>
      ) : (
        /* No Results State */
        <div className="bg-paper-100 border-2 border-dashed border-rule p-12 text-center max-w-xl mx-auto my-12">
          <BookOpen className="w-10 h-10 text-ink-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-ink-950 mb-2">
            No Dispatches Found
          </h3>
          <p className="text-sm text-ink-600 font-serif mb-6 leading-relaxed">
            No stories matched your search for <strong className="text-ink-950 font-bold">"{query}"</strong>. Try checking your spelling, using more general keywords, or browsing our primary sections.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
              className="px-4 py-2 bg-ink-950 text-paper-100 text-xs font-mono uppercase tracking-wider font-bold hover:bg-editorial-red transition-colors cursor-pointer"
            >
              Clear Search
            </button>
            <Link
              to="/latest"
              className="px-4 py-2 bg-paper-200 border border-rule text-ink-800 text-xs font-mono uppercase tracking-wider font-bold hover:border-ink-950 transition-colors"
            >
              Browse Latest
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
