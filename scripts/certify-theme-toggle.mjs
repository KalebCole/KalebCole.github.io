import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('../src/components/ThemeToggle.astro', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

assert.doesNotMatch(
  component,
  /data-icon-(?:light|dark)[^>]*\shidden(?:\s|>)/,
  'theme icons must not use the SVG hidden property',
);
assert.doesNotMatch(
  component,
  /(?:light|dark)\.hidden\s*=/,
  'theme script must not assign the SVG hidden property',
);
assert.match(
  styles,
  /html\[data-mode="light"\]\s+\[data-icon-light\]/,
  'light mode must explicitly display the sun icon',
);
assert.match(
  styles,
  /html\[data-mode="dark"\]\s+\[data-icon-dark\]/,
  'dark mode must explicitly display the moon icon',
);

console.log('Certified theme toggle icon states.');
