import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNewsroom } from '../../context/NewsroomContext';
import { Search, Menu, X, ChevronDown, Compass, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, searchQuery, setSearchQuery } = useNewsroom();
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsSectionsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  // Keyboard accessibility: Escape to close modals/drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSectionsOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus trap / auto-focus for search modal
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const primaryLinks = [
    { label: 'Latest', path: '/latest' },
    { label: 'Long Reads', path: '/long-reads' },
    { label: 'Short Stories', path: '/short-stories' },
    { label: 'Multimedia', path: '/multimedia' },
    { label: 'About', path: '/about' },
  ];

  const categoryBeats = [
    { label: 'Campus', path: '/section/campus', desc: 'Nocturnal operations, labor, and facilities governance' },
    { label: 'Society', path: '/section/society', desc: 'Mutual aid, student food security, and community care' },
    { label: 'Culture', path: '/section/culture', desc: '35mm analog darkroom craft and creative subcultures' },
    { label: 'Investigations', path: '/section/investigations', desc: 'Archival preservation audits and institutional memory' },
  ];

  return (
    <>
      {/* CALM, SINGLE-ROW EDITORIAL MASTHEAD */}
      <header className="sticky top-0 z-40 bg-paper-100 border-b border-rule transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Left: Publication Masthead */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSectionsOpen(!isSectionsOpen)}
              className="lg:hidden p-1.5 text-ink-900 hover:text-editorial-red transition-colors"
              aria-label="Toggle navigation sections"
              aria-expanded={isSectionsOpen}
            >
              {isSectionsOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="inline-flex items-baseline gap-1 group">
              <span className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink-950 group-hover:text-editorial-red transition-colors">
                {settings.brandName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-editorial-red inline-block mb-1" />
            </Link>
          </div>

          {/* Center: Primary Editorial Destinations (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-ink-700">
            {primaryLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors hover:text-editorial-red relative ${
                    isActive ? 'text-editorial-red font-bold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-editorial-red" />
                  )}
                </Link>
              );
            })}

            {/* Sections Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsSectionsOpen(!isSectionsOpen)}
              className={`inline-flex items-center gap-1 py-1 transition-colors hover:text-editorial-red ${
                isSectionsOpen ? 'text-editorial-red font-bold' : ''
              }`}
              aria-expanded={isSectionsOpen}
            >
              <span>Sections</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSectionsOpen ? 'rotate-180' : ''}`} />
            </button>
          </nav>

          {/* Right: Search Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-ink-700 hover:text-editorial-red border border-rule hover:border-ink-900 bg-paper-50 transition-colors"
              aria-label="Open search dialog"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTIONS DISCOVERY DRAWER / MENU PANEL */}
      {isSectionsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start animate-fadeIn"
          onClick={() => setIsSectionsOpen(false)}
        >
          <div
            ref={drawerRef}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md h-full bg-paper-100 border-r border-ink-950 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-rule mb-6">
                <div>
                  <span className="dispatch-stamp block mb-1">
                    INDEX • THE DISPATCH
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-ink-950">
                    Editorial Desks
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSectionsOpen(false)}
                  className="p-1.5 text-ink-700 hover:text-ink-950 border border-rule hover:border-ink-900 bg-paper-50"
                  aria-label="Close sections menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Links for Mobile */}
              <div className="lg:hidden mb-6 pb-6 border-b border-rule">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 font-bold block mb-3">
                  Primary Destinations
                </span>
                <ul className="space-y-2">
                  {primaryLinks.map(link => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="font-serif text-lg font-bold text-ink-950 hover:text-editorial-red block transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reporting Categories */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 font-bold block mb-3">
                  Reporting Desks
                </span>
                <div className="space-y-2">
                  {categoryBeats.map(beat => {
                    const isActive = location.pathname === beat.path;
                    return (
                      <Link
                        key={beat.path}
                        to={beat.path}
                        className={`block p-3 border transition-colors ${
                          isActive
                            ? 'bg-paper-200 border-editorial-red'
                            : 'bg-paper-50 border-rule hover:border-ink-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-ink-950 text-base">
                            {beat.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                        </div>
                        <p className="text-xs text-ink-600 font-sans mt-0.5">
                          {beat.desc}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Look Closer under Investigations as methodology explainer */}
              <div className="pt-4 border-t border-rule">
                <Link
                  to="/look-closer"
                  className="block p-3 bg-paper-200 border border-rule hover:border-ink-950 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-editorial-red font-bold mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Investigations Lab</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-ink-950">
                    Look Closer: Fieldwork & Evidence Explorer
                  </h3>
                  <p className="text-xs text-ink-600 mt-1">
                    Annotated documentary photographs, nocturnal shift timeline, and reporting methodology.
                  </p>
                </Link>
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="pt-6 border-t border-rule text-xs font-mono text-ink-500 flex items-center justify-between">
              <span>{settings.editionLabel}</span>
              <Link to="/about" className="hover:text-editorial-red underline">
                Newsroom Mission
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fadeIn"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-paper-100 border border-ink-950 shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search stories"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rule mb-4">
              <span className="font-serif text-lg font-bold text-ink-950 flex items-center gap-2">
                <Search className="w-4 h-4 text-editorial-red" />
                Search The Dispatch
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-ink-600 hover:text-ink-950 p-1"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div className="relative mb-4">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search headlines, summaries, reporters, or topics..."
                  className="w-full px-4 py-3 bg-white border border-ink-950 text-ink-950 font-serif text-base placeholder:font-sans placeholder:text-sm focus:outline-hidden focus:ring-1 focus:ring-editorial-red"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-600">
                <span className="font-mono text-[11px] text-ink-500">
                  Press Enter to search
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
