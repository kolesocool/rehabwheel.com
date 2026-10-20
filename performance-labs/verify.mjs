// Dependency-free quality gates for private Performance Labs. Node 22+.
import {readFileSync, existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(resolve(root,p),'utf8');
const page=read('performance-labs/index.html');
const script=read('performance-labs/labs.js');
const css=read('performance-labs/labs.css');
const rules=read('community/backend/firestore.rules');
let passed=0;
function check(name,test){try{test();console.log('PASS',name);passed++}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
check('Site-specific invitation-only landing page',()=>{assert(page.includes('PRIVATE BETA'));assert(page.includes('name="password"')===false);assert(page.includes('type="password"'));assert(page.includes('type="email"'));assert(page.includes('id="loginForm"'));});
check('Public indexing disabled',()=>{assert(page.includes('content="noindex,nofollow,noarchive,nosnippet"'));assert(!read('sitemap.xml').includes('performance-labs'));});
check('Real Rehabwheel logo and source photo',()=>{assert(page.includes('/rehabwheel_logo.jpg'));assert(page.includes('legmaker-seated-demonstration.webp'));});
check('No hardcoded production credentials or synthetic athlete results',()=>{assert(!script.includes('demoPassword'));assert(!script.includes('localStorage'));assert(!script.includes('sessionStorage'));assert(!page.includes('125 bpm'));assert(!page.includes('fake athlete'));assert(!existsSync(resolve(root,'performance-labs/firebase-config.js')));});
check('No public dashboard until member authorization',()=>{assert(page.includes('id="workspace" class="workspace" hidden'));assert(script.includes('member.data().active !== true'));assert(script.includes("!user.emailVerified"));});
check('Both labs use distinct authorized collections',()=>{assert(script.includes("mma:"));assert(script.includes("basketball:"));assert(script.includes("'performanceLabs',sport,'members',user.uid"));assert(script.includes("'performanceLabs',sport,'sessions'"));});
check('Lab records and role grants are client-read-only',()=>{assert(rules.includes("match /performanceLabs/{sportId}/members/{uid}"));assert(rules.includes("request.auth.token.email_verified == true"));assert(rules.includes("match /performanceLabs/{sportId}/sessions/{sessionId}"));assert(rules.includes('allow create, update, delete: if false;'));});
check('Interface deliberately labels research as investigational',()=>{assert(page.includes('investigational device'));assert(script.includes('not unvalidated'));assert(page.includes('No wearable or LegMaker telemetry is implied'));});
check('Keyboard, readable mobile, reduced motion',()=>{assert(page.includes('Skip to main content'));assert(css.includes(':focus-visible'));assert(css.includes('max-width:600px'));assert(css.includes('prefers-reduced-motion:reduce'));assert(script.includes("ArrowRight"));});
check('JavaScript parses in Node without execution',()=>{new vm.Script(script,{filename:'labs.js'});});
check('Firebase config template does not accidentally grant access',()=>{assert(read('performance-labs/firebase-config.example.js').includes('REPLACE_WITH_'));assert(script.includes('loginButton.disabled=true'));});
if(process.exitCode)process.exit(process.exitCode);
console.log(`\n${passed} performance lab build checks passed.`);
