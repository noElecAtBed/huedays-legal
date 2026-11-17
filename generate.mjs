#!/usr/bin/env node
/**
 * Build static privacy / terms / landing pages from documents.ts.
 * Paid-only sections (Privacy “Purchases”, Terms “Pro”) are omitted unless
 * you pass --paywall (v1 ships free).
 *
 *   node generate.mjs
 *   node generate.mjs --paywall path/to/documents.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2).filter((a) => a !== '--paywall');
const paywall = process.argv.includes('--paywall');
const srcPath = args[0] || path.join(root, 'documents.ts');

const raw = fs.readFileSync(srcPath, 'utf8');
const js = raw
  .replace(/import[\s\S]*?from\s+['"][^'"]+['"];\s*/, '')
  .replace(/\/\*\*[\s\S]*?\*\//g, '')
  .replace(/export type[^\n]*\n/, '')
  .replace(/export interface[^\n]*\n/, '')
  .replace(/export const legalUrl[\s\S]*?\n/, '')
  .replace(/export const legalText[\s\S]*/, '')
  .replace(/: Record<LegalDoc, LegalText>/g, '');

const box = {};
vm.runInNewContext(`${js}\nthis.zh = zh; this.en = en;`, box);
if (!box.zh || !box.en) throw new Error('Failed to parse zh/en documents from ' + srcPath);

function legalText(lang, doc) {
  const text = box[lang][doc];
  return paywall ? text : { ...text, sections: text.sections.filter((s) => !s.paid) };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8').trim();

function shell({ title, active, body }) {
  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <style>
${css}
  </style>
</head>
<body>
  <header class="top">
    <a class="brand" href="./">拾色年鉴 <span>Huedays</span></a>
    <nav>
      <a href="privacy.html"${active === 'privacy' ? ' aria-current="page"' : ''}>隐私政策 / Privacy</a>
      <a href="terms.html"${active === 'terms' ? ' aria-current="page"' : ''}>使用条款 / Terms</a>
    </nav>
  </header>
  <main>
${body}
  </main>
</body>
</html>
`;
}

function docPage(doc) {
  const zh = legalText('zh', doc);
  const en = legalText('en', doc);
  const body = `    <p class="langs"><a href="#zh">中文</a><span aria-hidden="true"> · </span><a href="#en">English</a></p>
    <article id="zh" lang="zh-Hans">
      <h1>${esc(zh.title)}</h1>
      <p class="updated">${esc(zh.updated)}</p>
      <p class="intro">${esc(zh.intro)}</p>
${zh.sections.map((s) => `      <h2>${esc(s.heading)}</h2>\n      <p>${esc(s.body)}</p>`).join('\n')}
    </article>
    <article id="en" lang="en">
      <h1>${esc(en.title)}</h1>
      <p class="updated">${esc(en.updated)}</p>
      <p class="intro">${esc(en.intro)}</p>
${en.sections.map((s) => `      <h2>${esc(s.heading)}</h2>\n      <p>${esc(s.body)}</p>`).join('\n')}
    </article>`;
  return shell({ title: `${zh.title} / ${en.title} · 拾色年鉴 Huedays`, active: doc, body });
}

const indexBody = `    <h1>拾色年鉴 <span>Huedays</span></h1>
    <ul class="links">
      <li><a href="privacy.html">隐私政策 / Privacy Policy</a></li>
      <li><a href="terms.html">使用条款 / Terms of Use</a></li>
    </ul>`;

const files = {
  'index.html': shell({ title: '拾色年鉴 Huedays', active: 'home', body: indexBody }),
  'privacy.html': docPage('privacy'),
  'terms.html': docPage('terms'),
};

for (const [name, html] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, name), html);
  console.log('wrote', name);
}
