(function () {
  "use strict";

  const ATTRIBUTION_KEY = "stocker_biz_attribution";

  function sendEvent(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  function textOf(element) {
    return (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
  }

  function readAttribution() {
    try {
      return JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}") || {};
    } catch (_) {
      return {};
    }
  }

  function saveAttribution() {
    const params = new URLSearchParams(location.search);
    const current = readAttribution();
    const next = {
      landing_page: current.landing_page || location.pathname,
      utm_source: params.get("utm_source") || current.utm_source || "",
      utm_medium: params.get("utm_medium") || current.utm_medium || "",
      utm_campaign: params.get("utm_campaign") || current.utm_campaign || "",
      utm_content: params.get("utm_content") || current.utm_content || "",
      referrer: current.referrer || document.referrer || ""
    };

    try {
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    } catch (_) {
      // Storage can be unavailable in private browsing; analytics still works.
    }
  }

  function eventParams(link) {
    const url = new URL(link.href, location.href);
    return {
      cta_text: textOf(link),
      link_url: url.href,
      source_path: location.pathname,
      inquiry_type: url.searchParams.get("type") || ""
    };
  }

  function trackLink(link) {
    const href = link.href || "";
    const params = eventParams(link);

    if (href.includes("stockerbiz.yahimaro.com/login")) {
      sendEvent("login_click", params);
    } else if (href.includes("stockerbiz.yahimaro.com/signup")) {
      sendEvent("trial_signup_click", params);
    } else if (href.includes("stockerbiz.yahimaro.com/demo/start")) {
      sendEvent("demo_start", params);
    } else if (href.includes("/stocker-biz/contact.html") || /contact\.html(?:[?#]|$)/.test(href)) {
      sendEvent("contact_click", params);
    } else if (href.includes("/stocker-biz/pricing.html") || /pricing\.html(?:[?#]|$)/.test(href)) {
      sendEvent("pricing_click", params);
    } else if (
      href.includes("apps.apple.com/jp/app/id6782330516") ||
      href.includes("com.yahimaro.stockerbiz.app")
    ) {
      sendEvent("app_store_click", params);
    }
  }

  function initFormTracking() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    let started = false;
    const markStarted = function () {
      if (started) return;
      started = true;
      const inquiry = document.getElementById("inquiry_type");
      sendEvent("form_start", {
        form_id: "stocker_biz_contact",
        inquiry_type: inquiry ? inquiry.value : "",
        source_path: location.pathname
      });
    };

    form.addEventListener("input", markStarted, { passive: true });
    form.addEventListener("change", markStarted, { passive: true });
  }

  window.stockerBizAttribution = readAttribution;
  window.stockerBizAnalyticsEvent = sendEvent;

  saveAttribution();
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (link) trackLink(link);
  });
  initFormTracking();
})();
