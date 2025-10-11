'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard';
import { useUser } from '../../contexts/UserContext';
import { FiHeart, FiStar } from 'react-icons/fi';

export default function FavoritesPage() {
  const { favorites } = useUser();
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (filter === 'all') {
      setFilteredFavorites(favorites);
    } else {
      setFilteredFavorites(favorites.filter(item => item.media_type === filter));
    }
  }, [favorites, filter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-rose-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-display flex items-center">
            <FiHeart className="h-8 w-8 mr-3" />
            Favorites
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            Your collection of favorite movies and TV shows
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All ({favorites.length})
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
              filter === 'movie'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiStar className="h-4 w-4 mr-2" />
            Movies ({favorites.filter(item => item.media_type === 'movie').length})
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
              filter === 'tv'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiHeart className="h-4 w-4 mr-2" />
            TV Shows ({favorites.filter(item => item.media_type === 'tv').length})
          </button>
        </div>

        {/* Results */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {favorites.length === 0 
                ? 'No favorites yet' 
                : `No ${filter} favorites`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {favorites.length === 0
                ? 'Start adding movies and TV shows to your favorites'
                : `You haven't added any ${filter} to your favorites yet`}
            </p>
            <a 
              href={filter === 'tv' ? '/tv-shows' : '/movies'} 
              className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Browse {filter === 'tv' ? 'TV Shows' : 'Movies'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFavorites.map((item) => (
              <MovieCard key={item.id} item={item} type={item.media_type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}