// Build a self-contained, static, public-information Rehabwheel Android app.
// Do not include the private community, military lab, or authenticated portal.
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const out=path.join(import.meta.dirname,"www");
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const excluded=new Set(["community","military","payments",".github","android-release",".git","docs","legmaker-labs","athlete-demo","hockey"]);
for(const ent of fs.readdirSync(root,{withFileTypes:true})){
  if(ent.isDirectory()){
    if(ent.name==="assets") fs.cpSync(path.join(root,ent.name),path.join(out,ent.name),{recursive:true});
    continue;
  }
  if(!ent.isFile())continue;
  if(/\.(html|css|js|json|webmanifest|svg|png|jpg|jpeg|ico|webp)$/i.test(ent.name))fs.copyFileSync(path.join(root,ent.name),path.join(out,ent.name));
}
const html=fs.readFileSync(path.join(out,"index.html"),"utf8");
if(!html.toLowerCase().includes("legmaker"))throw Error("Home page missing expected product reference");
const config={appId:"com.rehabwheel.legmaker",appName:"Rehabwheel",webDir:"www",android:{allowMixedContent:false},server:{androidScheme:"https"}};
fs.writeFileSync(path.join(import.meta.dirname,"capacitor.config.json"),JSON.stringify(config,null,2)+"\n");
console.log("Prepared public Rehabwheel pages and assets for a native Android build.");
