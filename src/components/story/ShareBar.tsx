import React, { useState } from 'react';
import { Share2, Link2, Check, Printer } from 'lucide-react';

interface ShareBarProps {
  title: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({ title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2 py-4 border-y border-rule my-6 text-xs font-mono text-ink-600">
      <span className="font-semibold uppercase tracking-wider text-ink-800 flex items-center gap-1.5 mr-2">
        <Share2 className="w-3.5 h-3.5 text-editorial-red" />
        Share Story:
      </span>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-2.5 py-1 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-800 transition-colors"
        title="Copy link to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-editorial-red" /> : <Link2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
      </button>

      <button
        onClick={handleShareTwitter}
        className="p-1.5 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-800 transition-colors"
        title="Share on X"
        aria-label="Share on X"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={handleShareLinkedIn}
        className="p-1.5 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-800 transition-colors"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </button>

      <button
        onClick={handlePrint}
        className="p-1.5 bg-paper-200 hover:bg-paper-300 border border-rule text-ink-800 transition-colors ml-auto"
        title="Print reader view"
        aria-label="Print story"
      >
        <Printer className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
