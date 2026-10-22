import React from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ShieldCheck, CheckCircle2, AlertTriangle, Eye, Lock, Cpu, RotateCcw } from 'lucide-react';

export const EditorialStandardsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Editorial Standards' }]} />

      {/* Header */}
      <div className="pb-8 border-b-2 border-ink-900 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-editorial-red" />
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
            Newsroom Code of Practice
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-ink-950 mb-4">
          Editorial Standards & Verification Protocol
        </h1>
        <p className="font-serif text-xl text-ink-700 leading-relaxed">
          The credibility of student journalism rests entirely upon factual accuracy, meticulous source verification, and transparent accountability. Below are the standards governing all reporting published by The Dispatch.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="space-y-12 text-ink-900">
        {/* Section 1: Accuracy & Verification */}
        <section className="p-6 bg-paper-100 border border-rule">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              1. Accuracy and Verification
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              Every factual assertion, statistic, and timeline published must be substantiated by at least two independent primary sources or verifiable public records. Reporters must retain all interview recordings, written transcripts, and field notes as verified newsroom archival records.
            </p>
            <p className="text-xs font-mono text-ink-600 bg-paper-200 p-3 border border-rule">
              <strong>Rule on Quotations:</strong> Quotes must represent verbatim spoken statements. Minor grammatical pauses may be omitted only when doing so does not alter the speaker's intent or nuance. Where audio or video is recorded, quotes are cross-checked against timecodes.
            </p>
          </div>
        </section>

        {/* Section 2: Fairness & Right of Reply */}
        <section className="p-6 bg-paper-100 border border-rule">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              2. Fairness and Responsible Reporting
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              When an investigation involves criticism, allegations of misconduct, or scrutiny of campus departments, the individuals or entities involved must be afforded a reasonable and documented opportunity to respond prior to publication.
            </p>
            <p>
              If a request for comment goes unanswered, the story must state the date and method of inquiry (e.g. <em>"The department did not respond to written inquiries submitted on October 14"</em>).
            </p>
          </div>
        </section>

        {/* Section 3: Attribution & Image Integrity */}
        <section className="p-6 bg-paper-100 border border-rule">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              3. Attribution and Visual Authenticity
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              Every photograph, video clip, and audio segment must carry an explicit attribution credit identifying the student photographer or videographer.
            </p>
            <p className="text-xs font-mono text-ink-600 bg-paper-200 p-3 border border-rule">
              <strong>Photo Manipulation Prohibition:</strong> Documentary photographs must not be staged, artificially generated, or digitally manipulated to add or remove objects. Standard color balance, contrast calibration, and cropping are permissible, but must preserve photographic truth.
            </p>
          </div>
        </section>

        {/* Section 4: Corrections & Retractions */}
        <section id="corrections" className="p-6 bg-paper-100 border border-rule">
          <div className="flex items-center gap-3 mb-3">
            <RotateCcw className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              4. Corrections and Updates Protocol
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              When a factual error is discovered in a published story, it must be corrected promptly and transparently. We do not quietly overwrite erroneous text without public acknowledgment.
            </p>
            <p>
              A correction notice is appended to the bottom of the article detailing: (1) what the original statement was, (2) the verified correction, and (3) the timestamp when the correction was applied.
            </p>
          </div>
        </section>

        {/* Section 5: Consent, Privacy & Vulnerability */}
        <section className="p-6 bg-paper-100 border border-rule">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              5. Consent, Privacy and Sensitive Subjects
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              Reporting involving vulnerable populations, student food insecurity, medical circumstances, or labor disputes requires explicit, documented verbal or written consent. We respect requests for partial anonymity (e.g. using a pseudonym or first name only) where public disclosure poses a credible risk to employment or safety.
            </p>
          </div>
        </section>

        {/* Section 6: AI-Generated Content Policy */}
        <section id="ai" className="p-6 bg-paper-100 border-2 border-editorial-red">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-5 h-5 text-editorial-red" />
            <h2 className="font-serif text-2xl font-bold text-ink-950">
              6. Policy on Artificial Intelligence (AI)
            </h2>
          </div>
          <div className="space-y-3 font-serif text-sm sm:text-base text-ink-800 leading-relaxed">
            <p>
              <strong>Prohibition of AI Reporting:</strong> Generative AI models (LLMs) cannot conduct journalism. They cannot conduct on-the-ground interviews, observe laboratory cleanrooms, verify municipal records, or record physical sound.
            </p>
            <p>
              All published text, photographic captures, audio narration, and video filming must be produced by real human student journalists. Generative AI text must never be submitted as original student reporting.
            </p>
          </div>
        </section>
      </div>

      {/* Footer Contact Statement */}
      <div className="mt-14 p-6 bg-paper-200 border border-rule text-xs font-mono text-ink-600">
        <p className="font-bold text-ink-900 mb-1">Editorial Queries & Ethical Inquiries:</p>
        <p>Contact Editor-in-Chief via the newsroom desk: <span className="text-editorial-red">standards@thedispatch.internal</span></p>
      </div>
    </div>
  );
};
