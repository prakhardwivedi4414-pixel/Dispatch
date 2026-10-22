import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_STAFF_ACCOUNTS } from '../../context/AuthContext';
import { UserRole } from '../../services/contentRepository';
import { ShieldAlert, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Check role authorization: only Samridhi's authorized account may access administrative dashboard
  const isAdminArea = requiredRole === 'admin' || location.pathname.startsWith('/admin');
  const isAuthorizedAdmin =
    user.role === 'admin' &&
    user.name === 'Samridhi' &&
    (user.id === DEMO_STAFF_ACCOUNTS.samridhi.id || Boolean(user.email));

  if (isAdminArea && !isAuthorizedAdmin) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-paper-50 border-2 border-ink-950 text-center shadow-lg">
        <ShieldAlert className="w-10 h-10 text-editorial-red mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-ink-950 mb-2">Restricted Administrator Area</h2>
        <p className="text-sm text-ink-700 font-sans mb-3">
          The administrative dashboard and privileged editorial operations are restricted solely to <strong>Samridhi</strong> (Administrator).
        </p>
        <p className="text-xs text-ink-500 font-mono mb-4">
          Current session: <strong>{user.name}</strong> ({user.role})
        </p>

        <div className="mb-6 p-3 bg-paper-200 border border-rule text-[11px] font-mono text-ink-600 text-left flex items-start gap-2">
          <Info className="w-4 h-4 text-editorial-red flex-shrink-0 mt-0.5" />
          <span>
            <strong>Prototype Security Notice:</strong> In this local environment, client-side role checks prevent unauthorized UI access. Production security requires a trusted server and database-enforced Row Level Security (RLS).
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-950 hover:bg-editorial-red text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <span>Go to My Profile</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-900 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Front Page</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
