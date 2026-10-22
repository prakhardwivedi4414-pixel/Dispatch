import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../services/contentRepository';
import { ShieldAlert, User, Lock, ArrowLeft, ArrowRight } from 'lucide-react';

export const EditorialLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('editor');
  const [displayName, setDisplayName] = useState('');
  const [validationError, setValidationError] = useState('');

  // Destination route after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/editorial';

  useEffect(() => {
    document.title = 'Editorial Login — The Dispatch';
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValidationError('');
    if (!displayName || displayName === 'Siya' || displayName === 'Editorial Desk' || displayName === 'Newsroom Director') {
      if (role === 'contributor') setDisplayName('Siya');
      else if (role === 'editor') setDisplayName('Editorial Desk');
      else if (role === 'admin') setDisplayName('Newsroom Director');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setValidationError('Please enter a display name (minimum 2 characters).');
      return;
    }

    login(selectedRole, trimmed);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-paper-100">
      <div className="max-w-md w-full bg-paper-50 border-2 border-ink-950 p-8 shadow-xl">
        
        {/* Masthead Header */}
        <div className="text-center pb-6 border-b border-rule mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">
            Editorial Access Gateway
          </span>
          <h1 className="font-serif text-3xl font-black text-ink-950 mt-1">
            The Dispatch
          </h1>
          <p className="text-xs font-mono text-ink-600 mt-1">
            Newsroom Content Management System
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 bg-paper-200 border-l-4 border-editorial-red text-xs font-sans text-ink-800" role="alert">
          <div className="flex items-center gap-2 font-bold text-editorial-red font-mono uppercase text-[11px] mb-1">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Browser Demo Environment</span>
          </div>
          <p className="leading-relaxed">
            Data is stored strictly in your local browser's <code className="bg-paper-100 px-1 py-0.5 border border-rule">localStorage</code>. No real passwords are required. Select a demonstration role below to access editorial tools.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-2">
              Select Editorial Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'contributor', title: 'Contributor', desc: 'Author drafts' },
                { id: 'editor', title: 'Editor', desc: 'Publish stories' },
                { id: 'admin', title: 'Admin', desc: 'Full control' },
              ].map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id as UserRole)}
                  className={`p-3 border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                    selectedRole === role.id
                      ? 'border-ink-950 bg-ink-950 text-paper-100 shadow-sm'
                      : 'border-rule bg-paper-100 text-ink-800 hover:border-ink-600'
                  }`}
                >
                  <span className="text-xs font-mono font-bold uppercase block">{role.title}</span>
                  <span className="text-[10px] opacity-80 mt-1">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-2">
              Reporter / Editor Name:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={e => {
                  setDisplayName(e.target.value);
                  setValidationError('');
                }}
                placeholder="e.g. Siya"
                className="w-full pl-9 pr-3 py-2.5 bg-paper-100 border border-rule text-sm font-serif text-ink-950 focus:outline-hidden focus:border-ink-950"
              />
            </div>
            {validationError && (
              <p className="text-xs text-editorial-red font-mono mt-1.5">{validationError}</p>
            )}
          </div>

          {/* Role permissions overview */}
          <div className="p-3 bg-paper-100 border border-rule text-[11px] font-mono text-ink-600">
            <span className="font-bold text-ink-900 block mb-1">Role Permissions:</span>
            {selectedRole === 'contributor' && '• Author and edit own stories; cannot publish or delete.'}
            {selectedRole === 'editor' && '• Edit all stories; publish/unpublish; toggle homepage lead story.'}
            {selectedRole === 'admin' && '• Full editorial control; manage contributors; access internal assessment dossier.'}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-editorial-red text-white text-xs font-mono uppercase tracking-widest font-bold hover:bg-ink-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Lock className="w-4 h-4" />
            <span>Enter Editorial Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-rule text-center">
          <Link
            to="/"
            className="text-xs font-mono text-ink-600 hover:text-editorial-red transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Newspaper</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
