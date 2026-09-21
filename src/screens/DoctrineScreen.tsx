import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Gavel,
  Check,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { allPlaybooks } from '../data/doctrineData';
import { DoctrinePlaybook } from '../types';
import { MovahediData } from '../data/movahediData';
import { useSimulation } from '../context/SimulationContext';

/** Deep links from each playbook into movahedi.ca content. */
const DOCTRINE_SITE_LINKS: Record<string, { label: string; href: string }[]> = {
  'pipeda-law25-breach': [
    { label: 'Glossary: Confidentiality incident (Law 25)', href: '/glossary#breach-confidentiality-incident' },
    { label: 'Glossary: Law 25', href: '/glossary#law-25' },
  ],
  'gdpr-art-33-34': [
    { label: 'Glossary: Breach notification duties', href: '/glossary#breach-confidentiality-incident' },
    { label: 'Privacy insights', href: '/insights' },
  ],
  'sec-item-105': [
    { label: 'Glossary: Critical incident', href: '/glossary#critical-incident' },
    { label: 'Privacy insights', href: '/insights' },
  ],
  'hipaa-breach-rule': [
    { label: 'Glossary: Breach notification duties', href: '/glossary#breach-confidentiality-incident' },
    { label: 'Privacy insights', href: '/insights' },
  ],
  'nist-sp-800-61': [
    { label: 'Glossary: Critical incident', href: '/glossary#critical-incident' },
    { label: 'Privacy insights', href: '/insights' },
  ],
  'nydfs-23-nycrr-500': [
    { label: 'Glossary: Breach notification duties', href: '/glossary#breach-confidentiality-incident' },
    { label: 'Privacy insights', href: '/insights' },
  ],
  'aida-ai-governance': [
    { label: 'Glossary: AI incident reporting', href: '/glossary#incident-reporting-ai' },
    { label: 'Glossary: Automated decision-making', href: '/glossary#admt' },
  ],
};

export const DoctrineScreen: React.FC = () => {
  const { selectedDoctrine } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(
    selectedDoctrine?.id || allPlaybooks[0]?.id || ''
  );
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(
    selectedDoctrine?.id || allPlaybooks[0]?.id || null
  );

  // Deep links (#/doctrine/<id>) select the requested playbook via context.
  useEffect(() => {
    if (selectedDoctrine) {
      setSelectedPlaybookId(selectedDoctrine.id);
      setExpandedMobileId(selectedDoctrine.id);
      setSearchQuery('');
      setSelectedFilter('ALL');
    }
  }, [selectedDoctrine]);

  // Interactive checked state for mandatory requirements checklist
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string, reqIdx: number) => {
    const key = `${id}_${reqIdx}`;
    setCheckedRequirements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const authorities = ['ALL', 'PIPEDA', 'QUEBEC LAW 25', 'SEC', 'GDPR', 'HIPAA'];

  const filteredPlaybooks = useMemo(() => {
    return allPlaybooks.filter((pb) => {
      const authorityName = pb.regulatoryAuthority || pb.authority || '';
      const matchesSearch =
        !searchQuery ||
        pb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pb.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorityName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilter === 'ALL' ||
        authorityName.toUpperCase().includes(selectedFilter) ||
        pb.id.toUpperCase().includes(selectedFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  const activePlaybook = useMemo(() => {
    return (
      filteredPlaybooks.find((p) => p.id === selectedPlaybookId) ||
      filteredPlaybooks[0] ||
      allPlaybooks[0]
    );
  }, [filteredPlaybooks, selectedPlaybookId]);

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-24 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[#1e293b] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
            <span className="text-[10px] font-extrabold tracking-widest text-[#2dd4bf] uppercase">
              STATUTORY INCIDENT DOCTRINE & PLAYBOOKS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC]">
            Crisis Response Doctrine
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Statutory breach disclosure clocks, legal privilege preservation frameworks, and supervisory authority
            expectations across Canadian, US, and European jurisdictions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="doctrine_search_input"
            aria-label="Search doctrine playbooks"
            placeholder="Search regulation, penalty, or requirement..."
            className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#2dd4bf]/60 transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase hidden md:inline shrink-0 mr-1">
          JURISDICTION:
        </span>
        {authorities.map((auth) => (
          <button
            key={auth}
            type="button"
            onClick={() => setSelectedFilter(auth)}
            data-testid={`filter_chip_${auth.replace(/\s+/g, '_')}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === auth
                ? 'bg-[#2dd4bf] text-[#042f2e] font-bold shadow-sm'
                : 'bg-[#0f172a] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1e293b]'
            }`}
          >
            {auth}
          </button>
        ))}
      </div>

      {/* Desktop Split Master-Detail vs Mobile Accordion List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Playbook Directory (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              REGULATORY PLAYBOOKS ({filteredPlaybooks.length})
            </span>
            <span className="text-[10px] text-[#94A3B8] hidden lg:inline">
              SELECT PLAYBOOK TO INSPECT
            </span>
          </div>

          {filteredPlaybooks.map((playbook) => {
            const isSelected = activePlaybook?.id === playbook.id;
            const isExpandedMobile = expandedMobileId === playbook.id;

            return (
              <button
                type="button"
                key={playbook.id}
                data-testid={`playbook_card_${playbook.id}`}
                onClick={() => {
                  setSelectedPlaybookId(playbook.id);
                  setExpandedMobileId(isExpandedMobile ? null : playbook.id);
                }}
                aria-label={`Open playbook: ${playbook.title}`}
                className={`w-full bg-[#0f172a] border rounded-2xl p-4 transition-all cursor-pointer shadow-md text-left ${
                  isSelected
                    ? 'border-[#2dd4bf] bg-[#0f172a] shadow-[0_0_15px_rgba(45,212,191,0.12)]'
                    : 'border-[#1e293b] hover:border-[#2dd4bf]/40'
                }`}
              >
                {/* Top Tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#2dd4bf] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/30 uppercase">
                    {playbook.regulatoryAuthority || playbook.authority}
                  </span>

                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FCA5A5] bg-[#f87171]/15 px-2 py-0.5 rounded border border-[#f87171]/30">
                    <Clock className="w-3 h-3 text-[#f87171]" />
                    <span>{playbook.deadlineWindow}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5">{playbook.title}</h3>

                {/* Statutory Penalties */}
                <div className="flex items-center gap-1.5 text-xs text-[#fbbf24] font-semibold mb-2 bg-[#020617] p-2 rounded-lg border border-[#1e293b]">
                  <Gavel className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] truncate">
                    PENALTIES: {playbook.statutoryPenalties}
                  </span>
                </div>

                {/* Overview Excerpt */}
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                  {playbook.overview}
                </p>

                {/* Mobile-Only Expanded Detail Container */}
                <div className="lg:hidden mt-3 pt-3 border-t border-[#1e293b]">
                  {isExpandedMobile && (
                    <div className="space-y-4 pt-1">
                      {/* Mandatory Requirements Checklist */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#2dd4bf] uppercase block mb-2">
                          MANDATORY DISCLOSURE ELEMENTS
                        </span>
                        <div className="space-y-1.5">
                          {playbook.mandatoryRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#F8FAFC]">
                              <Check className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0 mt-0.5" />
                              <span className="leading-snug">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Incident Checklist */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#34d399] uppercase block mb-2">
                          INCIDENT ACTION PLAYBOOK
                        </span>
                        <div className="space-y-1.5">
                          {playbook.incidentPlaybookChecklist.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                              <ArrowRight className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                              <span className="leading-snug">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Common Pitfalls */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#f87171] uppercase block mb-2">
                          COMMON SANCTIONS & PITFALLS
                        </span>
                        <div className="space-y-1.5">
                          {playbook.commonPitfalls.map((pitfall, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#FCA5A5]">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#f87171] shrink-0 mt-0.5" />
                              <span className="leading-snug">{pitfall}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#2dd4bf] pt-2">
                    <span>{isExpandedMobile ? 'COLLAPSE' : 'EXPAND DETAILS'}</span>
                    {isExpandedMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dedicated Desktop Interactive Workbench (7 cols on desktop, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-7 space-y-5">
          {activePlaybook ? (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Playbook Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold tracking-widest text-[#2dd4bf] bg-[#2dd4bf]/10 px-2.5 py-1 rounded-md border border-[#2dd4bf]/30 uppercase">
                    {activePlaybook.regulatoryAuthority || activePlaybook.authority}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FCA5A5] bg-[#f87171]/15 px-3 py-1 rounded-md border border-[#f87171]/30">
                    <Clock className="w-3.5 h-3.5 text-[#f87171]" />
                    <span>STATUTORY WINDOW: {activePlaybook.deadlineWindow}</span>
                  </div>
                </div>

                <h2 className="text-xl font-black text-[#F8FAFC] mb-2">
                  {activePlaybook.title}
                </h2>

                <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed">
                  {activePlaybook.overview}
                </p>
              </div>

              {/* Statutory Penalties Alert Box */}
              <div className="p-4 rounded-xl bg-[#020617] border border-[#fbbf24]/30 flex items-start gap-3">
                <Gavel className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-black text-[#fbbf24] uppercase tracking-wider block mb-0.5">
                    STATUTORY ENFORCEMENT & FINANCIAL PENALTIES
                  </span>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {activePlaybook.statutoryPenalties}
                  </p>
                </div>
              </div>

              {/* Interactive Mandatory Disclosure Elements Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1e293b]">
                  <span className="text-xs font-black tracking-widest text-[#2dd4bf] uppercase">
                    MANDATORY DISCLOSURE CONTENT CHECKLIST
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    CLICK TO VERIFY DURING CRISIS DRILL
                  </span>
                </div>

                <div className="space-y-2">
                  {activePlaybook.mandatoryRequirements.map((req, idx) => {
                    const isDone = !!checkedRequirements[`${activePlaybook.id}_${idx}`];

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleCheck(activePlaybook.id, idx)}
                        aria-pressed={isDone}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left ${
                          isDone
                            ? 'bg-[#34d399]/10 border-[#34d399]/40 text-[#F8FAFC]'
                            : 'bg-[#020617] border-[#1e293b] hover:border-[#2dd4bf]/30 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-[#34d399]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-[#94A3B8]' : ''}`}>
                          {req}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Incident Containment Playbook Action Steps */}
              <div>
                <span className="text-xs font-black tracking-widest text-[#34d399] uppercase block mb-2.5 pb-2 border-b border-[#1e293b]">
                  INCIDENT RESPONSE ACTION CHECKLIST
                </span>

                <div className="space-y-2.5">
                  {activePlaybook.incidentPlaybookChecklist.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] text-xs text-[#CBD5E1]"
                    >
                      <ArrowRight className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls & Regulatory Traps */}
              <div>
                <span className="text-xs font-black tracking-widest text-[#f87171] uppercase block mb-2.5 pb-2 border-b border-[#1e293b]">
                  COMMON REGULATORY PITFALLS & SANCTION RISKS
                </span>

                <div className="space-y-2">
                  {activePlaybook.commonPitfalls.map((pitfall, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f87171]/10 border border-[#f87171]/30 text-xs text-[#FCA5A5]"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Go deeper on movahedi.ca */}
              {(DOCTRINE_SITE_LINKS[activePlaybook.id] || []).length > 0 && (
                <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                  <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-wider block mb-2">
                    Go deeper on movahedi.ca
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DOCTRINE_SITE_LINKS[activePlaybook.id].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#2dd4bf] hover:bg-[#14b8a6]/20 text-xs font-semibold transition-colors no-underline"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Movahedi Strategic Counsel Note */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1E293B] border border-[#14b8a6]/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-wider block">
                    Need Specialized Regulatory Defense?
                  </span>
                  <span className="text-xs text-[#CBD5E1] font-semibold">
                    Consult with {MovahediData.CONSULTANT_NAME} for legal privilege & CAI/OPC compliance.
                  </span>
                </div>
                <a
                  href={MovahediData.DISCOVERY_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] text-xs font-bold rounded-lg shrink-0"
                >
                  Book Advisory
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 text-center text-[#94A3B8]">
              Select a playbook from the left to view full doctrine analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
