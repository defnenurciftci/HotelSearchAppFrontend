import React from 'react';

const PhotoCards = ({ hotel }) => {
  return (
    <div className="relative rounded-md overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 border border-[#d4c1ec]">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-48 object-cover" 
      />
      <div className="absolute bottom-4 left-4 bg-[#8986c8]/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-lg font-semibold shadow-md">
        {hotel.name}
      </div>
    </div>
  );
};

export default PhotoCards;
