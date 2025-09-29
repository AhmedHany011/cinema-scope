'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Navbar.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Loading from '../components/Loading.jsx';
import { fetchTrendingMovies, fetchTrendingTV, fetchPopularMovies } from '../utils/tmdb';
import { FiTrendingUp, FiStar, FiCalendar, FiChevronRight } from 'react-icons/fi';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, tvRes, popularRes] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTV(),
          fetchPopularMovies()
        ]);
        
        setTrendingMovies(moviesRes.data.results.slice(0, 10));
        setTrendingTV(tvRes.data.results.slice(0, 10));
        setPopularMovies(popularRes.data.results.slice(0, 10));
      } catch (err) {
        setError('Failed to fetch data. Please check your API key.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loading className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Please add your TMDb API key to the .env.local file.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
            Welcome to Cinema Scope
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover trending movies and TV shows, build your watchlist, and never miss what's popular.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/movies" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Movies
            </Link>
            <Link href="/tv" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Browse TV Shows
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/movies" className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <FiStar className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Movies</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Browse all movies</p>
                </div>
              </div>
            </Link>
            
            <Link href="/tv" className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <FiTrendingUp className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">TV Shows</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover series</p>
                </div>
              </div>
            </Link>
            
            <Link href="/discover" className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <FiCalendar className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Discover</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find new content</p>
                </div>
              </div>
            </Link>
            
            <Link href="/search" className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <FiChevronRight className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find anything</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display">Trending Movies</h2>
            <Link href="/movies" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <FiChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending TV Shows */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display">Trending TV Shows</h2>
            <Link href="/tv" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <FiChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingTV.map((show) => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display">Popular Movies</h2>
            <Link href="/movies?sort=popular" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <FiChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Cinema Scope. Powered by TMDb API.
          </p>
        </div>
      </footer>
    </div>
  );
}
