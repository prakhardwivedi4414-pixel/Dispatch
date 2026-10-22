import React from 'react';
import { Contributor } from '../../types';
import { Users, Award, ExternalLink, CheckCircle2 } from 'lucide-react';

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

  // Sort so primary byline is first
  const sortedContributors = [...contributors].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  return (
    <section className="my-12 pt-8 border-t-2 border-ink-950 bg-paper-100 p-6 sm:p-8" aria-label="Story Credits and Contributors">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rule mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink-950 text-paper-100 flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4 text-editorial-red" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950">
              Editorial Credits & Attribution
            </h3>
            <p className="text-xs font-mono text-ink-600">
              The Dispatch • Verified Reporting & Production Team
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-700 bg-paper-200 px-3 py-1 border border-rule">
          <CheckCircle2 className="w-3.5 h-3.5 text-editorial-red" />
          <span>Independent Student Attribution</span>
        </div>
      </div>

      {/* Grid of Contributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedContributors.map((contributor, index) => {
          const isPrimary = contributor.isPrimary || index === 0;
          const assignedRole = contributor.contributionRole || contributor.role;

          return (
            <div
              key={contributor.id || index}
              className={`p-5 border transition-colors flex flex-col justify-between ${
                isPrimary
                  ? 'bg-paper-50 border-ink-950 ring-1 ring-ink-950/20 shadow-xs'
                  : 'bg-paper-50/80 border-rule hover:border-ink-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    {contributor.profileImage ? (
                      <img
                        src={contributor.profileImage}
                        alt={contributor.name}
                        className="w-10 h-10 rounded-full object-cover border border-ink-900"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-ink-900 text-paper-100 flex items-center justify-center font-serif font-bold text-sm">
                        {contributor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base sm:text-lg text-ink-950">
                          {contributor.name}
                        </span>
                        {isPrimary && (
                          <span className="bg-editorial-red text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 font-bold">
                            Primary Byline
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-ink-500 uppercase tracking-wider block">
                        {contributor.role}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-paper-200 text-editorial-red border border-rule text-[11px] font-mono uppercase tracking-wider font-bold flex-shrink-0">
                    <Award className="w-3 h-3" />
                    <span>{assignedRole}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-serif mt-2">
                  {contributor.contribution || contributor.bio}
                </p>
              </div>

              {contributor.profileLink && (
                <div className="mt-3 pt-2.5 border-t border-rule text-right">
                  <a
                    href={contributor.profileLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-editorial-red hover:underline"
                  >
                    <span>View Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-rule flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-500">
        <span>Attribution verified per The Dispatch Transparency Charter.</span>
        <span>Every role reflects direct fieldwork participation.</span>
      </div>
    </section>
  );
};
