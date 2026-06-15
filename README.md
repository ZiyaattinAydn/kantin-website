Alsancak/Atakent Kantin şubeleri adına açılmış websitesinin taslağıdır. Henüz resmi bir site değildir

# kantin-website-final

Bu sürümde Alsancak ve Atakent menüleri tamamen ayrılmıştır.

## Sayfalar

- `index.html`: Ana sayfa, şube ayrımı, adresler ve dinamik etkinlik alanı
- `menu.html`: Alsancak / Atakent menü seçimi
- `events.html`: Yalnızca yayınlanmış gerçek etkinlikler
- `admin.html`: Etkinlik ekleme, düzenleme, taslak/yayın ve silme paneli

## Şube ayrımı

### Alsancak

- Kokteyl gösterilmez.
- Fıçı ve şişe bira, şarap, fritöz, fırın, deli ve salata ürünleri bulunur.
- Patates kızartmasında 2 ücretsiz sos seçimi belirtilmiştir.
- Tortilla cipste 1 ücretsiz sos seçimi belirtilmiştir.
- Pretzel cheddar sos ile gösterilir.
- Tavuk kızartması ve Frankfurter coleslaw ile gösterilir.
- Çıtır Chili Tavuk “acılı” olarak işaretlenir.
- Tüm sandviçlerin ikiye bölünerek servis edildiği tatlı bir notla belirtilir.

### Atakent

- Bubble ve house kokteyller yalnızca bu şubede görünür.
- Atakent’e özel Aperitifs + Grill menüsü ayrı krem/noktalı bölümde gösterilir.
- Izgara şişlerinin 17:00’dan itibaren servis edildiği belirtilir.

## Adresler ve sosyal medya

- Alsancak: 1464. Sokak No:71/A, Alsancak, Konak / İzmir
- Atakent: 2035 Sokak No:6, Atakent, Karşıyaka / İzmir
- Instagram: https://www.instagram.com/kantinizmir/

## Yerelde çalıştırma

Dosyaları doğrudan `file://` ile açma. JavaScript modülleri ve JSON verisi için küçük bir sunucu kullan:

```bash
python -m http.server 8080
```

Sonra:

```text
http://localhost:8080
```

## Yönetici panelini hemen deneme

1. `admin.html` sayfasını aç.
2. “Demo panelini aç” butonuna bas.
3. Bir etkinlik ekle ve durumunu “Yayında” seç.
4. Aynı tarayıcıda `events.html` veya `index.html` sayfasını yenile.

Demo kayıtları yalnızca o tarayıcının `localStorage` alanında tutulur. Başka cihazlarda görünmez.

# Canlı yönetici paneli kurulumu — Firebase

Panel, Firebase Authentication + Cloud Firestore ile canlı çalışmaya hazırdır.

## 1. Firebase projesi oluştur

Firebase Console’da yeni bir proje oluştur ve bir Web App ekle.

## 2. Authentication aç

- Authentication → Sign-in method
- Email/Password sağlayıcısını etkinleştir
- Users bölümünden yönetici için bir kullanıcı oluştur

## 3. Firestore aç

Cloud Firestore veritabanını oluştur.

## 4. Web yapılandırmasını ekle

Firebase’in verdiği yapılandırma değerlerini şu dosyaya yaz:

```text
assets/js/firebase-config.js
```

Örnek:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 5. Yönetici UID belgesi oluştur

Authentication → Users bölümündeki kullanıcının UID değerini kopyala.

Firestore’da şu belgeyi oluştur:

```text
admins / KULLANICI_UID
```

Belgenin içine örnek olarak:

```text
role: "admin"
```

ekleyebilirsin. Panel yalnızca `admins/{uid}` belgesi bulunan kullanıcıları kabul eder.

## 6. Güvenlik kurallarını yayınla

Paketteki `firestore.rules` dosyasını Firestore Rules alanına yapıştırıp yayınla.

Kurallar:

- Herkes yalnızca `published` etkinlikleri okuyabilir.
- Taslakları yalnızca yönetici görebilir.
- Etkinlik ekleme, düzenleme ve silme yalnızca yetkili yöneticiye açıktır.

## 7. Siteyi yayınla

Firebase Hosting kullanmak istersen:

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

Pakette temel `firebase.json` dosyası da bulunur.

## Önemli

- `firebaseConfig` değerlerinin tarayıcıda görünmesi normaldir; güvenliği Firestore Rules ve Authentication sağlar.
- `admin.html` bağlantısını ana navigasyona ekleme. Adresi yalnızca yetkililer bilsin.
- Güvenlik için yönetici hesabında güçlü ve benzersiz bir şifre kullan.
- Menü fiyatlarını canlıya almadan önce işletmedeki güncel listeyle tekrar karşılaştır.


## mobil düzeltmeleri

- Mobil tam ekran menünün header içine sıkışmasına neden olan `backdrop-filter` davranışı kaldırıldı.
- Mobil menü artık `100dvh` yüksekliğinde, kaydırılabilir ve güvenli alan boşluklarını destekler.
- Menü açıkken `kantin.` logosu beyaz görünür.
- Reveal animasyonları progressive enhancement biçimine çevrildi:
  JavaScript yüklenmese veya IntersectionObserver tetiklenmese bile metinler görünür kalır.
- Şube sekmesi değiştirildiğinde yeni paneldeki içerikler doğrudan görünür yapılır.
- CSS ve JavaScript bağlantılarına `?v=4` eklendi; eski tarayıcı önbelleğinin kırık dosyaları göstermesi önlenir.


## son görsel düzeltmeler

- Siyah slogan şeridi iki eş ve ekran genişliğini tamamen kaplayan gruba ayrıldı.
- Geniş monitörlerde sloganın yarıda bitip siyah boşluk bırakması giderildi.
- Animasyon döngüsündeki başlangıç/bitiş boşluğu kaldırıldı.
- Noktalı krem doku yalnızca `body` üzerinde üretiliyor.
- `dotted-paper` bölümleri artık deseni yeniden başlatmadığı için etkinlik ve şube bölümü arasındaki nokta kayması giderildi.
- CSS ve JavaScript bağlantıları `?v=5` ile önbellekten ayrıldı.


## küçük metin düzeltmesi

- Ana sayfadaki siyah slogan şeridinde en sağda görünen son ayırıcı nokta kaldırıldı.
- HTML sürümü `?v=6` ile önbellekten ayrıldı.


## .1 —  tabanlı kontrollü responsive düzeltme

- v7 ve v8 responsive kuralları kullanılmadı; çalışma doğrudan  paketinden üretildi.
- Mobil siyah slogan bandı korundu.
- Mobilde slogan bandının altındaki mavi şube bölümü, üst hero illüstrasyonuyla aynı 16 px dış boşlukla ortalandı.
- `Etkinlikler.` başlığındaki mavi noktanın alt satıra kopması engellendi.
- Sayfa hero alanı 980 px altında tek sütunda, 980 px ve üzerinde iki sütunda çalışır. Bu sayede dikey monitörde uzak görünüm masaüstü kalır; zoom arttıkça doğal biçimde tek sütuna geçer.
- Menüdeki dekoratif `01`, `02`, `03` numaraları kaldırıldı.
- Önbellek sürümü `?v=61` olarak güncellendi.


## rötuşları

- Mobilde ortalanmış mavi şube alanının alt köşeleri de ovalleştirildi.
- `Şubeni seç.` ve `Etkinlikler.` başlıkları bir miktar büyütüldü.
- Mavi menü panellerindeki başlık noktaları beyaz yapıldı.
- Kullanılabilir viewport 980 px altına düştüğünde:
  - Ana sayfadaki Alsancak / Atakent menü kartları alt alta geçer.
  - Şube adres kartları alt alta geçer.
- Menüdeki büyük `Bira + yanında.` ve `Kokteyl + fıçı.` başlıkları
  1050 px altındaki kullanılabilir genişlikte sola hizalanır.
- Normal geniş masaüstünde iki sütunlu görünüm korunur.
- Önbellek sürümü `6-final` olarak güncellendi.
