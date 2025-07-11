import React from 'react';

const PhotoCards = ({ hotel }) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-[#d4c1ec]">
      <img
        src={hotel.image}
        alt={hotel.name}
        loading="lazy"
        onError={(e) => (e.target.src = '/fallback-hotel.jpg')}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-[#8986c8]/70 backdrop-blur-md text-white px-4 py-2 rounded-md text-lg font-semibold shadow-lg">
        {hotel.name}
      </div>
    </div>
  );
};

export default PhotoCards;
