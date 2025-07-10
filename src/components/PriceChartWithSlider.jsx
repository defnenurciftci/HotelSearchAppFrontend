import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Slider from 'rc-slider';

const PriceChartWithSlider = ({
  priceData = [],
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  const handleSliderChange = ([min, max]) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="bg-white border border-[#d4c1ec] p-4 rounded-xl w-full shadow-md space-y-4">
      <p className="text-[#535691] font-semibold mb-2">Gecelik Fiyat Dağılımı</p>


      <div className="w-full">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={priceData}>
            <XAxis dataKey="price" tick={{ fontSize: 12, fill: "#535691" }} />
            <YAxis tick={{ fontSize: 12, fill: "#535691" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#adadf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <Slider
        className="w-full h-2 bg-[#eee] rounded"
        thumbClassName="h-5 w-5 rounded-full bg-[#adadf6] cursor-pointer shadow"
        trackClassName="bg-[#d4c1ec] h-2"
        min={0}
        max={25000}
        value={[Number(minPrice), Number(maxPrice)]}
        onChange={handleSliderChange}
        minDistance={100}
        pearling
      />


      <div className="flex justify-between items-center mt-2 gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Min ₺"
          className="w-1/2 px-3 py-2 border border-[#d4c1ec] rounded-lg text-[#535691]"
        />
        <span className="text-[#535691] font-semibold">-</span>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="Max ₺"
          className="w-1/2 px-3 py-2 border border-[#d4c1ec] rounded-lg text-[#535691]"
        />
      </div>
    </div>
  );
};

export default PriceChartWithSlider;