import React from 'react';
import { MdOutlineStar } from 'react-icons/md';

const HotelCard = ({ hotel }) => (
  <div className="min-w-[250px] max-w-sm bg-white border border-[#d4c1ec] rounded-xl shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-300 snap-center">
    <img
      src={hotel.image}
      alt={hotel.name}
      loading="lazy"
      onError={(e) => (e.target.src = '/fallback-hotel.jpg')}
      className="w-full h-40 object-cover rounded-t-xl"
    />
    <div className="p-4 space-y-1">
      <h3 className="font-bold text-lg text-[#535691]">{hotel.name}</h3>
      <p className="text-gray-500">{hotel.location}</p>

      {/* Yıldızlar */}
      <div className="flex text-yellow-500">
        {[...Array(4)].map((_, i) => (
          <MdOutlineStar key={i} />
        ))}
      </div>

      <p className="font-semibold text-[#535691]">{hotel.price}</p>
    </div>
  </div>
);

export default HotelCard;

