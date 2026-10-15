// Rehabwheel Community built-in verification — Node.js 20+; no third-party dependencies.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const app=read("community/index.html");
const overview=read("sports-community.html");
const css=read("community/editorial.css");
const sw=read("community/sw.js");
const manifest=JSON.parse(read("community/manifest.webmanifest"));
const homepage=read("index.html");
const sitemap=read("sitemap.xml");
const scriptMatch=app.match(/<script>\s*([\s\S]*?)<\/script>\s*<\/body>/);
assert(scriptMatch,"Interactive app's inline JS should exist");
const js=scriptMatch[1];
const results=[];
function test(name,fn){try{fn();results.push({name,pass:true});console.log("PASS",name)}catch(error){results.push({name,pass:false});console.error("FAIL",name,error.message)}}

test("Community JavaScript compiles",()=>new vm.Script(js,{filename:"community/index.html"}));
test("Service worker JavaScript compiles",()=>new vm.Script(sw,{filename:"community/sw.js"}));
test("Sports-first interface contains no dating",()=>{assert(!/\\bdating\\b|matchmaking/i.test(app));assert(!/\\bdating\\b|matchmaking/i.test(overview))});
test("Nine adaptive sports appear",()=>{for(const s of ["Wheelchair rolling","Handcycling","Wheelchair basketball","Wheelchair tennis","Wheelchair racing","Adaptive soccer","Swimming","Strength training","Seated cycling"])assert(js.includes(s),s)});
test("Key sections and on-page filters exist",()=>{for(const section of ["feed","explore","clubs","progress","profile"])assert(js.includes('"'+section+'"'),section);assert(js.includes('id="feedSportFilter"'))});
test("Activity storage remains local-only",()=>{assert(js.includes("localStorage.setItem"));assert(js.includes('visibility:"Only me"'));assert(!app.includes("Followers (future)"))});
test("Preview is noindex, public overview is indexable",()=>{assert(app.includes('noindex,nofollow'));assert(overview.includes('index,follow'));assert(overview.includes('rel="canonical"'))});
test("Public page links from homepage and sitemap",()=>{assert(homepage.includes('href="/sports-community.html"'));assert(homepage.includes('href="/community/"'));assert(sitemap.includes('https://rehabwheel.com/sports-community.html'))});
test("All local photos are available",()=>{for(const html of [app,overview])for(const m of html.matchAll(/(?:\/assets\/photos\/)([^"'\\s]+\\.webp)/g))assert(fs.existsSync(path.join(root,"assets/photos",m[1])),m[1])});
test("PWA manifest and offline shell match paths",()=>{assert.equal(manifest.start_url,"/community/");assert(manifest.icons.length>=1);assert(sw.includes("rw-community-shell"));assert(app.includes('serviceWorker.register("/community/sw.js"'))});
test("Offline messaging and reduced motion",()=>{assert(app.includes('id="offlineBanner"'));assert(css.includes(".offline-banner[hidden]"));assert(css.includes("prefers-reduced-motion"))});
test("Private data import/export is available",()=>{for(const fn of ["exportActivities()","downloadPrivateBackup()","parsePrivateBackup(value)"])assert(js.includes("function "+fn),fn);assert(js.includes('if(/^\\s*[=+\\-@]/.test(x))'))});
test("Account, social and health services are not falsely described as live",()=>{assert(app.includes("No live social accounts"));assert(overview.includes("No live social accounts yet"));assert(overview.includes("aren't connected to a personal account"))});
test("Source privacy and accessibility disclosures exist",()=>{assert(app.includes('role="dialog"'));assert(app.includes('aria-modal="true"'));assert(app.includes('role="status"'));assert(overview.includes('Skip to content'))});

const harness=js.replace(/\brender\(\);\s*\}\)\(\);\s*$/,'globalThis.__rwQa={parsePrivateBackup,weeklyActivities,weeklyMinutes,sportStats,state};\nrender();\n})();');
test("Test harness hooks inserted",()=>assert(harness.includes('globalThis.__rwQa=')));
let internal=null;
test("Runtime helpers execute without network",()=>{
  const mock={innerHTML:"",textContent:"",hidden:true,addEventListener(){},classList:{add(){},remove(){}},setAttribute(){}};
  const document={querySelector(){return mock},querySelectorAll(){return []},getElementById(){return mock},addEventListener(){},body:{appendChild(){}}};
  const window={addEventListener(){},scrollTo(){},navigator:{}};
  const navigator={onLine:true};const storage={getItem(){return null},setItem(){},removeItem(){}};
  const context={document,window,navigator,location:{protocol:"https:"},localStorage:storage,console,Date,Number,String,Math,JSON,setTimeout,clearTimeout,setInterval(){return 1},clearInterval(){},Blob,URL,confirm(){return true}};
  vm.createContext(context);
  vm.runInContext(harness,context,{timeout:1800});
  internal=context.__rwQa;
  assert(internal,"Test functions should be available");
});
if(internal){
 test("Import enforces Only me and validates saved activity",()=>{
   const valid={format:"rehabwheel-private-activities",version:1,weeklyGoal:120,activities:[{title:"Morning roll",mode:"Wheelchair rolling",duration:25,createdAt:"2026-10-14T12:00:00Z",visibility:"Everyone"}]};
   const value=internal.parsePrivateBackup(valid);
   assert.equal(value.goal,120);assert.equal(value.activities.length,1);assert.equal(value.activities[0].visibility,"Only me");
 });
 test("Import rejects invalid or excessive activities",()=>{
   const base={format:"rehabwheel-private-activities",version:1,activities:[]};
   assert.throws(()=>internal.parsePrivateBackup({...base,activities:[{title:"",duration:20,createdAt:new Date().toISOString()}]}));
   assert.throws(()=>internal.parsePrivateBackup({...base,activities:new Array(1001).fill({})}));
 });
 test("Weekly activity totals exclude old sessions",()=>{
   const now=new Date().toISOString();
   internal.state.activities=[{createdAt:now,mode:"Wheelchair rolling",duration:30},{createdAt:"2000-01-01T00:00:00Z",mode:"Swimming",duration:60}];
   assert.equal(internal.weeklyActivities().length,1);assert.equal(internal.weeklyMinutes(),30);
 });
 test("Sport counts reflect saved activities",()=>{
   const stats=internal.sportStats();
   assert.equal(stats.length,2);
   assert.equal(stats.find(x=>x.name==="Wheelchair rolling").count,1);
 });
}

const failures=results.filter(x=>!x.pass);
console.log("\n"+(results.length-failures.length)+"/"+results.length+" checks passed.");
process.exitCode=failures.length?1:0;
