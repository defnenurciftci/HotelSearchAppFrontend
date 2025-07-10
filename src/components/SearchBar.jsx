import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MapPin, Hotel } from 'lucide-react';
import axiosClient from '../service/axiosClient';

const SearchBar = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState("");

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nationality, setNationality] = useState('');
  const [nationalities, setNationalities] = useState([]);

  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  const roomsRef = useRef(null);
  const destinationInputRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Toplam misafir sayısını hesaplama
  const totalGuests = rooms.reduce((acc, room) => {
    acc.adults += room.adults;
    acc.children += room.children;
    return acc;
  }, { adults: 0, children: 0 });

  // Autocomplete API'sine istek atan fonksiyon (Debounce ile)
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const data = await api.getArrivalAutocomplete(query);
      if (data && Array.isArray(data.items)) {
        setSuggestions(data.items);
      } else {
        setSuggestions([]);
      }
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocomplete önerileri alınamadı:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Nationality listesini çek
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const data = await api.getNationalities();
        if (data && Array.isArray(data.items)) {
          setNationalities(data.items);
        }
      } catch (error) {
        console.error("Milliyetler alınamadı:", error);
      }
    };
    fetchNationalities();
  }, []);

  // `destinationQuery` değiştiğinde debounce ile öneri çek
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(destinationQuery);
    }, 500); // 500ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [destinationQuery, fetchSuggestions]);

  // Destination input değeri değiştiğinde çalışacak
  const handleDestinationQueryChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    // Eğer input boşaltılırsa veya kullanıcı yeni bir şey yazmaya başlarsa seçili lokasyonu sıfırla
    if (selectedLocation && selectedLocation.name !== value) {
        setSelectedLocation(null);
    }
    setShowSuggestions(true); // Inputa yazmaya başlayınca önerileri göster
  };

  // Öneriye tıklandığında
  const handleSuggestionClick = (suggestion) => {
    const name = suggestion.hotel ? suggestion.hotel.name : suggestion.city.name;
    // API'den gelen id ve type'ı kaydediyoruz
    const id = suggestion.hotel ? suggestion.hotel.id : suggestion.city.id;
    const type = suggestion.type; // type: 1 for city, 2 for hotel

    setDestinationQuery(name); // Input'a tam adı yaz
    setSelectedLocation({ id, type, name }); // Seçilen lokasyonun tüm bilgilerini kaydet
    setSuggestions([]); // Önerileri temizle
    setShowSuggestions(false); // Öneriler listesini gizle
  };

  const handleSearch = () => {
    // Arama yapmak için `selectedLocation` kullanılıyor
    if (!selectedLocation) {
        alert("Lütfen bir destinasyon seçiniz.");
        return;
    }

    const params = new URLSearchParams();
    params.set("destinationId", selectedLocation.id); // Seçilen lokasyonun ID'si
    params.set("destinationType", selectedLocation.type); // Seçilen lokasyonun tipi
    params.set("destinationName", selectedLocation.name); // Seçilen lokasyonun adı

    // Tarihlerin boş olup olmadığını kontrol edin
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    if (nationality) params.set("nationality", nationality);

    params.set("rooms", JSON.stringify(rooms)); // rooms array'ini JSON string'ine çevirerek gönder

    navigate(`/search-results?${params.toString()}`);
  };

  const handleRoomChange = (roomIndex, type, delta) => {
    setRooms(prev =>
      prev.map((room, idx) =>
        idx === roomIndex
          ? { ...room, [type]: Math.max(0, room[type] + delta) }
          : room
      )
    );
  };

  const addRoom = () => setRooms([...rooms, { adults: 1, children: 0 }]);
  const removeRoom = (index) => {
    if (rooms.length > 1) {
      setRooms(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axiosClient.get("/api/v1/locations/autocomplete", {
        query: value,
      });

      // Backend'den gelen öneri listesi response.data.suggestions olarak varsayılmıştır
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocomplete hatası:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Örnek olarak boş query ile çağırılıyor. Backend buna göre minPrice, maxPrice vs. dönüyorsa ayarla.
        const response = await axiosClient.post("/api/v1/locations/autocomplete", {
          query: "a",
        });

        setFilterOptions(response.data);

        if (response.data.minPrice) setMinPrice(response.data.minPrice);
        if (response.data.maxPrice) setMaxPrice(response.data.maxPrice);
      } catch (error) {
        console.error("Filtre verisi alınamadı:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Dropdown'lar ve autocomplete için dışarı tıklama olayını yöneten useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
        setShowSuggestions(false); // Autocomplete önerileri için dışarı tıklama
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#fef9ff] border border-[#d4c1ec] shadow rounded-2xl p-6 flex flex-wrap gap-4 items-end relative z-0">

      {/* Destination Input ve Autocomplete Alanı */}
      <div className="flex-1 min-w-[200px] relative" ref={destinationInputRef}>
        <div className="flex items-center relative">
          <MapPin className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nereye gidiyorsunuz?"
            value={destinationQuery} // Input değeri için ayrı state kullanılıyor
            onChange={handleDestinationQueryChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none placeholder-[#8986c8]"
            onFocus={() => destinationQuery.length >= 2 && setShowSuggestions(true)}
          />
        </div>

        {showSuggestions && (loadingSuggestions || suggestions.length > 0) && (
          <ul className="absolute z-50 mt-2 w-full bg-white border border-[#d4c1ec] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loadingSuggestions && <li className="px-4 py-2 text-gray-500">Yükleniyor...</li>}
            {!loadingSuggestions && suggestions.length === 0 && destinationQuery.length >= 2 && <li className="px-4 py-2 text-gray-500">Sonuç bulunamadı.</li>}
            {!loadingSuggestions && suggestions.map((s, index) => (
              <li
                key={`${s.type}-${s.hotel?.id || s.city?.id}-${index}`} // Benzersiz key için daha kapsamlı bir yapı
                className="px-4 py-3 cursor-pointer hover:bg-[#f2dfd7] text-[#535691] flex items-center"
                onClick={() => handleSuggestionClick(s)}
              >
                <div className="mr-3">
                  {s.type === 2 ? <Hotel className="h-5 w-5 text-gray-500" /> : <MapPin className="h-5 w-5 text-gray-500" />}
                </div>
                <div>
                  <p className="font-semibold">{s.hotel ? s.hotel.name : s.city.name}</p>
                  <p className="text-sm text-gray-500">{s.country.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-[#8986c8]"
      />

      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-[#8986c8]"
      />

      <div className="flex-1 min-w-[200px] relative">
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#d4c1ec] focus:outline-none focus:ring-2 focus:ring-[#adadf6] bg-white text-[#8986c8]"
        >
          <option value="">Milliyet Seçiniz</option>
          {nationalities.map((nat) => (
            <option key={nat.id} value={nat.id}>{nat.name}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full md:w-64 z-40" ref={roomsRef}>
        <button
          onClick={() => setShowRoomsDropdown(!showRoomsDropdown)}
          className="w-full border border-[#d4c1ec] px-4 py-3 rounded-lg bg-white text-left text-[#8986c8] hover:bg-[#f2dfd7]"
        >
          {rooms.length} Oda, {totalGuests.adults} Yetişkin, {totalGuests.children} Çocuk
        </button>

        {showRoomsDropdown && (
          <div className="absolute z-50 mt-2 bg-white border border-[#d4c1ec] rounded-lg shadow p-4 w-80 max-h-[400px] overflow-y-auto">
            {rooms.map((room, idx) => (
              <div key={idx} className="mb-4 border-b pb-3">
                <p className="font-semibold text-[#535691] mb-2">{idx + 1}. Oda</p>
                <div className="flex justify-between items-center mb-2">
                  <span>Yetişkin</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRoomChange(idx, "adults", -1)} className="px-2 py-1 border rounded">-</button>
                    <span>{room.adults}</span>
                    <button onClick={() => handleRoomChange(idx, "adults", 1)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Çocuk</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRoomChange(idx, "children", -1)} className="px-2 py-1 border rounded">-</button>
                    <span>{room.children}</span>
                    <button onClick={() => handleRoomChange(idx, "children", 1)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
                {rooms.length > 1 && (
                  <button onClick={() => removeRoom(idx)} className="text-red-500 text-sm mt-1">
                    Odayı Sil
                  </button>
                )}
              </div>
            ))}
            <button onClick={addRoom} className="text-sm text-blue-600 hover:underline">Oda Ekle</button>
            <button onClick={() => setShowRoomsDropdown(false)} className="mt-3 w-full bg-[#adadf6] hover:bg-[#8986c8] text-white py-2 rounded">Tamam</button>
          </div>
        )}
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-[#adadf6] hover:bg-[#8986c8] text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition"
      >
        <IoIosSearch className="text-lg" />
        Ara
      </button>
    </div>
  );
};

export default SearchBar;