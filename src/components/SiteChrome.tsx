import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

/**
 * movahedi.ca site chrome: a slim brand strip above the app and a footer
 * below it, so the simulator reads as part of the site rather than a
 * foreign embed. All links are absolute so they resolve on movahedi.ca.
 */
export const SiteHeader: React.FC = () => {
  return (
    <div className="bg-[#020617] border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-3">
        <a
          href="/"
          className="flex items-center gap-2 no-underline group"
          aria-label="movahedi.ca — Home"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#2dd4bf] to-[#14b8a6] text-[10px] font-bold text-[#042f2e]">
            MM
          </span>
          <span className="text-xs font-semibold tracking-tight text-[#f8fafc] group-hover:text-[#2dd4bf] transition-colors">
            Movahedi
          </span>
          <span className="hidden sm:inline text-[10px] font-medium text-[#94a3b8]">
            Privacy · AI Governance
          </span>
        </a>
        <nav className="flex items-center gap-1 text-[11px] font-medium" aria-label="Site">
          <a href="/tools" className="px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-colors no-underline">
            Tools
          </a>
          <a href="/insights" className="hidden sm:inline px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-colors no-underline">
            Insights
          </a>
          <a href="/glossary" className="hidden sm:inline px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-colors no-underline">
            Glossary
          </a>
          <a
            href="/tools/tabletop"
            className="flex items-center gap-1 px-2 py-1 rounded text-[#2dd4bf] hover:bg-[#14b8a6]/10 transition-colors no-underline"
          >
            <ArrowLeft className="w-3 h-3" />
            About this tool
          </a>
        </nav>
      </div>
    </div>
  );
};

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-[#020617] border-t border-[#1e293b] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#2dd4bf] to-[#14b8a6] text-[10px] font-bold text-[#042f2e]">
            MM
          </span>
          <p className="text-[11px] text-[#94a3b8] m-0">
            Breach Tabletop is a free tool by <a href="/" className="text-[#2dd4bf] hover:text-[#5eead4] no-underline">movahedi.ca</a> · Mohammad Movahedi
          </p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] font-medium" aria-label="Footer">
          <a href="/tools" className="px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] transition-colors no-underline">All free tools</a>
          <a href="/glossary" className="px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] transition-colors no-underline">Glossary</a>
          <a href="/services" className="px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] transition-colors no-underline">Services</a>
          <a href="/contact" className="px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] transition-colors no-underline">Contact</a>
          <a
            href="https://github.com/movahedi-ca/Tabletop-webapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded text-[#94a3b8] hover:text-[#f8fafc] transition-colors no-underline"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </div>
    </footer>
  );
};
