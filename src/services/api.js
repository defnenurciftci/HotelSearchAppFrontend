const API_BASE_URL = 'https://f0da8c1664cc.ngrok-free.app/'; // Sonundaki eğik çizgiyi kaldırdım, böylece her bir metodda manuel olarak ekleyebiliriz veya otomatik eklenen durumlarda çakışmayı önleriz.

export const api = {
  getArrivalAutocomplete: (query) => fetch(`${API_BASE_URL}api/v1/locations/autocomplete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }),

  // Düzeltildi: Eğik çizgi eklendi
getNationalities: async () => {
  const res = await fetch(`${API_BASE_URL}api/v1/lookups/nationalities`);
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.warn("❗ Beklenmeyen içerik tipi:", contentType);
    console.warn("❗ Dönen içerik:", text.slice(0, 200)); // sadece ilk 200 karakteri yaz
    throw new Error("Beklenmeyen yanıt tipi (HTML olabilir)");
  }

  return res.json();
},
  // Düzeltildi: Eğik çizgi eklendi
  getCurrencies: () => fetch(`${API_BASE_URL}api/v1/lookups/currencies`).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }),

  // Düzeltildi: Eğik çizgi eklendi
  priceSearch: (searchParams) => fetch(`${API_BASE_URL}api/v1/search/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchParams),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }),

  // Düzeltildi: Eğik çizgi eklendi
  getProductInfo: (productId) => fetch(`${API_BASE_URL}api/v1/products/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: productId }),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }),

  // Otel arama API'si için metot düzeltildi.
  // GET isteği olduğu için parametreler URL'ye eklendi.
  // Düzeltildi: Eğik çizgi eklendi
  searchHotels: (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    return fetch(`${API_BASE_URL}api/v1/hotels/search?${queryString}`, {
      method: 'GET',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
  },
};