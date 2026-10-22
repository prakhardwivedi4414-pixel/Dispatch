import React from 'react';
import { Contributor } from '../../types';
import { Users, Award } from 'lucide-react';

interface CreditsContributionsProps {
  contributors: Contributor[];
  storyId?: string;
}

export const CreditsContributions: React.FC<CreditsContributionsProps> = ({
  contributors,
}) => {
  if (!contributors || contributors.length === 0) {
    return null;
  }

  return (
    <section className="my-12 pt-8 border-t-2 border-ink-900 bg-paper-100 p-6 sm:p-8" aria-label="Story Credits and Contributors">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rule mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink-900 text-paper-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-editorial-red" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950">
              Reporting Team & Credits
            </h3>
            <p className="text-xs font-mono text-ink-600">
              The Dispatch • Editorial Authorship
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-600 bg-paper-200 px-3 py-1 border border-rule">
          <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
          <span>Verified Byline</span>
        </div>
      </div>

      {/* Grid of Contributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contributors.map(contributor => (
          <div
            key={contributor.id}
            className="p-4 bg-paper-50 border border-rule hover:border-ink-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-serif font-bold text-base text-ink-950">
                  {contributor.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-paper-200 text-editorial-red border border-rule text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <Award className="w-3 h-3" />
                  {contributor.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
                {contributor.bio || contributor.contribution}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-rule text-right">
        <p className="text-[11px] font-mono text-ink-500">
          Published under The Dispatch Editorial Standards for transparent reporting.
        </p>
      </div>
    </section>
  );
};
