'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';
import { fetchPopularMovies, fetchMovieGenres, discoverMovies, searchMovies } from '../../utils/tmdb';
import { FiSearch, FiFilter, FiX} from 'react-icons/fi';

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [runtimeMin, setRuntimeMin] = useState('');
  const [runtimeMax, setRuntimeMax] = useState('');

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetchMovieGenres();
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    
    fetchGenres();
  }, []);

  // Fetch movies based on filters/search
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let response;
        
        if (searchQuery) {
          // Search movies
          response = await searchMovies(searchQuery, page);
        } else if (selectedGenres.length > 0 || year || rating || sortBy !== 'popularity.desc' || runtimeMin || runtimeMax) {
          // Discover movies with filters
          const params = {
            page,
            sort_by: sortBy,
            with_genres: selectedGenres.join(','),
            'vote_count.gte': 5  // Apply vote count filter as per project specifications
          };
          
          if (year) params.year = year;
          if (rating) params['vote_average.gte'] = rating;
          if (runtimeMin) params['with_runtime.gte'] = runtimeMin;
          if (runtimeMax) params['with_runtime.lte'] = runtimeMax;
          
          response = await discoverMovies(params);
        } else {
          // Fetch popular movies but still apply vote count filter
          const params = {
            page,
            sort_by: sortBy,
            'vote_count.gte': 5  // Apply vote count filter as per project specifications
          };
          response = await discoverMovies(params);
        }
        
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery, selectedGenres, sortBy, year, rating, runtimeMin, runtimeMax]);

  const handleGenreChange = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId) 
        : [...prev, genreId]
    );
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleYearChange = (value) => {
    setYear(value);
    setPage(1);
  };

  const handleRatingChange = (value) => {
    setRating(value);
    setPage(1);
  };

  const handleRuntimeMinChange = (value) => {
    setRuntimeMin(value);
    setPage(1);
  };

  const handleRuntimeMaxChange = (value) => {
    setRuntimeMax(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setYear('');
    setRating('');
    setRuntimeMin('');
    setRuntimeMax('');
    setPage(1);
  };

  const hasFilters = selectedGenres.length > 0 || year || rating || runtimeMin || runtimeMax || sortBy !== 'popularity.desc';

  // Sort options for movies
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity (High to Low)' },
    { value: 'popularity.asc', label: 'Popularity (Low to High)' },
    { value: 'vote_average.desc', label: 'Rating (High to Low)' },
    { value: 'vote_average.asc', label: 'Rating (Low to High)' },
    { value: 'release_date.desc', label: 'Release Date (Newest)' },
    { value: 'release_date.asc', label: 'Release Date (Oldest)' },
    { value: 'revenue.desc', label: 'Revenue (High to Low)' },
    { value: 'title.asc', label: 'Title (A-Z)' },
    { value: 'title.desc', label: 'Title (Z-A)' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-display">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Movies'}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {searchQuery 
              ? `Found ${movies.length} movies matching your search` 
              : 'Browse thousands of movies and find your next favorite'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                <button 
                  onClick={() => setFilterOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Genres */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Genres</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genre-${genre.id}`}
                        checked={selectedGenres.includes(genre.id)}
                        onChange={() => handleGenreChange(genre.id)}
                        className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label 
                        htmlFor={`genre-${genre.id}`} 
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {genre.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Year */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Release Year</h3>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => handleYearChange(e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h3>
                <select
                  value={rating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="9">9+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="7">7+ Stars</option>
                  <option value="6">6+ Stars</option>
                  <option value="5">5+ Stars</option>
                </select>
              </div>
              
              {/* Runtime */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Runtime (minutes)</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={runtimeMin}
                    onChange={(e) => handleRuntimeMinChange(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={runtimeMax}
                    onChange={(e) => handleRuntimeMaxChange(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Clear Filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiFilter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
            
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              {hasFilters && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Active filters:</span>
                  {selectedGenres.map(genreId => {
                    const genre = genres.find(g => g.id === genreId);
                    return genre ? (
                      <span key={genreId} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {genre.name}
                      </span>
                    ) : null;
                  })}
                  {year && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Year: {year}
                    </span>
                  )}
                  {rating && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Rating: {rating}+
                    </span>
                  )}
                  {(runtimeMin || runtimeMax) && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Runtime: {runtimeMin || '0'}-{runtimeMax || '∞'} min
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Movies Grid */}
            {loading ? (
              <Loading className="h-96" />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-12">
                <FiSearch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No movies found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} item={movie} type="movie" />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      page === totalPages 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}