// Restricted Military Hub: dependency-free source and fail-closed release guard.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('military/index.html'),css=read('military/hub.css'),js=read('military/hub.js');
const config=read('military/firebase-config.js');
const firestore=read('military/backend/firestore.rules'),storage=read('military/backend/storage.rules');
const home=read('index.html'),sitemap=read('sitemap.xml'),robots=read('robots.txt');
let count=0;
function test(label,fn){try{fn();console.log('PASS',label);count++;}catch(e){console.error('FAIL',label,e.message);process.exitCode=1;}}
test('Army hub has no public sitemap or homepage navigation entry',()=>{assert(!home.includes('href="/military/"'));assert(!sitemap.includes('rehabwheel.com/military'));});
test('Restricted portal is noindex and noarchive',()=>{assert(html.includes('noindex,nofollow,noarchive'));assert(!robots.includes('Allow: /military/'));});
test('Login requests email and password; portal initially hidden',()=>{assert(html.includes('type="email"'));assert(html.includes('type="password"'));assert(html.includes('id="hubScreen" class="hub" hidden'));});
test('Authenticated vault contents are absent from public HTML',()=>{assert(!html.includes('AFWERX Phase I'));assert(!html.includes('Texas State University'));assert(!html.includes('Shepherd Center'));assert(!html.includes('AURC'));});
test('Official Rehabwheel logo and government disclaimer present',()=>{assert(html.includes('/rehabwheel_logo.jpg'));assert(html.includes('Not a U.S. Army'));assert(fs.existsSync(path.join(root,'rehabwheel_logo.jpg')));});
test('Firebase public configuration defaults to null (fail closed)',()=>{assert(/firebaseConfig\s*=\s*null/.test(config));assert(!config.includes('AIza'));});
test('UI gates email verification and custom claims',()=>{assert(js.includes('getIdTokenResult(user,forceRefresh)'));assert(js.includes('email_verified===true'));assert(js.includes('rehabwheelMilitary===true'));assert(js.includes('roles.includes(c.militaryRole)'));});
test('UI never caches program content in localStorage',()=>{assert(!js.includes('localStorage'));assert(js.includes('inMemoryPersistence'));});
test('UI uses private authenticated getBlob, not public download URLs',()=>{assert(js.includes('storageApi.getBlob'));assert(!js.includes('storageApi.getDownloadURL'));});
test('Portal sections read Firestore only after verification',()=>{assert(js.includes('if(!currentUser||!role||!catalogs[key])'));assert(js.includes('dbApi.getDocs'));});
test('Session expiration and sign-out are wired',()=>{assert(js.includes('15*60*1000'));assert(js.includes('signOutNow'));assert(html.includes('id="signout"'));});
test('Firewall checks email verification and custom roles',()=>{assert(firestore.includes('request.auth.token.email_verified == true'));assert(firestore.includes('request.auth.token.rehabwheelMilitary == true'));assert(firestore.includes('request.auth.token.militaryRole'));});
test('Firestore catch-all denies every other path',()=>{assert(firestore.includes('match /{document=**}'));assert(firestore.includes('allow read, write: if false'));});
test('Storage rules deny anonymous reads and public download URLs',()=>{assert(storage.includes('allow get: if member()'));assert(storage.includes('allow list: if false'));assert(storage.includes('request.resource.size <= 10485760'));assert(storage.includes('match /{allPaths=**} { allow read, write: if false; }'));});
test('Separate military rules do not overwrite Community rules',()=>{assert(fs.existsSync(path.join(root,'military/backend/firestore.rules')));assert(fs.existsSync(path.join(root,'community/backend/firestore.rules')));});
test('CSS includes mobile, reduced-motion, contrast and hidden safeguards',()=>{assert(css.includes('@media(max-width:500px)'));assert(css.includes('prefers-reduced-motion'));assert(css.includes('[hidden]{display:none!important}'));assert(css.includes(':focus-visible'));assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);});
test('JavaScript syntax parses in node module mode',()=>{for(const file of ['military/hub.js','military/firebase-config.js','military/backend/provision-user.mjs']){const run=spawnSync(process.execPath,['--check','--input-type=module'],{input:read(file),encoding:'utf8'});assert.equal(run.status,0,file+': '+run.stderr);}});
if(process.exitCode){console.error('Military Hub release guard failed.');process.exit(process.exitCode);}
console.log('\n'+count+' secure Military Hub source checks passed.');
