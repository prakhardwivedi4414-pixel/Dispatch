import React from 'react';
import { SourceItem } from '../../types';
import { BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

interface SourcesListProps {
  sources: SourceItem[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="my-8 pt-6 border-t border-rule">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-editorial-red" />
        <h4 className="font-serif text-lg font-bold text-ink-950">
          Sources, Documents & References
        </h4>
        <span className="text-xs font-mono text-ink-500 uppercase tracking-wider ml-auto">
          Editorial Verification
        </span>
      </div>

      <div className="space-y-3">
        {sources.map(source => (
          <div
            key={source.id}
            className="p-3 bg-paper-50 border border-rule text-xs sm:text-sm font-sans flex flex-col gap-1"
          >
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="font-semibold text-ink-900 flex items-center gap-1.5">
                {source.verified && (
                  <span title="Fact-checked source" className="inline-flex">
                    <CheckCircle className="w-3.5 h-3.5 text-editorial-red flex-shrink-0" />
                  </span>
                )}
                {source.title}
              </span>
              <div className="flex items-center gap-2 text-ink-500 font-mono text-xs">
                {source.organization && <span>{source.organization}</span>}
                {source.date && <span>({source.date})</span>}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-editorial-red hover:underline flex items-center gap-0.5"
                  >
                    Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            {source.note && (
              <p className="text-xs text-ink-600 italic">
                {source.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
