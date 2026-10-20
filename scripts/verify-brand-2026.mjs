#!/usr/bin/env node
/**
 * Rehabwheel design release guard.
 * Run: node scripts/verify-brand-2026.mjs
 * No dependencies, no network, no medical-product assertions.
 */
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const pages=[
 'index.html','legmaker.html','technology.html','research.html',
 'company.html','resources.html','funding.html','contact.html','photos.html',
 'explore.html','blog.html','investors.html','institutions.html','purchase-orders.html'
];
let failures=0,assertions=0;
function check(label,ok){assertions++;if(!ok){failures++;console.error('FAIL',label);}else console.log('PASS',label);}
function read(path){return readFileSync(join(root,path),'utf8');}
const cssPath='assets/rw26-brand.css';
check('Shared design system exists',existsSync(join(root,cssPath)));
const css=read(cssPath);
check('Design CSS is substantial and versioned',css.length>9000);
check('Reduced-motion rule provided',css.includes('prefers-reduced-motion:reduce'));
check('Small-screen breakpoint provided',css.includes('max-width:620px'));
check('Keyboard focus treatment provided',css.includes(':focus-visible'));
check('CSS block braces balanced',(css.match(/\{/g)||[]).length===(css.match(/\}/g)||[]).length);
for(const path of pages){
  const html=read(path);
  check(path+' loads brand CSS exactly once',(html.match(/rw26-brand\.css/g)||[]).length===1);
  check(path+' retains document head',html.includes('<head>')&&html.includes('</head>'));
  check(path+' keeps device status, where appropriate',!['index.html','legmaker.html'].includes(path)||html.toLowerCase().includes('investigational'));
}
const home=read('index.html');
check('Original editorial hero headline',home.includes('The chair stays. The legs move.'));
check('Hero uses an original LegMaker prototype photo',home.includes('assets/photos/legmaker-seated-demonstration.webp'));
check('New role-specific entry points appear once',(home.match(/class="rw26-pathways wrap"/g)||[]).length===1);
check('Institutional pathway precedes community feature',home.indexOf('class="rw-institutional-entry wrap"')<home.indexOf('class="rw-social-promo wrap"'));
check('Homepage prototype video is lazy loaded',(home.match(/loading="lazy" allow="accelerometer/g)||[]).length===2);
for(const page of ['research.html','institutions.html','photos.html']) check('Entry point exists: '+page,existsSync(join(root,page)));
console.log('\nDesign release guard:',assertions,'checks,',failures,'failures');
if(failures)process.exitCode=1;
