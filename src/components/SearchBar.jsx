import React, { useState, useRef, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PriceSlider from './PriceSlider';
import axiosClient from '../service/axiosClient';

const SearchBar = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [race, setRace] = useState('');
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  const [showPriceSlider, setShowPriceSlider] = useState(false);

  const roomsRef = useRef(null);
  const priceRef = useRef(null);
  const destinationRef = useRef(null);

  const totalGuests = rooms.reduce(
    (acc, room) => {
      acc.adults += room.adults;
      acc.children += room.children;
      return acc;
    },
    { adults: 0, children: 0 }
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("destination", destination);
    params.set("checkin", checkIn);
    params.set("checkout", checkOut);
    params.set("minPrice", minPrice);
    params.set("maxPrice", maxPrice);
    params.set("race", race);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setShowPriceSlider(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#fef9ff] border border-[#d4c1ec] shadow rounded-2xl p-6 flex flex-wrap gap-4 items-end overflow-visible relative z-0">

      {/* DESTINATION AUTOCOMPLETE */}
      <div className="relative w-full md:flex-1" ref={destinationRef}>
        <input
          type="text"
          value={destination}
          onChange={handleDestinationChange}
          onFocus={() => destination.length > 1 && setShowSuggestions(true)}
          placeholder="Nereye gidiyorsunuz?"
          className="w-full px-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-[#8986c8]"
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-[#d4c1ec] rounded-md shadow max-h-60 overflow-y-auto">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setDestination(item);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 hover:bg-[#f2dfd7] cursor-pointer text-[#535691]"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CHECK-IN / CHECK-OUT */}
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

      <div className="flex-1 min-w-[200px] relative z-50">
        <label htmlFor="race" className="sr-only">Irk Seçiniz</label>
        <select
          id="race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          className="w-full appearance-none px-4 py-3 rounded-lg border border-[#d4c1ec] focus:outline-none focus:ring-2 focus:ring-[#adadf6] bg-white text-[#8986c8] z-10"
        >
          <option value="">Irk Seçiniz</option>
          <option value="Turk">Türk</option>
          <option value="Diger">Diğer</option>
        </select>
        <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#8986c8]">▼</div>
      </div>

      {/* CURRENCY */}
      <div className="flex-1 min-w-[150px]">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full appearance-none px-4 py-3 rounded-lg border border-[#d4c1ec] focus:outline-none focus:ring-2 focus:ring-[#adadf6] bg-white text-[#8986c8]"
        >
          <option value="">Para Birimi</option>
          {filterOptions.currencyOptions.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>

      {/* PRICE SLIDER */}
      <div className="w-full md:w-[400px] relative z-30" ref={priceRef}>
        <button
          onClick={() => setShowPriceSlider(!showPriceSlider)}
          className="w-full border border-[#d4c1ec] px-4 py-3 rounded-lg bg-white text-left text-[#8986c8] hover:bg-[#f2dfd7]"
        >
          {minPrice}₺ - {maxPrice}₺ Arası Fiyat Seç {showPriceSlider ? "▲" : "▼"}
        </button>

        {showPriceSlider && (
          <div className="absolute z-40 mt-2 bg-white border border-[#d4c1ec] rounded-xl shadow p-4 w-full">
            <PriceSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
            <button
              onClick={() => setShowPriceSlider(false)}
              className="mt-3 w-full bg-[#adadf6] hover:bg-[#8986c8] text-white py-2 rounded"
            >
              Tamam
            </button>
          </div>
        )}
      </div>

      {/* ROOMS */}
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
            <button onClick={addRoom} className="text-sm text-blue-600 hover:underline">
              Oda Ekle
            </button>
            <button
              onClick={() => setShowRoomsDropdown(false)}
              className="mt-3 w-full bg-[#adadf6] hover:bg-[#8986c8] text-white py-2 rounded"
            >
              Tamam
            </button>
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
  )
}

export default SearchBar
