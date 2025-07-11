const API_BASE_URL = 'https://3f44e2b20dd6.ngrok-free.app/';

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
    console.log("getNationalities API çağrılıyor...");
    const res = await fetch(`${API_BASE_URL}api/v1/lookups/nationalities`);
    const contentType = res.headers.get("content-type");
    console.log("Yanıt durumu:", res.status);
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