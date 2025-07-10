import React from 'react';
import SearchBar from './SearchBar';
import { FiChevronDown } from 'react-icons/fi';

const Hero = () => {
  return (
    <div className="relative w-full h-[450px] md:h-[600px]">
      {/* Arka plan resmi */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out transform hover:scale-105"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2022/05/23/20/33/hot-air-balloon-7217173_1280.jpg')",
        }}
      />

      {/* Mor saydam katman */}
      <div className="absolute inset-0 bg-[#8986c8]/60" />

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d4c1ec] to-[#adadf6] drop-shadow-lg mb-6">
          Seyahat Etmeye Hazır Mısın?
        </h1>
        <p className="text-white text-lg md:text-2xl font-medium max-w-3xl opacity-90 mb-10 drop-shadow">
          Hayalini kurduğun tatil burada başlıyor! En düşük fiyatlarla otel rezervasyonunu yap.
        </p>
        <div className="w-full md:w-auto">
          <SearchBar />
        </div>
      </div>

      {/* Aşağı ok simgesi */}
      <FiChevronDown className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white text-3xl" />
    </div>
  );
};

export default Hero;
