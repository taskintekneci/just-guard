// Just Guard - Google Reklam Koruma Content Script

(function() {
  'use strict';

  let protectedSites = [];
  let isEnabled = true;

  // Storage'dan ayarları yükle
  function loadSettings() {
    chrome.storage.local.get(['enabled', 'sites'], (result) => {
      isEnabled = result.enabled !== false;
      protectedSites = result.sites || [];
      
      if (isEnabled && protectedSites.length > 0) {
        processAds();
        observeDOM();
      }
    });
  }

  // Storage değişikliklerini dinle
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.enabled) {
        isEnabled = changes.enabled.newValue !== false;
      }
      if (changes.sites) {
        protectedSites = changes.sites.newValue || [];
      }
      
      if (isEnabled && protectedSites.length > 0) {
        processAds();
      }
    }
  });

  // Reklamları işle
  function processAds() {
    if (!isEnabled || protectedSites.length === 0) return;

    // Google arama sonuçlarındaki reklam linklerini bul
    const adSelectors = [
      'a[data-rw]', // Sponsorlu reklamlar
      'a[data-ved]', // Genel linkler
      '.commercial-unit-desktop-top a',
      '.commercial-unit-desktop-rhs a',
      '.ads-ad a',
      '[data-text-ad] a',
      '.uEierd a', // Alışveriş reklamları
      '.pla-unit a',
      '#tads a', // Üst reklamlar
      '#tadsb a', // Alt reklamlar
      '#bottomads a',
      '.ad_cclk a'
    ];

    const adContainerSelectors = [
      '#tads', // Üst reklam container
      '#tadsb', // Alt reklam container
      '#bottomads',
      '.commercial-unit-desktop-top',
      '.commercial-unit-desktop-rhs',
      '[data-text-ad]',
      '.ads-ad',
      '.uEierd',
      '.pla-unit'
    ];

    // Önce reklam containerlarını bul
    adContainerSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(container => {
        const links = container.querySelectorAll('a[href]');
        links.forEach(processLink);
      });
    });

    // Sponsorlu etiketli reklamları bul
    document.querySelectorAll('span').forEach(span => {
      const text = span.textContent.toLowerCase();
      if (text === 'sponsorlu' || text === 'sponsored' || text === 'reklam' || text === 'ad') {
        // En yakın reklam container'ını bul
        const adContainer = span.closest('div[data-text-ad], div[data-hveid], .ads-ad, [data-sokoban-container]');
        if (adContainer) {
          const links = adContainer.querySelectorAll('a[href]');
          links.forEach(processLink);
        }
      }
    });
  }

  // Tek bir linki işle
  function processLink(link) {
    if (link.dataset.justGuardProcessed) return;
    link.dataset.justGuardProcessed = 'true';

    const href = link.href || '';
    
    // Korunan sitelerden birine ait mi kontrol et
    const matchedSite = protectedSites.find(site => {
      const sitePattern = site.toLowerCase();
      return href.toLowerCase().includes(sitePattern);
    });

    if (matchedSite) {
      // Reklamı tamamen kaldır
      removeAd(link, matchedSite);
    }
  }

  // Reklamı tamamen kaldır
  function removeAd(link, siteName) {
    // En yakın reklam bloğunu bul
    const adBlock = link.closest('[data-text-ad], .ads-ad, [data-hveid], [data-sokoban-container], .uEierd, .pla-unit, .commercial-unit-desktop-top, .commercial-unit-desktop-rhs') || link.parentElement;
    
    if (adBlock && !adBlock.dataset.justGuardRemoved) {
      adBlock.dataset.justGuardRemoved = 'true';
      
      // Engelleme sayısını artır
      incrementBlockCount();
      
      // Reklamı DOM'dan kaldır
      adBlock.style.display = 'none';
      adBlock.remove();
      
      console.log(`[Just Guard] Şirket reklamı kaldırıldı: ${siteName}`);
    }
  }

  // Engelleme sayacını artır
  function incrementBlockCount() {
    chrome.storage.local.get(['blockedTotal', 'blockedToday', 'lastDate'], (result) => {
      const today = new Date().toDateString();
      const blockedTotal = (result.blockedTotal || 0) + 1;
      let blockedToday = result.blockedToday || 0;

      if (result.lastDate !== today) {
        blockedToday = 1;
      } else {
        blockedToday += 1;
      }

      chrome.storage.local.set({
        blockedTotal,
        blockedToday,
        lastDate: today
      });
    });
  }

  // DOM değişikliklerini izle (dinamik yüklenen reklamlar için)
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });

      if (shouldProcess) {
        // Debounce
        clearTimeout(window.justGuardTimeout);
        window.justGuardTimeout = setTimeout(processAds, 200);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Sayfa yüklendiğinde başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
  } else {
    loadSettings();
  }

  // Sayfa tamamen yüklendiğinde tekrar kontrol et
  window.addEventListener('load', () => {
    setTimeout(processAds, 500);
  });

})();
