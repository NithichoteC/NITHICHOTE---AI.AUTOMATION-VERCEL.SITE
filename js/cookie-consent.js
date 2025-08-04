// Professional Cookie Consent Manager
// GDPR/CCPA Compliant Implementation

(function() {
  'use strict';

  // Cookie consent configuration
  const config = {
    cookieName: 'nithichote_cookie_consent',
    cookieExpiry: 365, // days
    privacyPolicyUrl: '/privacy.html',
    cookiePolicyUrl: '/cookie-policy.html',
    googleAnalyticsId: '', // Add your GA ID when ready
    position: 'bottom', // bottom or top
    theme: 'dark'
  };

  // Cookie categories
  const categories = {
    necessary: {
      name: 'Necessary',
      description: 'Essential cookies for website functionality',
      required: true
    },
    analytics: {
      name: 'Analytics',
      description: 'Help us understand how visitors use our website',
      required: false
    },
    marketing: {
      name: 'Marketing',
      description: 'Used to track visitors across websites for marketing',
      required: false
    }
  };

  // Check if consent has been given
  function hasConsent() {
    return getCookie(config.cookieName) !== null;
  }

  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Set cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Get consent preferences
  function getConsentPreferences() {
    const consent = getCookie(config.cookieName);
    if (!consent) return null;
    try {
      return JSON.parse(decodeURIComponent(consent));
    } catch (e) {
      return null;
    }
  }

  // Save consent preferences
  function saveConsent(preferences) {
    setCookie(config.cookieName, encodeURIComponent(JSON.stringify(preferences)), config.cookieExpiry);
    applyConsent(preferences);
    hideBanner();
  }

  // Apply consent (enable/disable cookies)
  function applyConsent(preferences) {
    if (preferences.analytics && config.googleAnalyticsId) {
      // Load Google Analytics
      loadGoogleAnalytics();
    }
    
    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: preferences }));
  }

  // Load Google Analytics
  function loadGoogleAnalytics() {
    if (window.gtag) return; // Already loaded
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', config.googleAnalyticsId, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure'
    });
  }

  // Create and show banner
  function showBanner() {
    // Don't show if already consented
    if (hasConsent()) {
      const preferences = getConsentPreferences();
      if (preferences) applyConsent(preferences);
      return;
    }

    // Create banner HTML
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <div class="cookie-consent-text">
            <h3>I value your privacy</h3>
            <p>This site uses cookies to enhance your browsing experience and analyze traffic. By clicking "Accept All", you consent to the use of cookies.</p>
          </div>
          <div class="cookie-consent-actions">
            <button class="cookie-consent-button cookie-consent-button-secondary" id="cookie-settings">Cookie Settings</button>
            <button class="cookie-consent-button cookie-consent-button-secondary" id="cookie-reject">Reject All</button>
            <button class="cookie-consent-button cookie-consent-button-primary" id="cookie-accept">Accept All</button>
          </div>
        </div>
      </div>
    `;

    // Create modal for settings
    const modal = document.createElement('div');
    modal.id = 'cookie-consent-modal';
    modal.className = 'cookie-consent-modal';
    modal.innerHTML = `
      <div class="cookie-consent-modal-content">
        <div class="cookie-consent-modal-header">
          <h2>Cookie Settings</h2>
          <button class="cookie-consent-close" id="modal-close">&times;</button>
        </div>
        <div class="cookie-consent-modal-body">
          <p>This site uses different types of cookies to optimize your experience. Click on the categories below to learn more and change the default settings. However, blocking some types of cookies may impact your experience.</p>
          
          <div class="cookie-consent-categories">
            <div class="cookie-consent-category">
              <div class="cookie-consent-category-header">
                <label class="cookie-consent-switch">
                  <input type="checkbox" id="consent-necessary" checked disabled>
                  <span class="cookie-consent-slider"></span>
                </label>
                <div class="cookie-consent-category-info">
                  <h4>Necessary Cookies</h4>
                  <span class="cookie-consent-badge">Always Active</span>
                </div>
              </div>
              <p>These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
            </div>
            
            <div class="cookie-consent-category">
              <div class="cookie-consent-category-header">
                <label class="cookie-consent-switch">
                  <input type="checkbox" id="consent-analytics">
                  <span class="cookie-consent-slider"></span>
                </label>
                <div class="cookie-consent-category-info">
                  <h4>Analytics Cookies</h4>
                </div>
              </div>
              <p>These cookies help understand how visitors interact with the website by collecting and reporting information anonymously.</p>
            </div>
            
            <div class="cookie-consent-category">
              <div class="cookie-consent-category-header">
                <label class="cookie-consent-switch">
                  <input type="checkbox" id="consent-marketing">
                  <span class="cookie-consent-slider"></span>
                </label>
                <div class="cookie-consent-category-info">
                  <h4>Marketing Cookies</h4>
                </div>
              </div>
              <p>These cookies are used to track visitors across websites to display ads that are relevant and engaging.</p>
            </div>
          </div>
        </div>
        <div class="cookie-consent-modal-footer">
          <a href="${config.privacyPolicyUrl}" class="cookie-consent-link">Privacy Policy</a>
          <a href="${config.cookiePolicyUrl}" class="cookie-consent-link">Cookie Policy</a>
          <div class="cookie-consent-modal-actions">
            <button class="cookie-consent-button cookie-consent-button-secondary" id="modal-reject">Reject All</button>
            <button class="cookie-consent-button cookie-consent-button-primary" id="modal-save">Save Settings</button>
          </div>
        </div>
      </div>
    `;

    // Add to page
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('cookie-accept').addEventListener('click', acceptAll);
    document.getElementById('cookie-reject').addEventListener('click', rejectAll);
    document.getElementById('cookie-settings').addEventListener('click', showSettings);
    document.getElementById('modal-close').addEventListener('click', hideSettings);
    document.getElementById('modal-reject').addEventListener('click', rejectAll);
    document.getElementById('modal-save').addEventListener('click', saveSettings);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) hideSettings();
    });
  }

  // Hide banner
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
  }

  // Show settings modal
  function showSettings() {
    document.getElementById('cookie-consent-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Hide settings modal
  function hideSettings() {
    document.getElementById('cookie-consent-modal').style.display = 'none';
    document.body.style.overflow = '';
  }

  // Accept all cookies
  function acceptAll() {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    });
  }

  // Reject all optional cookies
  function rejectAll() {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    });
  }

  // Save custom settings
  function saveSettings() {
    saveConsent({
      necessary: true,
      analytics: document.getElementById('consent-analytics').checked,
      marketing: document.getElementById('consent-marketing').checked,
      timestamp: new Date().toISOString()
    });
    hideSettings();
  }

  // Removed cookie reopen button as unprofessional
  function createReopenButton() {
    // Intentionally left empty - button removed
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      showBanner();
      createReopenButton();
    });
  } else {
    showBanner();
    createReopenButton();
  }

})();