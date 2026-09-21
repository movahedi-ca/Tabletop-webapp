import React, { useState, useMemo } from 'react';
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

export const DoctrineScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(
    allPlaybooks[0]?.id || ''
  );
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(
    allPlaybooks[0]?.id || null
  );

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
    <div className="w-full bg-[#0B101B] text-[#F8FAFC] pb-24 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[#22334D] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="text-[10px] font-extrabold tracking-widest text-[#00F0FF] uppercase">
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
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="doctrine_search_input"
            placeholder="Search regulation, penalty, or requirement..."
            className="w-full bg-[#131D2E] border border-[#22334D] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/60 transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <span className="text-[10px] font-bold text-[#64748B] uppercase hidden md:inline shrink-0 mr-1">
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
                ? 'bg-[#00F0FF] text-[#001F2B] font-bold shadow-sm'
                : 'bg-[#131D2E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#22334D]'
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
            <span className="text-[10px] text-[#64748B] hidden lg:inline">
              SELECT PLAYBOOK TO INSPECT
            </span>
          </div>

          {filteredPlaybooks.map((playbook) => {
            const isSelected = activePlaybook?.id === playbook.id;
            const isExpandedMobile = expandedMobileId === playbook.id;

            return (
              <div
                key={playbook.id}
                data-testid={`playbook_card_${playbook.id}`}
                onClick={() => {
                  setSelectedPlaybookId(playbook.id);
                  setExpandedMobileId(isExpandedMobile ? null : playbook.id);
                }}
                className={`w-full bg-[#131D2E] border rounded-2xl p-4 transition-all cursor-pointer shadow-md text-left ${
                  isSelected
                    ? 'border-[#00F0FF] bg-[#1A263B] shadow-[0_0_15px_rgba(0,240,255,0.12)]'
                    : 'border-[#22334D] hover:border-[#00F0FF]/40'
                }`}
              >
                {/* Top Tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 uppercase">
                    {playbook.regulatoryAuthority || playbook.authority}
                  </span>

                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FCA5A5] bg-[#EF4444]/15 px-2 py-0.5 rounded border border-[#EF4444]/30">
                    <Clock className="w-3 h-3 text-[#EF4444]" />
                    <span>{playbook.deadlineWindow}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5">{playbook.title}</h3>

                {/* Statutory Penalties */}
                <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-semibold mb-2 bg-[#0B101B] p-2 rounded-lg border border-[#22334D]">
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
                <div className="lg:hidden mt-3 pt-3 border-t border-[#22334D]">
                  {isExpandedMobile && (
                    <div className="space-y-4 pt-1">
                      {/* Mandatory Requirements Checklist */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#00F0FF] uppercase block mb-2">
                          MANDATORY DISCLOSURE ELEMENTS
                        </span>
                        <div className="space-y-1.5">
                          {playbook.mandatoryRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#F8FAFC]">
                              <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                              <span className="leading-snug">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Incident Checklist */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#10B981] uppercase block mb-2">
                          INCIDENT ACTION PLAYBOOK
                        </span>
                        <div className="space-y-1.5">
                          {playbook.incidentPlaybookChecklist.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                              <ArrowRight className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                              <span className="leading-snug">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Common Pitfalls */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-[#EF4444] uppercase block mb-2">
                          COMMON SANCTIONS & PITFALLS
                        </span>
                        <div className="space-y-1.5">
                          {playbook.commonPitfalls.map((pitfall, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#FCA5A5]">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
                              <span className="leading-snug">{pitfall}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#00F0FF] pt-2">
                    <span>{isExpandedMobile ? 'COLLAPSE' : 'EXPAND DETAILS'}</span>
                    {isExpandedMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dedicated Desktop Interactive Workbench (7 cols on desktop, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-7 space-y-5">
          {activePlaybook ? (
            <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Playbook Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded-md border border-[#00F0FF]/30 uppercase">
                    {activePlaybook.regulatoryAuthority || activePlaybook.authority}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FCA5A5] bg-[#EF4444]/15 px-3 py-1 rounded-md border border-[#EF4444]/30">
                    <Clock className="w-3.5 h-3.5 text-[#EF4444]" />
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
              <div className="p-4 rounded-xl bg-[#0B101B] border border-[#F59E0B]/30 flex items-start gap-3">
                <Gavel className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-black text-[#F59E0B] uppercase tracking-wider block mb-0.5">
                    STATUTORY ENFORCEMENT & FINANCIAL PENALTIES
                  </span>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {activePlaybook.statutoryPenalties}
                  </p>
                </div>
              </div>

              {/* Interactive Mandatory Disclosure Elements Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#22334D]">
                  <span className="text-xs font-black tracking-widest text-[#00F0FF] uppercase">
                    MANDATORY DISCLOSURE CONTENT CHECKLIST
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    CLICK TO VERIFY DURING CRISIS DRILL
                  </span>
                </div>

                <div className="space-y-2">
                  {activePlaybook.mandatoryRequirements.map((req, idx) => {
                    const isDone = !!checkedRequirements[`${activePlaybook.id}_${idx}`];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheck(activePlaybook.id, idx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isDone
                            ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F8FAFC]'
                            : 'bg-[#0B101B] border-[#22334D] hover:border-[#00F0FF]/30 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-[#10B981]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#64748B]" />
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-[#94A3B8]' : ''}`}>
                          {req}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Incident Containment Playbook Action Steps */}
              <div>
                <span className="text-xs font-black tracking-widest text-[#10B981] uppercase block mb-2.5 pb-2 border-b border-[#22334D]">
                  INCIDENT RESPONSE ACTION CHECKLIST
                </span>

                <div className="space-y-2.5">
                  {activePlaybook.incidentPlaybookChecklist.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0B101B] border border-[#22334D] text-xs text-[#CBD5E1]"
                    >
                      <ArrowRight className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls & Regulatory Traps */}
              <div>
                <span className="text-xs font-black tracking-widest text-[#EF4444] uppercase block mb-2.5 pb-2 border-b border-[#22334D]">
                  COMMON REGULATORY PITFALLS & SANCTION RISKS
                </span>

                <div className="space-y-2">
                  {activePlaybook.commonPitfalls.map((pitfall, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5]"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movahedi Strategic Counsel Note */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#131D2E] to-[#1E293B] border border-[#6366F1]/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider block">
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
                  className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#001F2B] text-xs font-bold rounded-lg shrink-0"
                >
                  Book Advisory
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-8 text-center text-[#64748B]">
              Select a playbook from the left to view full doctrine analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
