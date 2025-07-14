import React from 'react';
import SearchBar from './SearchBar';
import { FiChevronDown } from 'react-icons/fi';

const Hero = ({ onSearch, nationalities, currencies }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[700px] overflow-hidden">
      {/* Arka plan resmi */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out transform hover:scale-105 brightness-[0.85]"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2022/05/23/20/33/hot-air-balloon-7217173_1280.jpg')",
        }}
      />

      {/* Mor saydam katman */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8986c8]/70 via-[#9e97d6]/60 to-[#d4c1ec]/50" />

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-28 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fef9ff] via-white to-[#d4c1ec] drop-shadow-xl mb-6 leading-tight">
          Hayalindeki Tatile Hazır Mısın?
        </h1>
        <p className="text-white text-base sm:text-lg md:text-2xl font-medium max-w-3xl opacity-90 mb-8 drop-shadow-md">
          En uygun fiyatlarla en güzel oteller burada. Şimdi aramaya başla!
        </p>

        <div className="w-full md:w-[1000px] bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 transition-all hover:shadow-2xl">
          <SearchBar onSearch={onSearch} nationalities={nationalities} currencies={currencies} />
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('hotels');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <FiChevronDown className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
