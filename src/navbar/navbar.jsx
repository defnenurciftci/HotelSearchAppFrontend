import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosBed } from 'react-icons/io';

const Navbar = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('currency') || 'TRY'
  );

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
        const data = await res.json();
        const codes = Object.keys(data.rates).slice(0, 10); // İstersen tümünü kullanabilirsin
        setCurrencies(codes);
      } catch (err) {
        console.error('Para birimleri alınamadı:', err);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency); // Global saklama
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
