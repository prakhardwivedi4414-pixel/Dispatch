import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../services/contentRepository';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={`/editorial/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Check role authorization if specified
  if (requiredRole && requiredRole === 'admin' && user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-paper-50 border border-ink-950 text-center">
        <ShieldAlert className="w-10 h-10 text-editorial-red mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-ink-950 mb-2">Restricted Access</h2>
        <p className="text-sm text-ink-700 font-sans mb-6">
          This view requires <strong>Admin</strong> privileges. Your current role is <strong>{user.role}</strong>.
        </p>
        <Link
          to="/editorial"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink-950 text-white font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
