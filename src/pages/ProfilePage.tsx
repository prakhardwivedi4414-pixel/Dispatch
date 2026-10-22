import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNewsroom } from '../context/NewsroomContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import {
  User, ShieldCheck, LogOut, ArrowRight,
  ExternalLink, Database, Layers, CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, isLiveDatabase } = useAuth();
  const { stories } = useNewsroom();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = user ? `${user.name} — Profile & Byline Portfolio — The Dispatch` : 'Staff Profile — The Dispatch';
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-paper-50 border-2 border-ink-950 text-center shadow-lg">
        <User className="w-10 h-10 text-editorial-red mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-ink-950 mb-2">No Active Newsroom Session</h2>
        <p className="text-sm text-ink-700 font-sans mb-6">
          Please sign in to access your contributor profile and editorial portfolio.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <span>Sign In to The Dispatch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' && user.name === 'Samridhi';

  // Filter stories where current user is credited as an author
  const myStories = stories.filter(story =>
    story.authors?.some(a => a.name.toLowerCase() === user.name.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 min-h-[80vh]">
      <Breadcrumbs items={[{ label: 'Staff Profile' }, { label: user.name }]} />

      {/* Profile Header Card */}
      <div className="bg-paper-50 border-2 border-ink-950 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-rule">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-ink-950 text-paper-100 flex items-center justify-center font-serif text-2xl font-bold border-2 border-editorial-red shadow-sm flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-3xl font-black text-ink-950">
                  {user.name}
                </h1>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold border ${
                  isAdmin
                    ? 'bg-editorial-red text-white border-editorial-red'
                    : 'bg-paper-200 text-ink-800 border-rule'
                }`}>
                  {isAdmin ? 'Sole Administrator' : 'Newsroom Contributor'}
                </span>
              </div>
              <p className="text-xs font-mono text-ink-600 mt-1 flex items-center gap-2">
                <span>The Dispatch Staff & Reporting Roster</span>
                {user.email && (
                  <>
                    <span>•</span>
                    <span>{user.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-rule hover:border-editorial-red text-ink-700 hover:text-editorial-red bg-paper-100 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Roles & Permissions Notice */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-paper-100 border border-rule">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink-900 mb-2">
              <ShieldCheck className="w-4 h-4 text-editorial-red" />
              <span>Permissions & Capabilities</span>
            </div>
            <ul className="text-xs font-sans text-ink-700 space-y-1.5 leading-relaxed">
              {isAdmin ? (
                <>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Full administrator control over all articles, drafts, and archives.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Manage the newsroom contributor roster and assigned reporting roles.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Publish, unpublish, and assign homepage lead stories.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Author and draft investigative dispatches and field reports.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>View verified bylines, photographer credits, and sources.</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-ink-500 font-mono text-[11px]">
                    <span>Note: Administrative dashboard (`/admin`) and roster controls are restricted solely to Samridhi.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="p-4 bg-paper-100 border border-rule flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink-900 mb-2">
                <Database className="w-4 h-4 text-editorial-red" />
                <span>Backend Connection</span>
              </div>
              <p className="text-xs font-sans text-ink-700 leading-relaxed">
                Connected Mode: <strong className="text-ink-950">{isLiveDatabase ? 'Supabase Managed Database' : 'Local Editorial Storage'}</strong>
              </p>
              <p className="text-[11px] font-mono text-ink-500 mt-1">
                {isLiveDatabase
                  ? 'Authenticated via Supabase Auth with Row Level Security enforcement.'
                  : 'Operating in local demo prototype mode (non-cryptographic browser storage).'}
              </p>
            </div>

            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-rule flex flex-wrap gap-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-950 hover:bg-editorial-red text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Open CMS Dashboard</span>
                </Link>
                <Link
                  to="/admin/contributors"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-900 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
                >
                  <span>Manage Roster</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contributed Articles Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink-950 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-red font-bold block mb-1">
              Verified Byline Portfolio
            </span>
            <h2 className="font-serif text-2xl font-black text-ink-950">
              Assigned Dispatches & Fieldwork ({myStories.length})
            </h2>
          </div>
          <Link
            to="/"
            className="text-xs font-mono uppercase tracking-wider text-editorial-red hover:underline inline-flex items-center gap-1 font-bold"
          >
            <span>Back to Front Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myStories.map(story => (
              <article
                key={story.id}
                className="bg-paper-50 border border-ink-950 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-ink-950 mb-3 border border-rule relative">
                    <img
                      src={story.cover.src}
                      alt={story.cover.alt}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-ink-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
                      {story.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-ink-950/80 text-paper-200 text-[10px] font-mono px-2 py-0.5">
                      {story.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink-950 mb-2 leading-snug">
                    <Link to={`/article/${story.slug}`} className="hover:text-editorial-red transition-colors">
                      {story.headline}
                    </Link>
                  </h3>
                  <p className="text-xs font-serif text-ink-700 line-clamp-2 leading-relaxed mb-4">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-rule flex items-center justify-between text-xs font-mono text-ink-600">
                  <span>{story.publishedAt}</span>
                  <Link
                    to={`/article/${story.slug}`}
                    className="font-bold text-editorial-red hover:text-ink-950 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-paper-100 border border-rule text-center text-ink-600 text-sm font-serif">
            <p>No stories currently assigned to this byline. Dispatches authored by this contributor will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
