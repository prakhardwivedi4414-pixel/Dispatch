import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentRepository } from '../../services/contentRepository';
import { Contributor } from '../../types';
import { ArrowLeft, Plus, Save, Trash2, CheckCircle2, User, Globe, Image } from 'lucide-react';

export const ContributorsManagerPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/editorial';

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Contributors Roster & Attribution — The Dispatch CMS';
    contentRepository.listContributors().then(data => {
      setContributors(data);
      setIsLoading(false);
    });
  }, []);

  const handleChange = (id: string, field: keyof Contributor, value: string) => {
    setContributors(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
    setSaveStatus('Unsaved changes');
  };

  const handleAdd = () => {
    const newContrib: Contributor = {
      id: `contrib_${Date.now()}`,
      name: 'New Reporter',
      role: 'Staff Reporter',
      bio: 'Field reporting, documentary research, and newsroom verification.',
      profileImage: '',
      profileLink: '',
    };
    setContributors([...contributors, newContrib]);
    setSaveStatus('Unsaved changes');
  };

  const handleDelete = async (id: string) => {
    if (contributors.length <= 1) {
      alert('At least one newsroom contributor must remain.');
      return;
    }
    if (!window.confirm('Are you sure you want to remove this contributor from the newsroom roster?')) {
      return;
    }

    if (user) {
      try {
        await contentRepository.deleteContributor(id, user);
      } catch {
        // ignore
      }
    }

    setContributors(contributors.filter(c => c.id !== id));
    setSaveStatus('Contributor removed.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSaveAll = async () => {
    if (!user) return;
    try {
      setSaveStatus('Saving contributors...');
      for (const contrib of contributors) {
        await contentRepository.saveContributor(contrib, user);
      }
      setSaveStatus('All contributors saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Save error';
      setSaveStatus('Save failed: ' + err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b-2 border-ink-950">
        <div className="flex items-center gap-3">
          <Link
            to={basePath}
            className="p-2 bg-paper-100 border border-rule hover:border-ink-950 text-ink-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">
              Newsroom Roster
            </span>
            <h1 className="font-serif text-3xl font-black text-ink-950">
              Contributors & Byline Attribution
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {saveStatus && (
            <span className="text-editorial-red font-bold flex items-center gap-1">
              {saveStatus.includes('saved') && <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />}
              {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-2 bg-paper-100 border border-ink-950 text-ink-900 font-bold hover:bg-paper-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contributor</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-editorial-red text-white font-bold uppercase tracking-wider hover:bg-ink-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mb-6 p-4 bg-paper-100 border border-rule text-xs font-serif text-ink-800">
        <p className="leading-relaxed">
          Contributors in this roster are selectable across all article bylines and production credits. Confirmed newsroom contributors are Arpita Singh and Kirti, with Samridhi as the sole newsroom administrator. Only verified roles and work may be attributed.
        </p>
      </div>

      {/* Contributors List */}
      {isLoading ? (
        <div className="p-12 text-center font-mono text-xs text-ink-500">
          Loading roster...
        </div>
      ) : (
        <div className="space-y-6">
          {contributors.map((contrib, idx) => (
            <div
              key={contrib.id}
              className="bg-paper-50 border border-ink-950 p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-rule">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-editorial-red font-bold">
                    Contributor #{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-ink-500">• ID: {contrib.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(contrib.id)}
                  className="text-ink-400 hover:text-editorial-red transition-colors p-1 cursor-pointer"
                  title="Remove contributor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink-700 font-bold mb-1">
                    Display Name:
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-ink-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contrib.name}
                      onChange={e => handleChange(contrib.id, 'name', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-paper-100 border border-rule font-serif text-sm text-ink-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink-700 font-bold mb-1">
                    Default Editorial Title:
                  </label>
                  <input
                    type="text"
                    value={contrib.role}
                    onChange={e => handleChange(contrib.id, 'role', e.target.value)}
                    placeholder="e.g. Lead Investigative Reporter"
                    className="w-full p-2 bg-paper-100 border border-rule font-mono text-xs text-ink-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-700 font-bold mb-1">
                  Biography & Editorial Background:
                </label>
                <textarea
                  rows={2}
                  value={contrib.bio || contrib.contribution || ''}
                  onChange={e => handleChange(contrib.id, 'bio', e.target.value)}
                  className="w-full p-2 bg-paper-100 border border-rule text-xs font-serif text-ink-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-rule text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-ink-600 mb-1 flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    Optional Profile Image URL:
                  </label>
                  <input
                    type="text"
                    value={contrib.profileImage || ''}
                    onChange={e => handleChange(contrib.id, 'profileImage', e.target.value)}
                    placeholder="https://..."
                    className="w-full p-1.5 bg-paper-100 border border-rule font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ink-600 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Optional Portfolio / Profile Link:
                  </label>
                  <input
                    type="text"
                    value={contrib.profileLink || ''}
                    onChange={e => handleChange(contrib.id, 'profileLink', e.target.value)}
                    placeholder="https://..."
                    className="w-full p-1.5 bg-paper-100 border border-rule font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
