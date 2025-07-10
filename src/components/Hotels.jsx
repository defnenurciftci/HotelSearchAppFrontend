import React, { useRef } from 'react';
import HotelCard from './HotelCard';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const hotels = [
  {
    name: 'Antalya Hilton',
    location: 'Antalya, Türkiye',
    price: '₺1.500 / gece',
    image: 'https://assets.hiltonstatic.com/hilton-asset-cache/image/upload/c_fill,w_1920,h_1080,q_70,f_auto,g_auto/Imagery/Property%20Photography/Hilton%20Hotels%20and%20Resorts/I/ISTHITW/Hilton-Istanbul-Otel-Giris-Aksam-02.jpg'
  },
  {
    name: 'Deluxe Resort',
    location: 'Muğla, Türkiye',
    price: '₺2.000 / gece',
    image: 'https://assets.kerzner.com/api/public/content/434185142a3644718cad792aff117d47?v=64ffc60c&t=w2880'
  },
  {
    name: 'Lake View Hotel',
    location: 'İzmir, Türkiye',
    price: '₺1.250 / gece',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/37/40/eb/ja-lake-view-hotel.jpg?w=1200&h=-1&s=1'
  },
  {
    name: 'Cappadocia Cave Suites',
    location: 'Nevşehir, Türkiye',
    price: '₺1.800 / gece',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA37mJ4WAOnDu-g7ecoWjQLQMURYh7DDsctA&s'
  },
  {
    name: 'Palazzo Cordusio Gran Melia ',
    location: 'Milano, İtalya',
    price: '₺46.8000 / gece',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/692515919.jpg?k=541e17e1bca596c7cc676c9104e49899a9cee90f251f27d1b0ac6ad71f750fb5&o='
  },
  {
    name: 'The Dilly',
    location: 'Londra, Birleşik Krallık',
    price: '₺15.000 / gece',
    image: 'https://www.globalmousetravels.com/wp-content/uploads/2021/08/The-Dilly-Hotel-London-28.jpg'
  },
];

const Hotels = () => {
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    scrollRef.current.scrollLeft += offset;
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#535691] mb-6">Popüler Oteller</h2>

      {/* Oklar */}
      <button
        onClick={() => scroll(-300)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#535691] p-2 rounded-full shadow"
      >
        <MdArrowBackIos />
      </button>

      <button
        onClick={() => scroll(300)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#535691] p-2 rounded-full shadow"
      >
        <MdArrowForwardIos />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Hotels;  