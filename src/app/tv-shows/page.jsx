'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';
import { fetchPopularTV, fetchTVGenres, discoverTV, searchTV } from '../../utils/tmdb';
import { FiSearch, FiFilter, FiX, FiStar, FiTrendingUp, FiCalendar, FiTv } from 'react-icons/fi';

// Create a client component that uses useSearchParams
function TVShowsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');
  
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(''); // Changed to single genre selection
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [goToPage, setGoToPage] = useState(''); // For direct page input

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetchTVGenres();
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    
    fetchGenres();
  }, []);

  // Fetch shows based on filters/search
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let response;
        
        if (searchQuery) {
          // Search TV shows
          response = await searchTV(searchQuery, page);
        } else if (selectedGenre || year || rating || sortBy !== 'popularity.desc' || status) {
          // Discover TV shows with filters
          const params = {
            page,
            sort_by: sortBy,
            'vote_count.gte': 25  // Apply vote count filter as per project specifications
          };
          
          // Add genre filter if selected
          if (selectedGenre) params.with_genres = selectedGenre;
          if (year) params.first_air_date_year = year;
          if (rating) params['vote_average.gte'] = rating;
          if (status) params.with_status = status;
          
          response = await discoverTV(params);
        } else {
          // Fetch popular TV shows but still apply vote count filter
          const params = {
            page,
            sort_by: sortBy,
            'vote_count.gte': 25  // Apply vote count filter as per project specifications
          };
          response = await discoverTV(params);
        }
        
        setShows(response.data.results);
        setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
      } catch (err) {
        setError('Failed to fetch TV shows');
        console.error('Error fetching TV shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery, selectedGenre, sortBy, year, rating, status]);

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    setPage(1);
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

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSortBy('popularity.desc');
    setYear('');
    setRating('');
    setStatus('');
    setPage(1);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      setGoToPage('');
    }
  };

  const hasFilters = selectedGenre || year || rating || status || sortBy !== 'popularity.desc';

  // Sort options for TV shows
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity (High to Low)' },
    { value: 'popularity.asc', label: 'Popularity (Low to High)' },
    { value: 'vote_average.desc', label: 'Rating (High to Low)' },
    { value: 'vote_average.asc', label: 'Rating (Low to High)' },
    { value: 'first_air_date.desc', label: 'First Air Date (Newest)' },
    { value: 'first_air_date.asc', label: 'First Air Date (Oldest)' },
    { value: 'name.asc', label: 'Name (A-Z)' },
    { value: 'name.desc', label: 'Name (Z-A)' }
  ];

  // Rating options
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '7', label: '7+ Stars' },
    { value: '6', label: '6+ Stars' },
    { value: '5', label: '5+ Stars' }
  ];

  // Status options for TV shows
  const statusOptions = [
    { value: '', label: 'Any Status' },
    { value: '0', label: 'Returning Series' },
    { value: '1', label: 'Planned' },
    { value: '2', label: 'In Production' },
    { value: '3', label: 'Ended' },
    { value: '4', label: 'Canceled' },
    { value: '5', label: 'Pilot' }
  ];

  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'Any Year' },
    ...Array.from({ length: 50 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-display">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'TV Shows'}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {searchQuery 
              ? `Found ${shows.length} TV shows matching your search` 
              : 'Browse thousands of TV shows and find your next binge-worthy series'}
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Genre</h3>
                <select
                  value={selectedGenre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Year */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">First Air Year</h3>
                <select
                  value={year}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h3>
                <select
                  value={rating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  {selectedGenre && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {genres.find(g => g.id == selectedGenre)?.name || 'Genre'}
                    </span>
                  )}
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
                  {status && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Status: {statusOptions.find(s => s.value === status)?.label || status}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* TV Shows Grid */}
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
            ) : shows.length === 0 ? (
              <div className="text-center py-12">
                <FiSearch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No TV shows found</h3>
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
                  {shows.map((show) => (
                    <MovieCard key={show.id} item={show} type="tv" />
                  ))}
                </div>
                
                {/* Enhanced Pagination */}
                <div className="flex flex-col items-center mt-8 space-y-4">
                  <div className="flex flex-wrap justify-center items-center gap-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className={`px-3 py-2 rounded-lg ${
                        page === 1 
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {/* First Page */}
                    {page > 3 && (
                      <>
                        <button
                          onClick={() => setPage(1)}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          1
                        </button>
                        {page > 4 && <span className="px-2 py-2 text-gray-500">...</span>}
                      </>
                    )}
                    
                    {/* Pages before current */}
                    {[...Array(2)].map((_, i) => {
                      const pageNum = page - 2 + i;
                      return pageNum > 0 ? (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {pageNum}
                        </button>
                      ) : null;
                    })}
                    
                    {/* Current Page */}
                    <button
                      className="px-3 py-2 rounded-lg bg-green-600 text-white"
                      disabled
                    >
                      {page}
                    </button>
                    
                    {/* Pages after current */}
                    {[...Array(2)].map((_, i) => {
                      const pageNum = page + 1 + i;
                      return pageNum <= totalPages ? (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {pageNum}
                        </button>
                      ) : null;
                    })}
                    
                    {/* Last Page */}
                    {page < totalPages - 2 && (
                      <>
                        {page < totalPages - 3 && <span className="px-2 py-2 text-gray-500">...</span>}
                        <button
                          onClick={() => setPage(totalPages)}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    {/* Next Button */}
                    <button
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                      className={`px-3 py-2 rounded-lg ${
                        page === totalPages 
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  
                  {/* Page Input */}
                  <form onSubmit={handleGoToPage} className="flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-gray-300">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={goToPage}
                      onChange={(e) => setGoToPage(e.target.value)}
                      className="w-20 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Go
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                      of {totalPages}
                    </span>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component in Suspense for server-side rendering
import { Suspense } from 'react';

export default function TVShowsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><Loading className="h-96" /></div>}>
      <TVShowsContent />
    </Suspense>
  );
}