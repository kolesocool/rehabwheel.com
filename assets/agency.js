/* Shared usability, form delivery and explorer refinements. No form data is stored locally. */
(()=>{'use strict';
const init=()=>{
 const current=location.pathname==='/'?'/index.html':location.pathname;
 document.querySelectorAll('.site-header a[href]').forEach(a=>{const u=new URL(a.href,location.href);if(u.pathname===current&&!u.hash)a.setAttribute('aria-current','page');});
 document.querySelectorAll('[data-print-page]').forEach(b=>b.addEventListener('click',()=>window.print()));
 document.querySelectorAll('.web-contact-form,.rw-subscribe-form').forEach(form=>{
  const fallback=document.createElement('p');fallback.className='agency-form-fallback';fallback.innerHTML='Prefer email? <a href="mailto:nikita@rehabwheel.com">nikita@rehabwheel.com</a>';form.append(fallback);
  const status=document.createElement('p');status.className='agency-submit-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(status);
  form.querySelectorAll('[required]').forEach(field=>{const label=field.closest('label')?.querySelector('span');if(label&&!label.querySelector('.agency-required')){const mark=document.createElement('small');mark.className='agency-required';mark.textContent=' (required)';label.append(mark);}});
 });
 document.addEventListener('submit',async event=>{
  const form=event.target;if(!form.matches('.web-contact-form,.rw-subscribe-form'))return;
  const prevented=event.defaultPrevented;event.preventDefault();
  if(prevented||!form.checkValidity()||form.dataset.sending==='true'||form.dataset.accepted==='true')return;
  const action=new URL(form.action);if(action.origin!=='https://formsubmit.co')return;
  const status=form.querySelector('.agency-submit-status'),button=form.querySelector('[type=submit]');const old=button.innerHTML;
  form.dataset.sending='true';form.setAttribute('aria-busy','true');button.disabled=true;button.textContent='Sending…';status.textContent='Sending your request. Keep this page open.';
  try{
   const data=Object.fromEntries(new FormData(form));delete data._next;
   const response=await fetch(action.origin+'/ajax'+action.pathname,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw Error('provider');const receipt=await response.json();if(receipt.success!==true&&receipt.success!=='true')throw Error('unconfirmed');
   const newsletter=form.matches('.rw-subscribe-form'),order=form.matches('.po-form');
   status.textContent=newsletter?'Your subscription request was accepted by the delivery service. The Rehabwheel team still needs to process it.':order?'Your purchasing inquiry was accepted by the delivery service for team review. This is not an order confirmation.':'Your inquiry was accepted by the delivery service. The Rehabwheel team will review it and respond by email.';
   form.dataset.accepted='true';button.textContent='Request sent';
   const eventName=newsletter?'newsletter_request_accepted':order?'purchase_provider_accepted':'inquiry_provider_accepted';
   const type=newsletter?'newsletter':order?'purchase_order':form.querySelector('#inquiryType')?.value==='LegMaker Demo Request'?'demo':'contact';
   window.RehabwheelAnalytics?.track(eventName,{form_type:type});
   const again=document.createElement('button');again.type='button';again.className='agency-reset';again.textContent='Start a new request';again.addEventListener('click',()=>{form.reset();form.dataset.accepted='false';button.disabled=false;button.innerHTML=old;status.textContent='';again.remove();form.querySelector('input:not([type=hidden]):not([name=_honey]),select')?.focus();});status.after(again);
  }catch{status.textContent='We could not confirm acceptance. Your entries are still here. Check your connection before retrying, or contact us by email below.';button.disabled=false;button.innerHTML=old;}
  finally{form.dataset.sending='false';form.removeAttribute('aria-busy');}
 });
 const explorer=document.querySelector('.explore');if(explorer){
  const range=document.getElementById('illustrative-resistance');if(range)range.addEventListener('input',()=>{document.getElementById('illustrative-resistance-value').textContent=range.value+' / 15';document.querySelector('.agency-resistance-bar span').style.width=(Number(range.value)/15*100)+'%';});
  const visual=document.querySelector('.ex-motion');visual.dataset.motion='passive';
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{visual.dataset.motion=b.dataset.mode;}));
  const reset=document.createElement('button');reset.type='button';reset.className='agency-reset';reset.textContent='Reset all illustrations';document.querySelector('.ex-nav').after(reset);
  reset.addEventListener('click',()=>{document.querySelector('[data-mode=passive]').click();const range=document.getElementById('session-duration');range.value='30';range.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-setup=chair]').click();document.querySelector('[data-pattern=steady]').click();document.querySelector('[data-step="0"]').click();const play=document.getElementById('motion-toggle');if(play.getAttribute('aria-pressed')==='true')play.click();const resistance=document.getElementById('illustrative-resistance');if(resistance){resistance.value='1';resistance.dispatchEvent(new Event('input'));}reset.textContent='Illustrations reset';});
  document.querySelector('#insights .ex-note').insertAdjacentHTML('beforebegin','<p class="agency-metric-help"><span><strong>Cadence:</strong> pedal revolutions per minute</span><span><strong>Mean:</strong> average of the displayed sample values</span></p>');
  const svg=document.querySelector('.ex-chart');const text=document.createElementNS('http://www.w3.org/2000/svg','text');text.setAttribute('x','8');text.setAttribute('y','16');text.setAttribute('fill','#46616c');text.setAttribute('font-size','12');text.textContent='RPM';svg.append(text);
  for(const [id,href,label] of [['movement','legmaker.html','Explore product information'],['session','technology.html','Review the technology'],['setup','photos.html','See original prototype photographs'],['insights','research.html','Review research direction']]){document.getElementById(id).insertAdjacentHTML('beforeend','<a class="agency-text-link" href="'+href+'">'+label+' ↗</a>');}
 }
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
