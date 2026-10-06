#!/usr/bin/env node
/**
 * Internal link + asset checker run against the static export output (`out/`).
 * Constitution Principle V: zero broken internal links or missing assets.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname, normalize } from 'node:path';

const OUT_DIR = resolve(process.cwd(), 'out');

if (!existsSync(OUT_DIR)) {
  console.error('check:links — output directory "out/" not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else results.push(full);
  }
  return results;
}

const files = walk(OUT_DIR);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const errors = [];

function checkTarget(fromFile, rawHref) {
  const href = rawHref.split('#')[0].split('?')[0];
  if (!href) return; // pure fragment link
  if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href)) return;
  let targetPath;
  if (href.startsWith('/')) {
    targetPath = join(OUT_DIR, href);
  } else {
    targetPath = join(dirname(fromFile), href);
  }
  targetPath = normalize(targetPath);
  const candidates = [
    targetPath,
    join(targetPath, 'index.html'),
    targetPath.endsWith('.html') ? targetPath : `${targetPath}.html`,
  ];
  const ok = candidates.some((c) => existsSync(c));
  if (!ok) {
    errors.push(
      `${fromFile.replace(OUT_DIR.replace(/\\/g, '/') + '/', '')} -> ${rawHref}`,
    );
  }
}

const linkRe = /(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    checkTarget(file, m[1]);
  }
}

if (errors.length > 0) {
  console.error(`check:links — ${errors.length} broken link(s)/asset(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(`check:links — OK (${htmlFiles.length} HTML pages, 0 broken links)`);
