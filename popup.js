document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enableToggle');
  const siteInput = document.getElementById('siteInput');
  const addBtn = document.getElementById('addBtn');
  const sitesList = document.getElementById('sitesList');
  const siteCount = document.getElementById('siteCount');
  const blockedCount = document.getElementById('blockedCount');
  const todayCount = document.getElementById('todayCount');
  const notification = document.getElementById('notification');

  // Varsayılan siteler - eklenti ilk kurulduğunda otomatik eklenir
  const DEFAULT_SITES = [
    'defaultsiteniz.com',
  ];

  // İlk kurulumda varsayılan siteleri ekle
  initializeDefaultSites();

  // Storage'dan verileri yükle
  loadData();

  function initializeDefaultSites() {
    chrome.storage.local.get(['initialized', 'sites'], (result) => {
      if (!result.initialized) {
        // İlk kurulum - varsayılan siteleri ekle
        const sites = result.sites || [];
        const mergedSites = [...new Set([...DEFAULT_SITES, ...sites])];
        chrome.storage.local.set({ 
          sites: mergedSites, 
          initialized: true 
        }, () => {
          renderSites(mergedSites);
        });
      }
    });
  }

  // Event listeners
  enableToggle.addEventListener('change', saveEnabled);
  addBtn.addEventListener('click', addSite);
  siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSite();
  });

  function loadData() {
    chrome.storage.local.get(['enabled', 'sites', 'blockedTotal', 'blockedToday', 'lastDate'], (result) => {
      // Koruma durumu
      enableToggle.checked = result.enabled !== false;
      
      // Site listesi
      const sites = result.sites || [];
      renderSites(sites);
      
      // İstatistikler
      blockedCount.textContent = result.blockedTotal || 0;
      
      // Bugünkü sayıyı kontrol et
      const today = new Date().toDateString();
      if (result.lastDate !== today) {
        // Yeni gün, sayacı sıfırla
        chrome.storage.local.set({ blockedToday: 0, lastDate: today });
        todayCount.textContent = 0;
      } else {
        todayCount.textContent = result.blockedToday || 0;
      }
    });
  }

  function saveEnabled() {
    chrome.storage.local.set({ enabled: enableToggle.checked });
    showNotification(enableToggle.checked ? 'Koruma aktif!' : 'Koruma devre dışı!');
  }

  function addSite() {
    let site = siteInput.value.trim().toLowerCase();
    
    if (!site) {
      showNotification('Lütfen bir site girin!');
      return;
    }

    // URL'yi temizle
    site = site.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    
    // Domain formatını kontrol et
    if (!isValidDomain(site)) {
      showNotification('Geçersiz domain formatı!');
      return;
    }

    chrome.storage.local.get(['sites'], (result) => {
      const sites = result.sites || [];
      
      if (sites.includes(site)) {
        showNotification('Bu site zaten ekli!');
        return;
      }

      sites.push(site);
      chrome.storage.local.set({ sites }, () => {
        renderSites(sites);
        siteInput.value = '';
        showNotification('Site eklendi!');
      });
    });
  }

  function deleteSite(siteToDelete) {
    chrome.storage.local.get(['sites'], (result) => {
      const sites = result.sites || [];
      const updatedSites = sites.filter(site => site !== siteToDelete);
      
      chrome.storage.local.set({ sites: updatedSites }, () => {
        renderSites(updatedSites);
        showNotification('Site silindi!');
      });
    });
  }

  function renderSites(sites) {
    siteCount.textContent = sites.length;

    if (sites.length === 0) {
      sitesList.innerHTML = `
        <div class="empty-state">
          <div class="icon">📋</div>
          <p>Henüz site eklenmemiş</p>
        </div>
      `;
      return;
    }

    sitesList.innerHTML = sites.map(site => `
      <div class="site-item">
        <span class="site-url">${escapeHtml(site)}</span>
        <button class="btn-delete" data-site="${escapeHtml(site)}" title="Sil">×</button>
      </div>
    `).join('');

    // Silme butonlarına event listener ekle
    sitesList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteSite(btn.dataset.site);
      });
    });
  }

  function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
});
