import React, { useState } from 'react';
import {
  ExternalLink,
  Shield,
  Lightbulb,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Tag,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Award,
  CheckSquare,
} from 'lucide-react';
import { MovahediData } from '../data/movahediData';

export const AdvisoryScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabs = ['Advisory Services', 'Practitioner Insights', 'Breach & RROSH Evaluator'];

  // Breach evaluator interactive state
  const [isSensitiveData, setIsSensitiveData] = useState<boolean>(true);
  const [isLikelyMisuse, setIsLikelyMisuse] = useState<boolean>(true);
  const [affectedVolume, setAffectedVolume] = useState<number>(250);
  const [dataEncrypted, setDataEncrypted] = useState<boolean>(false);

  const isRroshMet =
    isSensitiveData &&
    !dataEncrypted &&
    (isLikelyMisuse || affectedVolume > 100);

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-24 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Hero Consultant Profile Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#0b1220] to-[#0f172a] border border-[#1e293b] hover:border-[#2dd4bf]/30 rounded-2xl p-6 md:p-8 mb-6 shadow-xl relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2dd4bf]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-[#2dd4bf] to-[#14b8a6] flex items-center justify-center text-[#042f2e] font-black text-2xl md:text-3xl shadow-lg shrink-0">
              MM
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-wider bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/30">
                  STRATEGIC ADVISORY
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {MovahediData.CREDENTIALS}
                </span>
              </div>

              <h1 className="text-xl md:text-3xl font-black text-[#F8FAFC]">
                {MovahediData.CONSULTANT_NAME}
              </h1>

              <span className="text-xs md:text-sm font-bold text-[#5eead4] block mt-0.5">
                {MovahediData.SPECIALIZATION} • {MovahediData.LOCATION}
              </span>

              <p className="text-xs md:text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
                Building trustworthy data ecosystems — where regulatory compliance is crystal clear, AI risk is defensibly governed, and executive tabletop readiness is proven.
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
            <a
              href={MovahediData.WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="visit_movahedi_site_button"
              className="flex-1 md:flex-initial h-11 px-5 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
            >
              <span>Visit movahedi.ca</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={MovahediData.DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="book_discovery_call_button"
              className="flex-1 md:flex-initial h-11 px-5 bg-[#0f172a] hover:bg-[#1E293B] border border-[#14b8a6] text-[#5eead4] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-[#5eead4]" />
              <span>Book Discovery Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-1.5 mb-6 max-w-xl flex items-center">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(idx)}
            data-testid={`advisory_tab_${idx}`}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              selectedTab === idx
                ? 'bg-[#2dd4bf] text-[#042f2e] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Advisory Services (Responsive 3-col on desktop) */}
      {selectedTab === 0 && (
        <div className="space-y-4 mb-8">
          <div className="mb-4">
            <span className="text-[11px] font-black tracking-widest text-[#2dd4bf] uppercase block mb-1">
              PRACTICE AREAS & CAPABILITIES
            </span>
            <p className="text-xs md:text-sm text-[#94A3B8]">
              Strategic privacy engineering, Canadian statutory defense (PIPEDA, Law 25), and AI risk governance for enterprise leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MovahediData.services.map((service, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-[#1e293b] hover:border-[#2dd4bf]/40 rounded-2xl p-5 shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#2dd4bf] transition-colors">
                      {service.title}
                    </h3>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2dd4bf] hover:text-[#2dd4bf]/80 p-1 shrink-0"
                      title="Open service details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <span className="text-xs font-semibold text-[#5eead4] block mb-2.5">
                    {service.subtitle}
                  </span>

                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1e293b]">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#020617] border border-[#1e293b] text-[#94A3B8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Practitioner Insights (Responsive 2-col on desktop) */}
      {selectedTab === 1 && (
        <div className="space-y-4 mb-8">
          <div className="mb-4">
            <span className="text-[11px] font-black tracking-widest text-[#2dd4bf] uppercase block mb-1">
              PRACTITIONER ARTICLES & DOCTRINAL ANALYSIS
            </span>
            <p className="text-xs md:text-sm text-[#94A3B8]">
              Expert publications on Canadian privacy statutes, constitutional digital forensics, and AI safety by Mohammad Movahedi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MovahediData.insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-[#1e293b] hover:border-[#2dd4bf]/40 rounded-2xl p-5 shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#14b8a6]/20 text-[#5eead4] border border-[#14b8a6]/40">
                      {insight.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#94A3B8]">{insight.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#2dd4bf] transition-colors mb-2 leading-snug">
                    {insight.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    {insight.summary}
                  </p>

                  <div className="bg-[#020617] border border-[#1e293b] rounded-xl p-3 mb-4 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#F8FAFC] leading-relaxed">
                      <strong className="text-[#fbbf24] font-bold">Key Takeaway: </strong>
                      {insight.keyTakeaway}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#1e293b]">
                  <a
                    href={insight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2dd4bf] hover:underline"
                  >
                    <span>Read complete paper on movahedi.ca</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Canadian Breach & RROSH Evaluator (Dual-panel workbench on desktop) */}
      {selectedTab === 2 && (
        <div className="mb-8">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-2">
              <Calculator className="w-5 h-5 text-[#2dd4bf]" />
              <h3 className="text-base md:text-lg font-black tracking-wide text-[#F8FAFC] uppercase">
                CANADIAN PRIVACY BREACH EVALUATOR (RROSH)
              </h3>
            </div>

            <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-2xl">
              Interactive legal risk assessment based on Movahedi doctrine for PIPEDA Section 10.1 and Quebec Law 25 "Real Risk of Significant Harm" determination.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Parameters (6 cols on desktop) */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-wider block mb-1">
                  Step 1: Breach Characteristics & Impact Factors
                </span>

                {/* Criteria 1: Sensitive Data */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#020617] border border-[#1e293b]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Data Sensitivity Factor</h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      Includes financial details, SIN, health records, passwords, or biometrics.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isSensitiveData}
                      onChange={(e) => setIsSensitiveData(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]" />
                  </label>
                </div>

                {/* Criteria 2: Likelihood of Misuse */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#020617] border border-[#1e293b]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Probability of Misuse</h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      Malicious intent confirmed, extortion demand, or unauthorized exfiltration tunnel.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isLikelyMisuse}
                      onChange={(e) => setIsLikelyMisuse(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]" />
                  </label>
                </div>

                {/* Criteria 3: Encryption Protection */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#020617] border border-[#1e293b]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Strong Cryptographic Protection</h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      Data was AES-256 encrypted at rest and keys were NOT compromised.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={dataEncrypted}
                      onChange={(e) => setDataEncrypted(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]" />
                  </label>
                </div>

                {/* Volume of records */}
                <div className="p-4 rounded-xl bg-[#020617] border border-[#1e293b]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Estimated Affected Volume</h4>
                    <span className="text-xs font-mono font-bold text-[#2dd4bf]">
                      {affectedVolume > 1000 ? '1,000+ individuals' : `${affectedVolume} individuals`}
                    </span>
                  </div>
                  <input
                    aria-label="Affected records volume"
                    type="range"
                    min="1"
                    max="1000"
                    value={affectedVolume}
                    onChange={(e) => setAffectedVolume(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#2dd4bf]"
                  />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono mt-1">
                    <span>1 record</span>
                    <span>500 records</span>
                    <span>1,000+ records</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Determination & Legal Obligations (6 cols on desktop) */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-wider block mb-1">
                  Step 2: Statutory Determination & Obligations
                </span>

                {/* Evaluation Result Box */}
                <div
                  className={`rounded-2xl p-5 border transition-all ${
                    isRroshMet
                      ? 'bg-[#f87171]/10 border-[#f87171]/50 shadow-[0_0_20px_rgba(248,113,113,0.15)]'
                      : 'bg-[#34d399]/10 border-[#34d399]/50 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    {isRroshMet ? (
                      <AlertTriangle className="w-6 h-6 text-[#f87171] shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-[#34d399] shrink-0" />
                    )}
                    <div>
                      <h4
                        className={`text-sm font-black tracking-wider uppercase ${
                          isRroshMet ? 'text-[#f87171]' : 'text-[#34d399]'
                        }`}
                      >
                        {isRroshMet
                          ? 'MANDATORY REGULATOR NOTIFICATION TRIGGERED (RROSH)'
                          : 'INTERNAL BREACH REGISTER LOGGING MANDATED'}
                      </h4>
                      <span className="text-[11px] text-[#94A3B8]">
                        {isRroshMet ? 'PIPEDA s. 10.1 & Quebec Law 25' : 'PIPEDA s. 10.3 (24-Month Retention)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed mb-4">
                    {isRroshMet
                      ? "Under PIPEDA and Quebec Law 25, when a breach creates a Real Risk of Significant Harm (bodily harm, humiliation, damage to reputation or relationships, loss of employment, financial loss, identity theft), you must report to the Office of the Privacy Commissioner of Canada (OPC) or CAI 'as soon as feasible' and directly notify all impacted individuals."
                      : 'While the threshold for mandatory external reporting to the OPC or individuals is not currently met due to encryption or low probability of misuse, organizations MUST record every confidentiality incident in an internal Breach Register and maintain records for at least 24 months.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#1e293b]/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#94A3B8]">OPC Notification Window:</span>
                      <span className="font-mono font-bold text-[#F8FAFC]">
                        {isRroshMet ? 'As Soon As Feasible' : 'Not Required'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94A3B8]">Quebec CAI Notification:</span>
                      <span className="font-mono font-bold text-[#F8FAFC]">
                        {isRroshMet ? 'Prompt Notice Required' : 'Not Required'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94A3B8]">Individual Notifications:</span>
                      <span className="font-mono font-bold text-[#F8FAFC]">
                        {isRroshMet ? 'Mandatory Direct Notice' : 'Optional / Discretionary'}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={MovahediData.DISCOVERY_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                >
                  <span>Request Breach Review from Movahedi.ca</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1E293B] border border-[#2dd4bf]/40 rounded-2xl p-6 text-center shadow-xl">
        <Shield className="w-8 h-8 text-[#2dd4bf] mx-auto mb-2" />
        <h3 className="text-base md:text-lg font-bold text-[#F8FAFC] mb-1">
          Ready to Harden Your Privacy & AI Governance?
        </h3>
        <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed mb-4 max-w-xl mx-auto">
          Connect directly with Mohammad Movahedi at movahedi.ca to discuss customized tabletop crisis exercises, privacy impact assessments (PIAs), or fractional CPO/CISO advisory.
        </p>

        <div className="flex justify-center gap-3">
          <a
            href={MovahediData.WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="advisory_bottom_cta_button"
            className="px-6 py-3 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <span>Explore Advisory at movahedi.ca</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
