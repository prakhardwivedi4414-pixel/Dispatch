import React, { useEffect } from 'react';
import { useNewsroom } from '../context/NewsroomContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Users, ShieldCheck, Info } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useNewsroom();

  useEffect(() => {
    document.title = 'About The Dispatch — Stories That Matter';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      <Breadcrumbs items={[{ label: 'About The Publication' }]} />

      {/* Header */}
      <div className="pb-8 border-b-2 border-ink-900 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-editorial-red inline-block" />
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
            Editorial Mission
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-ink-950 mb-4">
          Independent Journalism Grounded in Truth, Craft & Rigor
        </h1>
        <p className="font-serif text-xl text-ink-700 leading-relaxed">
          <em>{settings.brandName}</em> is an independent, student-led digital publication founded by Siya and student collaborators, dedicated to long-form investigative journalism and multimedia reporting.
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="space-y-6 text-base sm:text-lg font-serif text-ink-850 leading-relaxed mb-12">
        <p>
          Founded on the conviction that communities deserve investigative depth rather than surface press releases, <em>The Dispatch</em> combines rigorous documentary fieldwork with modern multimedia storytelling. Our reporting scrutinizes institutional governance, labor conditions, community mutual aid, and artistic subcultures across audio, visual, and written forms.
        </p>

        <p>
          Every dispatch published here adheres to the principle of format-driven reporting. Rather than treating video, podcasts, and photography as mere decorations for text, we treat each medium as an autonomous, rigorous reporting instrument.
        </p>
      </section>

      {/* Demonstrative Reporting Notice */}
      <section className="bg-paper-100 border border-ink-950 p-6 sm:p-8 mb-12" aria-label="Illustrative Content Note">
        <div className="flex items-center gap-2.5 mb-3">
          <Info className="w-5 h-5 text-editorial-red flex-shrink-0" />
          <h2 className="font-serif text-2xl font-bold text-ink-950">
            Illustrative & Demonstrative Content Note
          </h2>
        </div>

        <p className="text-sm text-ink-700 font-serif leading-relaxed mb-4">
          <em>The Dispatch</em> is a student journalism publication designed to demonstrate professional multimedia reporting practices. All dispatches, photographic frames, audio pieces, and source ledgers published on this platform are created for demonstrative and portfolio review purposes.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-600 bg-paper-200 p-3 border border-rule">
          <ShieldCheck className="w-4 h-4 text-editorial-red flex-shrink-0" />
          <span>Demonstration stories are flagged with <code className="text-editorial-red font-bold">isDemo: true</code> in the editorial system.</span>
        </div>
      </section>

      {/* Editorial Team & Roles */}
      <section className="mb-14">
        <div className="flex items-center gap-2 pb-3 border-b-2 border-ink-900 mb-6">
          <Users className="w-5 h-5 text-editorial-red" />
          <h2 className="font-serif text-2xl font-bold text-ink-950">
            Newsroom Masthead
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Siya</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Editor-in-Chief & Lead Reporter
              </span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed font-sans">
              Directs editorial assignments, leads fieldwork investigations on nocturnal labor and community mutual aid, co-hosts the investigative podcast, and coordinates reporting verification.
            </p>
          </div>

          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Maya Chen</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Head of Visuals & Photography
              </span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed font-sans">
              Director of documentary photography, managing low-light film and digital capture, negative development, color grading, and visual attribution standards.
            </p>
          </div>

          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Liam O’Connor</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Audio Producer & Video Director
              </span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed font-sans">
              Engineers multi-track studio audio, masters broadcast sound design, operates field video cinematography, and edits short-form documentary packages.
            </p>
          </div>

          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Marcus Vance & Priya Patel</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Fact-Checking & Archival Research
              </span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed font-sans">
              Conducts independent source verification, public record FOI requests, data cross-checks, and statistical validation across all published stories.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Note */}
      <section className="p-6 bg-paper-200 border border-rule text-xs font-sans text-ink-700">
        <h3 className="font-serif text-base font-bold text-ink-950 mb-2">
          Contact The Editorial Desk
        </h3>
        <p className="mb-2">
          For newsroom inquiries, corrections, or source inquiries:
        </p>
        <div className="font-mono text-ink-900 space-y-1">
          <p>Email: <span className="text-editorial-red">editorial@thedispatch.internal</span></p>
          <p>Newsroom: Student Media Center, Room 304</p>
        </div>
      </section>
    </div>
  );
};
