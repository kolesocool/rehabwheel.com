/* Rehabwheel People: accessible biography dialogs, deep links and section navigation.
   Original portrait assets and biographies remain in the HTML source. */
(function(){
 "use strict";
 function ready(){
  var dialogs=Array.prototype.slice.call(document.querySelectorAll(".rw-person-dialog"));
  if(!dialogs.length)return;
  var lastTrigger=null;
  function openBio(button,focusClose){
   var id=button && button.getAttribute("data-dialog");
   var modal=id && document.getElementById(id);
   if(!modal)return;
   if(modal.open)return;
   lastTrigger=button;
   if(typeof modal.showModal!=="function"){
     /* Progressive fallback for browsers without native dialog. */
     modal.setAttribute("open","");
   }else{
     modal.showModal();
   }
   document.body.classList.add("rw-dialog-is-open");
   if(focusClose!==false){
    var close=modal.querySelector(".rw-dialog-close");
    if(close)close.focus({preventScroll:true});
   }
  }
  function closeBio(modal){
   if(!modal || !modal.open)return;
   if(typeof modal.close==="function")modal.close();
   else{
    modal.removeAttribute("open");
    onClosed();
   }
  }
  function onClosed(){
   if(dialogs.every(function(d){return !d.open})){
    document.body.classList.remove("rw-dialog-is-open");
   }
   if(lastTrigger && lastTrigger.isConnected){
    try{lastTrigger.focus({preventScroll:true})}catch(err){lastTrigger.focus()}
   }
   lastTrigger=null;
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-dialog].rw-person-open, [data-dialog].rw-person-photo-trigger"),function(btn){
   btn.addEventListener("click",function(){openBio(btn,true)});
  });
  dialogs.forEach(function(modal){
   var close=modal.querySelector(".rw-dialog-close");
   if(close)close.addEventListener("click",function(){closeBio(modal)});
   modal.addEventListener("close",onClosed);
   modal.addEventListener("cancel",function(){
    /* Native Escape behavior is retained; close event restores focus. */
   });
   modal.addEventListener("click",function(event){
    if(event.target===modal)closeBio(modal);
   });
   modal.addEventListener("keydown",function(event){
    if(event.key==="Escape" && typeof modal.close!=="function"){
      event.preventDefault();closeBio(modal);
    }
   });
  });
  function openProfileFromHash(){
   var hash=window.location.hash.slice(1);
   if(!hash)return;
   try{hash=decodeURIComponent(hash)}catch(e){}
   var person=document.getElementById(hash);
   if(!person || !person.classList.contains("rw-person"))return;
   var button=person.querySelector(".rw-person-photo-trigger[data-dialog]");
   if(button)openBio(button,true);
  }
  window.addEventListener("hashchange",openProfileFromHash);
  if(window.location.hash){
   /* Deep links from homepage should open the intended biography. */
   window.requestAnimationFrame(openProfileFromHash);
  }
  var links=Array.prototype.slice.call(document.querySelectorAll(".rw-people-jumplinks a[href^='#']"));
  if("IntersectionObserver" in window && links.length){
   var map={};
   links.forEach(function(link){map[link.getAttribute("href").slice(1)]=link});
   var observer=new IntersectionObserver(function(entries){
    var onscreen=entries.filter(function(entry){return entry.isIntersecting}).sort(function(a,b){return b.intersectionRatio-a.intersectionRatio});
    if(!onscreen.length)return;
    links.forEach(function(link){link.removeAttribute("aria-current")});
    var active=map[onscreen[0].target.id];
    if(active)active.setAttribute("aria-current","location");
   },{rootMargin:"-15% 0px -62% 0px",threshold:[0,.2,.5]});
   links.forEach(function(link){
    var section=document.getElementById(link.getAttribute("href").slice(1));
    if(section)observer.observe(section);
   });
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});
 else ready();
})();