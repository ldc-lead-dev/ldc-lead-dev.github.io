#!/usr/bin/env node
/**
 * build-i18n.js — Generate /fr/index.html from /index.html + /i18n/fr.json
 *
 * Reads the English index.html as the template, replaces all data-i18n content
 * with French translations, updates lang/canonical/OG meta tags, and writes
 * the result to fr/index.html so crawlers see French content server-side.
 *
 * Usage: node build-i18n.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const EN_HTML_PATH = path.join(ROOT, 'index.html');
const FR_JSON_PATH = path.join(ROOT, 'i18n', 'fr.json');
const FR_OUT_DIR = path.join(ROOT, 'fr');
const FR_OUT_PATH = path.join(FR_OUT_DIR, 'index.html');

// Keys whose content should be set via innerHTML (contain markup)
const HTML_KEYS = new Set(['hero_title_html', 'svc_learn_html']);

const SITE_URL = 'https://www.ldc-software.com';

// ---------------------------------------------------------------------------
// Read inputs
// ---------------------------------------------------------------------------
const enHtml = fs.readFileSync(EN_HTML_PATH, 'utf-8');
const fr = JSON.parse(fs.readFileSync(FR_JSON_PATH, 'utf-8'));
const meta = fr._meta;

// ---------------------------------------------------------------------------
// 1. Replace <html lang="en"> → <html lang="fr">
// ---------------------------------------------------------------------------
let html = enHtml.replace(/<html\s+lang="en"/, '<html lang="fr"');

// ---------------------------------------------------------------------------
// 2. Replace <title>
// ---------------------------------------------------------------------------
html = html.replace(
  /<title>[^<]+<\/title>/,
  `<title>${meta.title}</title>`
);

// ---------------------------------------------------------------------------
// 3. Replace <meta name="description">
// ---------------------------------------------------------------------------
html = html.replace(
  /(<meta\s+name="description"\s+content=")[^"]*(")/,
  `$1${meta.description}$2`
);

// ---------------------------------------------------------------------------
// 4. Update canonical URL → /fr/
// ---------------------------------------------------------------------------
html = html.replace(
  /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
  `$1${SITE_URL}/fr/$2`
);

// ---------------------------------------------------------------------------
// 5. Update Open Graph tags
// ---------------------------------------------------------------------------
html = html.replace(
  /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
  `$1${meta.og_title}$2`
);
html = html.replace(
  /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
  `$1${meta.og_description}$2`
);
html = html.replace(
  /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
  `$1${SITE_URL}/fr/$2`
);
html = html.replace(
  /(<meta\s+property="og:locale"\s+content=")[^"]*(")/,
  `$1${meta.og_locale}$2`
);

// ---------------------------------------------------------------------------
// 6. Update Twitter Card tags
// ---------------------------------------------------------------------------
html = html.replace(
  /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
  `$1${meta.twitter_title}$2`
);
html = html.replace(
  /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
  `$1${meta.twitter_description}$2`
);

// ---------------------------------------------------------------------------
// 7. Fix asset paths — make relative paths absolute so /fr/index.html works
// ---------------------------------------------------------------------------
// CSS
html = html.replace(
  /href="styles\.css"/g,
  'href="/styles.css"'
);
// JS — match any cache-bust version so the fix survives future bumps
html = html.replace(
  /href="main\.js(\?v=\d+)?"/g,
  'href="/main.js$1"'
);
html = html.replace(
  /src="main\.js(\?v=\d+)?"/g,
  'src="/main.js$1"'
);

// ---------------------------------------------------------------------------
// 8. Replace data-i18n element content with French translations
// ---------------------------------------------------------------------------
for (const [key, value] of Object.entries(fr)) {
  if (key === '_meta') continue;
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (HTML_KEYS.has(key)) {
    // For HTML keys, find the element's tag name and match to its closing tag,
    // handling nested same-name tags correctly. Supports multiple occurrences.
    const openTagRe = new RegExp(`<(\\w+)[^>]*data-i18n="${escapedKey}"[^>]*>`, 'g');
    let match;
    let offset = 0; // track cumulative length change from replacements
    // Collect all match positions first on the original html
    const matches = [];
    const snapshot = html;
    while ((match = openTagRe.exec(snapshot)) !== null) {
      matches.push({ index: match.index, fullOpen: match[0], tagName: match[1] });
    }
    for (const m of matches) {
      const adjustedIndex = m.index + offset;
      const contentStart = adjustedIndex + m.fullOpen.length;
      const closeTag = `</${m.tagName}>`;
      const openRe = new RegExp(`<${m.tagName}[\\s>]`);

      let depth = 1;
      let pos = contentStart;
      let closePos = -1;
      while (depth > 0 && pos < html.length) {
        const nextCloseIdx = html.indexOf(closeTag, pos);
        if (nextCloseIdx === -1) break;
        const segment = html.substring(pos, nextCloseIdx);
        const openMatch = segment.match(openRe);
        if (openMatch) {
          depth++;
          pos = pos + openMatch.index + openMatch[0].length;
        } else {
          depth--;
          if (depth === 0) { closePos = nextCloseIdx; break; }
          pos = nextCloseIdx + closeTag.length;
        }
      }
      if (closePos === -1) continue;
      const oldContent = html.substring(contentStart, closePos);
      html = html.substring(0, contentStart) + value + html.substring(closePos);
      offset += value.length - oldContent.length;
    }
  } else {
    // For text-only keys, replace textContent (no child tags expected)
    const regex = new RegExp(
      `(data-i18n="${escapedKey}">)[^<]*(</\\w+>)`,
      'g'
    );
    html = html.replace(regex, `$1${value}$2`);
  }
}

// ---------------------------------------------------------------------------
// 9. Update the lang toggle: FR should be active on the French page
// ---------------------------------------------------------------------------
html = html.replace(
  '<button class="lang-btn active" data-lang="en" role="radio" aria-checked="true">EN</button>',
  '<button class="lang-btn" data-lang="en" role="radio" aria-checked="false">EN</button>'
);
html = html.replace(
  '<button class="lang-btn" data-lang="fr" role="radio" aria-checked="false">FR</button>',
  '<button class="lang-btn active" data-lang="fr" role="radio" aria-checked="true">FR</button>'
);

// ---------------------------------------------------------------------------
// 10. Update JSON-LD WebSite schema URL for French page
// ---------------------------------------------------------------------------
// No change needed — the Organization and WebSite schemas reference the main
// site URL which is correct for both language versions.

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
fs.mkdirSync(FR_OUT_DIR, { recursive: true });
fs.writeFileSync(FR_OUT_PATH, html, 'utf-8');

console.log(`✓ Generated ${path.relative(ROOT, FR_OUT_PATH)} (${(html.length / 1024).toFixed(1)} KB)`);
