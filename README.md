# Breach Tabletop — Web App

An interactive cybersecurity incident-response simulator. Run realistic breach tabletop drills in the browser: weigh multi-phase decisions under time pressure, watch cost, trust, legal risk and forensic integrity move in real time, then get a graded after-action report.

**Play it live:** https://movahedi.ca/tabletop/
**About the tool:** https://movahedi.ca/tools/tabletop

Part of the [movahedi.ca](https://movahedi.ca) free privacy and security toolkit by Mohammad Movahedi.

## Scenarios

- `OP_BLACKOUT` — double-extortion ransomware and dark-web leaks
- `OP_POISON_PILL` — CI/CD pipeline poisoning and supply-chain compromise
- `OP_VELVET_SHADOW` — unencrypted executive laptop theft during M&A
- `OP_REPLY_ALL` — customer financial PII spill and regulator notification
- `OP_OPEN_VAULT` — misconfigured cloud storage bucket exposure
- `OP_INSIDE_JOB` — insider sabotage and logic bomb

## Features

- **War-room command center** — readiness metrics, drill history, quick access to playbooks
- **Dynamic decision injects** — multi-phase dilemmas with breaking-news alerts and competing stakeholder advice (CISO, Legal, CFO, CTO, IR lead)
- **Live crisis telemetry** — incident cost, elapsed time, public trust, legal liability tier, forensic chain of custody
- **Statutory doctrine playbooks** — SEC Form 8-K Item 1.05, GDPR Articles 33/34, NYDFS 23 NYCRR 500, HIPAA, NIST SP 800-61 Rev. 2, plus PIPEDA / Quebec Law 25 and AI-incident guidance, each deep-linked into the movahedi.ca glossary
- **After-action reports** — letter grades, competency breakdown, executive summary, lessons learned
- **Deep links** — every screen has a hash URL (`#/scenario/<id>`, `#/doctrine/<id>`, …) so the site can link straight into a scenario briefing
- **Fully client-side** — no backend, no API keys, no tracking; drill history stays in the browser's localStorage

## Tech

React 18 + TypeScript + Vite + Tailwind CSS v4. The UI follows the movahedi.ca design tokens (navy/teal, Inter + Playfair Display) and ships with movahedi.ca site chrome.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs to dist/ with base path /tabletop/
```

The production build is deployed as static files under `movahedi.ca/tabletop/`.

## Related

- [breach-simulator](https://github.com/movahedi-ca/breach-simulator) — the native Android (Kotlin/Jetpack Compose) sibling of this simulator

## License

MIT — see [LICENSE](LICENSE).
