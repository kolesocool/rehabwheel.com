// Create an offline-bundled Rehabwheel Sports Community preview for Capacitor.
// No private data or auth provider credentials are bundled.
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"../..");
const out=path.join(root,".community-mobile-dist");
fs.rmSync(out,{recursive:true,force:true});
const copy=(from,to)=>{const src=path.join(root,from),dst=path.join(out,to);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)};
const app=fs.readFileSync(path.join(root,"community/index.html"),"utf8");
const rewrite=app
  .replaceAll('href="/"','href="https://rehabwheel.com/"')
  .replaceAll('href="/sports-community.html"','href="https://rehabwheel.com/sports-community.html"')
  .replaceAll('href="/legmaker.html"','href="https://rehabwheel.com/legmaker.html"')
  .replaceAll('href="/privacy.html"','href="https://rehabwheel.com/privacy.html"')
  .replaceAll('href="/contact.html"','href="https://rehabwheel.com/contact.html"')
  .replace('if("serviceWorker" in navigator && location.protocol==="https:")','if(false && "serviceWorker" in navigator && location.protocol==="https:")');
const target=path.join(out,"community/index.html");
fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,rewrite);
for(const filename of ["community/editorial.css","community/manifest.webmanifest","rehabwheel_logo.jpg","icon-192.png","apple-touch-icon.png"])copy(filename,filename);
const photos=fs.readdirSync(path.join(root,"assets/photos"));
for(const p of photos)if(p.endsWith(".webp"))copy("assets/photos/"+p,"assets/photos/"+p);
fs.writeFileSync(path.join(out,"index.html"),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/community/"><title>Rehabwheel Sports Community Preview</title></head><body><a href="/community/">Open Rehabwheel Sports Community Preview</a></body></html>');
if(!rewrite.includes("ADAPTIVE SPORTS PREVIEW")||/dating|matchmaking/i.test(rewrite))throw Error("Incorrect or unsafe community content for native preview");
for(const expected of ["/community/editorial.css","/assets/photos/","/rehabwheel_logo.jpg"]){if(!rewrite.includes(expected))throw Error("Missing bundled reference "+expected)}
console.log("Prepared local-only wheelchair-sports mobile preview with "+photos.filter(p=>p.endsWith(".webp")).length+" real product photographs.");
console.log("No backend, clinical data or live community accounts are included.");
