import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, DEMO_STAFF_ACCOUNTS } from '../../context/AuthContext';
import { UserRole } from '../../services/contentRepository';
import { Lock, ArrowLeft, ArrowRight, Database, KeyRound, AlertCircle, Info } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export const EditorialLoginPage: React.FC = () => {
  const { loginAsStaff, loginWithCredentials, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMode, setAuthMode] = useState<'demo' | 'credentials'>(
    isSupabaseConfigured ? 'credentials' : 'demo'
  );

  // Selected Demo Account key ('samridhi' | 'arpita' | 'kirti')
  const [selectedAccountKey, setSelectedAccountKey] = useState<string>('samridhi');

  // Supabase credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getDestination = (role: UserRole, name: string) => {
    const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
    if (role === 'admin' && name === 'Samridhi') {
      return rawFrom && rawFrom !== '/login' && rawFrom !== '/admin/login' ? rawFrom : '/admin';
    }
    // Contributors are routed to their personal profile portfolio, never trapped in /admin
    if (!rawFrom || rawFrom === '/admin' || rawFrom === '/login' || rawFrom.startsWith('/admin')) {
      return '/profile';
    }
    return rawFrom;
  };

  useEffect(() => {
    document.title = 'Staff Sign-In — The Dispatch';
    if (isAuthenticated && user) {
      navigate(getDestination(user.role, user.name), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await loginAsStaff(selectedAccountKey);
      if (res.success) {
        const acc = DEMO_STAFF_ACCOUNTS[selectedAccountKey];
        navigate(getDestination(acc.role, acc.name), { replace: true });
      } else {
        setErrorMessage(res.error || 'Failed to initialize staff session.');
      }
    } catch {
      setErrorMessage('Failed to initialize staff session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithCredentials(email, password);
      if (res.success) {
        navigate('/profile', { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAccount = DEMO_STAFF_ACCOUNTS[selectedAccountKey] || DEMO_STAFF_ACCOUNTS.samridhi;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-paper-100">
      <div className="max-w-md w-full bg-paper-50 border-2 border-ink-950 p-6 sm:p-8 shadow-xl">
        
        {/* Masthead Header */}
        <div className="text-center pb-6 border-b border-rule mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">
            Staff & Editorial Gateway
          </span>
          <h1 className="font-serif text-3xl font-black text-ink-950 mt-1">
            The Dispatch
          </h1>
          <p className="text-xs font-mono text-ink-600 mt-1">
            Editorial CMS & Publications Management
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="mb-6 p-3 bg-paper-100 border border-rule flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-editorial-red" />
            <span className="text-ink-600">Backend Status:</span>
            <span className="font-bold text-ink-950">
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Demo Storage'}
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-600' : 'bg-amber-600'}`} />
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-700 text-xs font-mono text-red-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabs: Demo Role Access vs Credentials */}
        <div className="flex border-b border-rule mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('demo');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-center border-b-2 font-bold transition-colors cursor-pointer ${
              authMode === 'demo'
                ? 'border-editorial-red text-editorial-red'
                : 'border-transparent text-ink-500 hover:text-ink-950'
            }`}
          >
            Demo Staff Profiles
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('credentials');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-center border-b-2 font-bold transition-colors cursor-pointer ${
              authMode === 'credentials'
                ? 'border-editorial-red text-editorial-red'
                : 'border-transparent text-ink-500 hover:text-ink-950'
            }`}
          >
            Database Credentials
          </button>
        </div>

        {/* MODE 1: DEMO STAFF PROFILES */}
        {authMode === 'demo' ? (
          <form onSubmit={handleDemoSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-2">
                Select Newsroom Account:
              </label>
              <div className="space-y-2">
                {Object.entries(DEMO_STAFF_ACCOUNTS).map(([key, acc]) => {
                  const isSelected = selectedAccountKey === key;
                  const isAccountAdmin = acc.role === 'admin';
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedAccountKey(key);
                        setErrorMessage('');
                      }}
                      className={`w-full p-3 border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-ink-950 bg-ink-950 text-paper-100 shadow-xs'
                          : 'border-rule bg-paper-100 text-ink-800 hover:border-ink-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-serif text-base">{acc.name}</strong>
                          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-2xs font-bold ${
                            isAccountAdmin
                              ? isSelected ? 'bg-editorial-red text-white' : 'bg-red-100 text-editorial-red'
                              : isSelected ? 'bg-paper-800 text-paper-200' : 'bg-paper-200 text-ink-700'
                          }`}>
                            {isAccountAdmin ? 'Administrator' : 'Contributor'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans mt-0.5 line-clamp-1 ${isSelected ? 'text-paper-300' : 'text-ink-600'}`}>
                          {acc.desk}
                        </p>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-editorial-red bg-editorial-red' : 'border-ink-400'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Capabilities Summary */}
            <div className="p-3 bg-paper-100 border border-rule text-[11px] font-mono text-ink-700 space-y-1">
              <span className="font-bold text-ink-950 block">Session Permissions:</span>
              {selectedAccount.role === 'admin' ? (
                <p className="text-ink-800">
                  • <strong>Samridhi</strong> is the sole administrator. Logging in provides full access to the CMS Dashboard (`/admin`), article publishing, and newsroom contributor roster management.
                </p>
              ) : (
                <p className="text-ink-700">
                  • <strong>{selectedAccount.name}</strong> has reporting permissions. Logging in routes to your personal contributor profile (`/profile`) and byline portfolio. Administrative operations (`/admin`) are restricted to Samridhi.
                </p>
              )}
            </div>

            {/* Security Disclaimer Notice */}
            <div className="p-3 bg-paper-200 border border-rule text-[11px] font-mono text-ink-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-editorial-red flex-shrink-0 mt-0.5" />
              <span>
                <strong>Prototype Notice:</strong> Sessions are simulated in local browser storage for demonstration only. No passwords are stored. True security requires server-side token validation and database Row Level Security (RLS).
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-editorial-red text-white text-xs font-mono uppercase tracking-widest font-bold hover:bg-ink-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Entering...' : `Enter as ${selectedAccount.name}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* MODE 2: EMAIL & PASSWORD CREDENTIALS */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-1">
                Newsroom Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="samridhiaug@gmail.com"
                className="w-full px-3 py-2.5 bg-paper-100 border border-rule text-sm font-sans text-ink-950 focus:outline-hidden focus:border-ink-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-bold mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-paper-100 border border-rule text-sm font-sans text-ink-950 focus:outline-hidden focus:border-ink-950"
              />
            </div>

            {!isSupabaseConfigured ? (
              <div className="p-3 bg-amber-50 border border-amber-300 text-[11px] font-mono text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Supabase database credentials are not loaded in <code className="font-bold">.env</code>. To use live email/password authentication, copy <code className="font-bold">.env.example</code> to <code className="font-bold">.env</code> and provide your API keys.
                </span>
              </div>
            ) : (
              <p className="text-[11px] font-mono text-ink-500 bg-paper-100 p-2.5 border border-rule">
                Authenticating against configured Supabase project with Row Level Security.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !isSupabaseConfigured}
              className="w-full py-3 bg-ink-950 text-white text-xs font-mono uppercase tracking-widest font-bold hover:bg-editorial-red transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Sign In With Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-rule text-center">
          <Link
            to="/"
            className="text-xs font-mono text-ink-600 hover:text-editorial-red transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to The Dispatch Front Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
