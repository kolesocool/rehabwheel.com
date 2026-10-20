/* Community waitlist: no preview app, no analytics, no local email storage. */
(function(){
  'use strict';
  const form=document.getElementById('communityWaitlist');
  if(form){
    const status=document.getElementById('status');
    form.addEventListener('submit',function(){
      if(!form.checkValidity())return;
      if(status)status.textContent='Opening the form provider to process your request. Please complete any verification it asks for.';
      // Do not prevent the native POST: no fake on-page success confirmation.
    });
  }
  // Previous community previews installed an offline service worker. Retire it
  // and its cached public app shell; preserve user-authored local activity data.
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.getRegistrations().then(function(regs){
        return Promise.all(regs.filter(function(reg){return new URL(reg.scope).pathname.startsWith('/community/');})
        .map(function(reg){return reg.unregister();}));
      }).catch(function(){/* Offline browser versions may not expose registration APIs. */});
    });
  }
  if('caches' in window){
    window.addEventListener('load',function(){
      caches.keys().then(function(keys){
        return Promise.all(keys.filter(function(key){return key.startsWith('rw-community-shell-');})
        .map(function(key){return caches.delete(key);}));
      }).catch(function(){/* Cache cleanup is best-effort. */});
    });
  }
})();