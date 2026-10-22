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
          <em>{settings.brandName}</em> is an independent, student-led digital publication dedicated to in-depth investigative journalism, documentary photography, and multimedia storytelling.
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="space-y-6 text-base sm:text-lg font-serif text-ink-850 leading-relaxed mb-12">
        <p>
          Founded on the conviction that communities deserve investigative depth rather than superficial press releases, <em>The Dispatch</em> combines rigorous documentary fieldwork with modern multimedia storytelling. Our reporting scrutinizes institutional governance, labor conditions, community mutual aid, and artistic subcultures across audio, visual, and written forms.
        </p>

        <p>
          Every dispatch published here adheres to the principle of format-driven reporting. Rather than treating video, podcasts, and photography as mere decorations for text, we treat each medium as an autonomous, rigorous reporting instrument.
        </p>
      </section>

      {/* Editorial Independence and Transparency Note */}
      <section className="bg-paper-100 border border-ink-950 p-6 sm:p-8 mb-12" aria-label="Editorial Transparency Note">
        <div className="flex items-center gap-2.5 mb-3">
          <Info className="w-5 h-5 text-editorial-red flex-shrink-0" />
          <h2 className="font-serif text-2xl font-bold text-ink-950">
            Editorial Independence & Transparency Notice
          </h2>
        </div>

        <p className="text-sm text-ink-700 font-serif leading-relaxed mb-4">
          <em>The Dispatch</em> is an independent student publication publishing original student reporting and multimedia journalism. Dispatches adhere to strict verification standards and transparent attribution.
        </p>
        <p className="text-sm text-ink-700 font-serif leading-relaxed mb-4">
          <strong>Document & Visual Sourcing:</strong> All published dispatches are derived directly from verified reporting documents. Original photographs and illustrations are preserved faithfully with verifiable attribution and source links.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-600 bg-paper-200 p-3 border border-rule">
          <ShieldCheck className="w-4 h-4 text-editorial-red flex-shrink-0" />
          <span>Independent editorial reporting published under student press standards and verification.</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          {/* Administrator */}
          <div className="p-5 bg-paper-50 border-2 border-ink-950 sm:col-span-2">
            <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
              <strong className="font-serif text-xl text-ink-950">Samridhi</strong>
              <span className="text-xs font-mono uppercase bg-editorial-red text-white px-2 py-0.5 font-bold">
                Administrator & Editorial Lead
              </span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed font-sans">
              Oversees newsroom administration, verifies reporting attribution, directs cross-desk editorial standards, and manages publishing permissions.
            </p>
          </div>

          {/* Confirmed Contributors */}
          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Arpita Singh</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Contributor
              </span>
            </div>
            <p className="text-xs text-ink-600 font-mono">
              The Dispatch Contributing Staff
            </p>
          </div>

          <div className="p-5 bg-paper-50 border border-rule">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="font-serif text-lg text-ink-950">Kirti</strong>
              <span className="text-xs font-mono uppercase text-editorial-red font-bold">
                Contributor
              </span>
            </div>
            <p className="text-xs text-ink-600 font-mono">
              The Dispatch Contributing Staff
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
          <p>
            Email:{' '}
            <a
              href="mailto:samridhiaug@gmail.com"
              className="text-editorial-red hover:underline font-bold"
            >
              samridhiaug@gmail.com
            </a>
          </p>
          <p>Newsroom: Student Media Center, Room 304</p>
        </div>
      </section>
    </div>
  );
};
