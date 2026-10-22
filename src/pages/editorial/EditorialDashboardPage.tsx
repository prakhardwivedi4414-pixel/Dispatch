import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentRepository } from '../../services/contentRepository';
import { Story, StoryStatus } from '../../types';
import {
  Plus, Edit, Eye, Trash2, ShieldAlert,
  Download, Upload, Users, Award, Star, LogOut, FileText
} from 'lucide-react';

export const EditorialDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StoryStatus | 'all'>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isEditorOrAdmin = user?.role === 'editor' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const loadStories = React.useCallback(async () => {
    setLoading(true);
    try {
      const all = await contentRepository.list('all', user);
      setStories(all);
    } catch (e: any) {
      setNotification({ message: e.message || 'Failed to load stories', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    document.title = 'Editorial Dashboard — The Dispatch';
    loadStories();
  }, [loadStories]);

  const handlePublishToggle = async (story: Story) => {
    if (!user || !isEditorOrAdmin) return;
    try {
      if (story.status === 'published') {
        await contentRepository.unpublish(story.id, user);
        setNotification({ message: `"${story.headline}" moved to review.`, type: 'success' });
      } else {
        await contentRepository.publish(story.id, user);
        setNotification({ message: `"${story.headline}" published to front page!`, type: 'success' });
      }
      loadStories();
    } catch (e: any) {
      setNotification({ message: e.message || 'Action failed', type: 'error' });
    }
  };

  const handleSetLead = async (storyId: string) => {
    if (!user || !isEditorOrAdmin) return;
    try {
      await contentRepository.setLead(storyId, user);
      setNotification({ message: 'Homepage lead story updated.', type: 'success' });
      loadStories();
    } catch (e: any) {
      setNotification({ message: e.message || 'Action failed', type: 'error' });
    }
  };

  const handleDelete = async (storyId: string, headline: string) => {
    if (!user || !isEditorOrAdmin) return;
    if (!window.confirm(`Are you sure you want to delete "${headline}"?`)) return;
    try {
      await contentRepository.delete(storyId, user);
      setNotification({ message: 'Story deleted.', type: 'success' });
      loadStories();
    } catch (e: any) {
      setNotification({ message: e.message || 'Action failed', type: 'error' });
    }
  };

  const handleExport = () => {
    try {
      const dataStr = contentRepository.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `the-dispatch-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setNotification({ message: 'Editorial archive exported successfully.', type: 'success' });
    } catch (e: any) {
      setNotification({ message: 'Export failed: ' + e.message, type: 'error' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const res = contentRepository.importData(text);
        if (res.success) {
          setNotification({ message: 'Data imported successfully.', type: 'success' });
          loadStories();
        } else {
          setNotification({ message: res.error || 'Import failed.', type: 'error' });
        }
      } catch (err: any) {
        setNotification({ message: 'Invalid JSON file: ' + err.message, type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredStories = stories.filter(s => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 min-h-screen">
      {/* Top Banner: Demo Mode Warning */}
      <div className="mb-6 p-3.5 bg-paper-200 border-l-4 border-editorial-red flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-editorial-red flex-shrink-0" />
          <span>
            <strong>Demo mode:</strong> Data is saved only in this browser (<code className="bg-paper-100 px-1 border border-rule">localStorage</code>) and is not secure. A production backend is required for real multi-user permissions.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-ink-950 text-paper-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
            Role: {user?.role}
          </span>
          <span className="text-ink-600">({user?.name})</span>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className={`mb-6 p-4 border flex items-center justify-between text-xs font-mono ${
          notification.type === 'success'
            ? 'bg-green-50 border-green-700 text-green-950'
            : 'bg-red-50 border-red-700 text-red-950'
        }`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-ink-500 hover:text-ink-950 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 mb-8 border-b-2 border-ink-950">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
              Newsroom Operations
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-ink-950">
            Editorial Workspace
          </h1>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <Link
            to="/editorial/new"
            className="px-4 py-2 bg-editorial-red text-white font-bold uppercase tracking-wider hover:bg-ink-950 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </Link>

          {isEditorOrAdmin && (
            <Link
              to="/editorial/contributors"
              className="px-3 py-2 bg-paper-100 border border-ink-950 text-ink-900 font-bold hover:bg-paper-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-editorial-red" />
              <span>Contributors</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/editorial/internal"
              className="px-3 py-2 bg-ink-950 text-paper-100 font-bold hover:bg-editorial-red transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Admin assessment & syllabus audit"
            >
              <Award className="w-4 h-4 text-editorial-red" />
              <span>Internal Assessment</span>
            </Link>
          )}

          <button
            onClick={handleExport}
            className="px-3 py-2 bg-paper-100 border border-rule text-ink-700 hover:border-ink-950 transition-colors flex items-center gap-1 cursor-pointer"
            title="Export all stories as JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <label className="px-3 py-2 bg-paper-100 border border-rule text-ink-700 hover:border-ink-950 transition-colors flex items-center gap-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              logout();
              navigate('/editorial/login');
            }}
            className="px-3 py-2 bg-paper-200 border border-rule text-ink-600 hover:text-editorial-red transition-colors flex items-center gap-1 cursor-pointer"
            title="Sign out of editorial session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-rule pb-2 font-mono text-xs">
        <span className="text-ink-500 mr-2">Filter:</span>
        {[
          { id: 'all', label: 'All Dispatches', count: stories.length },
          { id: 'published', label: 'Published', count: stories.filter(s => s.status === 'published').length },
          { id: 'review', label: 'Review', count: stories.filter(s => s.status === 'review').length },
          { id: 'draft', label: 'Drafts', count: stories.filter(s => s.status === 'draft').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-ink-950 text-paper-100 border-ink-950 font-bold'
                : 'bg-paper-50 text-ink-700 border-rule hover:border-ink-600'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Stories Table / List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-ink-500">
          Loading dispatches...
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-paper-100 border-2 border-dashed border-rule p-12 text-center max-w-lg mx-auto my-12">
          <FileText className="w-10 h-10 text-ink-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-ink-950 mb-2">No Stories in this View</h3>
          <p className="text-xs text-ink-600 font-sans mb-4">
            No stories match the selected status filter.
          </p>
          <Link
            to="/editorial/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-ink-950 text-paper-100 text-xs font-mono uppercase font-bold hover:bg-editorial-red transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Story</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map(story => {
            const authorsStr = story.authors?.map(a => a.name).join(', ') || 'Unassigned';

            return (
              <div
                key={story.id}
                className="bg-paper-50 border border-ink-950 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-shadow"
              >
                {/* Story Info */}
                <div className="flex items-start gap-4 min-w-0 flex-grow">
                  <div className="w-20 h-20 bg-ink-950 border border-rule flex-shrink-0 overflow-hidden">
                    <img
                      src={story.cover.src}
                      alt={story.headline}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono mb-1">
                      <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
                      <span className="font-bold uppercase text-editorial-red">{story.category}</span>
                      <span className="text-ink-400">•</span>
                      <span className="text-ink-600 font-semibold uppercase">{story.format}</span>
                      <span className="text-ink-400">•</span>
                      <span className="text-ink-500">{story.readingTime} min</span>
                      {story.isLead && (
                        <span className="ml-2 bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-amber-600" />
                          Lead Story
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl font-bold text-ink-950 truncate mb-1">
                      {story.headline}
                    </h2>

                    <div className="text-xs text-ink-600 font-sans flex items-center gap-3">
                      <span>Byline: <strong className="text-ink-900 font-medium">{authorsStr}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">Published: {story.publishedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono flex-shrink-0 self-end md:self-center">
                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${
                    story.status === 'published'
                      ? 'bg-green-100 text-green-950 border-green-600'
                      : story.status === 'review'
                      ? 'bg-amber-100 text-amber-950 border-amber-600'
                      : 'bg-paper-200 text-ink-800 border-rule'
                  }`}>
                    {story.status}
                  </span>

                  {/* Edit Button */}
                  <Link
                    to={`/editorial/edit/${story.id}`}
                    className="p-2 bg-paper-100 border border-rule hover:border-ink-950 text-ink-900 transition-colors cursor-pointer"
                    title="Edit Story"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  {/* Public View link */}
                  {story.status === 'published' && (
                    <Link
                      to={`/story/${story.slug}`}
                      target="_blank"
                      className="p-2 bg-paper-100 border border-rule hover:border-ink-950 text-ink-900 transition-colors cursor-pointer"
                      title="View Published Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}

                  {/* Lead Story Toggle (Editor/Admin) */}
                  {isEditorOrAdmin && !story.isLead && story.status === 'published' && (
                    <button
                      type="button"
                      onClick={() => handleSetLead(story.id)}
                      className="px-2 py-1 bg-paper-100 border border-rule hover:border-amber-600 text-ink-800 text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Set as front-page lead story"
                    >
                      <Star className="w-3 h-3 text-amber-600" />
                      <span>Set Lead</span>
                    </button>
                  )}

                  {/* Publish / Unpublish Toggle (Editor/Admin) */}
                  {isEditorOrAdmin && (
                    <button
                      type="button"
                      onClick={() => handlePublishToggle(story)}
                      className={`px-3 py-1 font-bold uppercase text-[11px] transition-colors cursor-pointer ${
                        story.status === 'published'
                          ? 'bg-paper-200 text-ink-800 border border-rule hover:bg-paper-300'
                          : 'bg-green-800 text-white hover:bg-green-900 shadow-2xs'
                      }`}
                    >
                      {story.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  )}

                  {/* Delete Button (Editor/Admin) */}
                  {isEditorOrAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(story.id, story.headline)}
                      className="p-2 text-ink-500 hover:text-editorial-red hover:bg-red-50 border border-transparent hover:border-red-300 transition-colors cursor-pointer"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
