'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cinema-scope-favorites');
    const savedWatchlist = localStorage.getItem('cinema-scope-watchlist');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('cinema-scope-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cinema-scope-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToFavorites = (item) => {
    setFavorites(prev => [...prev.filter(fav => fav.id !== item.id), item]);
  };

  const removeFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== itemId));
  };

  const addToWatchlist = (item) => {
    setWatchlist(prev => [...prev.filter(watch => watch.id !== item.id), item]);
  };

  const removeFromWatchlist = (itemId) => {
    setWatchlist(prev => prev.filter(watch => watch.id !== itemId));
  };

  const isInFavorites = (itemId) => favorites.some(fav => fav.id === itemId);
  const isInWatchlist = (itemId) => watchlist.some(watch => watch.id === itemId);

  return (
    <UserContext.Provider value={{
      favorites,
      watchlist,
      addToFavorites,
      removeFromFavorites,
      addToWatchlist,
      removeFromWatchlist,
      isInFavorites,
      isInWatchlist,
    }}>
      {children}
    </UserContext.Provider>
  );
};