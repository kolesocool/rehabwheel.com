/* Rehabwheel privacy-first analytics event layer.
   Set window.REHABWHEEL_ANALYTICS={measurementId:"G-...", consent:true}
   only after consent has been obtained. No personal data in events. */
(function () {
  "use strict";
  const allowed = new Set(["page_view","cta_click","navigation_click","outbound_click","demo_request_submitted","contact_request_submitted","newsletter_opt_in_confirmed","purchase_order_request_submitted","funding_resource_clicked","research_collaboration_request_submitted","assistant_opened","assistant_interaction_completed","form_validation_error","site_search","download_click","video_play","video_complete","not_found"]);
  const config = window.REHABWHEEL_ANALYTICS || {};
  // Site owners may set a measurement ID through a separate, public config file.
  // Consent must be explicitly granted; never infer it from browsing.
  const validId = /^G-[A-Z0-9]+$/.test(config.measurementId || "");
  const enabled = config.consent === true && validId;
  function send(name, data) {
    if (!enabled || !allowed.has(name) || typeof window.gtag !== "function") return false;
    const safe = {};
    for (const key of ["section","placement","category","form_type","device_type","content_type"]) {
      const value = data && data[key];
      if (typeof value === "string" && /^[a-zA-Z0-9_-]{1,48}$/.test(value)) safe[key] = value;
    }
    window.gtag("event", name, safe);
    return true;
  }
  window.RehabwheelAnalytics = Object.freeze({track: send, isEnabled: () => enabled});
  // Integration hook: call track only after the server confirms success.
  // Example: RehabwheelAnalytics.track("demo_request_submitted",{form_type:"demo"});
  // Never send email addresses, names, medical details or form text.
  if (!enabled) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", config.measurementId, {send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false});
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.measurementId);
  document.head.appendChild(script);
  send("page_view", {category:"website"});
  window.dispatchEvent(new Event("rw-analytics-ready"));
  document.addEventListener("click", function(e) {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    let target;
    try { target = new URL(a.href, location.href); } catch (_) { return; }
    if (!/^https?:$/.test(target.protocol)) return;
    if (target.origin !== location.origin) send("outbound_click", {category:"external"});
    else if (a.closest("nav")) send("navigation_click", {category:"navigation"});
    else if (a.classList.contains("btn")) send("cta_click", {category:"button"});
  }, {passive:true});
})();