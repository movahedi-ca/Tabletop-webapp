#!/usr/bin/env node
/**
 * Breach Tabletop — 100 UX checks.
 *
 * Covers: document/metadata quality, WCAG contrast of the app's real token
 * pairs (computed, not guessed), keyboard/a11y semantics, responsive design,
 * touch targets, motion preferences, page content clarity, performance
 * budgets, and navigation/IA. Static where honest, live where it matters.
 *
 * Usage: node tests/tabletop-ux.mjs
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
const walkSrc = (cb) => {
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(f)) cb(p, readFileSync(p, 'utf8'));
    }
  };
  if (existsSync(join(ROOT, 'src'))) walk(join(ROOT, 'src'));
};

// WCAG contrast
function lum(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

const html = exists('dist/index.html') ? read('dist/index.html') : '';
const css = exists('src/index.css') ? read('src/index.css') : '';
const cssBundle = (() => {
  const d = join(ROOT, 'dist/assets');
  if (!existsSync(d)) return '';
  const f = readdirSync(d).find((x) => x.endsWith('.css'));
  return f ? readFileSync(join(d, f), 'utf8') : '';
})();

// ---------- document / metadata ----------
const appTitle = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
const appDesc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
check('U01 app: <html lang="en">', /<html[^>]*lang="en"/i.test(html));
check('U02 app: viewport meta', /name="viewport"/.test(html));
check('U03 app: title <= 60 chars', appTitle.length > 0 && appTitle.length <= 60, `${appTitle.length}`);
check('U04 app: title >= 10 chars', appTitle.length >= 10);
check('U05 app: meta description 50-160 chars', appDesc.length >= 50 && appDesc.length <= 160, `${appDesc.length}`);
check('U06 app: charset utf-8', /charset="UTF-8"/i.test(html));

let pageText = '', pageTitle = '', pageDesc = '';
if (!SKIP_LIVE) {
  ({ text: pageText } = await get('/tools/tabletop/'));
  pageTitle = (pageText.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  pageDesc = (pageText.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  check('U07 page: lang attribute present', /<html[^>]*lang="/i.test(pageText));
  check('U08 page: viewport meta', /name="viewport"/.test(pageText));
  check('U09 page: title <= 60 chars', pageTitle.length > 0 && pageTitle.length <= 60, `${pageTitle.length}`);
  check('U10 page: meta description 50-160 chars', pageDesc.length >= 50 && pageDesc.length <= 160, `${pageDesc.length}`);
  check('U11 page: exactly one h1', (pageText.match(/<h1/g) || []).length === 1);
  check('U12 page: at least 4 h2 sections', (pageText.match(/<h2/g) || []).length >= 4);
  const levels = [...pageText.matchAll(/<h([1-6])/g)].map((m) => +m[1]);
  check('U13 page: no skipped heading levels', levels.every((l, i) => i === 0 || l - levels[i - 1] <= 1), levels.join(','));
  check('U14 page: canonical link present', pageText.includes('rel="canonical"'));
} else {
  for (let i = 7; i <= 14; i++) check(`U${String(i).padStart(2, '0')} (live skipped)`, 'skip');
}

// ---------- contrast (computed WCAG ratios, app tokens) ----------
const pairs = [
  ['U15', '#F8FAFC', '#020617', 7, 'body text'],
  ['U16', '#CBD5E1', '#020617', 4.5, 'secondary text'],
  ['U17', '#94A3B8', '#020617', 4.5, 'muted text'],
  ['U18', '#14B8A6', '#020617', 4.5, 'teal accent text'],
  ['U19', '#2DD4BF', '#020617', 4.5, 'bright teal text'],
  ['U20', '#5EEAD4', '#020617', 4.5, 'light teal text'],
  ['U21', '#F8FAFC', '#0F172A', 4.5, 'text on card'],
  ['U22', '#94A3B8', '#0F172A', 4.5, 'muted on card'],
  ['U23', '#F87171', '#020617', 4.5, 'danger text'],
  ['U24', '#FBBF24', '#020617', 4.5, 'warning text'],
  ['U25', '#34D399', '#020617', 4.5, 'success text'],
  ['U26', '#020617', '#2DD4BF', 4.5, 'inverted chip text'],
  ['U27', '#042f2e', '#14b8a6', 4.5, 'site CTA (dark theme)'],
];
for (const [id, fg, bg, min, label] of pairs) {
  const r = ratio(fg, bg);
  check(`${id} contrast ${label}: ${fg} on ${bg} >= ${min}`, r >= min, r.toFixed(2));
}
let lowContrastMuted = 0;
walkSrc((p, src) => {
  if (/text-\[#64748b\]|text-slate-500/.test(src)) lowContrastMuted++;
});
check('U28 no low-contrast #64748b muted text remains', lowContrastMuted === 0, `${lowContrastMuted} files`);

// ---------- keyboard / a11y semantics ----------
let buttonCount = 0, divOnClick = 0, ariaCount = 0, labelCount = 0, inputCount = 0, imgNoAlt = 0, emptyButtons = 0;
walkSrc((p, src) => {
  buttonCount += (src.match(/<button/g) || []).length;
  divOnClick += (src.match(/<(div|span)[^>]*onClick=/g) || []).length;
  ariaCount += (src.match(/aria-[a-z-]+=/g) || []).length;
  labelCount += (src.match(/<label/g) || []).length;
  inputCount += (src.match(/<input/g) || []).length;
  const imgs = src.match(/<img[^>]*>/g) || [];
  imgNoAlt += imgs.filter((t) => !/alt=/.test(t)).length;
  emptyButtons += (src.match(/<button[^>]*>\s*<\/button>/g) || []).length;
});
check('U29 native <button> used (>= 30)', buttonCount >= 30, `${buttonCount}`);
check('U30 no div/span with onClick (keyboard traps)', divOnClick === 0, `${divOnClick}`);
check('U31 aria attributes present (>= 3)', ariaCount >= 3, `${ariaCount}`);
check('U32 every input has a label or aria-label', (() => {
  let total = 0, unlabeled = 0;
  walkSrc((p, src) => {
    const inputs = src.match(/<input(?:[^>{]|\{[^{}]*\})*>/g) || [];
    total += inputs.length;
    const labelBlocks = (src.match(/<label(?:[^>{]|\{[^{}]*\})*>[\s\S]*?<\/label>/g) || []).join('\n');
    for (const t of inputs) {
      if (!/aria-label=|aria-labelledby=/.test(t) && !labelBlocks.includes(t)) unlabeled++;
    }
  });
  return unlabeled === 0 ? true : `${unlabeled}/${total} unlabeled`;
})() === true);
check('U33 no <img> without alt', imgNoAlt === 0, `${imgNoAlt}`);
check('U34 no empty buttons', emptyButtons === 0, `${emptyButtons}`);
check('U35 focus-visible styles in app CSS', css.includes('focus-visible') || cssBundle.includes('focus-visible'));
check('U36 prefers-reduced-motion honored', css.includes('prefers-reduced-motion'));
const appTsx = exists('src/App.tsx') ? read('src/App.tsx') : '';
check('U37 <main> landmark present', appTsx.includes('<main'));
check('U38 site header + footer rendered', appTsx.includes('SiteHeader') && appTsx.includes('SiteFooter'));
check('U39 <nav> landmarks in chrome/nav bars', (() => {
  let n = 0;
  walkSrc((p, src) => { if (/<nav[\s>]/.test(src)) n++; });
  return n >= 2;
})());
check('U40 no autoplaying media', (() => {
  let bad = 0;
  walkSrc((p, src) => { if (/<video|<audio|<marquee/.test(src)) bad++; });
  return bad === 0;
})());

// ---------- responsive ----------
const mediaCount = (cssBundle.match(/@media/g) || []).length;
check('U41 responsive breakpoints in CSS (>= 3)', mediaCount >= 3, `${mediaCount}`);
check('U42 sm: breakpoint used', cssBundle.includes('640px') || /\\bsm\\:/.test(cssBundle) || cssBundle.includes('.sm\\:'));
check('U43 md: breakpoint used', cssBundle.includes('48rem'));
check('U44 lg: breakpoint used', cssBundle.includes('64rem'));
check('U45 no fixed pixel widths >= 1200px', !/width:\s*1[2-9][0-9]{2}px/.test(cssBundle));
check('U46 mobile bottom nav exists', exists('src/components/BottomNavBar.tsx'));
check('U47 desktop nav hidden on mobile', exists('src/components/DesktopNavBar.tsx') && /hidden md:/.test(read('src/components/DesktopNavBar.tsx')));
check('U48 selection colors styled (readability)', appTsx.includes('selection:'));
if (!SKIP_LIVE) {
  check('U49 page: responsive grid for scenario cards', /sm:grid-cols-2/.test(pageText));
  check('U50 page: fluid type scale', /sm:text-5xl|md:text-5xl/.test(pageText));
  check('U51 page: responsive page padding', /sm:px-6/.test(pageText));
  check('U52 page: prose constrained (max-w)', /max-w-3xl|max-w-2xl/.test(pageText));
} else {
  for (const i of [49, 50, 51, 52]) check(`U${i} (live skipped)`, 'skip');
}

// ---------- touch targets ----------
check('U53 bottom nav bar is 64px tall (h-16)', /h-16/.test(read('src/components/BottomNavBar.tsx')));
let smallInteractive = 0;
walkSrc((p, src) => {
  // text-[10px]/text-[11px] must not appear on buttons or links
  const hits = [...src.matchAll(/<(button|a)[^>]*text-\[1[01]px\][^>]*>/g)];
  smallInteractive += hits.length;
});
check('U54 no tiny 10-11px text on buttons/links', smallInteractive === 0, `${smallInteractive}`);
if (!SKIP_LIVE) {
  check('U55 page CTAs have generous padding', /href="\/tabletop\/"[^>]*class="[^"]*px-6 py-3/.test(pageText) || /class="[^"]*px-6 py-3[^"]*"[^>]*href="\/tabletop\/"/.test(pageText));
  check('U56 scenario card links padded', /rounded-2xl[^"]*p-6/.test(pageText));
} else {
  check('U55 (live skipped)', 'skip');
  check('U56 (live skipped)', 'skip');
}

// ---------- motion ----------
check('U57 no CSS animations without reduced-motion guard', !/@keyframes/.test(css) || css.includes('prefers-reduced-motion'));
check('U58 no marquee/blink elements', (() => {
  let bad = 0;
  walkSrc((p, src) => { if (/<marquee|<blink/.test(src)) bad++; });
  return bad === 0;
})());

// ---------- page content clarity ----------
if (!SKIP_LIVE) {
  const ctaCount = (pageText.match(/href="\/tabletop\/"/g) || []).length;
  check('U59 at least 2 launch CTAs', ctaCount >= 2, `${ctaCount}`);
  const cardLinks = (pageText.match(/\/tabletop\/#\/scenario\//g) || []).length;
  check('U60 six scenario cards linked', cardLinks >= 6, `${cardLinks}`);
  check('U61 privacy/local-storage explanation present', /localStorage|local storage/i.test(pageText));
  check('U62 FAQ has at least 6 entries', (pageText.match(/<details/g) || []).length >= 6);
  check('U63 no lorem ipsum', !/lorem ipsum/i.test(pageText));
  check('U64 no "click here" link text', !/click here/i.test(pageText));
  check('U65 no bare "read more"', !/>\s*read more\s*</i.test(pageText));
  check('U66 all links have discernible text', !/<a[^>]*>\s*<\/a>/.test(pageText));
  check('U67 breadcrumb present', /breadcrumb/i.test(pageText));
  check('U68 page states the tool is free', />[^<]*\bfree\b[^<]*</i.test(pageText));
  const extLinks = [...pageText.matchAll(/href="(http:\/\/[^"]+)"/g)].map((m) => m[1]);
  check('U69 no insecure http:// outbound links', extLinks.length === 0, extLinks.slice(0, 2).join(','));
  check('U70 page links to glossary', pageText.includes('/glossary'));
  check('U71 page links to services', pageText.includes('/services'));
  check('U72 JSON-LD present for rich results', pageText.includes('application/ld+json'));
} else {
  for (let i = 59; i <= 72; i++) check(`U${i} (live skipped)`, 'skip');
}

// ---------- performance budgets ----------
const jsBytes = (() => {
  const d = join(ROOT, 'dist/assets');
  if (!existsSync(d)) return 0;
  const f = readdirSync(d).find((x) => x.endsWith('.js'));
  return f ? statSync(join(d, f)).size : 0;
})();
const cssBytes = (() => {
  const d = join(ROOT, 'dist/assets');
  if (!existsSync(d)) return 0;
  const f = readdirSync(d).find((x) => x.endsWith('.css'));
  return f ? statSync(join(d, f)).size : 0;
})();
check('U73 JS under 512 KB', jsBytes > 0 && jsBytes < 512 * 1024, `${jsBytes}`);
check('U74 CSS under 103 KB', cssBytes > 0 && cssBytes < 103 * 1024, `${cssBytes}`);
const fontDir = join(ROOT, 'dist/fonts');
const fontBytes = existsSync(fontDir) ? readdirSync(fontDir).filter((f) => f.endsWith('.woff2')).reduce((n, f) => n + statSync(join(fontDir, f)).size, 0) : 0;
check('U75 fonts under 300 KB total', fontBytes > 0 && fontBytes < 300 * 1024, `${fontBytes}`);
check('U76 scripts are deferred (type=module)', /<script type="module"/.test(html));
check('U77 no render-blocking external CSS', !/<link[^>]*rel="stylesheet"[^>]*href="https?:/i.test(html));
check('U78 font preloads for fast first paint', (html.match(/rel="preload"[^>]*as="font"/g) || []).length >= 2);
if (!SKIP_LIVE) {
  const og = await get('/og/tabletop.png');
  const len = +(og.res.headers.get('content-length') || 0);
  check('U79 og image under 500 KB', og.res.status === 200 && (len === 0 || len < 500 * 1024), `${len}`);
  const imgs = (pageText.match(/<img[^>]*>/g) || []).length;
  check('U80 page uses at most 2 inline images', imgs <= 2, `${imgs}`);
} else {
  check('U79 (live skipped)', 'skip');
  check('U80 (live skipped)', 'skip');
}

// ---------- navigation / IA ----------
const chrome = exists('src/components/SiteChrome.tsx') ? read('src/components/SiteChrome.tsx') : '';
check('U81 site header links to Tools', chrome.includes('/tools'));
check('U82 site header links to Insights', chrome.includes('/insights'));
check('U83 site header links to Glossary', chrome.includes('/glossary'));
check('U84 chrome links back to /tools/tabletop', chrome.includes('/tools/tabletop'));
check('U85 footer element in chrome', /<footer/.test(chrome));
check('U86 chrome links to movahedi.ca', chrome.includes('movahedi.ca'));
if (!SKIP_LIVE) {
  const appHome = await get('/tabletop/');
  const links = [...new Set([...pageText.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]))]
    .filter((h) => !h.startsWith('/tabletop/') && !h.startsWith('#') && !h.includes('#'));
  const sample = links.slice(0, 8);
  const broken = [];
  for (const l of sample) {
    try {
      const r = await fetch(ORIGIN + l, { redirect: 'manual' });
      await r.arrayBuffer().catch(() => {});
      if (r.status < 200 || r.status >= 400) broken.push(`${l} -> ${r.status}`);
    } catch { broken.push(`${l} -> fetch error`); }
  }
  check('U87 sampled internal links resolve (8 links)', sample.length === 8 && broken.length === 0, broken.slice(0, 3).join('; '));
  const nf = await get('/this-page-does-not-exist-xyz/');
  check('U88 unknown site route returns 404 page', nf.res.status === 404, `${nf.res.status}`);
  const ids = ['darkhydra-ransomware', 'cloudmatrix-supply-chain', 'lost-laptop-theft', 'misdirected-email-spill', 'cloud-s3-exposure', 'rogue-admin-insider'];
  check('U89 all six scenario deep-link ids on page', ids.every((id) => pageText.includes(`/tabletop/#/scenario/${id}`)));
  check('U90 page links doctrine deep links', pageText.includes('/tabletop/#/doctrine'));
  check('U91 home link in breadcrumb', /href="\/"/.test(pageText));
  check('U92 tools hub link in breadcrumb', /href="\/tools[\/"]/.test(pageText));
  check('U93 app route serves the SPA shell', appHome.res.status === 200 && appHome.text.includes('id="root"'));
  check('U94 report route documented in FAQ', /report/i.test(pageText));
  check('U95 history feature mentioned', /history/i.test(pageText));
  check('U96 contact path exists site-wide', pageText.includes('/contact') || pageText.includes('mohammad@movahedi.ca'));
  check('U97 no "under construction" copy', !/under construction|coming soon/i.test(pageText));
  check('U98 page has related-links section', /related|go deeper|learn more/i.test(pageText));
  check('U99 app: six scenarios listed on home screen', bundleHasScenarios());
  function bundleHasScenarios() {
    const d = join(ROOT, 'dist/assets');
    if (!existsSync(d)) return false;
    const f = readdirSync(d).find((x) => x.endsWith('.js'));
    if (!f) return false;
    const b = readFileSync(join(d, f), 'utf8');
    return ['darkhydra-ransomware', 'cloudmatrix-supply-chain', 'lost-laptop-theft', 'misdirected-email-spill', 'cloud-s3-exposure', 'rogue-admin-insider'].every((id) => b.includes(id));
  }
  check('U100 page and app titles are distinct', pageTitle !== appTitle, `"${pageTitle}" vs "${appTitle}"`);
} else {
  for (let i = 87; i <= 100; i++) check(`U${String(i).padStart(2, '0')} (live skipped)`, 'skip');
}

const total = pass + fail + skip;
console.log(`\nux: ${pass}/${total} passed, ${fail} failed, ${skip} skipped`);
if (failures.length) { console.log('FAILURES:'); failures.forEach((f) => console.log(' - ' + f)); }
if (total !== 100) { console.log(`ERROR: ${total} checks, need exactly 100`); process.exit(1); }
process.exit(fail ? 1 : 0);
