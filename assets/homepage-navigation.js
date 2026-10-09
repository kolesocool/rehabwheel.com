/* Homepage mega-menu: explicit click, keyboard and outside-click behavior. */
(()=>{'use strict';
const nav=document.querySelector('.rw-desktop-nav');if(!nav)return;
const triggers=[...nav.querySelectorAll('.rw-nav-trigger')];
const close=(restore=false)=>{for(const b of triggers){b.setAttribute('aria-expanded','false');const panel=document.getElementById(b.getAttribute('aria-controls'));if(panel)panel.hidden=true;}if(restore)nav.querySelector('.rw-nav-trigger')?.focus();};
for(const b of triggers){b.addEventListener('click',()=>{const wasOpen=b.getAttribute('aria-expanded')==='true';close();if(!wasOpen){b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).hidden=false;}});}
document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&triggers.some(b=>b.getAttribute('aria-expanded')==='true')){const active=triggers.find(b=>b.getAttribute('aria-expanded')==='true');close();active?.focus();}});
nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))close();});
window.addEventListener('resize',()=>{if(window.innerWidth<=1020)close();});
})();