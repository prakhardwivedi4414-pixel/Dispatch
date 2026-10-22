import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="inline-block p-4 bg-paper-200 border-2 border-ink-900 mb-6">
        <span className="font-mono text-4xl sm:text-6xl font-black text-editorial-red">404</span>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink-950 mb-4">
        Page Not In Archives
      </h1>

      <p className="font-serif text-base sm:text-lg text-ink-700 leading-relaxed mb-8 max-w-md mx-auto">
        The requested dispatch or archival URL cannot be located. It may have been reassigned, retired, or entered with an invalid path.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-ink-900 text-white font-bold uppercase tracking-wider hover:bg-editorial-red transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>

        <Link
          to="/latest"
          className="flex items-center gap-2 px-5 py-2.5 border border-ink-900 bg-paper-50 text-ink-900 font-bold uppercase tracking-wider hover:bg-paper-200 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-editorial-red" />
          <span>Browse All Dispatches</span>
        </Link>
      </div>
    </div>
  );
};
