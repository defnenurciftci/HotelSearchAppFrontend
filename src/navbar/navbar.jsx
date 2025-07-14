import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoIosBed } from 'react-icons/io';
import { api } from '../services/api'; // api.js dosyanızı içe aktarın
import { Globe } from 'lucide-react'; // DollarSign kaldırıldı
const Navbar = () => {
  const nationalityInputRef = useRef(null);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('currency') || 'TRY' // Varsayılanı 'TRY' veya localStorage'dan al
  );

  // Milliyet state'leri eklendi
  const [nationality, setNationality] = useState(''); // Seçilen milliyetin ID'si (örn: "TR")
  const [nationalityQuery, setNationalityQuery] = useState(''); // Arama kutusundaki metin (örn: "Türkiye")
  const [nationalities, setNationalities] = useState([]); // Tüm milliyet listesi
  const [filteredNationalities, setFilteredNationalities] = useState([]); // Filtrelenmiş milliyet listesi
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false); // Dropdown'ın görünürlüğü



  useEffect(() => {
    const fetchData = async () => {
      // Kurları getir
      try {
        const data = await api.getCurrencies();
        if (data && Array.isArray(data)) {
          const currencyCodes = data.map(c => c.code);
          setCurrencies(currencyCodes);
          if (!currencyCodes.includes(selectedCurrency)) {
            const defaultCurrency = currencyCodes.find(code => code === 'EUR') || currencyCodes[0];
            if (defaultCurrency) {
              setSelectedCurrency(defaultCurrency);
              localStorage.setItem('currency', defaultCurrency);
            }
          }
        } else {
          console.warn("API'den para birimi verisi gelmedi veya formatı beklenmedik:", data);
          setCurrencies([]);
        }
      } catch (err) {
        console.error('Para birimleri alınamadı:', err);
        setCurrencies([]);
      }

      // Milliyetleri getir (SearchBar'dan taşındı)
      try {
        const nationalitiesData = await api.getNationalities();
        if (nationalitiesData && Array.isArray(nationalitiesData)) {
          setNationalities(nationalitiesData);
          setFilteredNationalities(nationalitiesData);
          // Varsayılan milliyeti ilk gelen olarak ayarla veya "TR" bul
          const defaultNationality = nationalitiesData.find(n => n.id === 'TR') || nationalitiesData[0];
          if (defaultNationality) {
            setNationality(defaultNationality.id);
            setNationalityQuery(defaultNationality.name);
          }
        } else {
          console.warn("API'den milliyet verisi gelmedi veya formatı beklenmedik:", nationalitiesData);
          setNationalities([]);
        }
      } catch (error) {
        console.error("Milliyetler alınamadı:", error);
        setNationalities([]);
      }
    };

    fetchData();
  }, []); // Boş bağımlılık dizisi ile sadece bir kez çalıştır

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nationalityInputRef.current && !nationalityInputRef.current.contains(event.target)) {
        setShowNationalityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency); // Seçilen para birimini yerel depolamaya kaydet
  };
  // Milliyet arama kutusu değiştiğinde
  const handleNationalityInputChange = (e) => {
    const value = e.target.value;
    setNationalityQuery(value);
    setShowNationalityDropdown(true);

    if (value.trim() === "") {
      setFilteredNationalities(nationalities); // Arama kutusu boşsa tüm milliyetleri göster
    } else {
      const filtered = nationalities.filter(nat =>
        nat.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNationalities(filtered); // Arama sorgusuna göre filtrele
    }

    // Arama kutusundaki değer değiştiğinde seçimi sıfırla
    if (nationality) {
      const selectedNat = nationalities.find(n => n.id === nationality);
      if (selectedNat && selectedNat.name !== value) {
        setNationality('');
      }
    }
  };

  // Milliyet listeden seçildiğinde
  const handleNationalitySelect = (nat) => {
    setNationality(nat.id);
    setNationalityQuery(nat.name);
    setShowNationalityDropdown(false);
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
        {/* NATIONALITY (Milliyet) - SearchBar'dan taşındı */}
        <div className="relative" ref={nationalityInputRef}>
          <div className="flex items-center relative">
            <Globe className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Milliyet Seçiniz"
              value={nationalityQuery}
              onChange={handleNationalityInputChange}
              onFocus={() => {
                setShowNationalityDropdown(true);
                if (nationalityQuery === "") {
                  setFilteredNationalities(nationalities);
                }
              }}
              className="w-full pl-10 pr-4 py-1 rounded-md border border-[#adadf6] focus:outline-none focus:ring-2 focus:ring-[#adadf6] bg-white text-[#535691]"
            />
          </div>

          {showNationalityDropdown && (
            <ul className="absolute z-50 mt-2 w-full bg-white border border-[#d4c1ec] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredNationalities.length === 0 ? (
                <li className="px-4 py-2 text-gray-500">Sonuç bulunamadı.</li>
              ) : (
                filteredNationalities.map((nat) => (
                  <li
                    key={nat.id}
                    className="px-4 py-3 cursor-pointer hover:bg-[#f2dfd7] text-[#535691]"
                    onClick={() => handleNationalitySelect(nat)}
                  >
                    {nat.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
