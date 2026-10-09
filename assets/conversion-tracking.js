/* Conversion attribution after external form provider redirects.
 * Redirect markers are not independently verified server receipts.
 * Never collect submitted names, email addresses, medical details or message text.
 */
(function(){
  'use strict';
  function track(){
    const p=new URLSearchParams(location.search);
    const contact=location.pathname.endsWith('/contact.html') && p.get('sent')==='1';
    const order=location.pathname.endsWith('/purchase-orders.html') && p.get('submitted')==='1';
    if(!contact&&!order)return;
    const event=order?'purchase_order_request_submitted':'contact_request_submitted';
    const type=order?'purchase_order':'contact';
    // One event per redirect in this browser session; prevents refresh duplicates.
    const key='rw-conversion-'+event+'-'+location.pathname;
    try{if(sessionStorage.getItem(key))return;}catch(_){}
    if(window.RehabwheelAnalytics && window.RehabwheelAnalytics.track(event,{form_type:type})){
      try{sessionStorage.setItem(key,'1')}catch(_){}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',track,{once:true});else track();
  // Consent and GA4 script may load after this page finishes loading.
  window.addEventListener('rw-analytics-ready',track,{once:true});
})();