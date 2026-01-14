// Just Guard - Background Service Worker

// Eklenti ilk kurulduğunda veya güncellendiğinde çalışır
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    // Mevcut açık Google sekmelerine content script'i enjekte et
    injectToExistingTabs();
  }
});

// Chrome başlatıldığında da çalış
chrome.runtime.onStartup.addListener(() => {
  injectToExistingTabs();
});

// Mevcut Google sekmelerine script enjekte et
async function injectToExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({
      url: [
        'https://www.google.com/*',
        'https://www.google.com.tr/*',
        'https://google.com/*',
        'https://google.com.tr/*'
      ]
    });

    for (const tab of tabs) {
      try {
        // Content script'i enjekte et
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        
        // CSS'i de enjekte et
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['styles.css']
        });
        
        console.log(`Just Guard: Tab ${tab.id} için script enjekte edildi`);
      } catch (err) {
        // Bu sekme için izin yoksa veya özel sayfa ise hata verir, görmezden gel
        console.log(`Just Guard: Tab ${tab.id} için enjeksiyon başarısız:`, err.message);
      }
    }
  } catch (err) {
    console.error('Just Guard: Tab sorgusu başarısız:', err);
  }
}
