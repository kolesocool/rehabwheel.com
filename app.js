const progress=document.getElementById('progress');
if(progress)addEventListener('scroll',()=>{const h=document.documentElement,den=h.scrollHeight-h.clientHeight;progress.style.width=(den?Math.min(100,h.scrollTop/den*100):0)+'%'},{passive:true});
const revealEls=document.querySelectorAll('.section-head,.cards article,.panel,.research-card,.patents>div,.journey-grid>div,.product-band-inner>*,.spec-grid>div,.clinical-grid>*,.audience-grid>*');
if(matchMedia('(prefers-reduced-motion: reduce)').matches){revealEls.forEach(el=>el.classList.add('show'));}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -4%'});revealEls.forEach(el=>{el.classList.add('reveal');observer.observe(el)});}
const modes={passive:{k:'MOTOR-ASSISTED',t:'Passive motion',c:'The system drives the pedal cycle to provide continuous lower-limb movement.',v:'Assist'},active:{k:'USER-DRIVEN',t:'Active motion',c:'The user drives the movement while the platform is designed to sense and track the session.',v:'Active'},resistance:{k:'ADJUSTABLE LOAD',t:'Resistance training',c:'Planned adjustable resistance supports progressively configured lower-limb exercise sessions.',v:'1–15'}};
document.querySelectorAll('.mode-tab').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.mode-tab').forEach(x=>x.classList.remove('active'));button.classList.add('active');const m=modes[button.dataset.mode];document.getElementById('mode-kicker').textContent=m.k;document.getElementById('mode-title').textContent=m.t;document.getElementById('mode-copy').textContent=m.c;document.getElementById('mode-value').textContent=m.v;}));
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>10),{passive:true});
if(toggle&&mobile){const closeMenu=()=>{mobile.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');mobile.setAttribute('aria-hidden','true');};toggle.addEventListener('click',()=>{const open=!mobile.classList.contains('open');mobile.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-hidden',String(!open));if(open)mobile.querySelector('a')?.focus();});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobile.classList.contains('open')){closeMenu();toggle.focus()}});}
document.querySelectorAll('.attach-step').forEach(step=>step.addEventListener('click',()=>{document.querySelectorAll('.attach-step').forEach(s=>s.classList.remove('active'));step.classList.add('active');const visual=document.querySelector('.attach-visual');if(visual)visual.dataset.step=step.dataset.step;}));
const rpm=document.querySelector('#rpm'),res=document.querySelector('#resistance'),dur=document.querySelector('#duration');if(rpm){const sync=()=>{document.querySelector('#rpmValue').textContent=rpm.value+' RPM';document.querySelector('#bigRpm').textContent=rpm.value;document.querySelector('#resValue').textContent=res.value+' / 15';document.querySelector('#resReadout').textContent=res.value;document.querySelector('#durationValue').textContent=dur.value+' min';document.querySelector('#durationReadout').textContent=dur.value+' min'};[rpm,res,dur].forEach(x=>x.addEventListener('input',sync));document.querySelectorAll('[data-sim-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-sim-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#modeValue').textContent=b.dataset.simMode;}));sync();}
document.querySelectorAll('[data-inquiry]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-inquiry]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const subject=btn.dataset.inquiry;const title=document.querySelector('#inquiryTitle'),email=document.querySelector('#inquiryEmail');if(title)title.textContent=subject;if(email)email.href='mailto:info@rehabwheel.com?subject='+encodeURIComponent(subject);}));
/* Rehabwheel analytics + AI assistant */
window.rwAnalytics=window.rwAnalytics||{queue:[],session:crypto.randomUUID?crypto.randomUUID():String(Date.now()),track:function(name,data={}){const event={name,data,path:location.pathname,ts:new Date().toISOString(),session:this.session};this.queue.push(event);try{const stored=JSON.parse(localStorage.getItem("rw_analytics")||"[]");stored.push(event);localStorage.setItem("rw_analytics",JSON.stringify(stored.slice(-250)));}catch(e){} window.dispatchEvent(new CustomEvent("rw:analytics",{detail:event}));}};
const rwParams=new URLSearchParams(location.search);rwAnalytics.track("page_view",{title:document.title,referrer:document.referrer?(()=>{try{return new URL(document.referrer).hostname}catch(e){return "unknown"}})():"direct",viewport:innerWidth+"x"+innerHeight,utm_source:rwParams.get("utm_source")||"",utm_medium:rwParams.get("utm_medium")||"",utm_campaign:rwParams.get("utm_campaign")||""});
let rwMaxScroll=0;addEventListener("scroll",()=>{const d=document.documentElement,p=Math.round((d.scrollTop/(d.scrollHeight-d.clientHeight))*100);[25,50,75,90].forEach(n=>{if(p>=n&&rwMaxScroll<n){rwMaxScroll=n;rwAnalytics.track("scroll_depth",{percent:n})}})},{passive:true});
let rwExitTracked=false;const rwTrackExit=()=>{if(rwExitTracked)return;rwExitTracked=true;rwAnalytics.track("page_exit",{seconds:Math.round(performance.now()/1000),maxScroll:rwMaxScroll})};document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")rwTrackExit()});addEventListener("pagehide",rwTrackExit);
document.addEventListener("click",e=>{
 const a=e.target.closest("a"); if(a){
  const href=a.getAttribute("href")||"";
  if(href.startsWith("mailto:")) rwAnalytics.track("email_click",{href});
  else if(href.startsWith("tel:")) rwAnalytics.track("phone_click",{href});
  else if(/contact\.html.*demo|#demo/.test(href)) rwAnalytics.track("demo_cta_click",{href,text:a.textContent.trim()});
  else if(/^https?:/.test(href)&&!href.includes(location.hostname)) rwAnalytics.track("outbound_click",{href});
 }
});
const ai=document.getElementById("rehabwheelAI");
if(ai){
 const launch=document.getElementById("rwAiLaunch"),panel=document.getElementById("rwAiPanel"),close=document.getElementById("rwAiClose"),form=document.getElementById("rwAiForm"),input=document.getElementById("rwAiInput"),msgs=document.getElementById("rwAiMessages");
 let aiTurns=0;const toggle=open=>{panel.hidden=!open;launch.setAttribute("aria-expanded",String(open));if(open){rwAnalytics.track("ai_open");setTimeout(()=>input.focus(),50)}};
 launch.onclick=()=>toggle(panel.hidden);close.onclick=()=>toggle(false);
 const add=(who,txt)=>{const d=document.createElement("div");d.className="rw-ai-msg "+who;d.innerHTML="<b>"+(who==="bot"?"AI Assistant":"You")+"</b><p></p>";d.querySelector("p").textContent=txt;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d};
 const localAnswer=q=>{const x=q.toLowerCase();
  if(x.includes("attach")||x.includes("wheelchair")) return "LegMaker is being developed as a compact lower-limb motion unit designed around common 16-, 18- and 20-inch manual wheelchairs. See the real prototype photos on this page for the current development configuration.";
  if(x.includes("mode")||x.includes("passive")||x.includes("active")||x.includes("resistance")) return "The product direction includes three modes: Passive motor-assisted motion, Active user-driven movement, and Resistance exercise with up to 15 planned levels.";
  if(x.includes("demo")||x.includes("contact")) return "You can request a LegMaker demo through the Rehabwheel contact form. I can take you there now: use the Request a Demo button on this page.";
  if(x.includes("research")||x.includes("clinical")) return "Rehabwheel is preparing structured usability, engineering and clinical evaluation work. The product is under development; the website does not represent regulatory clearance or clinical efficacy.";
  if(x.includes("legmaker")||x.includes("what is")) return "LegMaker is Rehabwheel’s wheelchair-integrated lower-limb motion platform under development for assisted, active and resistance exercise, with connected session information in the roadmap.";
  return null;
 };
 const ask=async q=>{q=q.trim();if(!q)return;aiTurns++;add("user",q);input.value="";rwAnalytics.track("ai_question",{length:q.length,turn:aiTurns});
  const local=localAnswer(q);if(local){setTimeout(()=>add("bot",local),180);return}
  const wait=add("bot","Thinking…");
  try{const r=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,page:location.pathname})});if(!r.ok)throw new Error();const j=await r.json();wait.querySelector("p").textContent=j.answer||"I couldn't answer that question.";}
  catch(e){wait.querySelector("p").textContent="The live AI connection is being configured. For now, I can answer common LegMaker questions or help you request a demo.";rwAnalytics.track("ai_api_unavailable");}
 };
 form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
 document.querySelectorAll("[data-ai-q]").forEach(b=>b.addEventListener("click",()=>ask(b.dataset.aiQ)));
}

document.addEventListener("keydown",e=>{if(e.key==="Escape"){const p=document.getElementById("rwAiPanel");const l=document.getElementById("rwAiLaunch");if(p&&!p.hidden){p.hidden=true;l?.setAttribute("aria-expanded","false");l?.focus()}}});
document.addEventListener("submit",e=>{if(e.target.matches(".web-contact-form"))rwAnalytics.track("lead_form_submit",{type:e.target.querySelector('[name="Inquiry type"]')?.value||"unknown"})});

/* Current-page navigation semantics */
(()=>{const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.links a,.mobile-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0];if(href===current)a.setAttribute('aria-current','page')})})();

/* Analytics console + richer conversion instrumentation */
(()=> {
 const A=window.rwAnalytics;if(!A)return;
 const safeEvents=()=>{try{return JSON.parse(localStorage.getItem("rw_analytics")||"[]")}catch(e){return[]}};
 const summarize=()=>{const ev=safeEvents(),count=n=>ev.filter(x=>x.name===n).length,pages=[...new Set(ev.filter(x=>x.name==="page_view").map(x=>x.path))];
  return {events:ev.length,pageViews:count("page_view"),pages:pages.length,demos:count("demo_cta_click"),aiQuestions:count("ai_question"),leads:count("lead_form_submit"),outbound:count("outbound_click"),maxScroll:Math.max(0,...ev.filter(x=>x.name==="scroll_depth").map(x=>Number(x.data?.percent)||0))}};
 window.rwAnalytics.summary=summarize;
 document.addEventListener("click",e=>{const el=e.target.closest("button,[data-mode],[data-sim-mode],[data-inquiry],summary");if(!el)return;
  if(el.matches(".mode-tab"))A.track("product_mode_interaction",{mode:el.dataset.mode});
  else if(el.hasAttribute("data-sim-mode"))A.track("simulator_mode_interaction",{mode:el.dataset.simMode});
  else if(el.hasAttribute("data-inquiry"))A.track("inquiry_type_select",{type:el.dataset.inquiry});
  else if(el.tagName==="SUMMARY")A.track("faq_open",{question:el.textContent.trim().slice(0,120)});
 });
 const panel=document.createElement("aside");panel.className="rw-insights";panel.id="rwInsights";panel.hidden=true;panel.setAttribute("aria-label","Local analytics preview");
 panel.innerHTML='<div class="rw-insights-head"><div><small>FIRST-PARTY ANALYTICS</small><strong>Local insights</strong></div><button type="button" aria-label="Close analytics">×</button></div><div class="rw-insights-grid"></div><div class="rw-insights-foot"><span>Stored only in this browser</span><button type="button" data-clear>Clear local data</button></div>';
 document.body.appendChild(panel);
 const render=()=>{const x=A.summary();panel.querySelector(".rw-insights-grid").innerHTML=[["Page views",x.pageViews],["Pages",x.pages],["CTA clicks",x.ctaClicks||0],["Demo rate",(x.demoRate||0)+"%"],["Lead rate",(x.leadRate||0)+"%"],["AI use",(x.aiRate||0)+"%"],["Sections",x.engagedSections||0],["Max scroll",x.maxScroll+"%"]].map(([k,v])=>'<div><strong>'+v+'</strong><span>'+k+'</span></div>').join("")};
 panel.querySelector(".rw-insights-head button").onclick=()=>panel.hidden=true;
 panel.querySelector("[data-clear]").onclick=()=>{localStorage.removeItem("rw_analytics");A.queue.length=0;render();A.track("analytics_local_reset")};
 window.rwAnalytics.openDashboard=()=>{render();panel.hidden=false;A.track("analytics_dashboard_open")};
 if(new URLSearchParams(location.search).get("analytics")==="1")setTimeout(()=>window.rwAnalytics.openDashboard(),300);
})();

/* X10000 funnel analytics */
(()=>{const A=window.rwAnalytics;if(!A)return;
 const started=performance.now(),seen=new Set(),sectionStart=new Map();
 const classify=a=>{const t=(a.textContent||"").trim().toLowerCase(),h=a.getAttribute("href")||"";if(/demo/.test(t+h))return"demo";if(/question|contact|connect/.test(t+h))return"contact";if(/legmaker/.test(t+h))return"product";if(/research/.test(t+h))return"research";if(/invest/.test(t+h))return"investor";return"navigation"};
 document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a)return;A.track("cta_click",{kind:classify(a),label:(a.textContent||"").trim().slice(0,80),href:a.getAttribute("href")||"",from:location.pathname})});
 const sections=[...document.querySelectorAll("main section[id],main section")];if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>es.forEach(x=>{const key=x.target.id||("section-"+sections.indexOf(x.target));if(x.isIntersecting){if(!seen.has(key)){seen.add(key);A.track("section_view",{section:key})}sectionStart.set(key,performance.now())}else if(sectionStart.has(key)){const sec=Math.round((performance.now()-sectionStart.get(key))/1000);if(sec>=2)A.track("section_engagement",{section:key,seconds:sec});sectionStart.delete(key)}}),{threshold:.45});sections.forEach(x=>io.observe(x))}
 const original=A.summary;A.summary=()=>{const base=original(),ev=(()=>{try{return JSON.parse(localStorage.getItem("rw_analytics")||"[]")}catch(e){return[]}})(),count=n=>ev.filter(x=>x.name===n).length;
  const views=Math.max(1,count("page_view")),demo=count("demo_cta_click"),leads=count("lead_form_submit"),ai=count("ai_question"),cta=count("cta_click");
  return {...base,ctaClicks:cta,demoRate:Math.round(demo/views*100),leadRate:Math.round(leads/views*100),aiRate:Math.round(ai/views*100),engagedSections:new Set(ev.filter(x=>x.name==="section_view").map(x=>x.data?.section)).size};
 };
 addEventListener("pagehide",()=>A.track("session_summary",{seconds:Math.round((performance.now()-started)/1000),sections:seen.size,aiUsed:A.queue.some(x=>x.name==="ai_question"),demoIntent:A.queue.some(x=>x.name==="demo_cta_click")}),{once:true});
})();
