# Just Guard - Chrome Reklam Koruma Eklentisi

🛡️ Şirket çalışanlarının Google reklamlarına tıklamaması için geliştirilen Chrome eklentisi.

## Özellikler

- ✅ Birden fazla şirket sitesi ekleyebilme
- ✅ Google arama sonuçlarındaki reklamları otomatik tespit
- ✅ Şirket sitelerine ait reklamlara tıklamayı engelleme
- ✅ Uyarı modalı ile bilgilendirme
- ✅ Engellenen tıklama istatistikleri
- ✅ Açma/Kapama özelliği
- ✅ Şık ve modern arayüz

## Kurulum

### 1. Eklentiyi Chrome'a Yükleyin

1. Chrome tarayıcınızı açın
2. Adres çubuğuna `chrome://extensions` yazın ve Enter'a basın
3. Sağ üst köşedeki **"Geliştirici modu"** seçeneğini aktif edin
4. **"Paketlenmemiş öğe yükle"** butonuna tıklayın
5. `just-guard` klasörünü seçin
6. Eklenti yüklenecektir!

### 2. İkonları PNG'ye Dönüştürün (Opsiyonel)

Eklentide SVG ikonlar bulunmaktadır. Chrome bazı durumlarda PNG tercih eder. SVG'leri PNG'ye dönüştürmek için:

**Online araç kullanarak:**
- SVG dosyalarını yükleyin
- PNG olarak indirin ve icons klasörüne kaydedin

**Veya basit PNG ikonlar oluşturun:**

Alternatif olarak, manifest.json dosyasındaki icon satırlarını kaldırabilirsiniz. Chrome varsayılan bir ikon kullanacaktır.

## Kullanım

1. Chrome araç çubuğundaki 🛡️ Just Guard ikonuna tıklayın
2. **"Korumak istediğiniz site domainini ekleyin"** alanına şirket sitenizi yazın
   - Örnek: `example.com` veya `ornek.com.tr`
3. **"Ekle"** butonuna tıklayın
4. Birden fazla site ekleyebilirsiniz
5. Google'da arama yaptığınızda, eklediğiniz sitelere ait reklamlar:
   - Kırmızı çerçeve ile işaretlenir
   - "Şirket Reklamı - Tıklamayın!" uyarısı gösterilir
   - Tıklandığında engellenir ve uyarı modalı açılır

## Önemli Notlar

⚠️ Bu eklenti yalnızca Google arama sonuçlarında çalışır.

⚠️ Domain eklerken sadece domain adını girin (http:// veya www. olmadan).

⚠️ Eklenti yerel storage kullanır, veriler tarayıcınızda saklanır.

## Dosya Yapısı

```
just-guard/
├── manifest.json      # Eklenti yapılandırması
├── popup.html         # Popup arayüzü
├── popup.js           # Popup JavaScript
├── content.js         # Google sayfasında çalışan script
├── styles.css         # Stil dosyası
├── icons/             # İkon dosyaları
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md          # Bu dosya
```

## Sorun Giderme

**Eklenti çalışmıyor:**
- Chrome'u yeniden başlatın
- Eklentiyi devre dışı bırakıp tekrar etkinleştirin
- "Geliştirici modu"nun açık olduğundan emin olun

**Reklamlar tespit edilmiyor:**
- Site domainini doğru girdiğinizden emin olun
- Korumanın aktif olduğunu kontrol edin
- Sayfayı yenileyin

## Lisans

MIT License - Özgürce kullanabilir ve değiştirebilirsiniz.
