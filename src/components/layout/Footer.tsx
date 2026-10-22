import React from 'react';
import { Link } from 'react-router-dom';
import { useNewsroom } from '../../context/NewsroomContext';
import { ArrowUp, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useNewsroom();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink-950 text-paper-200 border-t border-ink-900 pt-12 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-ink-800">
          {/* Col 1: Brand & Editorial Mission */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-2">
              <span className="font-serif text-3xl font-black text-paper-100 tracking-tight uppercase">
                {settings.brandName}
              </span>
            </Link>
            <p className="text-xs uppercase tracking-widest text-editorial-red font-bold mb-3 font-mono">
              {settings.tagline}
            </p>
            <p className="text-sm text-ink-400 font-sans leading-relaxed max-w-md">
              An independent student digital newsroom dedicated to high-impact investigative reporting, documentary photography, long-form journalism, and audio documentary production.
            </p>
          </div>

          {/* Col 2: Navigation Desks */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-sm font-bold text-paper-100 mb-3 border-b border-ink-800 pb-1 uppercase tracking-wider font-mono">
              Desks & Beats
            </h4>
            <ul className="space-y-2 text-xs font-sans text-ink-400">
              <li>
                <Link to="/section/campus" className="hover:text-paper-100 transition-colors">
                  Campus Affairs & Governance
                </Link>
              </li>
              <li>
                <Link to="/section/society" className="hover:text-paper-100 transition-colors">
                  Society & Mutual Aid
                </Link>
              </li>
              <li>
                <Link to="/section/culture" className="hover:text-paper-100 transition-colors">
                  Culture & Visual Arts
                </Link>
              </li>
              <li>
                <Link to="/section/investigations" className="hover:text-paper-100 transition-colors">
                  Investigative Reporting
                </Link>
              </li>
              <li>
                <Link to="/multimedia" className="hover:text-paper-100 transition-colors">
                  Audio & Video Multimedia
                </Link>
              </li>
              <li>
                <Link to="/look-closer" className="text-editorial-red hover:underline">
                  Look Closer: Evidence Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Editorial Standards & Transparency */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-sm font-bold text-paper-100 mb-3 border-b border-ink-800 pb-1 uppercase tracking-wider font-mono">
              Standards & Transparency
            </h4>
            <ul className="space-y-2 text-xs font-sans text-ink-400 mb-6">
              <li>
                <Link to="/standards" className="hover:text-paper-100 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-editorial-red" />
                  Code of Editorial Ethics & Verification
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-paper-100 transition-colors">
                  About The Newsroom & Contributors
                </Link>
              </li>
            </ul>

            <div className="p-3 bg-ink-900 border border-ink-800 text-xs font-mono text-ink-400">
              <span className="text-paper-200 block font-bold mb-0.5">Editor: {settings.editorName}</span>
              <span>{settings.editionLabel}</span>
            </div>
          </div>
        </div>

        {/* Footer Sub-bar with quiet Editorial Login */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ink-500">
          <div>
            © 2026 {settings.brandName}. Published under student press independence.
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/editorial/login"
              className="inline-flex items-center gap-1 text-ink-400 hover:text-paper-100 transition-colors"
              title="Staff & Contributor Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Editorial login</span>
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-paper-100 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3 text-editorial-red" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
