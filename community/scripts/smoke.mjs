// Browser-level Rehabwheel community smoke test (run with Playwright + local static server)
import {chromium} from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";

const base=process.env.RW_TEST_URL||"http://127.0.0.1:8123";
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(let i=0;i<35;i++){try{const response=await fetch(base+"/community/");if(response.ok)break}catch{}if(i===34)throw Error("Local test server is not responding");await wait(300)}
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
let checked=0;
async function run(name,fn){try{await fn();checked++;console.log("PASS",name)}catch(err){console.error("FAIL",name,err);throw err}}
try{
 const phone=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true,serviceWorkers:"block"});
 const errors=[];phone.on("pageerror",err=>errors.push(err.message));
 await phone.goto(base+"/community/",{waitUntil:"domcontentloaded"});
 await run("Mobile bottom navigation is visible",async()=>assert.equal(await phone.locator("#mobileNav").isVisible(),true));
 await run("Sports tab has nine interactive cards",async()=>{
   await phone.locator('#mobileNav [data-tab="explore"]').click();
   assert.equal(await phone.locator(".sport-card").count(),9);
 });
 await run("Sports selection prefills activity log",async()=>{
   await phone.locator('[data-sportpick="Wheelchair basketball"]').click();
   assert.equal(await phone.locator('#activityForm select[name="mode"]').inputValue(),"Wheelchair basketball");
 });
 await run("Save private 35-minute activity",async()=>{
   await phone.locator('#activityForm input[name="title"]').fill("Court practice");
   await phone.locator('#activityForm input[name="duration"]').fill("35");
   await phone.locator("#saveModal").click();
   assert.equal(await phone.locator("#modal").getAttribute("hidden"),"");
   assert((await phone.locator("#view").innerText()).includes("Court skills"));
 });
 await run("Edit previously saved private sport activity",async()=>{
   await phone.locator('#mobileNav [data-tab="progress"]').click();
   await phone.locator('[data-act="edit"]').first().click();
   assert.equal(await phone.locator('#activityForm input[name="title"]').inputValue(),"Court practice");
   await phone.locator('#activityForm input[name="title"]').fill("Court skills");
   await phone.locator('#activityForm input[name="duration"]').fill("40");
   await phone.locator('#saveModal').click();
   const view=await phone.locator("#view").innerText();
   assert(view.includes("Court skills"));
   assert(view.includes("40 minutes"));
 });
 await run("Progress displays real activity minutes",async()=>{
   await phone.locator('#mobileNav [data-tab="progress"]').click();
   assert((await phone.locator("#view").innerText()).includes("40 minutes"));
   assert((await phone.locator("#view").innerText()).includes("Wheelchair basketball"));
 });
 await run("Private data export creates backup file",async()=>{
   await phone.locator('#mobileNav [data-tab="profile"]').click();
   const [download]=await Promise.all([phone.waitForEvent("download"),phone.locator('[data-act="backup"]').click()]);
   assert.equal(download.suggestedFilename(),"rehabwheel-private-backup.json");
   const backup=JSON.parse(await fs.readFile(await download.path(),"utf8"));
   assert.equal(backup.activities.length,1);assert.equal(backup.activities[0].visibility,"Only me");
 });
 await run("Activity deletion requests confirmation",async()=>{
   await phone.locator('#mobileNav [data-tab="progress"]').click();
   let confirmed=false;
   phone.once("dialog",async dialog=>{confirmed=true;await dialog.dismiss()});
   await phone.locator('[data-act="delete"]').first().click();
   assert(confirmed);
   assert((await phone.locator("#view").innerText()).includes("Court practice"));
 });
 await run("Mobile page has no significant horizontal overflow",async()=>{
   const sizes=await phone.evaluate(()=>({body:document.body.scrollWidth,viewport:document.documentElement.clientWidth}));
   assert(sizes.body<=sizes.viewport+4,JSON.stringify(sizes));
 });
 await run("Mobile app emitted no uncaught JavaScript errors",async()=>assert.deepEqual(errors,[]));
 await phone.close();
 const desk=await browser.newPage({viewport:{width:1440,height:900},serviceWorkers:"block"});
 await desk.goto(base+"/community/",{waitUntil:"domcontentloaded"});
 await run("Desktop navigation and clubs function",async()=>{
   assert.equal(await desk.locator("#sideNav").isVisible(),true);
   await desk.locator('#sideNav [data-tab="clubs"]').click();
   assert((await desk.locator("#view").innerText()).includes("Sports Club"));
 });
 await run("Desktop product image uses actual site asset",async()=>{
   await desk.locator('#sideNav [data-tab="feed"]').click();
   const src=await desk.locator(".welcome img").getAttribute("src");
   assert(src.startsWith("/assets/photos/"));
   const valid=await desk.locator(".welcome img").evaluate(el=>el.complete&&el.naturalWidth>0);
   assert(valid,"Image did not load from the repository");
 });
 await run("Desktop avoids significant horizontal overflow",async()=>{
   const sizes=await desk.evaluate(()=>({body:document.body.scrollWidth,viewport:document.documentElement.clientWidth}));
   assert(sizes.body<=sizes.viewport+4,JSON.stringify(sizes));
 });
 await desk.close();
 console.log("\n"+checked+" browser smoke checks passed.");
}finally{await browser.close()}
