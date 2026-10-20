import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const js = read('../lab.js');
const css = read('../lab.css');
const cfg = read('../auth-config.js');
const doc = read('../README.md');

execFileSync('node', ['--check', new URL('../lab.js', import.meta.url).pathname], { stdio: 'inherit' });
assert.match(html, /name="robots" content="noindex,nofollow/);
assert.match(html, /id="gate"/);
assert.match(html, /id="lab"[^>]* hidden/);
assert.match(html, /type="password"/);
assert.match(html, /autocomplete="current-password"/);
assert.match(html, /type="module" src="\/hockey\/lab.js/);
assert.match(html, /href="\/hockey\/lab.css/);
assert.match(html, /src="\/hockey\/auth-config.js/);
assert.match(html, /role="status" aria-live="polite"/);
assert.match(html, /No session data/);
assert.match(html, /Investigational technology/);
for (const id of ['overview','protocols','telemetry','research','access']) {
  assert.match(html, new RegExp('id="view-' + id + '"'));
  assert.match(html, new RegExp('data-view="' + id + '"'));
}
assert.match(css, /:focus-visible/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media\(max-width:600px\)/);
assert.match(js, /signInWithEmailAndPassword/);
assert.match(js, /getIdTokenResult\(true\)/);
assert.match(js, /hockeyLabAccess !== true/);
assert.match(js, /emailVerified !== true/);
assert.match(js, /inMemoryPersistence/);
assert.doesNotMatch(js, /createUserWithEmailAndPassword/);
assert.match(cfg, /REHABWHEEL_HOCKEY_AUTH = null/);
assert.match(doc, /GitHub Pages cannot keep page files secret/);
assert.doesNotMatch(html + js + cfg, /BEGIN PRIVATE KEY|SERVICE_ACCOUNT_PRIVATE_KEY/);
console.log('Hockey lab static security and UI checks: passed. Runtime sign-in and edge policy are NOT verified.');
