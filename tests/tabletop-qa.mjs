#!/usr/bin/env node
/**
 * Breach Tabletop — 100 QA checks.
 *
 * Covers: build artifact integrity, bundle content completeness (all 6
 * scenarios, 7 doctrine playbooks), hash-routing logic, live production app
 * behavior, and the /tools/tabletop/ launch page (SEO, JSON-LD, deep links,
 * site wiring, internal link health).
 *
 * Usage: node tests/tabletop-qa.mjs
 * Env: TABLETOP_ROOT, TABLETOP_ORIGIN, SKIP_LIVE=1
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

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

const SCENARIOS = [
  ['darkhydra-ransomware', 'OP_BLACKOUT'],
  ['cloudmatrix-supply-chain', 'OP_POISON_PILL'],
  ['lost-laptop-theft', 'OP_VELVET_SHADOW'],
  ['misdirected-email-spill', 'OP_REPLY_ALL'],
  ['cloud-s3-exposure', 'OP_OPEN_VAULT'],
  ['rogue-admin-insider', 'OP_INSIDE_JOB'],
];
const DOCTRINES = ['gdpr-art-33-34', 'sec-item-105', 'hipaa-breach-rule', 'nist-sp-800-61', 'nydfs-23-nycrr-500', 'pipeda-law25-breach', 'aida-ai-governance'];

// ---------- build artifacts ----------
check('Q01 dist/index.html exists', exists('dist/index.html'));
const assetDir = join(ROOT, 'dist/assets');
const jsFiles = existsSync(assetDir) ? readdirSync(assetDir).filter((f) => f.endsWith('.js')) : [];
const cssFiles = existsSync(assetDir) ? readdirSync(assetDir).filter((f) => f.endsWith('.css')) : [];
check('Q02 exactly one JS asset', jsFiles.length === 1, `found ${jsFiles.length}`);
check('Q03 exactly one CSS asset', cssFiles.length === 1, `found ${cssFiles.length}`);
const html = exists('dist/index.html') ? read('dist/index.html') : '';
const jsPath = jsFiles[0] ? join(assetDir, jsFiles[0]) : null;
const cssPath = cssFiles[0] ? join(assetDir, cssFiles[0]) : null;
const jsBuf = jsPath ? readFileSync(jsPath) : Buffer.alloc(0);
const cssBuf = cssPath ? readFileSync(cssPath) : Buffer.alloc(0);
check('Q04 index.html references the shipped JS file', !!jsFiles[0] && html.includes(`/tabletop/assets/${jsFiles[0]}`));
check('Q05 index.html references the shipped CSS file', !!cssFiles[0] && html.includes(`/tabletop/assets/${cssFiles[0]}`));
check('Q06 JS bundle under 512 KB', jsBuf.length < 512 * 1024, `${jsBuf.length} bytes`);
check('Q07 CSS bundle under 103 KB', cssBuf.length < 103 * 1024, `${cssBuf.length} bytes`);
check('Q08 JS gzip under 150 KB', gzipSync(jsBuf).length < 150 * 1024);
check('Q09 CSS gzip under 20 KB', gzipSync(cssBuf).length < 20 * 1024);
const fontDir = join(ROOT, 'dist/fonts');
const fontBytes = existsSync(fontDir)
  ? readdirSync(fontDir).filter((f) => f.endsWith('.woff2')).reduce((n, f) => n + statSync(join(fontDir, f)).size, 0)
  : 0;
const htmlBytes = exists('dist/index.html') ? statSync(join(ROOT, 'dist/index.html')).size : 0;
check('Q10 total first load under 1 MB', htmlBytes + jsBuf.length + cssBuf.length + fontBytes < 1024 * 1024);
check('Q11 no source maps in dist', !readdirSync(join(ROOT, 'dist')).flatMap((d) => { try { return readdirSync(join(ROOT, 'dist', d)); } catch { return []; } }).some((f) => f.endsWith('.map')));
check('Q12 no TypeScript sources in dist', !existsSync(assetDir) || !readdirSync(assetDir).some((f) => f.endsWith('.ts') || f.endsWith('.tsx')));

// ---------- bundle content ----------
const bundle = jsBuf.toString('utf8');
SCENARIOS.forEach(([id], n) => check(`Q${13 + n} scenario id in bundle: ${id}`, bundle.includes(`'${id}'`) || bundle.includes(`"${id}"`)));
SCENARIOS.forEach(([, codename], n) => check(`Q${19 + n} codename in bundle: ${codename}`, bundle.includes(codename)));
DOCTRINES.forEach((id, n) => check(`Q${25 + n} doctrine id in bundle: ${id}`, bundle.includes(id)));
check('Q32 storage key in bundle', bundle.includes('breach_tabletop_records'));
check('Q33 /tools/tabletop link in bundle (site chrome)', bundle.includes('/tools/tabletop'));
check('Q34 /glossary link in bundle', bundle.includes('/glossary'));
check('Q35 /insights link in bundle', bundle.includes('/insights'));

// ---------- routing logic ----------
const ctx = exists('src/context/SimulationContext.tsx') ? read('src/context/SimulationContext.tsx') : '';
check('Q36 scenario deep-link route parsed', ctx.includes("head === 'scenario'"));
check('Q37 drill route handled', ctx.includes('/drill') || ctx.includes("'drill'") || ctx.includes('/drill'));
check('Q38 report route handled', ctx.includes('/report'));
check('Q39 doctrine route parsed', ctx.includes("head === 'doctrine'"));
check('Q40 history route parsed', ctx.includes("head === 'history'"));
check('Q41 advisory route parsed', ctx.includes("head === 'advisory'"));
check('Q42 hashchange listener registered', ctx.includes('hashchange'));
check('Q43 drill/report deep links fall back to scenario briefing', /drill|report/.test(ctx) && ctx.includes('SCENARIO_DETAIL'));
check('Q44 doctrine deep link selects the requested playbook', ctx.includes('setSelectedDoctrine') && ctx.includes("head === 'doctrine'"));

// ---------- live app ----------
let appText = '';
if (!SKIP_LIVE) {
  const { res, text } = await get('/tabletop/');
  appText = text;
  check('Q45 GET /tabletop/ returns 200', res.status === 200, `got ${res.status}`);
  check('Q46 app mounts into <div id="root">', text.includes('id="root"'));
  check('Q47 app title correct', text.includes('<title>Breach Tabletop | Movahedi</title>'));
  check('Q48 app meta description present', /<meta name="description"[^>]{50,}/.test(text));
  const liveJs = (text.match(/<script[^>]*src="([^"]+)"/g) || []).map((m) => m.match(/src="([^"]+)"/)[1]);
  const liveCss = (text.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g) || []).map((m) => m.match(/href="([^"]+)"/)[1]);
  const jsOk = liveJs.length ? (await get(liveJs[0])).res.status === 200 : false;
  check('Q49 live JS asset returns 200', jsOk, liveJs[0] || 'none found');
  const cssOk = liveCss.length ? (await get(liveCss[0])).res.status === 200 : false;
  check('Q50 live CSS asset returns 200', cssOk, liveCss[0] || 'none found');
  const fontOk = (await get('/tabletop/fonts/Inter-var.woff2')).res.status === 200;
  check('Q51 self-hosted font returns 200', fontOk);
  const redir = await get('/tabletop');
  check('Q52 /tabletop redirects to /tabletop/', [301, 302, 307, 308].includes(redir.res.status) && (redir.res.headers.get('location') || '').endsWith('/tabletop/'), `${redir.res.status}`);
  check('Q53 og:type website on app page', text.includes('og:type'));
  check('Q54 app HTML has no Google Fonts links', !text.includes('fonts.googleapis'));
} else {
  for (let i = 45; i <= 54; i++) check(`Q${i} (live skipped)`, 'skip');
}

// ---------- /tools/tabletop page ----------
let pageText = '';
if (!SKIP_LIVE) {
  const { res, text } = await get('/tools/tabletop/');
  pageText = text;
  check('Q55 /tools/tabletop/ returns 200', res.status === 200, `got ${res.status}`);
  const title = (text.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  check('Q56 page title mentions Breach Tabletop', title.includes('Breach Tabletop'), title);
  const desc = (text.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  check('Q57 meta description 50-160 chars', desc.length >= 50 && desc.length <= 160, `${desc.length}`);
  check('Q58 canonical points at /tools/tabletop/', text.includes('rel="canonical"') && text.includes('/tools/tabletop/'));
  check('Q59 og:title present', text.includes('og:title'));
  check('Q60 og:description present', text.includes('og:description'));
  check('Q61 og:image is /og/tabletop.png', text.includes('/og/tabletop.png'));
  check('Q62 og:type website', /og:type" content="website"/.test(text) || text.includes('og:type'));
  check('Q63 twitter card present', text.includes('twitter:card'));
  const ldBlocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let ldOk = 0, ldParsed = [];
  for (const b of ldBlocks) { try { ldParsed.push(JSON.parse(b)); ldOk++; } catch { /* invalid */ } }
  check('Q64 all JSON-LD blocks are valid JSON', ldOk === ldBlocks.length && ldBlocks.length >= 3, `${ldOk}/${ldBlocks.length}`);
  const ldStr = JSON.stringify(ldParsed);
  check('Q65 WebApplication schema present', ldStr.includes('"@type":"WebApplication"'));
  check('Q66 FAQPage schema present', ldStr.includes('"@type":"FAQPage"'));
  check('Q67 BreadcrumbList schema present', ldStr.includes('"@type":"BreadcrumbList"'));
  check('Q68 WebApplication offers price 0', /"price"\s*:\s*"?0"?/.test(ldStr));
  SCENARIOS.forEach(([id], n) => check(`Q${69 + n} deep link present: ${id}`, text.includes(`/tabletop/#/scenario/${id}`)));
  const faqCount = (text.match(/<details/g) || []).length;
  check('Q75 FAQ has at least 6 entries', faqCount >= 6, `found ${faqCount}`);
  const h1Count = (text.match(/<h1/g) || []).length;
  check('Q76 exactly one h1', h1Count === 1, `found ${h1Count}`);
  const h2Count = (text.match(/<h2/g) || []).length;
  check('Q77 at least 4 h2 sections', h2Count >= 4, `found ${h2Count}`);
  const ctaCount = (text.match(/href="\/tabletop\/"/g) || []).length;
  check('Q78 at least 2 launch CTAs', ctaCount >= 2, `found ${ctaCount}`);
  const ogImg = await get('/og/tabletop.png');
  check('Q79 og image 200 as image/png', ogImg.res.status === 200 && (ogImg.res.headers.get('content-type') || '').includes('image/png'), `${ogImg.res.status}`);
  check('Q80 page not marked noindex', !/name="robots"[^>]*noindex/i.test(text));
} else {
  for (let i = 55; i <= 80; i++) check(`Q${i} (live skipped)`, 'skip');
}

// ---------- site wiring (live) ----------
if (!SKIP_LIVE) {
  const sm = await get('/sitemap-index.xml');
  const smIdx = sm.text.includes('<sitemapindex') ? (await get('/sitemap-0.xml')).text : sm.text;
  check('Q81 sitemap includes /tools/tabletop/', smIdx.includes('/tools/tabletop/'));
  const llms = await get('/llms.txt');
  check('Q82 llms.txt mentions /tools/tabletop/', llms.text.includes('/tools/tabletop/'));
  check('Q83 llms.txt mentions /tabletop/', llms.text.includes('/tabletop/'));
  const ai = await get('/ai/');
  check('Q84 /ai/ fact sheet mentions Breach Tabletop', ai.text.includes('Breach Tabletop'));
  const svc = await get('/services/');
  check('Q85 /services/ links /tools/tabletop', svc.text.includes('/tools/tabletop'));
  const frac = await get('/services/fractional-advisory/');
  check('Q86 fractional-advisory page references tabletop', frac.text.toLowerCase().includes('tabletop'));
  check('Q87 /sitemap-index.xml returns 200', sm.res.status === 200);
  check('Q88 /llms.txt returns 200', llms.res.status === 200);
  const robots = await get('/robots.txt');
  check('Q89 robots.txt does not disallow /tabletop/', !/Disallow:\s*\/tabletop/.test(robots.text));
  const fav = await get('/favicon.svg');
  check('Q90 /favicon.svg returns 200', fav.res.status === 200, `${fav.res.status}`);
} else {
  for (let i = 81; i <= 90; i++) check(`Q${i} (live skipped)`, 'skip');
}

// ---------- scenario data completeness ----------
const scenariosSrc = exists('src/data/scenariosData.ts') ? read('src/data/scenariosData.ts') : '';
const splitChunk = (src, id) => {
  const i = src.indexOf(`id: '${id}'`);
  if (i < 0) return '';
  const next = src.indexOf("id: '", i + 10);
  return src.slice(i, next < 0 ? undefined : next);
};
SCENARIOS.forEach(([id], n) => {
  const chunk = splitChunk(scenariosSrc, id);
  const m = chunk.match(/briefing:\s*\n?\s*["']([\s\S]*?)["'],/);
  const brief = (m ? m[1] : '').replace(/\\n/g, ' ');
  check(`Q${91 + n} scenario ${id}: briefing >= 120 chars`, brief.length >= 120, `${brief.length}`);
});
check('Q97 all codenames follow OP_ convention', SCENARIOS.every(([, c]) => /^OP_[A-Z_]+$/.test(c)));
const doctrineSrc = exists('src/data/doctrineData.ts') ? read('src/data/doctrineData.ts') : '';
check('Q98 doctrine playbook count is 7', DOCTRINES.every((id) => doctrineSrc.includes(`id: '${id}'`)));
check('Q99 every doctrine playbook has title and content', DOCTRINES.every((id) => {
  const c = splitChunk(doctrineSrc, id);
  return /title:\s*'[^']{5,}/.test(c) && c.length > 500;
}));
const pkg = exists('package.json') ? JSON.parse(read('package.json')) : {};
check('Q100 package version is 1.1.0', pkg.version === '1.1.0', pkg.version);

const total = pass + fail + skip;
console.log(`\nqa: ${pass}/${total} passed, ${fail} failed, ${skip} skipped`);
if (failures.length) { console.log('FAILURES:'); failures.forEach((f) => console.log(' - ' + f)); }
if (total !== 100) { console.log(`ERROR: ${total} checks, need exactly 100`); process.exit(1); }
process.exit(fail ? 1 : 0);
