#!/usr/bin/env node
/**
 * Breach Tabletop — 100 security checks.
 *
 * Covers: shipped-bundle secret hygiene, network egress, inline-code risks,
 * source-repo hygiene, scenario/doctrine content safety, and live production
 * security headers on https://movahedi.ca/tabletop/.
 *
 * Usage:
 *   node tests/tabletop-security.mjs
 * Env:
 *   TABLETOP_ROOT   path to the Tabletop-webapp checkout (default: repo root)
 *   TABLETOP_ORIGIN public origin to test (default: https://movahedi.ca)
 *   SKIP_LIVE=1     skip live HTTP checks (offline CI)
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.TABLETOP_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = (process.env.TABLETOP_ORIGIN || 'https://movahedi.ca').replace(/\/$/, '');
const SKIP_LIVE = process.env.SKIP_LIVE === '1';

let pass = 0, fail = 0, skip = 0;
const failures = [];
function check(name, cond, detail = '') {
  if (cond === 'skip') { skip++; return; }
  if (cond) { pass++; }
  else { fail++; failures.push(detail ? `${name} -- ${detail}` : name); }
}
async function get(path) {
  const res = await fetch(ORIGIN + path, { redirect: 'manual' });
  const text = await res.text();
  return { res, text };
}
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const exists = (p) => existsSync(join(ROOT, p));

const SCENARIOS = ['darkhydra-ransomware', 'cloudmatrix-supply-chain', 'lost-laptop-theft', 'misdirected-email-spill', 'cloud-s3-exposure', 'rogue-admin-insider'];
const DOCTRINES = ['gdpr-art-33-34', 'sec-item-105', 'hipaa-breach-rule', 'nist-sp-800-61', 'nydfs-23-nycrr-500', 'pipeda-law25-breach', 'aida-ai-governance'];

// ---------- shipped bundle ----------
const distHtml = join(ROOT, 'dist/index.html');
check('S01 dist/index.html exists', exists('dist/index.html'));
const assetDir = join(ROOT, 'dist/assets');
let jsFiles = [], cssFiles = [];
if (existsSync(assetDir)) {
  jsFiles = readdirSync(assetDir).filter((f) => f.endsWith('.js'));
  cssFiles = readdirSync(assetDir).filter((f) => f.endsWith('.css'));
}
check('S02 exactly one JS bundle ships', jsFiles.length === 1, `found ${jsFiles.length}`);
check('S03 exactly one CSS bundle ships', cssFiles.length === 1, `found ${cssFiles.length}`);
check('S04 no source maps ship', !existsSync(assetDir) || !readdirSync(assetDir).some((f) => f.endsWith('.map')));

const bundle = jsFiles.length ? readFileSync(join(assetDir, jsFiles[0]), 'utf8') : '';
const cssBundle = cssFiles.length ? readFileSync(join(assetDir, cssFiles[0]), 'utf8') : '';
const html = exists('dist/index.html') ? read('dist/index.html') : '';

check('S05 no private key material in bundle', !bundle.includes('BEGIN PRIVATE KEY'));
check('S06 no RSA private key material in bundle', !bundle.includes('BEGIN RSA PRIVATE KEY'));
check('S07 no AWS access key pattern in bundle', !/AKIA[0-9A-Z]{16}/.test(bundle));
check('S08 no GitHub classic token prefix in bundle', !bundle.includes('ghp_'));
check('S09 no GitHub fine-grained token prefix in bundle', !bundle.includes('github_pat_'));
check('S10 no Google API key pattern in bundle', !/AIza[0-9A-Za-z\-_]{35}/.test(bundle));
check('S11 no Slack token prefix in bundle', !bundle.includes('xoxb-'));
check('S12 no MongoDB connection string in bundle', !bundle.includes('mongodb://'));
check('S13 no Postgres connection string in bundle', !bundle.includes('postgres://'));
check('S14 no password assignment in bundle', !/password\s*=\s*['"]/i.test(bundle));
check('S15 no passwd string in bundle', !/passwd/i.test(bundle));
check('S16 no api_key assignment in bundle', !/api[_-]?key\s*[:=]\s*['"][A-Za-z0-9]/i.test(bundle));
check('S17 no client_secret in bundle', !/client_secret/i.test(bundle));
check('S18 no bearer token in bundle', !/bearer\s+[A-Za-z0-9\-_.=]{12,}/i.test(bundle));
check('S19 no document.cookie writes in bundle', !/document\.cookie\s*=/.test(bundle));
const fetchCount = (bundle.match(/fetch\(/g) || []).length;
check('S20 at most one fetch() call in bundle', fetchCount <= 1, `found ${fetchCount}`);
check('S21 the single fetch is the Vite modulepreload polyfill', fetchCount === 0 || bundle.includes('modulepreload'));
check('S22 no XMLHttpRequest in bundle', !bundle.includes('XMLHttpRequest'));
check('S23 no WebSocket constructor in bundle', !bundle.includes('new WebSocket'));
check('S24 no EventSource in bundle', !bundle.includes('new EventSource'));
check('S25 no sendBeacon in bundle', !bundle.includes('sendBeacon'));
check('S26 no eval( in bundle', !/[^a-zA-Z]eval\(/.test(bundle));
check('S27 no new Function( in bundle', !bundle.includes('new Function('));
const httpsUrls = [...new Set([...bundle.matchAll(/https:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g)].map((m) => m[0]))];
const httpsAllow = ['https://github.com/movahedi-ca/Tabletop-webapp', 'https://movahedi.ca', 'https://reactjs.org'];
const httpsBad = httpsUrls.filter((u) => !httpsAllow.some((a) => u.startsWith(a)));
check('S28 every https URL in bundle is allowlisted', httpsBad.length === 0, httpsBad.slice(0, 3).join(', '));
const httpUrls = [...new Set([...bundle.matchAll(/http:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g)].map((m) => m[0]))];
const httpBad = httpUrls.filter((u) => !u.startsWith('http://www.w3.org/') && !u.startsWith('http://www.w3.org/XML/'));
check('S29 every http URL in bundle is a w3.org XML namespace', httpBad.length === 0, httpBad.slice(0, 3).join(', '));
check('S30 no third-party analytics markers in bundle', !/googletagmanager|google-analytics|clarity\.ms|hotjar|segment\.io|mixpanel|amplitude/i.test(bundle));
check('S31 no fonts.googleapis reference in shipped HTML', !html.includes('fonts.googleapis'));
check('S32 no fonts.googleapis reference in shipped CSS', !cssBundle.includes('fonts.googleapis'));
const fontDir = join(ROOT, 'dist/fonts');
const fontFiles = existsSync(fontDir) ? readdirSync(fontDir).filter((f) => f.endsWith('.woff2')) : [];
check('S33 fonts self-hosted (variable woff2 in dist/fonts)', fontFiles.length >= 2, `found ${fontFiles.length}`);
check('S34 @font-face rules present in shipped CSS', (cssBundle.match(/@font-face/g) || []).length >= 2);
check('S35 no geolocation API in bundle', !bundle.includes('geolocation'));
check('S36 no getUserMedia in bundle', !bundle.includes('getUserMedia'));
check('S37 no Notification.requestPermission in bundle', !bundle.includes('Notification.requestPermission'));

// ---------- index.html ----------
check('S38 no inline <script> without src', !/<script(?![^>]*src=)[^>]*>/i.test(html));
check('S39 no inline event handlers', !/\son(click|load|error|mouseover|mouseout|submit|focus|blur|change|keydown)=/i.test(html));
check('S40 no javascript: URLs', !/javascript:/i.test(html));
const scriptSrcs = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
check('S41 all script src are same-origin /tabletop/', scriptSrcs.length > 0 && scriptSrcs.every((s) => s.startsWith('/tabletop/')), scriptSrcs.join(','));
check('S42 stylesheet/font hrefs are self-hosted', !/<link[^>]*rel="stylesheet"[^>]*href="https?:/i.test(html));
check('S43 favicon is same-origin', (() => {
  const m = html.match(/rel="icon"[^>]*href="([^"]+)"/);
  return !!m && !/^(https?:)?\/\//i.test(m[1]);
})());
check('S44 <html lang="en">', /<html[^>]*lang="en"/i.test(html));
check('S45 charset utf-8 declared', /charset="UTF-8"/i.test(html));
check('S46 no iframes', !/<iframe/i.test(html));
check('S47 font preloads present', (html.match(/rel="preload"[^>]*as="font"/g) || []).length >= 2);
check('S48 viewport meta present', /name="viewport"/.test(html));

// ---------- source hygiene ----------
const simCtx = exists('src/context/SimulationContext.tsx') ? read('src/context/SimulationContext.tsx') : '';
const allSrc = (() => {
  // walk src for a few greps
  const out = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(ts|tsx|css)$/.test(f)) out.push(readFileSync(p, 'utf8'));
    }
  };
  if (existsSync(join(ROOT, 'src'))) walk(join(ROOT, 'src'));
  return out.join('\n');
})();
check('S49 no document.cookie in source', !allSrc.includes('document.cookie'));
check('S50 no sessionStorage in source', !allSrc.includes('sessionStorage'));
check('S51 localStorage key is the namespaced drill-records key', simCtx.includes("STORAGE_KEY = 'breach_tabletop_records'"));
check('S52 localStorage only touched in SimulationContext', (() => {
  const hits = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(f) && readFileSync(p, 'utf8').includes('localStorage')) hits.push(f);
    }
  };
  if (existsSync(join(ROOT, 'src'))) walk(join(ROOT, 'src'));
  return hits.length === 1 && hits[0] === 'SimulationContext.tsx';
})());
const repoFiles = (() => {
  const out = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      if (f === 'node_modules' || f === '.git') continue;
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else out.push(p);
    }
  };
  walk(ROOT);
  return out;
})();
const base = (p) => p.split('/').pop();
check('S53 no .env files in repo', !repoFiles.some((p) => base(p).startsWith('.env')));
check('S54 no .pem files in repo', !repoFiles.some((p) => p.endsWith('.pem')));
check('S55 no SSH private keys in repo', !repoFiles.some((p) => /id_rsa$|id_ed25519$/.test(p)));
const gitignore = exists('.gitignore') ? read('.gitignore') : '';
check('S56 .gitignore covers node_modules', gitignore.includes('node_modules'));
check('S57 .gitignore covers dist', /(^|\n)dist\/?(\n|$)/.test(gitignore));
check('S58 .gitignore covers .env', gitignore.includes('.env'));
const pkg = exists('package.json') ? JSON.parse(read('package.json')) : {};
const scripts = JSON.stringify(pkg.scripts || {});
check('S59 no install-time scripts in package.json', !/postinstall|preinstall|prepare/.test(scripts), scripts.slice(0, 120));
check('S60 LICENSE exists', exists('LICENSE'));
check('S61 README exists', exists('README.md'));
check('S62 README documents the no-secrets posture', exists('README.md') && /no API keys/i.test(read('README.md')));

// ---------- scenario / doctrine content safety ----------
const scenariosSrc = exists('src/data/scenariosData.ts') ? read('src/data/scenariosData.ts') : '';
const doctrineSrc = exists('src/data/doctrineData.ts') ? read('src/data/doctrineData.ts') : '';
const splitScenario = (id) => {
  const i = scenariosSrc.indexOf(`id: '${id}'`);
  if (i < 0) return '';
  const next = scenariosSrc.indexOf("id: '", i + 10);
  return scenariosSrc.slice(i, next < 0 ? undefined : next);
};
SCENARIOS.forEach((id, n) => {
  const chunk = splitScenario(id);
  check(`S${63 + n} scenario ${id}: briefing has no URLs`, chunk.length > 0 && !/https?:\/\//.test(chunk));
});
SCENARIOS.forEach((id, n) => {
  const chunk = splitScenario(id);
  check(`S${69 + n} scenario ${id}: no credential patterns`, chunk.length > 0 && !/password\s*=\s*['"]|api[_-]?key\s*[:=]\s*['"]|client_secret|bearer\s+[A-Za-z0-9]{12,}/i.test(chunk));
});
const splitDoctrine = (id) => {
  const i = doctrineSrc.indexOf(`id: '${id}'`);
  if (i < 0) return '';
  const next = doctrineSrc.indexOf("id: '", i + 10);
  return doctrineSrc.slice(i, next < 0 ? undefined : next);
};
DOCTRINES.forEach((id, n) => {
  const chunk = splitDoctrine(id);
  check(`S${75 + n} doctrine ${id}: no javascript: URLs`, chunk.length > 0 && !/javascript:/i.test(chunk));
});
DOCTRINES.forEach((id, n) => {
  const chunk = splitDoctrine(id);
  check(`S${82 + n} doctrine ${id}: no non-TLS http:// URLs`, chunk.length > 0 && !/http:\/\/(?!www\.w3\.org)/.test(chunk));
});

// ---------- live production ----------
if (!SKIP_LIVE) {
  const { res, text } = await get('/tabletop/');
  const h = (n) => res.headers.get(n);
  check('S89 GET /tabletop/ returns 200', res.status === 200, `got ${res.status}`);
  check('S90 content-type is text/html', (h('content-type') || '').includes('text/html'));
  const csp = h('content-security-policy') || '';
  check('S91 Content-Security-Policy header present', csp.length > 0);
  check('S92 CSP includes default-src self', csp.includes("default-src 'self'"));
  check('S93 X-Frame-Options is DENY', (h('x-frame-options') || '').toUpperCase() === 'DENY');
  check('S94 X-Content-Type-Options is nosniff', (h('x-content-type-options') || '').toLowerCase() === 'nosniff');
  check('S95 Strict-Transport-Security present', !!h('strict-transport-security'));
  check('S96 Referrer-Policy present', !!h('referrer-policy'));
  check('S97 Permissions-Policy present', !!h('permissions-policy'));
  check('S98 no Set-Cookie on /tabletop/', !res.headers.has('set-cookie'));
  // Asset URLs come from the LIVE html so the check validates production self-consistency.
  const liveJs = (text.match(/<script[^>]*src="([^"]+)"/g) || []).map((m) => m.match(/src="([^"]+)"/)[1]).filter((s) => s.startsWith('/tabletop/'));
  const liveCss = (text.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g) || []).map((m) => m.match(/href="([^"]+)"/)[1]).filter((s) => s.startsWith('/tabletop/'));
  const jsRes = liveJs.length ? await get(liveJs[0]) : { res: { status: 0, headers: new Headers() } };
  check('S99 JS asset 200 as application/javascript', jsRes.res.status === 200 && (jsRes.res.headers.get('content-type') || '').includes('javascript'), `${jsRes.res.status} ${liveJs[0] || 'none'}`);
  const cssRes = liveCss.length ? await get(liveCss[0]) : { res: { status: 0, headers: new Headers() } };
  check('S100 CSS asset 200 as text/css', cssRes.res.status === 200 && (cssRes.res.headers.get('content-type') || '').includes('text/css'), `${cssRes.res.status} ${liveCss[0] || 'none'}`);
} else {
  for (let i = 89; i <= 100; i++) check(`S${i} (live check skipped)`, 'skip');
}

const total = pass + fail + skip;
console.log(`\nsecurity: ${pass}/${total} passed, ${fail} failed, ${skip} skipped`);
if (failures.length) { console.log('FAILURES:'); failures.forEach((f) => console.log(' - ' + f)); }
if (total !== 100) { console.log(`ERROR: ${total} checks, need exactly 100`); process.exit(1); }
process.exit(fail ? 1 : 0);
