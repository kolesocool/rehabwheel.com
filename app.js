const progress=document.getElementById('progress');
if(progress)addEventListener('scroll',()=>{const h=document.documentElement,den=h.scrollHeight-h.clientHeight;progress.style.width=(den?Math.min(100,h.scrollTop/den*100):0)+'%'},{passive:true});
const revealEls=document.querySelectorAll('.section-head,.cards article,.panel,.research-card,.patents>div,.journey-grid>div,.product-band-inner>*,.spec-grid>div,.clinical-grid>*,.audience-grid>*');
if(matchMedia('(prefers-reduced-motion: reduce)').matches){revealEls.forEach(el=>el.classList.add('show'));}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -4%'});revealEls.forEach(el=>{el.classList.add('reveal');observer.observe(el)});}
const modes={passive:{k:'MOTOR-ASSISTED',t:'Passive motion',c:'The system drives the pedal cycle to provide continuous lower-limb movement.',v:'Assist'},active:{k:'USER-DRIVEN',t:'Active motion',c:'The user drives the movement while the platform is designed to sense and track the session.',v:'Active'},resistance:{k:'ADJUSTABLE LOAD',t:'Resistance training',c:'Planned adjustable resistance supports progressively configured lower-limb exercise sessions.',v:'1–15'}};
document.querySelectorAll('.mode-tab').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.mode-tab').forEach(x=>x.classList.remove('active'));button.classList.add('active');const m=modes[button.dataset.mode];document.getElementById('mode-kicker').textContent=m.k;document.getElementById('mode-title').textContent=m.t;document.getElementById('mode-copy').textContent=m.c;document.getElementById('mode-value').textContent=m.v;}));
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>10),{passive:true});
if(toggle&&mobile){toggle.addEventListener('click',()=>{const open=!mobile.classList.contains('open');mobile.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-hidden',String(!open));});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');mobile.setAttribute('aria-hidden','true');}));}
document.querySelectorAll('.attach-step').forEach(step=>step.addEventListener('click',()=>{document.querySelectorAll('.attach-step').forEach(s=>s.classList.remove('active'));step.classList.add('active');const visual=document.querySelector('.attach-visual');if(visual)visual.dataset.step=step.dataset.step;}));
const rpm=document.querySelector('#rpm'),res=document.querySelector('#resistance'),dur=document.querySelector('#duration');if(rpm){const sync=()=>{document.querySelector('#rpmValue').textContent=rpm.value+' RPM';document.querySelector('#bigRpm').textContent=rpm.value;document.querySelector('#resValue').textContent=res.value+' / 15';document.querySelector('#resReadout').textContent=res.value;document.querySelector('#durationValue').textContent=dur.value+' min';document.querySelector('#durationReadout').textContent=dur.value+' min'};[rpm,res,dur].forEach(x=>x.addEventListener('input',sync));document.querySelectorAll('[data-sim-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-sim-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#modeValue').textContent=b.dataset.simMode;}));sync();}
document.querySelectorAll('[data-inquiry]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-inquiry]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const subject=btn.dataset.inquiry;const title=document.querySelector('#inquiryTitle'),email=document.querySelector('#inquiryEmail');if(title)title.textContent=subject;if(email)email.href='mailto:info@rehabwheel.com?subject='+encodeURIComponent(subject);}));
/* Rehabwheel analytics + AI assistant */
window.rwAnalytics=window.rwAnalytics||{queue:[],session:crypto.randomUUID?crypto.randomUUID():String(Date.now()),track:function(name,data={}){const event={name,data,path:location.pathname,ts:new Date().toISOString(),session:this.session};this.queue.push(event);try{const stored=JSON.parse(localStorage.getItem("rw_analytics")||"[]");stored.push(event);localStorage.setItem("rw_analytics",JSON.stringify(stored.slice(-250)));}catch(e){} window.dispatchEvent(new CustomEvent("rw:analytics",{detail:event}));}};
rwAnalytics.track("page_view",{title:document.title,referrer:document.referrer?new URL(document.referrer).hostname:"direct",viewport:innerWidth+"x"+innerHeight});
let rwMaxScroll=0;addEventListener("scroll",()=>{const d=document.documentElement,p=Math.round((d.scrollTop/(d.scrollHeight-d.clientHeight))*100);[25,50,75,90].forEach(n=>{if(p>=n&&rwMaxScroll<n){rwMaxScroll=n;rwAnalytics.track("scroll_depth",{percent:n})}})},{passive:true});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")rwAnalytics.track("page_exit",{seconds:Math.round(performance.now()/1000),maxScroll:rwMaxScroll})});
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
