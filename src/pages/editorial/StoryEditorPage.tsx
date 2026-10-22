import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentRepository } from '../../services/contentRepository';
import { Story, StoryCategory, StoryFormat, StoryStatus, Contributor } from '../../types';
import { countWords, computeReadingTime, validateStory } from '../../utils/validation';
import {
  Save, Eye, ArrowLeft, CheckCircle2, Award, Star, AlertTriangle
} from 'lucide-react';

export const StoryEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/editorial';

  const isNew = !id || id === 'new';
  const isEditorOrAdmin = user?.role === 'editor' || user?.role === 'admin';

  // Form State
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<StoryCategory>('Campus');
  const [format, setFormat] = useState<StoryFormat>('long-read');
  const [status, setStatus] = useState<StoryStatus>('draft');
  const [publishedAt, setPublishedAt] = useState(() =>
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [isLead, setIsLead] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  // Cover Image
  const [coverSrc, setCoverSrc] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [coverCredit, setCoverCredit] = useState('');
  const [coverCaption, setCoverCaption] = useState('');
  const [coverSource, setCoverSource] = useState('Pinterest (Provisional reference)');
  const [isVerifiedSource, setIsVerifiedSource] = useState(false);

  // Media
  const [mediaType, setMediaType] = useState<'audio' | 'video' | 'gallery' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDuration, setMediaDuration] = useState('');
  const [transcript, setTranscript] = useState('');

  // Source PDF Document & Facsimile Pages
  const [sourcePdfFilename, setSourcePdfFilename] = useState('');
  const [sourcePdfUrl, setSourcePdfUrl] = useState('');
  const [sourcePdfSize, setSourcePdfSize] = useState<number>(0);
  const [sourcePdfPages, setSourcePdfPages] = useState<number>(0);
  const [pdfPagesList, setPdfPagesList] = useState<string[]>([]);

  // Authors & Attribution Roles
  const [allContributors, setAllContributors] = useState<Contributor[]>([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(['samridhi']);
  const [authorRoles, setAuthorRoles] = useState<Record<string, string>>({});
  const [primaryAuthorId, setPrimaryAuthorId] = useState<string>('samridhi');

  // Editor UI State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Word count and reading time
  const currentWords = countWords(body);
  const currentReadingTime = computeReadingTime(body);

  useEffect(() => {
    document.title = isNew ? 'New Dispatch — The Dispatch CMS' : `Edit Story — The Dispatch CMS`;
    
    // Load contributors
    contentRepository.listContributors().then(contribs => {
      setAllContributors(contribs);
    });

    if (!isNew && id) {
      contentRepository.get(id, user).then(story => {
        if (!story) {
          navigate('/editorial');
          return;
        }
        setHeadline(story.headline);
        setSubheading(story.subheading || '');
        setSummary(story.summary);
        setBody(story.body);
        setCategory(story.category);
        setFormat(story.format);
        setStatus(story.status);
        setPublishedAt(story.publishedAt);
        setIsLead(story.isLead);
        setIsDemo(story.isDemo);

        setCoverSrc(story.cover.src);
        setCoverAlt(story.cover.alt);
        setCoverCredit(story.cover.credit);
        setCoverCaption(story.cover.caption);
        setCoverSource(story.cover.source || (story.cover.credit?.toLowerCase().includes('pinterest') ? 'Pinterest (Provisional reference)' : 'Original Fieldwork'));
        setIsVerifiedSource(story.cover.isVerifiedSource ?? false);

        if (story.sourcePdf) {
          setSourcePdfFilename(story.sourcePdf.filename);
          setSourcePdfUrl(story.sourcePdf.url);
          setSourcePdfSize(story.sourcePdf.sizeBytes);
          setSourcePdfPages(story.sourcePdf.pageCount);
        }
        if (story.pdfPages) {
          setPdfPagesList(story.pdfPages);
        }


        if (story.media) {
          setMediaType(story.media.type);
          setMediaUrl(story.media.url || '');
          setMediaDuration(story.media.duration || '');
          setTranscript(story.media.transcript || '');
        }

        setSelectedAuthorIds(story.authors.map(a => a.id));
        const roles: Record<string, string> = {};
        let primary = '';
        story.authors.forEach(a => {
          roles[a.id] = a.contributionRole || a.role || 'Reporter / Writer';
          if (a.isPrimary) primary = a.id;
        });
        setAuthorRoles(roles);
        setPrimaryAuthorId(primary || (story.authors[0] ? story.authors[0].id : 'samridhi'));
      });
    }
  }, [id, isNew, navigate, user, basePath]);

  const handleFieldChange = () => {
    if (saveStatus !== 'unsaved') {
      setSaveStatus('unsaved');
    }
  };

  // Client-side image downscaling for local storage safety
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new window.Image();
      img.onload = () => {
        // Downscale to max 1280px width for storage conservation
        const canvas = document.createElement('canvas');
        const maxW = 1280;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setCoverSrc(dataUrl);
          handleFieldChange();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (explicitStatus?: StoryStatus) => {
    if (!user) return;
    setSaveStatus('saving');
    setErrorMessage('');

    const targetStatus = explicitStatus || status;

    // Build author objects with explicit roles and primary byline
    const assignedAuthors = allContributors
      .filter(c => selectedAuthorIds.includes(c.id))
      .map(c => ({
        ...c,
        isPrimary: c.id === primaryAuthorId || (selectedAuthorIds[0] === c.id && !primaryAuthorId),
        contributionRole: authorRoles[c.id] || c.role || 'Reporter / Writer',
      }));

    if (assignedAuthors.length === 0) {
      const defaultAuthor = allContributors[0] || { id: 'samridhi', name: 'Samridhi', role: 'Editor', isPrimary: true };
      assignedAuthors.push({
        ...defaultAuthor,
        isPrimary: true,
        contributionRole: defaultAuthor.role || 'Senior Editor',
      });
    }

    const storySlug = headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `story-${Date.now()}`;

    const storyData: Story = {
      id: isNew ? `dispatch-${Date.now()}` : id!,
      slug: storySlug,
      headline: headline || 'Untitled Dispatch',
      subheading: subheading || undefined,
      summary: summary || '',
      body: body || '',
      category,
      format,
      authors: assignedAuthors,
      publishedAt,
      status: targetStatus,
      readingTime: currentReadingTime,
      cover: {
        src: coverSrc || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80',
        alt: coverAlt || headline,
        credit: coverCredit || 'Reference photograph (Pinterest / Archival)',
        caption: coverCaption || '',
        source: coverSource,
        isVerifiedSource,
      },
      media: mediaType !== 'none' ? {
        type: mediaType,
        url: mediaUrl,
        duration: mediaDuration,
        transcript: transcript,
      } : undefined,
      sourcePdf: sourcePdfFilename ? {
        filename: sourcePdfFilename,
        url: sourcePdfUrl,
        sizeBytes: sourcePdfSize,
        pageCount: sourcePdfPages,
      } : undefined,
      pdfPages: pdfPagesList.length > 0 ? pdfPagesList : undefined,
      isLead,
      isDemo,
    };


    try {
      await contentRepository.save(storyData, user);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (isNew) {
        navigate(`${basePath}/edit/${storyData.id}`, { replace: true });
      }
    } catch (err: unknown) {
      setSaveStatus('error');
      const msg = err instanceof Error ? err.message : 'Save failed';
      setErrorMessage(msg);
    }
  };

  const validation = validateStory({
    headline,
    summary,
    body,
    category,
    format,
    cover: { src: coverSrc, alt: coverAlt, credit: coverCredit, caption: coverCaption },
    authors: allContributors.filter(c => selectedAuthorIds.includes(c.id)),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 min-h-screen">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-ink-950">
        <div className="flex items-center gap-3">
          <Link
            to={basePath}
            className="p-2 bg-paper-100 border border-rule hover:border-ink-950 text-ink-700 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">
              {isNew ? 'Create New Story' : 'Story Editor'}
            </span>
            <h1 className="font-serif text-2xl font-bold text-ink-950">
              {headline.trim() || 'Untitled Dispatch'}
            </h1>
          </div>
        </div>

        {/* Save Bar & Mode Switches */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Save Status Badge */}
          <span className="text-ink-500">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'unsaved' && <span className="text-amber-800 font-bold">● Unsaved changes</span>}
            {saveStatus === 'saved' && (
              <span className="text-green-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved {lastSavedTime}
              </span>
            )}
            {saveStatus === 'error' && <span className="text-editorial-red font-bold">✕ Save failed</span>}
          </span>

          {/* Tab Selector: Edit vs Live Preview */}
          <div className="flex border border-rule bg-paper-100 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'edit' ? 'bg-ink-950 text-paper-100 font-bold' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              Edit Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-ink-950 text-paper-100 font-bold' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Save Draft Action */}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3 py-2 bg-paper-100 border border-ink-950 text-ink-900 font-bold hover:bg-paper-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish Action (Editor/Admin) */}
          {isEditorOrAdmin && (
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-4 py-2 bg-editorial-red text-white font-bold uppercase tracking-wider hover:bg-ink-950 transition-colors cursor-pointer shadow-xs"
            >
              Publish Now
            </button>
          )}
        </div>
      </div>

      {/* Error alert if quota exceeded */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-editorial-red text-red-950 text-xs font-mono">
          <strong>Storage Alert:</strong> {errorMessage}
        </div>
      )}

      {/* TAB 1: EDIT FORM */}
      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Headline */}
            <div>
              <label htmlFor="headline" className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-1">
                Headline <span className="text-editorial-red">*</span>
              </label>
              <input
                id="headline"
                type="text"
                value={headline}
                onChange={e => {
                  setHeadline(e.target.value);
                  handleFieldChange();
                }}
                placeholder="Clear, authoritative investigative headline..."
                className="w-full p-3 bg-paper-50 border border-ink-950 font-serif text-xl sm:text-2xl font-bold text-ink-950 focus:outline-hidden focus:border-editorial-red"
              />
            </div>

            {/* Subheading / Deck */}
            <div>
              <label htmlFor="subheading" className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-1">
                Subheading / Deck (Optional)
              </label>
              <input
                id="subheading"
                type="text"
                value={subheading}
                onChange={e => {
                  setSubheading(e.target.value);
                  handleFieldChange();
                }}
                placeholder="Secondary contextual deck..."
                className="w-full p-2.5 bg-paper-50 border border-rule font-serif text-base text-ink-800 focus:outline-hidden focus:border-ink-950"
              />
            </div>

            {/* Standfirst / Summary */}
            <div>
              <label htmlFor="summary" className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-1">
                Editorial Standfirst / Summary <span className="text-editorial-red">*</span>
              </label>
              <textarea
                id="summary"
                rows={2}
                value={summary}
                onChange={e => {
                  setSummary(e.target.value);
                  handleFieldChange();
                }}
                placeholder="Two-to-three sentence synopsis for article decks, search snippets, and rail previews..."
                className="w-full p-3 bg-paper-50 border border-rule font-serif text-sm text-ink-800 focus:outline-hidden focus:border-ink-950 leading-relaxed"
              />
            </div>

            {/* Body Markdown Content */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="body" className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold">
                  Story Body (Markdown Supported)
                </label>
                <div className="text-xs font-mono text-ink-600 flex items-center gap-3">
                  <span>Words: <strong className="text-ink-950 font-bold">{currentWords}</strong></span>
                  <span>•</span>
                  <span>Reading: <strong className="text-ink-950 font-bold">{currentReadingTime} min</strong></span>
                </div>
              </div>
              <textarea
                id="body"
                rows={16}
                value={body}
                onChange={e => {
                  setBody(e.target.value);
                  handleFieldChange();
                }}
                placeholder="Author reporting narrative here. Supports ## Headings, ### Subheadings, > Pull quotes, and [Reporter's Note: ...] blocks..."
                className="w-full p-4 bg-paper-50 border border-ink-950 font-serif text-base text-ink-950 leading-relaxed focus:outline-hidden focus:border-editorial-red"
              />
            </div>

            {/* Optional Media Embed Section */}
            <div className="p-5 bg-paper-100 border border-rule space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-900 font-bold block">
                Multimedia Player / Script Configuration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="mediaType" className="block text-[11px] font-mono text-ink-600 mb-1">Media Module:</label>
                  <select
                    id="mediaType"
                    value={mediaType}
                    onChange={e => {
                      setMediaType(e.target.value as any);
                      handleFieldChange();
                    }}
                    className="w-full p-2 bg-paper-50 border border-rule text-xs font-mono"
                  >
                    <option value="none">None (Text Only)</option>
                    <option value="audio">Audio Podcast</option>
                    <option value="video">Video Report</option>
                    <option value="gallery">Photo Gallery</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mediaDuration" className="block text-[11px] font-mono text-ink-600 mb-1">Duration (e.g. 07:42):</label>
                  <input
                    id="mediaDuration"
                    type="text"
                    value={mediaDuration}
                    onChange={e => {
                      setMediaDuration(e.target.value);
                      handleFieldChange();
                    }}
                    placeholder="07:42"
                    className="w-full p-2 bg-paper-50 border border-rule text-xs font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="mediaUrl" className="block text-[11px] font-mono text-ink-600 mb-1">Media Stream URL:</label>
                  <input
                    id="mediaUrl"
                    type="text"
                    value={mediaUrl}
                    onChange={e => {
                      setMediaUrl(e.target.value);
                      handleFieldChange();
                    }}
                    placeholder="https://..."
                    className="w-full p-2 bg-paper-50 border border-rule text-xs font-mono"
                  />
                </div>
              </div>

              {(mediaType === 'audio' || mediaType === 'video') && (
                <div>
                  <label htmlFor="transcript" className="block text-[11px] font-mono text-ink-600 mb-1">
                    Verbatim Transcript / Production Script:
                  </label>
                  <textarea
                    id="transcript"
                    rows={4}
                    value={transcript}
                    onChange={e => {
                      setTranscript(e.target.value);
                      handleFieldChange();
                    }}
                    placeholder="Full audio script or broadcast package transcript for accessibility..."
                    className="w-full p-2.5 bg-paper-50 border border-rule font-mono text-xs text-ink-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Metadata Fields (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Editorial Desks & Formats */}
            <div className="p-5 bg-paper-50 border border-rule space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-950 font-bold block border-b border-rule pb-2">
                Editorial Classification
              </span>

              <div>
                <label htmlFor="category" className="block text-xs font-mono text-ink-700 font-bold mb-1">Desk / Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value as StoryCategory);
                    handleFieldChange();
                  }}
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                >
                  <option value="Campus">Campus</option>
                  <option value="Society">Society</option>
                  <option value="Culture">Culture</option>
                  <option value="Investigations">Investigations</option>
                </select>
              </div>

              <div>
                <label htmlFor="format" className="block text-xs font-mono text-ink-700 font-bold mb-1">Story Format:</label>
                <select
                  id="format"
                  value={format}
                  onChange={e => {
                    setFormat(e.target.value as StoryFormat);
                    handleFieldChange();
                  }}
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                >
                  <option value="long-read">Long Read (1,000+ words)</option>
                  <option value="short">Short Story (350–500 words)</option>
                  <option value="audio">Audio Podcast</option>
                  <option value="video">Video Report</option>
                  <option value="photo">Photo Feature</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-xs font-mono text-ink-700 font-bold mb-1">Status:</label>
                <select
                  id="status"
                  value={status}
                  onChange={e => {
                    setStatus(e.target.value as StoryStatus);
                    handleFieldChange();
                  }}
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono font-bold"
                >
                  <option value="draft">Draft (Work in progress)</option>
                  <option value="review">Review (Editorial check)</option>
                  <option value="published">Published (Public site)</option>
                </select>
              </div>

              <div>
                <label htmlFor="publishedAt" className="block text-xs font-mono text-ink-700 font-bold mb-1">Publication Dateline:</label>
                <input
                  id="publishedAt"
                  type="text"
                  value={publishedAt}
                  onChange={e => {
                    setPublishedAt(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              {isEditorOrAdmin && (
                <div className="pt-2 border-t border-rule">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-ink-900">
                    <input
                      type="checkbox"
                      checked={isLead}
                      onChange={e => {
                        setIsLead(e.target.checked);
                        handleFieldChange();
                      }}
                      className="w-4 h-4 text-editorial-red focus:ring-editorial-red"
                    />
                    <span className="font-bold">Set as Homepage Lead Story</span>
                  </label>
                </div>
              )}
            </div>

            {/* Byline / Authors Selection */}
            <div className="p-5 bg-paper-50 border border-rule space-y-4">
              <div className="flex items-center justify-between border-b border-rule pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-ink-950 font-bold">
                  Reporting Byline & Production Attribution
                </span>
                <Link
                  to={`${basePath}/contributors`}
                  className="text-[11px] font-mono text-editorial-red hover:underline"
                >
                  Manage Roster →
                </Link>
              </div>

              <p className="text-[11px] text-ink-600 font-sans">
                Assign contributors from the newsroom roster and specify their specific reporting or production role:
              </p>

              <div className="space-y-3">
                {allContributors.map(contrib => {
                  const isChecked = selectedAuthorIds.includes(contrib.id);
                  const isPrimary = primaryAuthorId === contrib.id;
                  const currentRole = authorRoles[contrib.id] || contrib.role || 'Reporter / Writer';

                  return (
                    <div
                      key={contrib.id}
                      className={`p-3 border transition-colors ${
                        isChecked ? 'bg-paper-100 border-ink-950' : 'bg-paper-50 border-rule'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <label className="flex items-start gap-2.5 text-xs font-mono cursor-pointer flex-grow">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedAuthorIds([...selectedAuthorIds, contrib.id]);
                                if (!primaryAuthorId) setPrimaryAuthorId(contrib.id);
                              } else {
                                const next = selectedAuthorIds.filter(id => id !== contrib.id);
                                setSelectedAuthorIds(next);
                                if (primaryAuthorId === contrib.id) {
                                  setPrimaryAuthorId(next[0] || '');
                                }
                              }
                              handleFieldChange();
                            }}
                            className="mt-0.5 text-editorial-red focus:ring-editorial-red"
                          />
                          <div>
                            <span className="font-serif font-bold text-ink-950 text-sm block">
                              {contrib.name}
                            </span>
                            <span className="text-ink-500 text-[10px] block">
                              Roster Title: {contrib.role}
                            </span>
                          </div>
                        </label>

                        {isChecked && (
                          <button
                            type="button"
                            onClick={() => {
                              setPrimaryAuthorId(contrib.id);
                              handleFieldChange();
                            }}
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                              isPrimary
                                ? 'bg-editorial-red text-white border-editorial-red'
                                : 'bg-paper-200 text-ink-700 border-rule hover:border-ink-950'
                            }`}
                          >
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{isPrimary ? 'Primary Byline' : 'Set as Primary'}</span>
                          </button>
                        )}
                      </div>

                      {/* Specific contribution role selector */}
                      {isChecked && (
                        <div className="mt-2.5 pt-2 border-t border-rule flex items-center gap-2">
                          <span className="text-[11px] font-mono text-ink-600 flex items-center gap-1">
                            <Award className="w-3 h-3 text-editorial-red" />
                            Role on this Story:
                          </span>
                          <select
                            value={currentRole}
                            onChange={e => {
                              setAuthorRoles(prev => ({
                                ...prev,
                                [contrib.id]: e.target.value,
                              }));
                              handleFieldChange();
                            }}
                            className="bg-paper-50 border border-rule px-2 py-1 text-xs font-mono text-ink-950 focus:outline-hidden"
                          >
                            <option value="Reporter / Writer">Reporter / Writer</option>
                            <option value="Photographer">Photographer</option>
                            <option value="Videographer">Videographer</option>
                            <option value="Audio Producer">Audio Producer</option>
                            <option value="Editor">Editor</option>
                            <option value="Researcher">Researcher</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Documentary Cover Image */}
            <div className="p-5 bg-paper-50 border border-rule space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-950 font-bold block border-b border-rule pb-2">
                Cover Photograph & Credit
              </span>

              {coverSrc && (
                <div className="aspect-[16/10] bg-ink-950 overflow-hidden border border-rule mb-2">
                  <img src={coverSrc} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label htmlFor="coverSrc" className="block text-[11px] font-mono text-ink-600 mb-1">Image URL:</label>
                <input
                  id="coverSrc"
                  type="text"
                  value={coverSrc}
                  onChange={e => {
                    setCoverSrc(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="https://..."
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-ink-600 mb-1">Or Upload Local Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs font-mono text-ink-700 w-full"
                />
              </div>

              <div>
                <label htmlFor="coverCredit" className="block text-[11px] font-mono text-ink-600 mb-1">Photo Credit / Attribution:</label>
                <input
                  id="coverCredit"
                  type="text"
                  value={coverCredit}
                  onChange={e => {
                    setCoverCredit(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="e.g. Reference photograph (Pinterest) or verified photographer"
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              <div>
                <label htmlFor="coverSource" className="block text-[11px] font-mono text-ink-600 mb-1">Image Source / Provenance:</label>
                <input
                  id="coverSource"
                  type="text"
                  value={coverSource}
                  onChange={e => {
                    setCoverSource(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="e.g. Pinterest (Provisional reference) or Fieldwork"
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="isVerifiedSource"
                  type="checkbox"
                  checked={isVerifiedSource}
                  onChange={e => {
                    setIsVerifiedSource(e.target.checked);
                    handleFieldChange();
                  }}
                  className="text-editorial-red focus:ring-editorial-red cursor-pointer"
                />
                <label htmlFor="isVerifiedSource" className="text-xs font-mono text-ink-800 cursor-pointer">
                  Verified Original Newsroom Photography
                </label>
              </div>

              {(!isVerifiedSource || coverSource.toLowerCase().includes('pinterest')) && (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-600 text-xs font-mono text-amber-900 leading-relaxed">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unverified Image Advisory</span>
                  </div>
                  <span>This photograph is flagged as sourced from Pinterest or external reference. Retained temporarily for prototype; do not attribute to named contributors without verification.</span>
                </div>
              )}

              <div>
                <label htmlFor="coverCaption" className="block text-[11px] font-mono text-ink-600 mb-1">Caption:</label>
                <textarea
                  id="coverCaption"
                  rows={2}
                  value={coverCaption}
                  onChange={e => {
                    setCoverCaption(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="Documentary context..."
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-serif"
                />
              </div>
            </div>

            {/* Original Source PDF Document Panel */}
            <div className="p-4 bg-paper-100 border border-rule space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-950 font-bold block border-b border-rule pb-2 flex items-center justify-between">
                <span>Original Source PDF</span>
                {sourcePdfFilename && <span className="text-editorial-red text-[10px]">Attached</span>}
              </span>

              <div>
                <label htmlFor="sourcePdfFilename" className="block text-[11px] font-mono text-ink-600 mb-1">PDF Filename:</label>
                <input
                  id="sourcePdfFilename"
                  type="text"
                  value={sourcePdfFilename}
                  onChange={e => {
                    setSourcePdfFilename(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="e.g. long story.pdf"
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              <div>
                <label htmlFor="sourcePdfUrl" className="block text-[11px] font-mono text-ink-600 mb-1">Document URL:</label>
                <input
                  id="sourcePdfUrl"
                  type="text"
                  value={sourcePdfUrl}
                  onChange={e => {
                    setSourcePdfUrl(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="/documents/long story.pdf"
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="sourcePdfSize" className="block text-[11px] font-mono text-ink-600 mb-1">File Size (bytes):</label>
                  <input
                    id="sourcePdfSize"
                    type="number"
                    value={sourcePdfSize || ''}
                    onChange={e => {
                      setSourcePdfSize(Number(e.target.value));
                      handleFieldChange();
                    }}
                    className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="sourcePdfPages" className="block text-[11px] font-mono text-ink-600 mb-1">Page Count:</label>
                  <input
                    id="sourcePdfPages"
                    type="number"
                    value={sourcePdfPages || ''}
                    onChange={e => {
                      setSourcePdfPages(Number(e.target.value));
                      handleFieldChange();
                    }}
                    className="w-full p-2 bg-paper-100 border border-rule text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Validation Checklist Card */}
            <div className="p-4 bg-paper-100 border border-rule text-xs font-mono">
              <span className="font-bold text-ink-950 block mb-2 uppercase">Editorial Readiness:</span>

              <ul className="space-y-1">
                {validation.issues.map((iss, i) => (
                  <li key={i} className={`flex items-start gap-1.5 ${
                    iss.severity === 'error' ? 'text-editorial-red font-bold' : 'text-amber-800'
                  }`}>
                    <span>{iss.severity === 'error' ? '✕' : '▲'}</span>
                    <span>{iss.message}</span>
                  </li>
                ))}
                {validation.issues.length === 0 && (
                  <li className="text-green-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All editorial standards satisfied.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-paper-50 border-2 border-ink-950 p-6 sm:p-12 shadow-md">
          <div className="mb-6 pb-3 border-b border-rule flex items-center justify-between text-xs font-mono text-ink-500">
            <span>Live Article Template Preview</span>
            <span className="uppercase text-editorial-red font-bold">{category} • {format}</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink-950 mb-4 leading-tight">
              {headline || 'Headline Preview'}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-ink-700 leading-relaxed mb-6 border-l-2 border-editorial-red pl-4">
              {summary || 'Summary deck preview...'}
            </p>

            <div className="py-3 border-y border-rule flex items-center justify-between text-xs font-mono text-ink-600 mb-8">
              <span>Byline: {allContributors.filter(c => selectedAuthorIds.includes(c.id)).map(a => a.name).join(', ') || 'The Dispatch'}</span>
              <span>{publishedAt} • {currentReadingTime} min read</span>
            </div>

            {coverSrc && (
              <figure className="my-8">
                <div className="aspect-[16/10] bg-ink-950 overflow-hidden border border-ink-900">
                  <img src={coverSrc} alt={headline} className="w-full h-full object-cover" />
                </div>
                {coverCaption && (
                  <figcaption className="text-xs font-serif text-ink-700 mt-2">
                    {coverCaption} — <span className="font-mono text-ink-500">Photo: {coverCredit}</span>
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose-editorial font-serif text-base text-ink-850 leading-relaxed space-y-4">
              {body.split('\n\n').map((block, i) => (
                <p key={i}>{block}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
