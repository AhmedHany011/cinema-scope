'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiStar, FiCalendar, FiClock, FiHeart, FiBookmark, FiPlay, FiArrowLeft, FiUsers, FiDollarSign, FiTrendingUp, FiEye } from 'react-icons/fi';
import Header from '../../../components/Navbar';
import MovieCard from '../../../components/MovieCard';
import Loading from '../../../components/Loading';
import { fetchMovieDetails, getImageUrl } from '../../../utils/tmdb';
import { useUser } from '../../../contexts/UserContext';

export default function MovieDetails() {
  const params = useParams();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, isInFavorites, isInWatchlist } = useUser();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchMovieDetails(id);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFavoriteClick = () => {
    if (isInFavorites(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({ ...movie, media_type: 'movie' });
    }
  };

  const handleWatchlistClick = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({ ...movie, media_type: 'movie' });
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTrailerUrl = () => {
    if (!movie?.videos?.results) return null;
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'from-green-400 to-emerald-600';
    if (rating >= 7) return 'from-yellow-400 to-orange-500';
    if (rating >= 5) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loading className="h-96" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Movie not found'}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trailerUrl = getTrailerUrl();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Cinematic Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-hidden pt-10 sm:mt-0">
        {/* Parallax Background */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 scale-110"
        >
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </motion.div>

        {/* Back Button - Absolute on Large Screens */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-8 z-20 hidden lg:block"
        >
          <Link href="/" className="group flex items-center space-x-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 hover:bg-black/50 transition-all duration-300">
            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 flex items-end h-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-20 w-full">
            {/* Back Button - Mobile Only */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 lg:hidden"
            >
              <Link href="/" className="group inline-flex items-center space-x-2 sm:space-x-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 hover:bg-black/50 transition-all duration-300 text-sm sm:text-base">
                <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-end">
              {/* Poster with 3D Effect */}
              <motion.div 
                initial={{ opacity: 0, y: 100, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="relative group perspective-1000">
                  <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-y-5">
                    <Image
                      src={getImageUrl(movie.poster_path, 'w780')}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Floating Rating Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 -right-4 z-10"
                  >
                    <div className={`bg-gradient-to-br ${getRatingColor(movie.vote_average)} rounded-full p-4 shadow-lg border-4 border-white/20 backdrop-blur-sm`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{movie.vote_average?.toFixed(1)}</div>
                        <div className="text-xs opacity-90">TMDb</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Movie Details */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-3 space-y-6 h-full flex flex-col justify-center"
              >
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
                  >
                    {movie.title}
                  </motion.h1>
                  
                  {movie.tagline && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-lg sm:text-xl text-gray-300 italic font-light mb-4 sm:mb-6"
                    >
                      "{movie.tagline}"
                    </motion.p>
                  )}
                </div>

                {/* Enhanced Meta Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm"
                >
                  {movie.release_date && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <FiCalendar className="h-4 w-4 text-blue-400" />
                      <span>{format(new Date(movie.release_date), 'yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiClock className="h-4 w-4 text-green-400" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiEye className="h-4 w-4 text-purple-400" />
                    <span>{movie.vote_count?.toLocaleString()} votes</span>
                  </div>
                </motion.div>

                {/* Genres with Gradient Pills */}
                {movie.genres && movie.genres.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap gap-2 sm:gap-3"
                  >
                    {movie.genres.map((genre, index) => (
                      <motion.span
                        key={genre.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full text-xs sm:text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                      >
                        {genre.name}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex flex-wrap gap-2 sm:gap-4"
                >
                  {trailerUrl && (
                    <motion.a
                      href={trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 text-sm sm:text-base"
                    >
                      <FiPlay className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>Watch Trailer</span>
                    </motion.a>
                  )}
                  
                  <motion.button
                    onClick={handleFavoriteClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center space-x-2 sm:space-x-3 rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 text-sm sm:text-base ${
                      isInFavorites(movie.id)
                        ? 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 shadow-lg hover:shadow-pink-500/25'
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <FiHeart className={`h-5 w-5 group-hover:scale-110 transition-transform ${isInFavorites(movie.id) ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isInFavorites(movie.id) ? 'Favorited' : 'Favorite'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleWatchlistClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center space-x-2 sm:space-x-3 rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 text-sm sm:text-base ${
                      isInWatchlist(movie.id)
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/25'
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <FiBookmark className={`h-5 w-5 group-hover:scale-110 transition-transform ${isInWatchlist(movie.id) ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isInWatchlist(movie.id) ? 'Watchlisted' : 'Watchlist'}</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Modern Content Sections */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: 'overview', label: 'Overview', icon: FiEye },
              { id: 'cast', label: 'Cast & Crew', icon: FiUsers },
              { id: 'details', label: 'Details', icon: FiTrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-sm border border-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[400px]"
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Synopsis
                    </h2>
                    {movie.overview ? (
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {movie.overview}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No synopsis available.</p>
                    )}
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Facts</h3>
                    <div className="space-y-4">
                      {movie.release_date && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Release Date</span>
                          <span className="text-white font-medium">
                            {format(new Date(movie.release_date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Runtime</span>
                        <span className="text-white font-medium">{formatRuntime(movie.runtime)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRatingColor(movie.vote_average)} flex items-center justify-center text-white font-bold text-sm`}>
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      {movie.status && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white font-medium">{movie.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === 'cast' && movie.credits?.cast && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  Cast & Crew
                </motion.h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {movie.credits.cast.slice(0, 18).map((person, index) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={getImageUrl(person.profile_path, 'w342')}
                            alt={person.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 16vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">{person.name}</h4>
                          <p className="text-xs text-gray-400 line-clamp-2">{person.character}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center space-x-2">
                      <FiDollarSign className="h-5 w-5 text-green-400" />
                      <span>Financial</span>
                    </h3>
                    <div className="space-y-4">
                      {movie.budget > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Budget</span>
                          <span className="text-white font-medium">{formatCurrency(movie.budget)}</span>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Revenue</span>
                          <span className="text-white font-medium">{formatCurrency(movie.revenue)}</span>
                        </div>
                      )}
                      {movie.budget > 0 && movie.revenue > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Profit</span>
                          <span className={`font-medium ${
                            movie.revenue - movie.budget > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {formatCurrency(movie.revenue - movie.budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Production Companies</h3>
                      <div className="space-y-3">
                        {movie.production_companies.slice(0, 5).map((company) => (
                          <div key={company.id} className="flex items-center space-x-3">
                            {company.logo_path && (
                              <div className="relative w-8 h-8 flex-shrink-0">
                                <Image
                                  src={getImageUrl(company.logo_path, 'w92')}
                                  alt={company.name}
                                  fill
                                  className="object-contain filter brightness-0 invert"
                                  sizes="32px"
                                />
                              </div>
                            )}
                            <span className="text-gray-300">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {movie.production_countries && movie.production_countries.length > 0 && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Production Countries</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.production_countries.map((country) => (
                          <span
                            key={country.iso_3166_1}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                          >
                            {country.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.spoken_languages.map((language) => (
                          <span
                            key={language.iso_639_1}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                          >
                            {language.english_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.belongs_to_collection && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Collection</h3>
                      <div className="flex items-center space-x-4">
                        {movie.belongs_to_collection.poster_path && (
                          <div className="relative w-16 h-24 flex-shrink-0">
                            <Image
                              src={getImageUrl(movie.belongs_to_collection.poster_path, 'w154')}
                              alt={movie.belongs_to_collection.name}
                              fill
                              className="object-cover rounded-lg"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium">{movie.belongs_to_collection.name}</h4>
                          <p className="text-gray-400 text-sm">Part of collection</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="bg-gradient-to-b from-black to-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              More Like This
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.similar.results.slice(0, 12).map((similarMovie, index) => (
                <motion.div
                  key={similarMovie.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MovieCard item={similarMovie} type="movie" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}