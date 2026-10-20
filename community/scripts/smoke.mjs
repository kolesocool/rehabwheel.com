// Browser-level Community waitlist smoke tests, Chromium, mobile and desktop.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.RW_TEST_URL||'http://127.0.0.1:8123';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let count=0;
async function test(label,fn){await fn();count++;console.log('PASS',label)}
try{
 for(const width of [360,390,768,927,1440]){
  const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/community/',{waitUntil:'domcontentloaded'});
  await test('Logo and prominent waitlist are visible at '+width,async()=>{
   assert(await page.locator('header .brand-image').isVisible());
   assert(await page.locator('#hero-title').isVisible());
   assert(await page.locator('#joinEmail').count()===1);
   const logo=await page.locator('header .brand-image').evaluate(i=>i.complete&&i.naturalWidth>0);
   assert(logo,'Logo failed to load');
  });
  await test('No horizontal overflow at '+width,async()=>{
   const d=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
   assert(d.page<=d.viewport+4,JSON.stringify(d));
  });
  await test('Not-yet-public disclosure and consent at '+width,async()=>{
   const text=await page.locator('main').innerText();
   assert(text.includes('not public'));
   const email=page.locator('#joinEmail');
   assert.equal(await email.getAttribute('required'),'');
   assert.equal(await page.locator('#joinConsent').getAttribute('required'),'');
   assert.equal(await page.locator('form#communityWaitlist').getAttribute('method'),'POST');
  });
  await test('Waitlist form validation at '+width,async()=>{
   await page.locator('a[href="#join"]').first().click();
   await page.locator('#joinEmail').fill('invalid-email');
   assert.equal(await page.locator('form#communityWaitlist').evaluate(f=>f.checkValidity()),false);
   await page.locator('#joinEmail').fill('test@example.com');
   assert.equal(await page.locator('form#communityWaitlist').evaluate(f=>f.checkValidity()),false);
   await page.locator('#joinConsent').check();
   assert.equal(await page.locator('form#communityWaitlist').evaluate(f=>f.checkValidity()),true);
   await page.evaluate(()=>document.querySelector('#communityWaitlist').addEventListener('submit',event=>event.preventDefault()));
   await page.locator('#submitJoin').click();
   assert((await page.locator('#status').innerText()).includes('form provider'));
  });
  await test('No uncaught browser errors at '+width,async()=>assert.deepEqual(errors,[]));
  if([390,1440].includes(width))await page.screenshot({path:'/tmp/rehabwheel-community-waitlist-'+width+'.png',fullPage:true});
  await page.close();
 }
 const landing=await browser.newPage({viewport:{width:1440,height:900},serviceWorkers:'block'});
 await landing.goto(base+'/',{waitUntil:'domcontentloaded'});
 await test('Corporate homepage CTA correctly links to waitlist',async()=>{
   const button=landing.locator('#rehabwheel-community a[href="/community/"]');
   assert.equal(await button.count(),1);
   assert((await button.innerText()).includes('Waitlist'));
 });
 await landing.goto(base+'/sports-community.html',{waitUntil:'domcontentloaded'});
 await test('Sports page points to waitlist, not public demo',async()=>{
   assert((await landing.locator('main').innerText()).includes('Join the Community waitlist'));
   assert.equal(await landing.locator('a[href="/community/"]').count(),2);
 });
 await landing.goto(base+'/community/thanks.html',{waitUntil:'domcontentloaded'});
 await test('Post-submit page is noindex',async()=>{
   assert((await landing.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
 });
 await landing.close();
 console.log('\n'+count+' Community waitlist browser checks passed');
}finally{await browser.close()}
