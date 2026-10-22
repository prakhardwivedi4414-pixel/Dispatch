import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentRepository } from '../../services/contentRepository';
import { Contributor } from '../../types';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

export const ContributorsManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    document.title = 'Contributors Manager — The Dispatch CMS';
    contentRepository.listContributors().then(setContributors);
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
      role: 'Staff Writer',
      bio: 'Reporting and field research.',
    };
    setContributors([...contributors, newContrib]);
    setSaveStatus('Unsaved changes');
  };

  const handleDelete = (id: string) => {
    if (contributors.length <= 1) {
      alert('At least one newsroom contributor must remain.');
      return;
    }
    setContributors(contributors.filter(c => c.id !== id));
    setSaveStatus('Unsaved changes');
  };

  const handleSaveAll = async () => {
    if (!user) return;
    try {
      for (const contrib of contributors) {
        await contentRepository.saveContributor(contrib, user);
      }
      setSaveStatus('All contributors saved!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e: any) {
      setSaveStatus('Save failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b-2 border-ink-950">
        <div className="flex items-center gap-3">
          <Link
            to="/editorial"
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
              Contributors Manager
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {saveStatus && (
            <span className="text-editorial-red font-bold">{saveStatus}</span>
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
      <div className="mb-6 p-4 bg-paper-100 border border-rule text-xs font-sans text-ink-700">
        <p>
          Bylines and contributor profiles can be updated here. No unconfirmed surnames are added to the public record. Changes persist directly into local browser storage.
        </p>
      </div>

      {/* Contributors List */}
      <div className="space-y-4">
        {contributors.map((contrib, idx) => (
          <div
            key={contrib.id}
            className="bg-paper-50 border border-ink-950 p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-rule">
              <span className="font-mono text-xs text-editorial-red font-bold">
                Contributor #{idx + 1}
              </span>
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
                  Name:
                </label>
                <input
                  type="text"
                  value={contrib.name}
                  onChange={e => handleChange(contrib.id, 'name', e.target.value)}
                  className="w-full p-2 bg-paper-100 border border-rule font-serif text-sm text-ink-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-700 font-bold mb-1">
                  Editorial Role:
                </label>
                <input
                  type="text"
                  value={contrib.role}
                  onChange={e => handleChange(contrib.id, 'role', e.target.value)}
                  className="w-full p-2 bg-paper-100 border border-rule font-mono text-xs text-ink-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-700 font-bold mb-1">
                Bio / Contribution Note:
              </label>
              <textarea
                rows={2}
                value={contrib.bio || contrib.contribution || ''}
                onChange={e => handleChange(contrib.id, 'bio', e.target.value)}
                className="w-full p-2 bg-paper-100 border border-rule text-xs font-serif text-ink-800"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
