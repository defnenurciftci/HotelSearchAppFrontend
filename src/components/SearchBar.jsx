import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // api.js dosyanızın yolu
import { MapPin, Hotel, Users, Calendar, Plus, Minus, X } from 'lucide-react'; // DollarSign kaldırıldı

const SearchBar = () => {
  const navigate = useNavigate();
  const destinationInputRef = useRef(null);
  const roomsRef = useRef(null);
  // nationalityInputRef kaldırıldı

  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null); // { id: ..., type: ..., name: ... }
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Milliyet state'leri kaldırıldı
  // const [nationality, setNationality] = useState('');
  // const [nationalityQuery, setNationalityQuery] = useState('');
  // const [nationalities, setNationalities] = useState([]);
  // const [filteredNationalities, setFilteredNationalities] = useState([]);
  // const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Oda ve Misafir state'leri
  const [rooms, setRooms] = useState([{ adult: 2, childAges: [] }]);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);

  // Kur state'leri kaldırıldı

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Toplam misafir sayısını hesaplar
  const totalGuests = rooms.reduce((acc, room) => acc + room.adult + room.childAges.length, 0);

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
      console.error("Autocomplete önerileri alınamadı:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Sayfa yüklendiğinde artık sadece milliyet listesi getiriliyor (kur listesi kaldırıldı)
  useEffect(() => {
    // Milliyetleri getirme kısmı buradan kaldırıldı, Navbar'a taşınacak
    // Bu useEffect artık boş kalabilir veya başka bir işlem yapmıyorsa kaldırılabilir.
    // Şimdilik boş bırakıyorum.
  }, []); // Boş bağımlılık dizisi ile sadece bir kez çalıştır

  // Varış yeri arama sorgusunda gecikmeli arama (debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(destinationQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [destinationQuery, fetchSuggestions]);

  // Dış tıklamaları dinler ve tüm açılır menüleri kapatır
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      // nationalityInputRef kontrolü kaldırıldı
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Varış yeri arama kutusundaki değişiklikleri yönetir
  const handleDestinationQueryChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    // Eğer seçili bir konum varsa ve arama kutusu değeri değişirse seçimi sıfırla
    if (selectedLocation && selectedLocation.name !== value) {
      setSelectedLocation(null);
    }
    setShowSuggestions(true); // Yazmaya başlandığında önerileri göster
  };

  // Otomatik tamamlama önerisine tıklandığında
  const handleSuggestionClick = (suggestion) => {
    const name = suggestion.hotel ? suggestion.hotel.name : suggestion.city.name;
    const id = suggestion.hotel ? suggestion.hotel.id : suggestion.city.id;
    const type = suggestion.type; // API'den gelen tip (örn: 1 şehir, 2 otel)

    setDestinationQuery(name);
    setSelectedLocation({ id, type, name });
    setSuggestions([]); // Önerileri temizle
    setShowSuggestions(false); // Açılır menüyü kapat
  };

  // Arama butonuna tıklandığında
  const handleSearch = () => {
    if (!selectedLocation) {
      alert("Lütfen bir destinasyon seçiniz."); // Kullanıcıya uyarı ver
      return;
    }

    // `api.searchByLocation` için istek gövdesini oluştur
    const searchRequestPayload = {
      destination: {
        id: selectedLocation.id,
        type: selectedLocation.type, // 1 for city, 2 for hotel (API'nin beklediği format)
      },
      checkin: checkIn || undefined, // Boş dize yerine undefined/null gönder
      checkout: checkOut || undefined,
      // nationalityId kaldırıldı
      roomCriteria: rooms.map(room => ({
        adult: room.adult,
        childAges: room.childAges
      }))
    };

    // Arama sonuçları sayfasına git ve arama payload'ını `state` olarak ilet.
    // `search-results` sayfası bu `state`'i kullanarak API çağrısını yapacaktır.
    navigate('/search-results', { state: { searchParams: searchRequestPayload } });
  };

  // Oda ve Misafir Yönetimi Fonksiyonları
  const handleAddRoom = () => setRooms([...rooms, { adult: 1, children: 0, childAges: [] }]);
  const handleRemoveRoom = (index) => { if (rooms.length > 1) setRooms(rooms.filter((_, i) => i !== index)); };
  const handleRoomChange = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index][field] = Math.max(0, value); // Değerin 0'dan küçük olmamasını sağla
    setRooms(newRooms);
  };
  const handleChildAgeChange = (roomIndex, childIndex, age) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].childAges[childIndex] = parseInt(age); // Yaşı sayıya dönüştür
    setRooms(newRooms);
  };
  const handleAddChild = (roomIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].childAges.push(0); // Yeni çocuğu varsayılan yaş 0 ile ekle
    setRooms(newRooms);
  };
  const handleRemoveChild = (roomIndex, childIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].childAges.splice(childIndex, 1); // Belirli çocuğu kaldır
    setRooms(newRooms);
  };

  // Milliyet arama kutusu değiştiğinde fonksiyonları kaldırıldı
  // const handleNationalityInputChange = (e) => { ... };
  // const handleNationalitySelect = (nat) => { ... };

  return (
    <div className="w-full max-w-[1100px] mx-auto bg-white/20 backdrop-blur-md border border-[#d4c1ec] shadow rounded-2xl p-6 flex flex-row flex-wrap gap-4 items-end relative z-0">

      {/* DESTINATION (Varış Yeri) */}
      <div className="flex-1 min-w-[220px] relative" ref={destinationInputRef}>
        <div className="flex items-center relative">
          <MapPin className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nereye gidiyorsunuz?"
            value={destinationQuery}
            onChange={handleDestinationQueryChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none placeholder-white"
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

      {/* CHECK-IN DATE (Giriş Tarihi) */}
      <div className="flex-1 min-w-[220px] relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-white custom-date-input"
          min={new Date().toISOString().split('T')[0]} // Bugün ve sonrası
        />
      </div>

      {/* CHECK-OUT DATE (Çıkış Tarihi) */}
      <div className="flex-1 min-w-[220px] relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#d4c1ec] focus:ring-2 focus:ring-[#adadf6] outline-none text-white custom-date-input"
          min={checkIn} // Check-in sonrası
        />
      </div>

      {/* Bu kısım artık burada değil */}

      {/* ROOM SELECTION (Oda Seçimi) */}
      <div className="relative w-full md:w-64 z-40" ref={roomsRef}>
        <button
          type="button"
          onClick={() => setShowRoomsDropdown(!showRoomsDropdown)}
          className="w-full border border-[#d4c1ec] px-4 py-3 rounded-lg bg-white/20 text-left text-white hover:bg-[#f2dfd7] flex items-center"
        >
          <Users className="h-5 w-5 text-gray-400 mr-3" />
          <span>{totalGuests} Misafir, {rooms.length} Oda</span>
        </button>
        {showRoomsDropdown && (
          <div className="absolute z-50 mt-2 bg-white border border-[#d4c1ec] rounded-lg shadow p-4 w-80 max-h-[400px] overflow-y-auto">
            {rooms.map((room, idx) => (
              <div key={idx} className="mb-4 border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-[#535691] mb-2 flex justify-between items-center">
                  Oda {idx + 1}
                  {rooms.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRoom(idx)} className="p-1 rounded-full hover:bg-red-100 text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span>Yetişkin</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleRoomChange(idx, "adult", room.adult - 1)} className="px-2 py-1 border rounded">-</button>
                    <span>{room.adult}</span>
                    <button type="button" onClick={() => handleRoomChange(idx, "adult", room.adult + 1)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Çocuk</span>
                  <button type="button" onClick={() => handleAddChild(idx)} className="bg-blue-100 text-blue-600 rounded-full p-1"><Plus className="h-4 w-4" /></button>
                </div>
                {room.childAges.map((age, childIndex) => (
                  <div key={childIndex} className="flex justify-between items-center mt-2 pl-4">
                    <span className="text-sm">Çocuk {childIndex + 1} Yaşı</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="17"
                        value={age}
                        onChange={(e) => handleChildAgeChange(idx, childIndex, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded-md"
                      />
                      <button type="button" onClick={() => handleRemoveChild(idx, childIndex)} className="ml-2 text-red-500 hover:text-red-700">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button type="button" onClick={handleAddRoom} className="w-full text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition text-sm">+ Oda Ekle</button>
            <button onClick={() => setShowRoomsDropdown(false)} className="mt-3 w-full bg-[#adadf6] hover:bg-[#8986c8] text-white py-2 rounded">Tamam</button>
          </div>
        )}
      </div>

      {/* SEARCH BUTTON (Arama Butonu) */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-[#adadf6] hover:bg-[#8986c8] text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition min-w-[200px]"
      >
        <IoIosSearch className="text-lg" />
        Otelleri Keşfet
      </button>
    </div>
  );
};

export default SearchBar;
