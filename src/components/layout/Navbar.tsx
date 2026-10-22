import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNewsroom } from '../../context/NewsroomContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Menu, X, User, LogIn, LogOut, ShieldCheck,
  ChevronDown, Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, searchQuery, setSearchQuery } = useNewsroom();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Keyboard accessibility: Escape to close modals/drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click-outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // Auto-focus for search modal
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/', { replace: true });
  };

  // The 6 clean, verified public destinations required by the brief
  const primaryDestinations = [
    { label: 'Home', path: '/' },
    { label: 'Latest', path: '/latest' },
    { label: 'Features', path: '/features' },
    { label: 'Campus', path: '/campus' },
    { label: 'Multimedia', path: '/multimedia' },
    { label: 'About', path: '/about' },
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/features') {
      return location.pathname === '/features' || location.pathname === '/long-reads' || location.pathname === '/short-stories';
    }
    if (path === '/campus') {
      return location.pathname === '/campus' || location.pathname === '/section/campus';
    }
    return location.pathname.startsWith(path);
  };

  const isAdmin = user?.role === 'admin' && user?.name === 'Samridhi';

  return (
    <>
      {/* COMPACT, DIGNIFIED EDITORIAL MASTHEAD */}
      <header className="sticky top-0 z-40 bg-paper-100 border-b border-rule shadow-2xs">
        {/* Top Tier: Publication Name & Key Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Masthead */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-ink-900 hover:text-editorial-red transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="inline-flex items-baseline gap-1 group" title="Return to The Dispatch Front Page">
              <span className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink-950 group-hover:text-editorial-red transition-colors">
                {settings.brandName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-editorial-red inline-block mb-1" />
            </Link>
          </div>

          {/* Center: Editorial Tagline & Datestamp (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-ink-500">
            <span>Stories That Matter</span>
            <span className="text-editorial-red">•</span>
            <span>Independent Student Newsroom</span>
          </div>

          {/* Right: Search Action & Authentication Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono text-ink-700 hover:text-editorial-red border border-rule hover:border-ink-900 bg-paper-50 transition-colors cursor-pointer"
              aria-label="Open search dialog"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Authenticated Account Menu vs Sign In Link */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-paper-50 border border-ink-950 hover:bg-paper-200 transition-colors cursor-pointer text-xs font-mono"
                  aria-expanded={isUserMenuOpen}
                  aria-label="User account menu"
                >
                  <div className="w-4 h-4 rounded-full bg-ink-950 text-paper-100 flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-bold text-ink-950 max-w-[100px] sm:max-w-[130px] truncate">
                    {user.name}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] uppercase tracking-wider bg-editorial-red text-white px-1 py-0.2 rounded-2xs font-bold hidden sm:inline">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-ink-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-paper-50 border-2 border-ink-950 shadow-xl py-2 z-50 text-xs font-mono">
                    <div className="px-3 py-2 border-b border-rule">
                      <span className="text-[10px] uppercase tracking-widest text-ink-500 block">Signed in as</span>
                      <strong className="text-ink-950 font-serif text-sm block truncate">{user.name}</strong>
                      <span className="text-[10px] text-editorial-red uppercase tracking-wider font-bold">
                        {isAdmin ? 'Sole Administrator' : 'Newsroom Contributor'}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-ink-800 hover:bg-paper-200 hover:text-editorial-red transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile & Bylines</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-ink-800 hover:bg-paper-200 hover:text-editorial-red transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Editorial CMS Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/contributors"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-ink-800 hover:bg-paper-200 hover:text-editorial-red transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Manage Contributors</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-rule mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-ink-700 hover:bg-red-50 hover:text-editorial-red transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-ink-950 text-white hover:bg-editorial-red transition-colors shadow-2xs"
                title="Staff Sign In"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Lower Tier: Compact Horizontal Editorial Navigation (Desktop) */}
        <div className="hidden lg:block border-t border-rule bg-paper-50/80">
          <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-ink-700">
            <div className="flex items-center gap-6 py-2">
              {primaryDestinations.map(item => {
                const isActive = isCurrentActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`py-0.5 transition-colors hover:text-editorial-red relative whitespace-nowrap ${
                      isActive ? 'text-editorial-red font-bold' : 'text-ink-700'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-editorial-red" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="text-[10px] text-ink-400 pl-4 py-2 border-l border-rule whitespace-nowrap">
              Vol. IV • Authentic Dispatches
            </div>
          </nav>
        </div>
      </header>

      {/* MOBILE / EXPANDABLE EDITORIAL MENU DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm h-full bg-paper-100 border-r border-ink-950 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-rule mb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-editorial-red font-bold block mb-1">
                    THE DISPATCH
                  </span>
                  <h2 className="font-serif text-2xl font-black text-ink-950">
                    Navigation
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-ink-700 hover:text-ink-950 border border-rule hover:border-ink-900 bg-paper-50 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Public Pages */}
              <ul className="space-y-3 font-serif text-lg mb-8">
                {primaryDestinations.map(link => {
                  const isActive = isCurrentActive(link.path);
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`block transition-colors hover:text-editorial-red py-1 ${
                          isActive ? 'text-editorial-red font-bold border-l-2 border-editorial-red pl-2' : 'text-ink-950'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Authenticated Staff Tools in Drawer */}
              <div className="pt-6 border-t border-rule">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 font-bold block mb-3">
                  Newsroom Staff
                </span>
                {isAuthenticated && user ? (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-3 bg-paper-200 border border-rule mb-2">
                      <span className="text-[10px] text-ink-500 block">Logged in as</span>
                      <strong className="text-ink-950 font-serif text-sm block">{user.name}</strong>
                      <span className="text-[10px] text-editorial-red font-bold">{user.role}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="block p-2 bg-paper-50 border border-rule hover:border-ink-950 transition-colors"
                    >
                      My Profile & Bylines
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block p-2 bg-ink-950 text-white hover:bg-editorial-red transition-colors"
                      >
                        CMS Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left p-2 text-editorial-red hover:underline cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-ink-950 text-white hover:bg-editorial-red font-mono text-xs uppercase tracking-wider font-bold transition-colors w-full justify-center"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Staff Sign In</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="pt-6 border-t border-rule text-xs font-mono text-ink-500 flex items-center justify-between">
              <span>{settings.brandName}</span>
              <Link to="/about" className="hover:text-editorial-red underline">
                About Newsroom
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
            className="w-full max-w-xl bg-paper-100 border-2 border-ink-950 shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search dispatches"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rule mb-4">
              <span className="font-serif text-lg font-bold text-ink-950 flex items-center gap-2">
                <Search className="w-4 h-4 text-editorial-red" />
                Search The Dispatch
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-ink-600 hover:text-ink-950 p-1 cursor-pointer"
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
                  Search across all published investigations, photo features, and dispatches
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Search Dispatches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
