import React, { useEffect, useState } from "react"
import ReactSlider from "keen-slider";

const priceDistribution = [
  5, 10, 15, 10, 8, 5, 3, 2, 6, 12, 9, 6, 4, 5, 6, 7, 5, 3, 2, 1, 1, 1, 1, 2, 2
];

const PriceSlider = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
  const [initialMin, setInitialMin] = useState(0);
  const [initialMax, setInitialMax] = useState(25000);

  useEffect(() => {
    const fetchInitialPrices = async () => {
      try {
        const res = await fetch("https://api.example.com/prices"); // 🔁 backend URL
        const data = await res.json();

        const min = data.minPrice ?? 0;
        const max = data.maxPrice ?? 25000;

        setMinPrice(min);
        setMaxPrice(max);
        setInitialMin(min);
        setInitialMax(max);
      } catch (error) {
        console.error("Fiyat aralığı alınamadı:", error);
      }
    };

    fetchInitialPrices();
  }, [setMinPrice, setMaxPrice]);

  const handleSliderChange = ([min, max]) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="bg-white border border-[#d4c1ec] px-5 py-6 rounded-2xl w-full shadow-xl space-y-5 relative">
      <p className="text-[#535691] font-bold text-lg">Fiyat aralığını belirleyin</p>

      {/* Histogram arka plan */}
      <div className="relative w-full h-20 overflow-hidden rounded">
        <div className="absolute inset-0 flex items-end justify-between px-1">
          {priceDistribution.map((value, index) => (
            <div
              key={index}
              className="bg-[#d4c1ec] w-[4%] rounded-t"
              style={{ height: `${value * 5}px` }}
            />
          ))}
        </div>

        {/* Slider */}
        <div className="absolute inset-0 z-10 px-1 flex items-center">
          <ReactSlider
            className="w-full h-2 bg-transparent"
            thumbClassName="h-5 w-5 rounded-full bg-[#adadf6] cursor-pointer shadow-lg border-2 border-white"
            trackClassName="bg-[#adadf6] h-2"
            min={initialMin}
            max={initialMax}
            value={[Number(minPrice), Number(maxPrice)]}
            onChange={handleSliderChange}
            minDistance={1000}
            pearling
          />
        </div>
      </div>

      {/* Giriş kutuları */}
      <div className="flex justify-between items-center gap-3 text-[#535691]">
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-semibold mb-1">Min. fiyat</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="border border-[#d4c1ec] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#adadf6]"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-semibold mb-1">Maks. fiyat</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="border border-[#d4c1ec] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#adadf6]"
          />
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {
            setMinPrice(initialMin);
            setMaxPrice(initialMax);
          }}
          className="text-sm text-[#8986c8] hover:underline"
        >
          Sıfırla
        </button>
        <button
          className="bg-[#8986c8] hover:bg-[#6e6bb2] text-white font-semibold py-2 px-6 rounded-xl text-sm shadow-md"
        >
          Uygula
        </button>
      </div>
    </div>
  );
};

export default PriceSlider;
