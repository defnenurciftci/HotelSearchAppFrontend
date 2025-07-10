import React from 'react';
import PhotoCards from './PhotoCards';

const hotels = [
  {
    name: 'Butik Oteller',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/b7/d2/b3/tuvana-hotel-main-1.jpg?w=1800&h=1000&s=1',
  },
  {
    name: 'Balayı Otelleri',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/9c/66/8d/h2o-underwater-experience.jpg?w=1400&h=-1&s=1',
  },
  {
    name: 'Bungalov Oteller',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG9vVhvZaHs7ct0IFwF62K8EMsHBh98kf-6Q&s',
  },
  {
    name: 'Denize Sıfır Oteller',
    image: 'https://images.etstur.com/imgproxy/files/images/hotelImages/TR/50048/l/Azura-Deluxe-Resort---Spa-Genel-251788.jpg',
  },
  {
    name: 'Kayak Otelleri',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScunobpQHwE5wDwB36iZSweo30b5zbC01uPQ&s',
  },
  {
    name: 'Disneyland ',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/571810091.jpg?k=d5c668f695a04853b9b681f6310711cc8b817c5c074e1ec94cdad9e6c3a8420c&o=&hp=1',
  },
];

const Photos = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#8986c8] mb-8 text-center">POPÜLER TATİL TEMALARI</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.map((hotel, idx) => (
          <PhotoCards key={idx} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Photos;
