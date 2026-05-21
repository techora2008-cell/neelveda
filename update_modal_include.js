// update_modal_include.js
const fs = require('fs');
const path = require('path');

const root = __dirname; // neelveda6
const cssPath = 'assets/css/modal.css';
const jsPath = 'assets/js/modal.js';

function getDepth(filePath) {
  const rel = path.relative(root, filePath);
  if (!rel.includes(path.sep)) return 0;
  return rel.split(path.sep).length - 1; // number of directories deep
}

function buildPrefix(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(cssPath) && content.includes(jsPath)) return false; // already injected
  const depth = getDepth(file);
  const prefix = buildPrefix(depth);
  const linkTag = `<link rel="stylesheet" href="${prefix}${cssPath}">`;
  const scriptTag = `<script src="${prefix}${jsPath}" defer></script>`;
  const injection = `\n${linkTag}\n${scriptTag}\n`;
  // Insert before closing </body>
  const newContent = content.replace(/<\/body>/i, injection + '</body>');
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${path.relative(root, file)}`);
    return true;
  }
  return false;
}

let updated = 0;
const walk = dir => {
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (full.endsWith('.html')) {
      if (processFile(full)) updated++;
    }
  });
};

walk(root);
console.log(`Total files updated: ${updated}`);
