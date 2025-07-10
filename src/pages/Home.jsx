import React from 'react';
import Header from '../Header/Header';
import Hero from '../components/Hero';
import Photos from '../components/photos';
import Hotels from '../components/Hotels';
import Footer from '../footer/footer';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-[#fef9ff] via-[#d4c1ec]/30 to-[#f2dfd7]/50 min-h-screen scroll-smooth">
      <Header />
      <Hero />
      <div className="px-4 md:px-8 lg:px-16 py-10 space-y-16">
        <Photos />
        <Hotels />
      </div>
      <Footer />
    </div>
  );
};

export default Home; 