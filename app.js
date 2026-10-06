const progress=document.getElementById('progress');
if(progress)addEventListener('scroll',()=>{const h=document.documentElement,den=h.scrollHeight-h.clientHeight;progress.style.width=(den?Math.min(100,h.scrollTop/den*100):0)+'%'},{passive:true});
const revealEls=document.querySelectorAll('.section-head,.cards article,.panel,.research-card,.patents>div,.journey-grid>div,.product-band-inner>*,.spec-grid>div,.clinical-grid>*,.audience-grid>*');
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){revealEls.forEach(el=>el.classList.add('show'));}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -4%'});revealEls.forEach(el=>{el.classList.add('reveal');observer.observe(el)});}
const modes={passive:{k:'MOTOR-ASSISTED',t:'Passive motion',c:'The system drives the pedal cycle to provide continuous lower-limb movement.',v:'Assist'},active:{k:'USER-DRIVEN',t:'Active motion',c:'The user drives the movement while the platform is designed to sense and track the session.',v:'Active'},resistance:{k:'ADJUSTABLE LOAD',t:'Resistance training',c:'Planned adjustable resistance supports progressively configured lower-limb exercise sessions.',v:'1–15'}};
document.querySelectorAll('.mode-tab').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.mode-tab').forEach(x=>x.classList.remove('active'));button.classList.add('active');const m=modes[button.dataset.mode];document.getElementById('mode-kicker').textContent=m.k;document.getElementById('mode-title').textContent=m.t;document.getElementById('mode-copy').textContent=m.c;document.getElementById('mode-value').textContent=m.v;}));
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>10),{passive:true});
if(toggle&&mobile){
 mobile.id=mobile.id||'mobile-navigation';
 toggle.setAttribute('aria-controls',mobile.id);
 toggle.setAttribute('type','button');
 const syncPosition=()=>mobile.style.setProperty('--menu-top',header.getBoundingClientRect().bottom+'px');
 const closeMenu=()=>{mobile.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');mobile.setAttribute('aria-hidden','true');mobile.inert=true;};
 closeMenu();
 toggle.addEventListener('click',()=>{const open=!mobile.classList.contains('open');if(!open){closeMenu();return;}syncPosition();mobile.inert=false;mobile.classList.add('open');document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close navigation');mobile.setAttribute('aria-hidden','false');mobile.querySelector('a')?.focus();});
 mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{
  if(!mobile.classList.contains('open'))return;
  if(e.key==='Escape'){closeMenu();toggle.focus();}
  if(e.key==='Tab'){const items=[toggle,...mobile.querySelectorAll('a[href],button:not([disabled])')],first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 });
 addEventListener('resize',()=>{if(getComputedStyle(toggle).display==='none')closeMenu();else if(mobile.classList.contains('open'))syncPosition();});
}
document.querySelectorAll('.attach-step').forEach(step=>step.addEventListener('click',()=>{document.querySelectorAll('.attach-step').forEach(s=>s.classList.remove('active'));step.classList.add('active');const visual=document.querySelector('.attach-visual');if(visual)visual.dataset.step=step.dataset.step;}));
const rpm=document.querySelector('#rpm'),res=document.querySelector('#resistance'),dur=document.querySelector('#duration');if(rpm){const sync=()=>{document.querySelector('#rpmValue').textContent=rpm.value+' RPM';document.querySelector('#bigRpm').textContent=rpm.value;document.querySelector('#resValue').textContent=res.value+' / 15';document.querySelector('#resReadout').textContent=res.value;document.querySelector('#durationValue').textContent=dur.value+' min';document.querySelector('#durationReadout').textContent=dur.value+' min'};[rpm,res,dur].forEach(x=>x.addEventListener('input',sync));document.querySelectorAll('[data-sim-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-sim-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#modeValue').textContent=b.dataset.simMode;}));sync();}
document.querySelectorAll('[data-inquiry]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-inquiry]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const subject=btn.dataset.inquiry;const title=document.querySelector('#inquiryTitle'),email=document.querySelector('#inquiryEmail');if(title)title.textContent=subject;if(email)email.href='mailto:info@rehabwheel.com?subject='+encodeURIComponent(subject);}));
/* Rehabwheel analytics + AI assistant */
window.rwAnalytics=window.rwAnalytics||{queue:[],session:crypto.randomUUID?crypto.randomUUID():String(Date.now()),track:function(name,data={}){const event={name,data,path:location.pathname,ts:new Date().toISOString(),session:this.session};this.queue.push(event);if(this.queue.length>250)this.queue.splice(0,this.queue.length-250);try{const parsed=JSON.parse(localStorage.getItem("rw_analytics")||"[]");const stored=Array.isArray(parsed)?parsed:[];stored.push(event);localStorage.setItem("rw_analytics",JSON.stringify(stored.slice(-250)));}catch(e){} window.dispatchEvent(new CustomEvent("rw:analytics",{detail:event}));}};
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
 let aiTurns=0;const toggle=open=>{panel.hidden=!open;launch.setAttribute("aria-expanded",String(open));if(open){rwAnalytics.track("ai_open");setTimeout(()=>input.focus(),50)}else launch.focus()};
 launch.onclick=()=>toggle(panel.hidden);close.onclick=()=>toggle(false);
 const add=(who,txt)=>{const d=document.createElement("div");d.className="rw-ai-msg "+who;d.innerHTML="<b>"+(who==="bot"?"AI Assistant":"You")+"</b><p></p>";d.querySelector("p").textContent=txt;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d};
 const localAnswer=q=>{const x=q.toLowerCase();
  if(x.includes("attach")||x.includes("wheelchair")) return "LegMaker is being developed as a compact lower-limb motion unit designed around common 16-, 18- and 20-inch manual wheelchairs. See the real prototype photos on this page for the current development configuration.";
  if(x.includes("mode")||x.includes("passive")||x.includes("active")||x.includes("resistance")) return "The product direction includes three modes: Passive motor-assisted motion, Active user-driven movement, and Resistance exercise with up to 15 planned levels.";
  if(x.includes("demo")||x.includes("contact")) return "You can request a LegMaker demo through the Rehabwheel contact form. I can take you there now: use the Request a Demo button on this page.";
  if(x.includes("status")||x.includes("available")||x.includes("availability")) return "LegMaker is under development. Contact Rehabwheel for current development and evaluation opportunities.";
  if(x.includes("research")||x.includes("clinical")) return "Rehabwheel is preparing structured usability, engineering and clinical evaluation work. The product is under development; the website does not represent regulatory clearance or clinical efficacy.";
  if(x.includes("legmaker")||x.includes("what is")) return "LegMaker is Rehabwheel’s wheelchair-integrated lower-limb motion platform under development for assisted, active and resistance exercise, with connected session information in the roadmap.";
  return null;
 };
 const ask=async q=>{q=q.trim().slice(0,600);if(!q)return;aiTurns++;add("user",q);input.value="";rwAnalytics.track("ai_question",{length:q.length,turn:aiTurns});
  const local=localAnswer(q);if(local){setTimeout(()=>add("bot",local),180);return}
  const endpoint=document.querySelector('meta[name="rehabwheel-assistant-endpoint"]')?.content;if(!endpoint){add("bot","I can help with LegMaker, wheelchair attachment, exercise modes, development status and demo requests. For other questions, contact the Rehabwheel team.");return;}
  const wait=add("bot","Thinking…");
  try{const r=await fetch(endpoint,{signal:AbortSignal.timeout(12000),method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,page:location.pathname})});if(!r.ok)throw new Error();const j=await r.json();wait.querySelector("p").textContent=j.answer||"I couldn't answer that question.";}
  catch(e){wait.querySelector("p").textContent="The live AI connection is being configured. For now, I can answer common LegMaker questions or help you request a demo.";rwAnalytics.track("ai_api_unavailable");}
 };
 form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
 document.querySelectorAll("[data-ai-q]").forEach(b=>b.addEventListener("click",()=>ask(b.dataset.aiQ)));
}

document.addEventListener("keydown",e=>{if(e.key==="Escape"){const p=document.getElementById("rwAiPanel");const l=document.getElementById("rwAiLaunch");if(p&&!p.hidden){p.hidden=true;l?.setAttribute("aria-expanded","false");l?.focus()}}});
document.addEventListener("submit",e=>{if(e.target.matches(".web-contact-form"))rwAnalytics.track("lead_form_submit",{type:e.target.querySelector('[name="Inquiry type"]')?.value||"unknown"})});

/* Current-page navigation semantics */
(()=>{const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.links a,.mobile-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0];if(href===current&&!(a.getAttribute('href')||'').includes('#'))a.setAttribute('aria-current','page')})})();

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
 panel.querySelector("[data-clear]").onclick=()=>{try{localStorage.removeItem("rw_analytics")}catch{}A.queue.length=0;render();A.track("analytics_local_reset")};
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

/* Load video players only after an explicit click. */
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.video;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';frame.title=button.getAttribute('aria-label');frame.allow='autoplay; encrypted-media; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';button.parentElement.replaceChildren(frame);frame.focus();window.rwAnalytics?.track('video_play',{video:id});}));
/* Accessible validation; never report a completed submission before delivery. */
document.querySelectorAll('.web-contact-form,.rw-subscribe-form').forEach(form=>{
 form.noValidate=true;
 const status=document.createElement('p');status.className='form-error';status.setAttribute('role','alert');form.appendChild(status);
 form.addEventListener('submit',event=>{
  form.querySelectorAll('[aria-invalid]').forEach(field=>field.removeAttribute('aria-invalid'));
  if(!form.checkValidity()){
   event.preventDefault();const invalid=form.querySelector(':invalid');
   const name=invalid?.closest('label')?.querySelector('span')?.textContent?.trim()||invalid?.name||'This field';
   status.textContent=invalid?.type==='checkbox'?'Please select the required consent checkbox.':invalid?.validity.typeMismatch?'Please enter a valid email address.':invalid?.validity.tooLong?'Please shorten this field.':name+' is required.';
   form.querySelectorAll(':invalid').forEach(field=>field.setAttribute('aria-invalid','true'));invalid?.focus();
  }else{
   status.textContent='';window.rwAnalytics?.track('form_valid_submission',{form:form.classList.contains('rw-subscribe-form')?'subscribe':'contact'});
  }
 });
 const clear=event=>{if(event.target.validity?.valid)event.target.removeAttribute('aria-invalid');if(form.checkValidity())status.textContent='';};
 form.addEventListener('input',clear);form.addEventListener('change',clear);
});

/* Rehabwheel's 50 original line icons. Decorative icons preserve text labels. */
(()=>{const icons={"home":"M3 10 12 3 21 10M5 9v12h14V9M10 21v-7h4v7","wheelchair":"M9 3v8h7l3 8 3-1M9 7h7M7 12a6 6 0 1 0 8 7","motion":"M3 12h18M16 7l5 5-5 5M8 5H3M8 19H3","technology":"M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4","clinicians":"M8 3v6a4 4 0 0 0 8 0V3M6 3h4M14 3h4M12 13v3a4 4 0 0 0 8 0v-3M18 11h4v3h-4z","research":"M9 3h6M10 3v6L4 19q-1 2 2 2h12q3 0 2-2L14 9V3M7 15h10","company":"M5 21V3h14v18M3 21h18M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-6h4v6","partners":"M3 9l4-4 5 2 5-2 4 4-4 10-5-2-5 2zM7 10l5 4 5-4","mail":"M3 5h18v14H3zM3 6l9 7 9-7","phone":"M5 3h4l2 5-3 2q2 4 6 6l2-3 5 2v4q-1 3-6 1Q4 16 3 6z","calendar":"M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2","play":"M8 4l13 8-13 8z","team":"M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6M16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 21v-4q0-5 6-5t6 5v4M16 13q6 0 6 5v3","person":"M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-3q0-5 8-5t8 5v3","advisor":"M3 8l9-5 9 5-9 5zM6 10v6q6 5 12 0v-6M21 8v9","leadership":"M3 6l4 5 5-8 5 8 4-5-2 13H5zM6 22h12","heart":"M12 21 3 12C-3 3 9 0 12 7c3-7 15-4 9 5z","pulse":"M2 12h5l3-8 4 16 3-8h5","shield":"M12 3l9 3v7q-1 6-9 9-8-3-9-9V6zM8 12l3 3 5-6","lock":"M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3M12 14v3","privacy":"M3 12q9-12 18 0-9 12-18 0M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0M3 3l18 18","document":"M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6","patent":"M8 3h8v10H8zM8 6h8M8 10h8M10 13l-2 8 4-2 4 2-2-8","check":"M4 12l5 5L20 6","arrow":"M3 12h18M15 6l6 6-6 6","external":"M14 3h7v7M21 3l-9 9M10 5H3v16h16v-7","search":"M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14M15 15l6 6","menu":"M3 6h18M3 12h18M3 18h18","close":"M5 5l14 14M19 5 5 19","download":"M12 3v12M7 10l5 5 5-5M3 16v5h18v-5","upload":"M12 16V3M7 8l5-5 5 5M3 16v5h18v-5","cloud":"M6 19h12a4 4 0 0 0 0-8 6 6 0 0 0-12-2 5 5 0 0 0 0 10","data":"M3 6q9-6 18 0v12q-9 6-18 0zM3 6q9 6 18 0M3 12q9 6 18 0","chart":"M3 3v18h18M7 17v-5M12 17V8M17 17V5","settings":"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2","battery":"M2 6h18v12H2zM23 10v4M6 10v4M10 10v4M14 10v4","bluetooth":"M12 2v20l6-6L6 6M6 18 18 8 12 2","wifi":"M2 8q10-10 20 0M5 12q7-7 14 0M8 16q4-4 8 0M12 20h.01","timer":"M9 2h6M12 2v3M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14M12 10v5l3 2M18 6l2-2","resistance":"M2 9h3v6H2zM5 6h3v12H5zM8 12h8M16 6h3v12h-3zM19 9h3v6h-3z","active":"M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4M12 7v6h6l3 7h2M12 9h5M8 10a6 6 0 1 0 7 8","passive":"M4 12a8 8 0 0 1 14-5M18 3v4h-4M20 12a8 8 0 0 1-14 5M6 21v-4h4","accessibility":"M12 3h.01M3 7l9 2 9-2M12 9v6M12 15l-5 7M12 15l5 7","location":"M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13M9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0","globe":"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M2 12h20M12 2q-8 10 0 20M12 2q8 10 0 20","message":"M3 3h18v14H8l-5 5zM7 8h10M7 12h6","newsletter":"M3 5h18v16H3zM7 9h4v4H7zM14 9h3M14 13h3M7 17h10","hand":"M7 13V6q0-3 3-3v8-6q3-3 3 0v6-5q3-2 3 1v5-3q3-1 3 2v6q0 5-6 5h-3q-3 0-5-4l-3-5q0-3 3-1l2 2","lightbulb":"M9 18h6M9 22h6M9 18v-3a7 7 0 1 1 6 0v3M12 2v2","sparkles":"M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM20 2v4M18 4h4","send":"M3 3l18 9-18 9 4-9zM7 12h14","info":"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 7h.01M12 11v6","help":"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M9 8q0-3 3-3t3 3q0 2-3 3v2M12 17h.01","clipboard":"M8 4H5v17h14V4h-3M8 2h8v4H8zM8 11h8M8 15h6","target":"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4","flag":"M5 22V3q4-3 8 0t7 0v10q-3 3-7 0t-8 0","link":"M10 13l4-4M8 15l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 9l2-2a4 4 0 0 0-6-6L8 5","layers":"M2 8l10-5 10 5-10 5zM2 12l10 5 10-5M2 16l10 5 10-5","expand":"M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6","collapse":"M9 3v6H3M21 9h-6V3M15 21v-6h6M3 15h6v6","plus":"M12 4v16M4 12h16","minus":"M4 12h16","refresh":"M20 8a8 8 0 0 0-14-3L3 8M3 3v5h5M4 16a8 8 0 0 0 14 3l3-3M16 16h5v5","stop":"M5 5h14v14H5z","image":"M3 3h18v18H3zM3 16l6-6 5 5 3-3 4 4M15 7h.01","zoom":"M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14M15 15l6 6M7 10h6M10 7v6","book":"M12 5q-5-3-10 0v15q5-3 10 0 5-3 10 0V5q-5-3-10 0v15","route":"M5 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4M19 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4M5 9v5q0 3 5 3h2M19 15V9q0-3-5-3h-2","briefcase":"M3 7h18v14H3zM8 7V3h8v4M3 12q9 6 18 0M10 12h4v4h-4z","bell":"M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM10 21h4M12 2v2"};const svg=name=>{const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 24 24');el.setAttribute('class','rw-icon');el.setAttribute('aria-hidden','true');el.setAttribute('focusable','false');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',icons[name]||icons.sparkles);el.appendChild(p);return el;};
const names={'LegMaker':'wheelchair','Technology':'technology','Clinicians':'clinicians','Research':'research','Company':'company','Partners':'partners','Contact':'mail','Request demo':'message'};
/* Compact desktop navigation stays text-led; mobile rows have useful visual cues. */
document.querySelectorAll('.mobile-nav a').forEach(a=>{const name=names[a.textContent.trim()];if(name)a.prepend(svg(name));});
const topics={
'Wheelchair-first fit':'wheelchair','Lower-limb focus':'motion','Connected sessions':'data',
'The chair stays central.':'wheelchair','Movement becomes configurable.':'settings','Sessions become readable.':'chart',
'Purposeful controls.':'settings','Metrics that stay readable.':'chart',
'Wheelchair users':'wheelchair','Rehabilitation teams':'clinicians','Home & caregiver workflows':'home',
'Wheelchair users & caregivers':'wheelchair','Clinicians & care teams':'clinicians','Researchers':'research','Investors & partners':'partners',
'Engineering & product development':'technology','Connected product experience':'wifi','No implied clearance or efficacy':'document',
'Explore evaluation opportunities':'research','Build the next generation with us':'partners',
'Explore workflow and usability.':'accessibility','Study measurable movement.':'chart','Help build what comes next.':'partners',
'Fits the workflow':'wheelchair','Configures the motion':'settings','Connects the session':'data',
'Lower-limb movement':'motion','16 · 18 · 20 inch':'wheelchair','Rechargeable':'battery','Connected roadmap':'wifi',
'Position':'wheelchair','Configure':'settings','Move':'motion','Review':'chart',
'Motion':'motion','Control':'settings','Sense':'pulse','Connect':'wifi','Interpret':'chart',
'Controlled motion':'motion','Session readiness':'check','Device state':'battery','Development verification':'shield',
'Passive':'passive','Active':'active','Resistance':'resistance',
'Prototype documentation':'document','Usability and safety':'shield','Clinical evaluation':'research',
'Intelligent, accessible mobility hardware.':'wheelchair','Robotic assistance integrated into everyday life.':'technology','Mechatronics + clinical outcomes.':'pulse',
'Leadership & General Inquiries':'mail','Clinical Research & Partnerships':'research','Investor Relations & Strategic Growth':'partners','Regulatory & Compliance':'shield'
};
document.querySelectorAll('.cards article h3,.audience-grid>a h3,.spec-grid h3,.journey-grid h3,.clinical-grid h3,.contact-team-grid h3').forEach(title=>{
 const name=topics[title.textContent.trim()];
 if(name&&!title.querySelector('.rw-icon')){title.classList.add('rw-icon-heading');title.prepend(svg(name));}
});
document.querySelectorAll('.mode-tab,[data-sim-mode]').forEach(button=>{
 const name=topics[button.textContent.trim()];
 if(name&&!button.querySelector('.rw-icon')){button.classList.add('rw-icon-control');button.prepend(svg(name));}
});
document.querySelectorAll('.form-submit [aria-hidden="true"]').forEach(el=>el.replaceChildren(svg('send')));
const catalog=document.getElementById('icon-catalog');if(catalog)Object.keys(icons).forEach(name=>{const li=document.createElement('li');li.appendChild(svg(name));const label=document.createElement('span');label.textContent=name;li.appendChild(label);catalog.appendChild(li);});
})();

/* Deep links reveal optional content, including after a menu selection. */
(()=>{const revealTarget=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}const target=document.getElementById(id);if(!target)return;let p=target.parentElement,opened=false;while(p){if(p.tagName==='DETAILS'&&!p.open){p.open=true;opened=true}p=p.parentElement}if(opened)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));};addEventListener('hashchange',revealTarget);revealTarget();
const buttons=document.querySelectorAll('.mode-tab,[data-sim-mode]');buttons.forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')));b.addEventListener('click',()=>{const group=b.matches('.mode-tab')?'.mode-tab':'[data-sim-mode]';document.querySelectorAll(group).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))})});
document.querySelectorAll('.form-error[role=alert]').forEach(el=>{el.setAttribute('aria-live','assertive');el.id=el.id||'validation-'+Math.random().toString(36).slice(2);el.closest('form')?.querySelectorAll('input:not([type=hidden]),textarea,select').forEach(field=>{field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),el.id].filter(Boolean).join(' '))});});
})();

/* Full-photo viewer with keyboard navigation and native dialog focus handling. */
(()=>{const links=[...document.querySelectorAll('.outdoor-photo>a')];if(!links.length||!('HTMLDialogElement'in window))return;
const dialog=document.createElement('dialog');dialog.className='photo-viewer';dialog.setAttribute('aria-labelledby','photo-viewer-title');
dialog.innerHTML='<div class="photo-viewer-head"><h2 id="photo-viewer-title">Prototype photograph</h2><button type="button" data-close aria-label="Close photo viewer">×</button></div><div class="photo-viewer-stage"><button type="button" data-prev aria-label="Previous photograph">←</button><img alt=""><button type="button" data-next aria-label="Next photograph">→</button></div><div class="photo-viewer-foot"><p data-caption></p><div><span data-counter aria-live="polite"></span><a data-original target="_blank" rel="noopener noreferrer">Open original photo ↗</a></div></div>';
document.body.appendChild(dialog);let group=[],index=0,opener;
dialog.setAttribute('aria-describedby','photo-viewer-help');const help=document.createElement('p');help.id='photo-viewer-help';help.className='photo-viewer-help';help.textContent='Use arrow keys to browse. Press Escape to close.';dialog.querySelector('.photo-viewer-foot').appendChild(help);
const image=dialog.querySelector('img'),counter=dialog.querySelector('[data-counter]'),caption=dialog.querySelector('[data-caption]'),original=dialog.querySelector('[data-original]');
const show=()=>{const a=group[index],img=a.querySelector('img');image.width=Number(img.getAttribute('width'))||1440;image.height=Number(img.getAttribute('height'))||1080;image.src=a.href;image.alt=img.alt;image.decoding='async';dialog.querySelector('#photo-viewer-title').textContent=a.closest('figure').querySelector('figcaption strong')?.textContent||'Prototype photograph';caption.textContent=img.alt;counter.textContent=(index+1)+' / '+group.length;original.href=a.href;dialog.querySelector('[data-prev]').disabled=group.length<2;dialog.querySelector('[data-next]').disabled=group.length<2;};
const move=step=>{index=(index+step+group.length)%group.length;show();};
links.forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();opener=a;const grid=a.closest('.outdoor-grid,.prototype-grid');group=grid?[...grid.querySelectorAll('.outdoor-photo>a')]:links;index=group.indexOf(a);show();dialog.showModal();document.body.classList.add('photo-viewer-open');}));
dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-prev]').onclick=()=>move(-1);dialog.querySelector('[data-next]').onclick=()=>move(1);
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='Home'){e.preventDefault();index=0;show()}if(e.key==='End'){e.preventDefault();index=group.length-1;show()}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('photo-viewer-open');opener?.focus()});
})();

/* Keep persistent mobile actions from covering the content being read. */
(()=>{
 const cta=document.querySelector(".mobile-demo-cta");
 const ai=document.querySelector(".rw-ai");
 if(!cta&&!ai)return;
 const mobile=window.matchMedia("(max-width: 820px)");
 if(!mobile.matches)return;
 const panel=ai?.querySelector(".rw-ai-panel");
 let previousY=window.scrollY,scheduled=false;
 const setDismissed=dismissed=>{
  const hide=dismissed&&!(panel&&!panel.hidden);
  cta?.classList.toggle("scroll-dismissed",hide);
  ai?.classList.toggle("scroll-dismissed",hide);
 };
 const onScroll=()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   const y=window.scrollY,delta=y-previousY;
   if(Math.abs(delta)>4)setDismissed(y>180&&delta>0);
   previousY=y;scheduled=false;
  });
 };
 addEventListener("scroll",onScroll,{passive:true});
 document.addEventListener("focusin",event=>{
  if(event.target.closest(".mobile-demo-cta,.rw-ai"))setDismissed(false);
 });
 addEventListener("resize",()=>{if(!mobile.matches)setDismissed(false)},{passive:true});
})();

/* Shared control accessibility and navigation refinements. */
(()=>{
 const page=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('.links a,.mobile-nav a').forEach(a=>{
  const url=new URL(a.href,location.href);
  if(url.pathname.split('/').pop()===page&&!url.hash)a.setAttribute('aria-current','page');
 });
 document.querySelectorAll('.mode-switch,.sim-modes').forEach(group=>{
  group.setAttribute('role','group');
  group.setAttribute('aria-label',group.classList.contains('sim-modes')?'Session motion mode':'LegMaker motion mode');
  const buttons=[...group.querySelectorAll('button')];
  buttons.forEach((button,index)=>{
   button.type='button';
   button.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%buttons.length;
    if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+buttons.length)%buttons.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=buttons.length-1;
    if(next===undefined)return;
    event.preventDefault();buttons[next].focus();buttons[next].click();
   });
  });
 });
 const units={rpm:'RPM',resistance:'of 15',duration:'minutes'};
 Object.entries(units).forEach(([id,unit])=>{
  const field=document.getElementById(id);
  if(!field)return;
  const sync=()=>field.setAttribute('aria-valuetext',field.value+' '+unit);
  field.addEventListener('input',sync);sync();
 });
 const menu=document.querySelector('.mobile-nav'),toggle=document.querySelector('.menu-toggle');
 document.addEventListener('click',event=>{
  if(menu?.classList.contains('open')&&!event.target.closest('.mobile-nav,.menu-toggle'))toggle?.click();
 });
 document.querySelectorAll('a[target="_blank"]').forEach(a=>{
  a.rel=[...new Set((a.rel+' noopener noreferrer').trim().split(/\s+/))].join(' ');
 });
})();

/* Announce motion changes without interrupting focus, and recover failed photos. */
(()=>{
 const stage=document.querySelector('.mode-stage');
 if(stage){
  stage.setAttribute('role','region');stage.setAttribute('aria-label','Selected motion mode');
  const status=document.createElement('p');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-atomic','true');stage.appendChild(status);
  document.querySelectorAll('.mode-tab').forEach(button=>button.addEventListener('click',()=>{
   status.textContent=document.getElementById('mode-title').textContent+'. '+document.getElementById('mode-copy').textContent;
  }));
 }
 const photo=document.querySelector('.photo-viewer-stage img');
 if(photo){
  const notice=document.createElement('p');notice.className='photo-load-error';notice.hidden=true;notice.setAttribute('role','status');photo.parentElement.appendChild(notice);
  photo.addEventListener('error',()=>{notice.hidden=false;notice.textContent='This photograph could not load. Try the next image or open the original photo below.';photo.style.display='none';});
  photo.addEventListener('load',()=>{notice.hidden=true;photo.style.display='block';});
 }
})();
