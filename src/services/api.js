const API_BASE_URL = 'http://localhost:8080/api/v1';
const API_ROOT_BASE_URL = 'http://localhost:8080';

export const api = {
  // getArrivalAutocomplete fonksiyonu: Varış yeri otomatik tamamlama için POST isteği gönderir.
  // Bu fonksiyon zaten doğru JSON dönüşü yapıyor ve sunucunuzdan beklenen davranışı alıyor.
  getArrivalAutocomplete: (query) => fetch(`${API_BASE_URL}/locations/autocomplete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }).then(res => {
    // Sunucu yanıtının başarılı olup olmadığını kontrol et (HTTP durum kodu 200-299 arası mı?)
    if (!res.ok) {
      // Başarılı değilse, hata detaylarını daha iyi görmek için yanıtı metin olarak oku
      return res.text().then(text => {
        // Hata mesajına sunucudan gelen yanıtın ilk 500 karakterini ekle
        console.error("❌ getArrivalAutocomplete HTTP hatası:", res.status, "Yanıt:", text.slice(0, 500));
        throw new Error(`HTTP hatası! Durum: ${res.status}. Yanıt: ${text.slice(0, 500)}`);
      });
    }
    // Başarılıysa, yanıtı JSON olarak ayrıştır
    return res.json();
  }),

  getCurrencies: () => fetch(`${API_BASE_URL}/lookups/currencies`).then(res => res.json()),

  // getNationalities fonksiyonu: Milliyet verilerini almak için GET isteği gönderir.
  // Bu fonksiyon, sunucudan HTML yerine JSON yanıtı almayı garanti altına almak için güncellendi.
  getNationalities: async () => {
    console.log("getNationalities API çağrılıyor...");

    try {
      const res = await fetch(`${API_BASE_URL}/lookups/nationalities`, {
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Sunucuya JSON içeriği tercih ettiğimizi belirtiyoruz
        }
      });

      // Yanıtın başarılı olup olmadığını kontrol et (2xx durum kodları)
      if (!res.ok) {
        const errorText = await res.text(); // Hata varsa yanıt gövdesini metin olarak oku (HTML hata sayfası olabilir)
        console.warn("❌ Hatalı yanıt durumu:", res.status);
        console.warn("❌ Yanıt gövdesi (ilk 500 karakter):", errorText.slice(0, 500));
        // Daha detaylı bir hata fırlat
        throw new Error(`HTTP hatası! Durum: ${res.status}. Sunucu beklenmedik bir hata veya HTML yanıtı döndürdü.`);
      }

      const contentType = res.headers.get("content-type");

      // Dönen içeriğin JSON olup olmadığını kesin olarak kontrol et
      if (!contentType || !contentType.includes("application/json")) {
        const unexpectedContent = await res.text(); // Beklenmedik içeriği metin olarak oku
        console.warn("❗ Beklenmeyen içerik tipi:", contentType);
        console.warn("❗ Dönen içerik (ilk 500 karakter):", unexpectedContent.slice(0, 500));
        // Eğer JSON değilse, HTML olduğunu varsayıp açıkça hata fırlat
        throw new Error(`Beklenmeyen yanıt tipi: ${contentType}. Sunucu JSON yerine HTML veya farklı bir format döndürdü.`);
      }

      // Her şey yolundaysa, yanıtı JSON olarak ayrıştır
      return res.json();
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu:", error);
      // Hatanın tekrar fırlatılması, çağrıyı yapan kodun hatayı yakalamasını sağlar
      throw error;
    }
  },

  priceSearch: (searchParams) => fetch(`${API_BASE_URL}/search/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchParams),
  }).then(res => res.json()),

  // getProductInfo fonksiyonu: Ürün bilgisi almak için POST isteği gönderir.
  getProductInfo: (productId) => fetch(`${API_BASE_URL}/products/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: productId }),
  }).then(res => res.json()),
  searchByLocation: (requestBody) => fetch(`${API_ROOT_BASE_URL}/api/price-search/by-location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  }).then(res => res.json()),

  // searchHotels fonksiyonu: Otel aramak için GET isteği gönderir.
  /**
   * Otele göre fiyat araması yapar.
   * @param {object} requestBody - PriceSearchByHotelRequest ile uyumlu nesne.
   */
  searchByHotel: (requestBody) => fetch(`${API_ROOT_BASE_URL}/api/price-search/by-hotel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  }).then(res => res.json()),
};
