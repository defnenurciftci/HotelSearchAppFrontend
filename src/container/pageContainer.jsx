import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <div className="w-11/12 max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 animate-fade-in">
      {children}
    </div>
  );
};

export default PageContainer;
