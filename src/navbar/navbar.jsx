import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosBed } from 'react-icons/io';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-[#ebe6f6] border border-[#adadf6] shadow-md p-4 px-6">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-[#535691]">
        <IoIosBed className="w-6 h-6" />
        <span className="text-2xl font-extrabold tracking-wide">VOYAGO</span>
      </div>

      {/* Menü */}
      <div className="space-x-6 text-[#535691] font-semibold">
        <Link
          to="/"
          className="hover:text-[#8986c8] transition-colors duration-200"
        >
          Anasayfa
        </Link>
        <Link
          to="/login"
          className="hover:text-[#8986c8] transition-colors duration-200"
        >
          Giriş Yap
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
