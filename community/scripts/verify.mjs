// Rehabwheel Community waitlist release verification — Node 20+, no deps.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const app=read('community/index.html');
const overview=read('sports-community.html');
const css=read('community/waitlist.css');
const script=read('community/waitlist.js');
const sw=read('community/sw.js');
const home=read('index.html');
const thanks=read('community/thanks.html');
const privacy=read('privacy.html');
const sitemap=read('sitemap.xml');
const manifest=JSON.parse(read('community/manifest.webmanifest'));
const schema=JSON.parse(app.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'null');
let count=0;
function test(label,fn){try{fn();count++;console.log('PASS',label)}catch(e){console.error('FAIL',label,e.message);process.exitCode=1}}
test('New public waitlist page is indexable and canonical',()=>{assert(app.includes('content="index,follow'));assert(app.includes('href="https://rehabwheel.com/community/"'));});
test('No unlaunched demo UI is public',()=>{assert(!app.includes('id="activityForm"'));assert(!app.includes('id="mobileNav"'));assert(!app.includes('id="view"'));assert(!app.includes('localStorage.setItem'));});
test('Official logo is prominently used',()=>{assert((app.match(/\/rehabwheel_logo\.jpg/g)||[]).length>=2);assert(app.includes('class="brand-image"'));});
test('Waitlist form routes to existing FormSubmit service',()=>{assert(app.includes('action="https://formsubmit.co/nikita@rehabwheel.com"'));assert(app.includes('method="POST"'));});
test('Required email and explicit consent',()=>{assert(/name="email"[^>]*type="email"[^>]*required/.test(app));assert(/name="community_email_consent"[^>]*type="checkbox"[^>]*required/.test(app));});
test('Personal data minimized and disclosure added',()=>{assert(!/name="(?:diagnosis|disability|medicalRecords|dateOfBirth)"/i.test(app));assert(app.includes('third-party form service'));assert(privacy.includes('id="community-waitlist-privacy"'));});
test('Confirmation page noindexed',()=>{assert(thanks.includes('content="noindex,nofollow,noarchive"'));});
test('No fabricated signup acknowledgement',()=>{assert(!script.includes('Successfully subscribed'));assert(script.includes('Opening the form provider'));});
test('Landing page JS and previous-worker retirement compile',()=>{new vm.Script(script);new vm.Script(sw);assert(!/addEventListener\(['"]fetch['"]/.test(sw));assert(script.includes('reg.unregister'));});
test('Manifest no longer implies public installed preview',()=>{assert(manifest.description.includes('not public'));assert.equal(manifest.display,'browser');});
test('Responsive design and accessible controls',()=>{assert(css.includes('max-width:620px'));assert(css.includes('prefers-reduced-motion:reduce'));assert(css.includes(':focus-visible'));assert(app.includes('Skip to content'));});
test('Real photo still available',()=>{assert(fs.existsSync(path.join(root,'assets/photos/legmaker-seated-demonstration.webp')));});
test('Structured WebPage and FAQ content align with page',()=>{assert.equal(schema['@context'],'https://schema.org');assert(schema['@graph'].some(n=>n['@type']==='WebPage'&&n.url==='https://rehabwheel.com/community/'));const faq=schema['@graph'].find(n=>n['@type']==='FAQPage');assert(faq?.mainEntity.length===6);});
test('Homepage promotes waitlist not public app',()=>{assert(home.includes('Join Community Waitlist'));assert(!home.includes('Open Community App'));});
test('Sports overview describes not-yet-live product',()=>{assert(overview.includes('Join the Community waitlist'));assert(!overview.includes('Explore interactive preview'));});
test('Sitemap includes Community and sports pages but not thanks',()=>{assert(sitemap.includes('https://rehabwheel.com/community/'));assert(sitemap.includes('https://rehabwheel.com/sports-community.html'));assert(!sitemap.includes('community/thanks.html'));});
if(process.exitCode){console.error('Community waitlist QA failed');process.exit(process.exitCode)}
console.log('\n'+count+' community waitlist release checks passed.');
