// Playwright tests for locked-by-default private Military Hub.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.RW_TEST_URL||'http://127.0.0.1:8123';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let count=0;
async function test(name,fn){await fn();console.log('PASS',name);count++;}
try{
 for(const width of [360,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/military/',{waitUntil:'domcontentloaded'});
  await test('Restricted login and logo visible at '+width,async()=>{
   assert(await page.locator('#loginScreen').isVisible());
   assert(await page.locator('header img[src="/rehabwheel_logo.jpg"]').isVisible());
   assert(await page.locator('header img').evaluate(el=>el.complete&&el.naturalWidth>0));
  });
  await test('Unauthorized workspace content inaccessible at '+width,async()=>{
   assert.equal(await page.locator('#hubScreen').isVisible(),false);
   assert.equal(await page.locator('#signout').isVisible(),false);
   assert.equal(await page.locator('#loginButton').isEnabled(),false);
   assert((await page.locator('#loginStatus').innerText()).includes('being provisioned'));
  });
  await test('No horizontal overflow at '+width,async()=>{
   const x=await page.evaluate(()=>({total:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
   assert(x.total<=x.viewport+4,JSON.stringify(x));
  });
  await test('Password reveal works but does not bypass access at '+width,async()=>{
   await page.locator('#password').fill('not-a-real-password');
   await page.locator('#revealPassword').click();
   assert.equal(await page.locator('#password').getAttribute('type'),'text');
   assert.equal(await page.locator('#hubScreen').isVisible(),false);
   await page.locator('#revealPassword').click();
   assert.equal(await page.locator('#password').getAttribute('type'),'password');
  });
  await test('No uncaught JS errors at '+width,async()=>assert.deepEqual(errors,[]));
  if(width===390||width===1440)await page.screenshot({path:'/tmp/rehabwheel-military-login-'+width+'.png',fullPage:true});
  await page.close();
 }
 console.log('\n'+count+' Military Hub locked-mode browser checks passed.');
}finally{await browser.close()}
