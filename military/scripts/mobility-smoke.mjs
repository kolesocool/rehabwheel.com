// Test-only DOM exercise: the concept source is public; private records remain gated.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.RW_TEST_URL||'http://127.0.0.1:8123';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let count=0;
try{
  for(const width of [360,768,1440]){
    const page=await browser.newPage({viewport:{width,height:980},serviceWorkers:'block'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/military/',{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#hubScreen').isVisible(),false,'real restricted workspace must remain hidden');
    await page.evaluate(async()=>{
      const {renderMobility}=await import('/military/mobility.js');
      const surface=document.createElement('main');
      surface.id='test-only-mobility-surface';
      document.body.append(surface);
      renderMobility(surface);
    });
    assert.equal(await page.locator('#test-only-mobility-surface h2').count(),1);
    assert.equal(await page.locator('#test-only-mobility-surface .mm-stage').count(),3);
    assert.equal(await page.locator('#test-only-mobility-surface .mm-gates li').count(),6);
    await page.locator('[data-stage="therapy"]').click();
    assert.equal(await page.locator('[data-stage="therapy"]').getAttribute('aria-pressed'),'true');
    assert((await page.locator('#mm-scenario-heading').innerText()).includes('Exercise first'));
    await page.locator('[data-stage="handoff"]').click();
    assert((await page.locator('#mm-system-chips').innerText()).includes('BRAKE / STOP'));
    assert.equal(await page.locator('#hubScreen').isVisible(),false);
    const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert(horizontal<=4,'unexpected horizontal scroll at '+width+': '+horizontal);
    assert.deepEqual(errors,[]);
    count++;
    await page.close();
  }
  console.log(count+' Military Mobility responsive/interaction smoke checks passed.');
}finally{await browser.close()}
