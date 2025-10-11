'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard';
import { useUser } from '../../contexts/UserContext';
import { FiBookmark, FiStar } from 'react-icons/fi';

export default function WatchlistPage() {
  const { watchlist } = useUser();
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (filter === 'all') {
      setFilteredWatchlist(watchlist);
    } else {
      setFilteredWatchlist(watchlist.filter(item => item.media_type === filter));
    }
  }, [watchlist, filter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-display flex items-center">
            <FiBookmark className="h-8 w-8 mr-3" />
            Watchlist
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            Movies and TV shows you want to watch
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
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All ({watchlist.length})
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
              filter === 'movie'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiStar className="h-4 w-4 mr-2" />
            Movies ({watchlist.filter(item => item.media_type === 'movie').length})
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
              filter === 'tv'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiBookmark className="h-4 w-4 mr-2" />
            TV Shows ({watchlist.filter(item => item.media_type === 'tv').length})
          </button>
        </div>

        {/* Results */}
        {filteredWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <FiBookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {watchlist.length === 0 
                ? 'Your watchlist is empty' 
                : `No ${filter} in watchlist`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {watchlist.length === 0
                ? 'Start adding movies and TV shows to your watchlist'
                : `You haven't added any ${filter} to your watchlist yet`}
            </p>
            <a 
              href={filter === 'tv' ? '/tv-shows' : '/movies'} 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Browse {filter === 'tv' ? 'TV Shows' : 'Movies'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredWatchlist.map((item) => (
              <MovieCard key={item.id} item={item} type={item.media_type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}