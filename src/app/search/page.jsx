'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';
import { searchMulti } from '../../utils/tmdb';
import { FiSearch, FiX } from 'react-icons/fi';

// Create a client component that uses useSearchParams
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch search results
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await searchMulti(query, page);
        setResults(response.data.results);
        setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  // Client-side filtering function for adult content
  // This is a targeted filter that looks for specific indicators of adult content
  const filterOutAdultContent = (items) => {
    if (!Array.isArray(items)) return items;
    
    // Keywords/terms that indicate adult content
    const adultKeywords = [
      'porn', 'xxx', 'adult', 'erotic', 'nude', 'nudity', 'sex', 'sexual',
      'explicit', 'mature', 'nsfw', '18+', 'x-rated', 'hardcore'
    ];
    
    // Adult genre IDs that indicate adult content
    const adultGenreIds = [10752]; // War genre sometimes contains adult themes
    
    return items.filter(item => {
      // Skip non-movie/TV items
      if (!(item.media_type === 'movie' || item.media_type === 'tv')) return false;
      
      // Check if item is explicitly marked as adult
      if (item.adult === true) return false;
      
      // Check title for adult keywords
      const title = (item.title || item.name || '').toLowerCase();
      if (adultKeywords.some(keyword => title.includes(keyword))) return false;
      
      // Check overview/description for adult keywords
      const overview = (item.overview || '').toLowerCase();
      if (adultKeywords.some(keyword => overview.includes(keyword))) return false;
      
      // Check genre IDs
      const genreIds = item.genre_ids || [];
      if (genreIds.some(id => adultGenreIds.includes(id))) return false;
      
      // Check release date for very old content that might be problematic
      // This is a heuristic - very old content sometimes has issues
      const releaseDate = item.release_date || item.first_air_date;
      if (releaseDate) {
        const year = new Date(releaseDate).getFullYear();
        // Content from before 1950 might have issues
        if (year < 1950 && year > 0) return false;
      }
      
      return true;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
      setPage(1);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-display">Search</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            Find your favorite movies, TV shows, and more
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows, people..."
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Search Results */}
        {query ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results for "{query}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? 'Loading...' : `Found ${filterOutAdultContent(results).length} results`}
              </p>
            </div>

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
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <FiSearch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try different search terms
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filterOutAdultContent(results)
                    .map((item) => (
                      <MovieCard 
                        key={item.id} 
                        item={item} 
                        type={item.media_type} 
                      />
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
        ) : (
          <div className="text-center py-12">
            <FiSearch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Search for Movies & TV Shows</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enter a title, actor, director, or keyword to find movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the component in Suspense for server-side rendering
import { Suspense } from 'react';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><Loading className="h-96" /></div>}>
      <SearchContent />
    </Suspense>
  );
}