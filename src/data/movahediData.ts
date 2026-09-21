import { MovahediService, MovahediInsight } from '../types';

export const MOVAHEDI_CONFIG = {
  CONSULTANT_NAME: 'Mohammad Movahedi',
  CREDENTIALS: 'CIPP/C • Six Sigma Black Belt',
  CURRENT_ROLE: 'Data Protection & Security Specialist',
  SPECIALIZATION: 'Privacy & AI Governance Consultant',
  LOCATION: 'Toronto, Canada',
  WEBSITE_URL: 'https://movahedi.ca',
  SERVICES_URL: 'https://movahedi.ca',
  DISCOVERY_CALL_URL: 'https://movahedi.ca',
};

export const MOVAHEDI_SERVICES: MovahediService[] = [
  {
    id: 'privacy-governance',
    title: 'Privacy & Data Governance',
    subtitle: 'PIPEDA, Quebec Law 25, Bill C-27 & GDPR',
    description:
      'Comprehensive enterprise privacy architectures, mandatory breach assessment (RROSH criteria), Privacy Impact Assessments (PIAs/DPIAs), and cross-border transfer compliance.',
    tags: ['PIPEDA', 'Law 25', 'GDPR', 'DPIA / PIA', 'DSAR Workflows'],
    url: 'https://movahedi.ca',
  },
  {
    id: 'ai-governance',
    title: 'AI Governance & Safety Controls',
    subtitle: 'Responsible AI, AIDA & EU AI Act Readiness',
    description:
      'Operationalizing responsible artificial intelligence frameworks, algorithmic bias audits, AI security platforms, model risk containment, and executive policy creation.',
    tags: ['AIDA Readiness', 'EU AI Act', 'Algorithmic Risk', 'LLM Guardrails'],
    url: 'https://movahedi.ca',
  },
  {
    id: 'incident-readiness',
    title: 'Incident Response & Crisis Tabletop',
    subtitle: 'Executive Tabletop Facilitation & Breach Doctrine',
    description:
      'Tailored tabletop crisis simulations for boards and executive teams. Hardening breach notification playbooks across Canadian, European, and US regulatory disclosure clocks.',
    tags: ['Tabletop Exercises', '72h Notification', 'Forensic Integrity', 'Regulator Briefings'],
    url: 'https://movahedi.ca',
  },
  {
    id: 'process-excellence',
    title: 'Process Excellence for Security & GRC',
    subtitle: 'Lean Six Sigma Applied to Cyber Operations',
    description:
      'Applying Six Sigma Black Belt methodologies to eliminate operational waste, accelerate Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR), and build defensible compliance records.',
    tags: ['Six Sigma Black Belt', 'MTTR Reduction', 'GRC Optimization', 'Root Cause Analysis'],
    url: 'https://movahedi.ca',
  },
  {
    id: 'custom-ai-tools',
    title: 'Custom B2B AI & Data Tools',
    subtitle: 'Privacy-Preserving Analytics & GRC Automation',
    description:
      'Prototyping and deploying specialized intelligence tools: automated data discovery and classification, privacy-preserving analytics, and intelligent compliance reporting.',
    tags: ['GRC Automation', 'Data Classification', 'Privacy Analytics', 'B2B Prototyping'],
    url: 'https://movahedi.ca',
  },
  {
    id: 'fractional-leadership',
    title: 'Fractional Leadership & Strategic Advisory',
    subtitle: 'Interim CPO / CISO Advisory for High-Growth Firms',
    description:
      'Embedded fractional privacy and security leadership for organizations scaling into regulated markets. Board reporting, vendor risk oversight, and audit readiness.',
    tags: ['Fractional CPO', 'Board Advisory', 'Vendor Due Diligence', 'Audit Defense'],
    url: 'https://movahedi.ca',
  },
];

export const MOVAHEDI_INSIGHTS: MovahediInsight[] = [
  {
    id: 'bill-c27-aida',
    title: 'Navigating Bill C-27 and AIDA: High-Impact AI & Privacy Readiness',
    category: 'Canadian Privacy & AI',
    readTimeMinutes: 6,
    keyTakeaway:
      'Organizations must maintain algorithmic risk audits, bias testing logs, and human-oversight fail-safes before deployment.',
    url: 'https://movahedi.ca',
  },
  {
    id: 'rv-bykovets-forensics',
    title: 'R v Bykovets: Constitutional Privacy in IP Addresses and Digital Forensics',
    category: 'Constitutional Law & Forensics',
    readTimeMinutes: 8,
    keyTakeaway:
      'Corporate incident response teams must document clean chain-of-custody without relying on warrantless voluntary law enforcement disclosures.',
    url: 'https://movahedi.ca',
  },
  {
    id: 'ai-security-platforms',
    title: 'Why Enterprise Incident Response Demands AI Security Platforms',
    category: 'AI Security & GRC',
    readTimeMinutes: 5,
    keyTakeaway:
      'Implement runtime guardrails and semantic anomaly inspection to prevent model-mediated exfiltration.',
    url: 'https://movahedi.ca',
  },
  {
    id: 'lean-six-sigma-cyber',
    title: 'Applying Lean Six Sigma to Cut Cybersecurity Incident MTTR',
    category: 'Process Excellence',
    readTimeMinutes: 7,
    keyTakeaway:
      'Standardizing communication handoffs and pre-authorizing containment actions yields up to a 60% drop in response cycle time.',
    url: 'https://movahedi.ca',
  },
];

export const MovahediData = {
  ...MOVAHEDI_CONFIG,
  services: MOVAHEDI_SERVICES,
  insights: MOVAHEDI_INSIGHTS.map((i) => ({
    ...i,
    readTime: `${i.readTimeMinutes} min read`,
    summary: i.keyTakeaway,
  })),
};

