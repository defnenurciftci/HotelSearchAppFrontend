import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cards from "../components/Cards";
import { api } from '../services/api';

const SearchResultPage = () => {
  const location = useLocation();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const destinationId = params.get("destinationId") || "";
  const destinationType = params.get("destinationType") || "";
  const destinationName = params.get("destinationName") || "";
  const checkIn = params.get("checkin") || "";
  const checkOut = params.get("checkout") || "";
  const nationality = params.get("nationality") || "";

  let rooms = [];
  try {
    const roomsString = params.get("rooms");
    rooms = roomsString ? JSON.parse(roomsString) : [{ adults: 1, children: 0 }];
  } catch (e) {
    console.error("Rooms parametresi parse edilirken hata:", e);
    rooms = [{ adults: 1, children: 0 }];
  }

  useEffect(() => {
    if (!destinationId || !destinationType) {
      setHotels([]);
      setLoading(false);
      return;
    }

    const fetchHotels = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = {
          destinationId: destinationId,
          destinationType: destinationType,
          checkIn: checkIn,
          checkOut: checkOut,
          nationality: nationality,
          // ÖNEMLİ: Backend'iniz rooms dizisini JSON string olarak bekliyorsa bu doğru.
          // Eğer URLSearchParams ile gönderilecekse, rooms'u doğrudan obj olarak veremezsiniz.
          // Ya backend'in URL parametrelerinde array parse etme yeteneği olmalı,
          // ya da her odayı ayrı ayrı parametreye dönüştürmeniz gerekir (örn: rooms[0].adults=1, rooms[0].children=0)
          // Şimdilik JSON string olarak gönderdiğimiz varsayımıyla devam ediyorum.
          rooms: JSON.stringify(rooms),
        };

        // Düzeltildi: api.searchHotels metodu doğrudan bir obje bekliyor, query string oluşturma işini kendi içinde yapıyor.
        const response = await api.searchHotels(searchParams);

        if (response && Array.isArray(response)) {
            setHotels(response);
        } else if (response && Array.isArray(response.items)) {
            setHotels(response.items);
        } else {
            setHotels([]);
        }

      } catch (err) {
        console.error("Otel verileri alınamadı:", err);
        setError("Otel verileri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destinationId, destinationType, checkIn, checkOut, nationality, JSON.stringify(rooms)]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Arama Sonuçları: {destinationName || "Belirtilmedi"}
      </h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-600 mt-4">{error}</p>
      ) : hotels.length === 0 ? (
        <p className="text-gray-500 mt-4">Bu arama kriterlerine uygun otel bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {hotels.map((hotel) => (
            <Cards key={hotel.id} {...hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;