import React, { useState } from 'react';
import { Download, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ScriptViewerProps {
  scriptText?: string;
  storyTitle: string;
  mediaType: string;
  duration?: string;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({
  scriptText,
  storyTitle,
  mediaType,
  duration,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!scriptText || scriptText.trim().length === 0) {
    return null;
  }

  const handleDownload = () => {
    const filename = `${storyTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}-script.txt`;
    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="my-10 bg-paper-100 border-2 border-ink-900 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5 bg-paper-200 border-b border-ink-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-editorial-red text-white flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink-950 flex items-center gap-2">
              Broadcast Script & Production Transcript
            </h3>
            <p className="text-xs font-mono text-ink-600">
              Format: {mediaType.toUpperCase()} {duration && `• Running Time: ${duration}`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rule hover:border-ink-900 bg-paper-50 text-xs font-semibold text-ink-800 transition-colors"
            title="Copy script text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-editorial-red" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            title="Download script as text file"
          >
            <Download className="w-3.5 h-3.5 text-editorial-red" />
            <span>Download Script (.txt)</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-ink-700 hover:text-ink-950"
            aria-label={isOpen ? 'Collapse script' : 'Expand script'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Script Content */}
      {isOpen && (
        <div className="p-5 md:p-8">
          <div className="text-xs uppercase tracking-widest font-mono text-ink-500 mb-3 pb-2 border-b border-rule flex justify-between items-center">
            <span>Verified Broadcast Manuscript</span>
            <span className="text-editorial-red font-semibold">Official Assignment Submission Asset</span>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-ink-900 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto p-4 bg-paper-50 border border-rule">
            {scriptText}
          </pre>
        </div>
      )}
    </section>
  );
};
