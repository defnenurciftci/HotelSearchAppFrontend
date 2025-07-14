import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosBed } from 'react-icons/io';
import { api } from '../services/api'; // api.js dosyanızı içe aktarın

const Navbar = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('currency') || 'TRY' // Varsayılanı 'TRY' veya localStorage'dan al
  );

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // api.js'deki getCurrencies fonksiyonunu kullan
        const data = await api.getCurrencies();

        // API'den gelen verinin yapısına göre currencies state'ini güncelle
        // Hata mesajınızdan anlaşıldığı üzere, 'data' doğrudan bir dizi objeler içeriyor.
        if (data && Array.isArray(data)) { // data.items yerine doğrudan data'nın dizi olup olmadığını kontrol et
          // Sadece para birimi kodlarını alarak state'e kaydet
          const currencyCodes = data.map(c => c.code); // data.items yerine doğrudan data'yı map et
          setCurrencies(currencyCodes);

          // Eğer seçili bir para birimi yoksa veya mevcut para birimleri arasında değilse
          // varsayılan bir değer ayarla (örn: EUR veya ilk gelen)
          if (!currencyCodes.includes(selectedCurrency)) {
            const defaultCurrency = currencyCodes.find(code => code === 'EUR') || currencyCodes[0];
            if (defaultCurrency) {
              setSelectedCurrency(defaultCurrency);
              localStorage.setItem('currency', defaultCurrency);
            }
          }
        } else {
          // Bu blok, API'den hiç veri gelmezse veya veri beklenen dizi formatında değilse çalışır
          console.warn("API'den para birimi verisi gelmedi veya formatı beklenmedik:", data);
          setCurrencies([]); // Hata durumunda boş dizi ayarla
        }
      } catch (err) {
        console.error('Para birimleri alınamadı:', err);
        setCurrencies([]); // Hata durumunda boş dizi ayarla
      }
    };

    fetchCurrencies();
  }, []); // Boş bağımlılık dizisi ile sadece bir kez çalıştır

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency); // Seçilen para birimini yerel depolamaya kaydet
  };

  return (
    <nav className="flex justify-between items-center bg-[#ebe6f6] border border-[#adadf6] shadow-md p-4 px-6">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-[#535691]">
        <IoIosBed className="w-6 h-6" />
        <span className="text-2xl font-extrabold tracking-wide">VOYAGO</span>
      </div>

      {/* Menü + Para Birimi Seçimi */}
      <div className="flex items-center space-x-6 text-[#535691] font-semibold">
        <Link to="/" className="hover:text-[#8986c8] transition-colors duration-200">
          Anasayfa
        </Link>
        <Link to="/login" className="hover:text-[#8986c8] transition-colors duration-200">
          Giriş Yap
        </Link>

        {/* Para birimi seçici */}
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="text-sm border border-[#adadf6] bg-white text-[#535691] px-2 py-1 rounded-md"
        >
          {/* currencies dizisi artık doğrudan kodları içeriyor */}
          {currencies.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
