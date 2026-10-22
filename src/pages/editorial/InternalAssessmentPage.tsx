import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INTERNAL_ASSESSMENT_DOSSIER } from '../../data/internalAssessmentData';
import { ArrowLeft, Printer, CheckCircle2, BookOpen } from 'lucide-react';

export const InternalAssessmentPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Internal Assessment & Syllabus Audit — The Dispatch';
  }, []);

  const { studentName, submissionDeadline, records, allRequirementsPassed } = INTERNAL_ASSESSMENT_DOSSIER;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 min-h-screen">
      {/* Top Header / Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b-2 border-ink-950 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/editorial"
            className="p-2 bg-paper-100 border border-rule hover:border-ink-950 text-ink-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold">
              Admin & Academic Verification Only
            </span>
            <h1 className="font-serif text-3xl font-black text-ink-950">
              Internal Assessment Dossier
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-ink-950 text-paper-100 font-bold uppercase tracking-wider hover:bg-editorial-red transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Assessment Sheet</span>
          </button>
        </div>
      </div>

      {/* Security notice banner (hidden in print) */}
      <div className="mb-8 p-4 bg-paper-200 border-l-4 border-editorial-red text-xs font-mono text-ink-800 print:hidden">
        <strong>RESTRICTED INTERNAL AREA:</strong> This dossier contains course submission metadata and rubric audits (e.g. syllabus guidelines, word counts, contribution ledgers). This page is strictly segregated under <code className="bg-paper-100 px-1 border border-rule">/editorial/internal</code> and is never linked or rendered on public reader-facing routes.
      </div>

      {/* Printable Dossier Sheet */}
      <div className="bg-paper-50 border-2 border-ink-950 p-6 sm:p-10 shadow-md print:border-none print:p-0 print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-ink-950 pb-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-editorial-red font-bold block mb-1">
                Multimedia Journalism Assessment Submission
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-ink-950">
                The Dispatch — Portfolio Audit Report
              </h2>
            </div>
            <div className="text-right font-mono text-xs text-ink-600">
              <span className="inline-flex items-center gap-1 text-green-800 font-bold bg-green-50 border border-green-300 px-2.5 py-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All 4 Slots Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-rule text-xs font-mono">
            <div>
              <span className="text-ink-500 block">Candidate Reporter:</span>
              <strong className="text-sm font-serif text-ink-950 font-bold">{studentName}</strong>
            </div>
            <div>
              <span className="text-ink-500 block">Submission Deadline:</span>
              <strong className="text-sm font-mono text-ink-950 font-bold">{submissionDeadline}</strong>
            </div>
            <div>
              <span className="text-ink-500 block">Overall Status:</span>
              <strong className="text-sm font-mono text-green-800 font-bold">
                {allRequirementsPassed ? '100% Complete' : 'Incomplete'}
              </strong>
            </div>
          </div>
        </div>

        {/* Syllabus Scope Overview */}
        <div className="mb-10">
          <h3 className="font-serif text-xl font-bold text-ink-950 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-editorial-red" />
            <span>Syllabus Story Slots & Format Compliance</span>
          </h3>

          <div className="space-y-6">
            {records.map(rec => (
              <div key={rec.slotId} className="border border-ink-950 p-5 bg-paper-100">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rule mb-3">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="bg-editorial-red text-white px-2 py-0.5 font-bold">
                      {rec.slotId}
                    </span>
                    <span className="font-bold text-ink-900">{rec.storyId}</span>
                  </div>
                  <span className="font-mono text-xs text-green-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Format & Length Validated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono mb-4 text-ink-700">
                  <div>
                    <span className="text-ink-500 block text-[10px]">Word Count:</span>
                    <strong>{rec.wordCount} words</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block text-[10px]">Media/Photos:</span>
                    <strong>{rec.hasMediaOrPhotos ? 'Verified Attached' : 'Missing'}</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block text-[10px]">Sources Audit:</span>
                    <strong>{rec.hasSources ? 'Catalogued' : 'None'}</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block text-[10px]">Group Ledger:</span>
                    <strong>{rec.hasContributions ? 'Logged' : 'Missing'}</strong>
                  </div>
                </div>

                {/* Contribution Log */}
                <div className="pt-3 border-t border-rule">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-600 block mb-2">
                    Group Member Contributions Record:
                  </span>
                  <div className="space-y-2">
                    {rec.contributionLog.map((log, i) => (
                      <div key={i} className="text-xs bg-paper-50 p-2.5 border border-rule">
                        <div className="flex items-center justify-between mb-1">
                          <strong className="font-serif text-ink-950">{log.contributorName}</strong>
                          <span className="font-mono text-[10px] text-editorial-red font-bold uppercase bg-paper-200 px-1.5 py-0.5">
                            {log.role}
                          </span>
                        </div>
                        <p className="font-sans text-ink-700 leading-relaxed text-[11px]">
                          {log.contributionSummary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declaration & Signoff */}
        <div className="pt-6 border-t-2 border-ink-950 text-xs font-mono text-ink-700 flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-ink-950 mb-1">Candidate Editorial Statement:</p>
            <p className="max-w-md font-sans text-ink-600">
              I certify that all original reporting, interviews, audio recording, cinematography, and documentary photography presented across these four dispatches represent student fieldwork adhering to journalistic integrity standards.
            </p>
          </div>
          <div className="text-right sm:self-end">
            <div className="border-b border-ink-950 w-48 mb-1 pb-4">
              <span className="font-serif italic text-base text-ink-950">{studentName}</span>
            </div>
            <span className="text-[10px] text-ink-500">Candidate Signature & Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};
