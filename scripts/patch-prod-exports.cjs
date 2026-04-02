#!/usr/bin/env node
// Patches workspace package.json exports from /src/*.ts to /dist/*.js
// Run once after build on EC2: node scripts/patch-prod-exports.cjs

const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..');
const searchDirs = ['packages', 'packages/adapters'];

function patchDir(dir) {
  const full = path.join(base, dir);
  if (!fs.existsSync(full)) return;
  fs.readdirSync(full, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .forEach(d => {
      const pj = path.join(full, d.name, 'package.json');
      if (!fs.existsSync(pj)) return;
      const p = JSON.parse(fs.readFileSync(pj, 'utf8'));
      let changed = false;
      if (p.exports && typeof p.exports === 'object') {
        Object.keys(p.exports).forEach(k => {
          const v = p.exports[k];
          if (typeof v === 'string' && v.includes('/src/') && v.endsWith('.ts')) {
            p.exports[k] = v.replace('/src/', '/dist/').slice(0, -3) + '.js';
            changed = true;
          }
        });
      }
      if (changed) {
        fs.writeFileSync(pj, JSON.stringify(p, null, 2) + '\n');
        console.log('Patched:', path.join(dir, d.name));
      }
    });
}

searchDirs.forEach(patchDir);
console.log('Done.');
