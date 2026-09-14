#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const strict = process.argv.includes('--strict');


const SEARCH_FILE = 'src/components/common/SearchBar.jsx';

const BRAND_FILES = new Set([
  'src/components/home/HeroBanner.jsx',
  'src/components/home/RandomPlayButton.jsx',
]);

const GENERIC_AUDIT_EXEMPT_FILES = new Set([...BRAND_FILES, SEARCH_FILE]);

const warnings = [];
const errors = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function count(re, text) {
  return (text.match(re) || []).length;
}

if (!fs.existsSync(srcRoot)) {
  console.error('design:audit: src/ not found');
  process.exit(2);
}

for (const file of walk(srcRoot)) {
  const name = rel(file);
  const text = fs.readFileSync(file, 'utf8');

  const rules = [
    [/hover:scale-(110|125|150)/g, 'large hover scaling; prefer restrained card motion'],
    [/shadow-2xl/g, 'shadow-2xl; verify this surface truly needs strong elevation'],
    [/blur-(2xl|3xl)/g, 'large blur effect; verify it is not decorative slop'],
    [/backdrop-blur-(xl|2xl|3xl)/g, 'heavy backdrop blur; prefer hierarchy through solid/layered surfaces'],
    [/animate-(bounce|spin|pulse)/g, 'continuous animation; verify it communicates active state'],
    [/duration-(700|1000|\[\d{4,}ms\])/g, 'long UI transition; verify it is cinematic media rather than normal interaction'],
    [/rounded-(3xl|\[\d{2,}px\])/g, 'large/arbitrary radius; verify it matches the shared radius vocabulary'],
  ];

  if (!GENERIC_AUDIT_EXEMPT_FILES.has(name)) {
    for (const [re, msg] of rules) {
      const n = count(re, text);
      if (n) warnings.push(`${name}: ${msg} (${n})`);
    }
  }

  // Generic gradient use is a review prompt, but protected brand files are exempt.
  if (!GENERIC_AUDIT_EXEMPT_FILES.has(name)) {
    const n = count(/bg-gradient-to-[trbl]/g, text);
    if (n > 2) warnings.push(`${name}: ${n} background gradients; review against anti-slop rules`);
  }
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

// Protected brand regression checks.
for (const file of BRAND_FILES) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    errors.push(`${file}: protected brand component file is missing`);
    continue;
  }
  const text = read(file);
  const required = [
    'rounded-full',
    'bg-gradient-to-r',
    'from-cyan-500',
    'to-blue-600',
    'text-white',
    'hover:scale-105',
    'hover:from-blue-600',
    'hover:to-cyan-500',
    'active:scale-95',
  ];
  const missing = required.filter(token => !text.includes(token));
  if (missing.length) {
    errors.push(`${file}: protected CTA treatment changed; missing ${missing.join(', ')}`);
  }
}


// Protected search-bar regression check.
{
  const full = path.join(root, SEARCH_FILE);
  if (!fs.existsSync(full)) {
    errors.push(`${SEARCH_FILE}: protected search bar file is missing`);
  } else {
    const text = read(SEARCH_FILE);
    const required = ['rounded-3xl', 'border-[0.5px]', 'focus-within:border-cyan-300/25', 'Search01Icon', 'from-cyan-500', 'to-blue-600', 'Search cartoons, genres, episodes...'];
    const missing = required.filter(token => !text.includes(token));
    if (missing.length) {
      errors.push(`${SEARCH_FILE}: protected search bar treatment changed; missing ${missing.join(', ')}`);
    }
  }
}

const design = path.join(root, 'DESIGN.md');
if (!fs.existsSync(design)) errors.push('DESIGN.md is missing');
else {
  const text = fs.readFileSync(design, 'utf8');
  for (const section of ['Design Decision Precedence', 'Protected Brand Components', 'Motion Quality Rules']) {
    if (!text.includes(section)) errors.push(`DESIGN.md: missing required section "${section}"`);
  }
}

console.log('RetroToonz design audit');
console.log(`Errors:   ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length) {
  console.log('\nErrors');
  errors.forEach(x => console.log(`  ✖ ${x}`));
}
if (warnings.length) {
  console.log('\nReview warnings');
  warnings.forEach(x => console.log(`  • ${x}`));
}
if (!errors.length && !warnings.length) console.log('\n✓ No design-regression patterns detected.');
else if (!errors.length) console.log('\n✓ No protected-brand regressions detected. Review warnings manually.');

if (errors.length || (strict && warnings.length)) process.exit(1);
