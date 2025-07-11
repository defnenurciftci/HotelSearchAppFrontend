import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MapPin, Hotel } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const destinationInputRef = useRef(null);
  const roomsRef = useRef(null);
  const nationalityInputRef = useRef(null);

  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Milliyet state'leri
  const [nationality, setNationality] = useState(''); // Seçilen milliyetin ID'si (örn: "TR")
  const [nationalityQuery, setNationalityQuery] = useState(''); // Arama kutusundaki metin (örn: "Türkiye")
  const [nationalities, setNationalities] = useState([]); // Tüm milliyet listesi
  const [filteredNationalities, setFilteredNationalities] = useState([]); // Filtrelenmiş milliyet listesi
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false); // Dropdown'ın görünürlüğü

  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);


  const totalGuests = rooms.reduce((acc, room) => {
    acc.adults += room.adults;
    acc.children += room.children;
    return acc;
  }, { adults: 0, children: 0 });

  // Varış yeri önerilerini getirme fonksiyonu
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length <= 2) {
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
      console.error("Autocomplete error 57:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Sayfa yüklendiğinde milliyet listesini bir kez getirir
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        console.log("data is ok")
        const data = await api.getNationalities();
        if (data && Array.isArray(data.items)) {
          console.log("first if is ok")
          setNationalities(data.items);
          setFilteredNationalities(data.items);
        }
      } catch (error) {
        console.error("Milliyetler alınamadı:", error);
      }
    };
    fetchNationalities();
  }, []);

  // Varış yeri arama sorgusunda gecikmeli arama
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(destinationQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [destinationQuery, fetchSuggestions]);

  // Dış tıklamaları dinler ve dropdown'ları kapatır
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (nationalityInputRef.current && !nationalityInputRef.current.contains(event.target)) {
        setShowNationalityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fonksiyonlar
  const handleDestinationQueryChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    if (selectedLocation && selectedLocation.name !== value) {
      setSelectedLocation(null);
    }
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    const name = suggestion.hotel ? suggestion.hotel.name : suggestion.city.name;
    const id = suggestion.hotel ? suggestion.hotel.id : suggestion.city.id;
    const type = suggestion.type;

    setDestinationQuery(name);
    setSelectedLocation({ id, type, name });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      alert("Lütfen bir destinasyon seçiniz.");
      return;
    }

    const params = new URLSearchParams();
    params.set("destinationId", selectedLocation.id);
    params.set("destinationType", selectedLocation.type);
    params.set("destinationName", selectedLocation.name);
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    if (nationality) params.set("nationality", nationality);
    params.set("rooms", JSON.stringify(rooms));

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

  // Milliyet arama kutusu değiştiğinde
  const handleNationalityInputChange = (e) => {
    const value = e.target.value;
    setNationalityQuery(value);
    setShowNationalityDropdown(true);

    if (value.trim() === "") {
      setFilteredNationalities(nationalities);
    } else {
      const filtered = nationalities.filter(nat =>
        nat.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNationalities(filtered);
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
    <div className="w-full max-w-[1100px] mx-auto bg-[#fef9ff] border border-[#d4c1ec] shadow rounded-2xl p-6 flex flex-col lg:flex-row lg:flex-wrap gap-4 items-end relative z-0">

      {/* DESTINATION */}
      <div className="flex-1 min-w-[220px] relative" ref={destinationInputRef}>
        <div className="flex items-center relative">
          <MapPin className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nereye gidiyorsunuz?"
            value={destinationQuery}
            onChange={handleDestinationQueryChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none placeholder-[#8986c8]"
            onFocus={() => destinationQuery.length >= 2 && setShowSuggestions(true)}
          />
        </div>
        {showSuggestions && (
          <ul className="absolute z-50 mt-2 w-full bg-white border border-[#d4c1ec] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loadingSuggestions && <li className="px-4 py-2 text-gray-500">Yükleniyor...</li>}
            {!loadingSuggestions && suggestions.length === 0 && (
              <li className="px-4 py-2 text-gray-500">Sonuç bulunamadı.</li>
            )}
            {suggestions.map((s, index) => (
              <li
                key={`${s.type}-${s.hotel?.id || s.city?.id}-${index}`}
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

      {/* DATES */}
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="flex-1 min-w-[220px] px-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-[#8986c8]"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="flex-1 min-w-[220px] px-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-[#8986c8]"
      />

      {/* NATIONALITY */}
      <div className="flex-1 min-w-[220px] relative" ref={nationalityInputRef}>
        <div className="flex items-center relative">
          <span className="absolute left-3 h-5 w-5 text-gray-400">🌐</span>
          <input
            type="text"
            placeholder="Milliyet Seçiniz"
            value={nationalityQuery}
            onChange={handleNationalityInputChange}
            onFocus={() => {
              setShowNationalityDropdown(true);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:outline-none focus:ring-2 focus:ring-[#adadf6] bg-white text-[#8986c8]"
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

      {/* ROOM SELECTION */}
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
                  <button onClick={() => removeRoom(idx)} className="text-red-500 text-sm mt-1">Odayı Sil</button>
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
        className="flex items-center gap-2 bg-[#adadf6] hover:bg-[#8986c8] text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition min-w-[200px]"
      >
        <IoIosSearch className="text-lg" />
        Ara
      </button>
    </div>
  );
};

export default SearchBar;