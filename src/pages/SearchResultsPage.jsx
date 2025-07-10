import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cards from "../components/Cards";  // Otel kartlarını göstermek için

const SearchResultPage = () => {

    const location = useLocation();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(location.search);
    const destination = params.get("destination") || "";
    const minPrice = params.get("minPrice") || "0";
    const maxPrice = params.get("maxPrice") || "9999";

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://yourapi.com/hotels", {
                    params: {
                        destination,
                        minPrice,
                        maxPrice,
                    },
                });
                setHotels(response.data);
            } catch (error) {
                console.error("Otel verileri alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [destination, minPrice, maxPrice]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Arama Sonuçları</h2>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : hotels.length === 0 ? (
                <p className="text-gray-500">Sonuç bulunamadı.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <Cards key={hotel.id} {...hotel} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResultPage