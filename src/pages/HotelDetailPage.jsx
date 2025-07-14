import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // api.js dosyanızın yolu
// import { StarRating } from '../common/StarRating'; // StarRating bileşeninin yolu kaldırıldı
import { MapPin, Calendar, Users, DollarSign, ChevronLeft } from 'lucide-react'; // İkonlar

const HotelDetailPage = () => {
    const { hotelId } = useParams(); // URL'den otel ID'sini al
    const navigate = useNavigate();
    const [hotelDetails, setHotelDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCurrency, setDisplayCurrency] = useState(localStorage.getItem('currency') || 'EUR'); // Para birimi localStorage'dan veya varsayılan olarak EUR

    useEffect(() => {
        // Para birimi değiştiğinde localStorage'ı dinle (Navbar ile senkronizasyon için)
        const handleStorageChange = () => {
            setDisplayCurrency(localStorage.getItem('currency') || 'EUR');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) {
                setError("Otel ID'si bulunamadı.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // api.js'deki getProductInfo fonksiyonunu kullanarak otel detaylarını çek
                const response = await api.getProductInfo(hotelId);

                // API yanıtının yapısını kontrol et
                // API'niz doğrudan otel detay objesini döndürebilir veya bir 'item', 'data', 'body' vb. içinde döndürebilir.
                let details = null;
                if (response && response.product) { // Eğer yanıt içinde 'product' anahtarı varsa
                    details = response.product;
                } else if (response && response.item) { // Eğer yanıt içinde 'item' anahtarı varsa
                    details = response.item;
                } else if (response && response.data) { // Eğer yanıt içinde 'data' anahtarı varsa
                    details = response.data;
                } else if (response && response.body) { // Eğer yanıt içinde 'body' anahtarı varsa
                    details = response.body;
                } else if (response) { // Doğrudan yanıtın kendisi otel detayı olabilir
                    details = response;
                }

                if (details) {
                    setHotelDetails(details);
                } else {
                    console.warn("API'den otel detay verisi gelmedi veya formatı beklenmedik:", response);
                    setError("Otel detayları bulunamadı veya formatı beklenmedik.");
                }

            } catch (err) {
                console.error("Otel detayları alınamadı:", err);
                setError("Otel detayları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [hotelId]); // hotelId değiştiğinde useEffect'i tetikle

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Otel detayları yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)} // Bir önceki sayfaya geri dön
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Geri Dön
                </button>
            </div>
        );
    }

    if (!hotelDetails) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
                <p className="text-xl text-gray-700 mb-4">Otel detayları bulunamadı.</p>
                <button
                    onClick={() => navigate(-1)} // Bir önceki sayfaya geri dön
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Geri Dön
                </button>
            </div>
        );
    }

    // Otel detayları varsa bunları göster
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fef9ff] via-[#d4c1ec]/30 to-[#f2dfd7]/50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                {/* Geri Dön Butonu */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Arama Sonuçlarına Geri Dön
                </button>

                {/* Otel Başlık ve Bilgileri */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{hotelDetails.name || hotelDetails.hotelName || 'Otel Adı Yok'}</h1>
                    <p className="text-lg text-gray-600 flex items-center mb-2">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        {hotelDetails.city?.name || hotelDetails.location?.name || 'Bilinmiyor'}, {hotelDetails.country?.name || 'Bilinmiyor'}
                    </p>
                    {/* StarRating bileşeni kaldırıldı, onun yerine basit bir yıldız gösterimi eklendi */}
                    <div className="flex items-center text-yellow-500 text-lg">
                        {'⭐'.repeat(Math.floor(hotelDetails.stars || hotelDetails.userRating || hotelDetails.rating || 0))}
                        {(hotelDetails.stars || hotelDetails.userRating || hotelDetails.rating) % 1 !== 0 && ' half-star-emoji'} {/* Yarım yıldız için emoji veya özel bir sınıf ekleyebilirsiniz */}
                        <span className="ml-2 text-gray-600">
                            {hotelDetails.stars || hotelDetails.userRating || hotelDetails.rating || 0} Puan
                        </span>
                    </div>
                    <p className="text-md text-gray-500 mt-2">{hotelDetails.address || 'Adres bilgisi yok.'}</p>
                </div>

                {/* Resim Galerisi */}
                {hotelDetails.photos && hotelDetails.photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {hotelDetails.photos.slice(0, 6).map((photo, index) => ( // İlk 6 fotoğrafı göster
                            <img
                                key={index}
                                src={photo.url || photo.thumbnailFull || photo.imageUrl || `https://placehold.co/400x300/e2e8f0/e2e8f0?text=Otel+Resmi+${index + 1}`}
                                alt={`${hotelDetails.name || 'Otel'} - ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-8">
                        Resim bulunamadı.
                    </div>
                )}

                {/* Fiyat Bilgisi */}
                <div className="bg-blue-50 p-6 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-lg text-blue-800 font-semibold">Gecelik En İyi Fiyat:</p>
                        <p className="text-4xl font-bold text-blue-600">
                            {hotelDetails.offers && hotelDetails.offers.length > 0 && hotelDetails.offers[0].price
                                ? `${hotelDetails.offers[0].price.amount.toFixed(2)} ${displayCurrency}`
                                : 'Fiyat Yok'}
                        </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
                        Şimdi Rezervasyon Yap
                    </button>
                </div>

                {/* Açıklama */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Açıklama</h3>
                    <p className="text-gray-700 leading-relaxed">
                        {hotelDetails.description || 'Bu otel için açıklama bulunmamaktadır.'}
                    </p>
                </div>

                {/* Tesis Olanakları (Varsayımsal) */}
                {hotelDetails.amenities && hotelDetails.amenities.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Olanaklar</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-700">
                            {hotelDetails.amenities.map((amenity, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="text-green-500 mr-2">✔</span> {amenity.name || amenity}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Ek Bilgiler (Varsayımsal) */}
                {hotelDetails.checkinTime && hotelDetails.checkoutTime && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Ek Bilgiler</h3>
                        <div className="flex items-center text-gray-700 mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                            Giriş Saati: {hotelDetails.checkinTime}
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                            Çıkış Saati: {hotelDetails.checkoutTime}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default HotelDetailPage;
