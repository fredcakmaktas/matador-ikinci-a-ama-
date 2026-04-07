# Instagram Benzeri Sosyal Medya Uygulaması

## Özellikler

- **Ana Akış**: Fotoğraf, video ve Reels paylaşımlarını gösteren kaydırılabilir akış
- **Hikayeler**: Ekranın üst kısmında yatay kaydırılabilir hikaye daireleri, hikayeye tıklayınca tam ekran görüntüleme
- **Reels Entegrasyonu**: Reels videoları ana akışta gönderilerle birlikte karışık olarak gösterilir (her 3 gönderide bir Reel)
- **Bildirimler**: Beğeni, yorum, takip ve etiket bildirimlerinin listesi
- **Mesajlaşma**: Sohbet listesi ve mesaj detay ekranı, mesaj gönderme/alma
- **Profil**: Kullanıcı bilgileri, takipçi/takip sayıları, paylaşım grid görünümü
- **Takip/Takip Et**: Kullanıcıları takip etme ve takipten çıkma özelliği
- **Beğeni & Yorum**: Paylaşımlara beğeni atma ve yorum yapma
- **Keşfet/Arama**: Kullanıcı ve yer arama özelliği
- **Gönderi Yükleme**: Fotoğraf ve Reels video yükleme
- **Etiketleme**: Gönderilere kullanıcı etiketleme

## Tasarım

- Açık tema, beyaz ve açık gri tonları ağırlıklı, Instagram'ın modern minimal çizgisinden ilham alan tasarım
- Siyah ve koyu gri metin, ince çizgilerle ayrılmış bölümler
- Profil fotoğrafları dairesel, hikaye daireleri renkli gradient kenarlıklı
- Paylaşımlar tam genişlikte, altında beğeni/yorum/paylaş ikonları
- Reels kartları ana akışta tam genişlikte, koyu arka planlı
- Mesajlaşma ekranı modern baloncuk tasarımlı
- Yumuşak geçiş animasyonları ve buton basma efektleri

## Sayfalar / Ekranlar

- **Ana Sayfa (Feed)**: Üstte hikaye şeridi, altında paylaşım akışı (gönderiler + Reels karışık). Her paylaşımda kullanıcı adı, fotoğraf, beğeni sayısı, yorum önizlemesi ve takip butonu
- **Keşfet/Arama**: Kullanıcı ve yer arama ekranı, son aramalar ve trend konular
- **Yükleme**: Fotoğraf ve Reels video seçme, düzenleme ve paylaşma ekranı
- **Bildirimler**: Beğeni, yorum, takip ve mention bildirimlerinin listelendiği ekran
- **Mesajlar Listesi**: Son mesajlarla birlikte sohbet listesi
- **Mesaj Detay**: Seçilen kişiyle mesajlaşma ekranı
- **Profil**: Kullanıcı fotoğrafı, bio, takipçi/takip istatistikleri ve paylaşım grid'i
- **Kullanıcı Profili**: Başka kullanıcıların profillerini görüntüleme

## Tab Bar Yapısı

1. Ana Sayfa (Feed) - Home ikonu
2. Keşfet (Search) - Search ikonu
3. Ekle (Add) - PlusSquare ikonu - Yükleme ekranını açar
4. Bildirimler - Heart ikonu
5. Mesajlar - MessageCircle ikonu
6. Profil - User ikonu

Not: Reels ayrı bir sekme olarak değil, ana akışa entegre edilmiştir.

## Yeni Eklenen Özellikler

- [x] **Kullanıcı Arama**: Kullanıcı adı veya isimle arama
- [x] **Yer Arama**: Lokasyon bazlı arama
- [x] **Fotoğraf Yükleme**: Galeriden fotoğraf seçme ve paylaşma
- [x] **Reels Yükleme**: Video seçme ve Reels olarak paylaşma
- [x] **Etiket Ekleme**: Gönderilere @mention ile kullanıcı etiketleme
- [x] **Konum Ekleme**: Gönderilere lokasyon bilgisi ekleme
