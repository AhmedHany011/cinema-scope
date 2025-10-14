'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiHeart, FiBookmark, FiHome, FiFilm, FiTv } from 'react-icons/fi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Movies', href: '/movies', icon: FiFilm },
    { name: 'TV Shows', href: '/tv-shows', icon: FiTv },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.PNG"
              alt="Cinema Scope"
              width={120}
              height={42}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-15">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - Search and User actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Link href="/search" className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FiSearch className="h-5 w-5" />
            </Link>

            {/* Favorites */}
            <Link href="/favorites" className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
              <FiHeart className="h-5 w-5" />
            </Link>

            {/* Watchlist */}
            <Link href="/watchlist" className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
              <FiBookmark className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-md flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;