'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiStar, FiCalendar, FiTv, FiHeart, FiBookmark, FiPlay, FiArrowLeft, FiUsers, FiEye, FiClock, FiMonitor, FiGlobe, FiHome, FiUser, FiInfo } from 'react-icons/fi';
import MovieCard from '../../../components/MovieCard';
import Loading from '../../../components/Loading';
import { fetchTVDetails, getImageUrl } from '../../../utils/tmdb';
import { useUser } from '../../../contexts/UserContext';

export default function TVDetails() {
  const params = useParams();
  const { id } = params;
  const [show, setShow] = useState(null);
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
        const response = await fetchTVDetails(id);
        setShow(response.data);
      } catch (err) {
        setError('Failed to fetch TV show details');
        console.error('Error fetching TV show details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFavoriteClick = () => {
    if (isInFavorites(show.id)) {
      removeFromFavorites(show.id);
    } else {
      addToFavorites({ ...show, media_type: 'tv' });
    }
  };

  const handleWatchlistClick = () => {
    if (isInWatchlist(show.id)) {
      removeFromWatchlist(show.id);
    } else {
      addToWatchlist({ ...show, media_type: 'tv' });
    }
  };

  const formatEpisodeRuntime = (runtimes) => {
    if (!runtimes || runtimes.length === 0) return 'N/A';
    const avgRuntime = Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length);
    return `${avgRuntime}m`;
  };

  // New function to format languages
  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return 'N/A';
    return languages.join(', ');
  };

  // New function to get creator names
  const getCreatorNames = (creators) => {
    if (!creators || creators.length === 0) return 'N/A';
    return creators.map(creator => creator.name).join(', ');
  };

  const getTrailerUrl = () => {
    if (!show?.videos?.results) return null;
    const trailer = show.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'from-green-400 to-emerald-600';
    if (rating >= 7) return 'from-yellow-400 to-orange-500';
    if (rating >= 5) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Returning Series':
      case 'In Production':
        return 'from-green-500 to-emerald-600';
      case 'Ended':
      case 'Canceled':
        return 'from-red-500 to-red-600';
      case 'Pilot':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading className="h-96" />
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'TV show not found'}</p>
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
      {/* Cinematic Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-hidden pt-10 sm:mt-0">
        {/* Parallax Background */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 "
        >
          <Image
            src={getImageUrl(show.backdrop_path, 'original')}
            alt={show.name}
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
        <div className="relative z-10 min-h-full lg:h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-20 w-full">
            {/* Back Button - Mobile Only */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 lg:hidden"
            >
              <Link href="/" className="group inline-flex items-center space-x-2 sm:space-x-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 hover:bg-black/50 transition-all duration-300 text-sm sm:text-base">
                <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-center lg:items-end">
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
                      src={getImageUrl(show.poster_path, 'w780')}
                      alt={show.name}
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
                    <div className={`bg-gradient-to-br ${getRatingColor(show.vote_average)} rounded-full p-4 shadow-lg border-4 border-white/20 backdrop-blur-sm`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{show.vote_average?.toFixed(1)}</div>
                        <div className="text-xs opacity-90">TMDb</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Show Details */}
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
                    {show.name}
                  </motion.h1>
                  
                  {show.tagline && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-lg sm:text-xl text-gray-300 italic font-light mb-4 sm:mb-6"
                    >
                      "{show.tagline}"
                    </motion.p>
                  )}
                </div>

                {/* Enhanced Meta Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm"
                >
                  {show.first_air_date && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <FiCalendar className="h-4 w-4 text-blue-400" />
                      <span>{format(new Date(show.first_air_date), 'yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiTv className="h-4 w-4 text-green-400" />
                    <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiMonitor className="h-4 w-4 text-purple-400" />
                    <span>{show.number_of_episodes} Episodes</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiClock className="h-4 w-4 text-orange-400" />
                    <span>{formatEpisodeRuntime(show.episode_run_time)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiEye className="h-4 w-4 text-pink-400" />
                    <span>{show.vote_count?.toLocaleString()} votes</span>
                  </div>
                  
                  {show.original_language && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <FiGlobe className="h-4 w-4 text-cyan-400" />
                      <span className="uppercase">{show.original_language}</span>
                    </div>
                  )}
                </motion.div>

                {/* Status and Network */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-wrap gap-2 sm:gap-4"
                >
                  {show.status && (
                    <div className={`flex items-center space-x-2 bg-gradient-to-r ${getStatusColor(show.status)} rounded-full px-4 py-2 text-white font-medium`}>
                      <span>{show.status}</span>
                    </div>
                  )}
                  
                  {show.networks && show.networks.length > 0 && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-gray-300">{show.networks[0].name}</span>
                    </div>
                  )}
                  
                  {show.created_by && show.created_by.length > 0 && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <FiUser className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-300">{getCreatorNames(show.created_by)}</span>
                    </div>
                  )}
                </motion.div>

                {/* Genres with Gradient Pills */}
                {show.genres && show.genres.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex flex-wrap gap-2 sm:gap-3"
                  >
                    {show.genres.map((genre, index) => (
                      <motion.span
                        key={genre.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
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
                  transition={{ delay: 1.6 }}
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
                      isInFavorites(show.id)
                        ? 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 shadow-lg hover:shadow-pink-500/25'
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <FiHeart className={`h-5 w-5 group-hover:scale-110 transition-transform ${isInFavorites(show.id) ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isInFavorites(show.id) ? 'Favorited' : 'Favorite'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleWatchlistClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center space-x-2 sm:space-x-3 rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 text-sm sm:text-base ${
                      isInWatchlist(show.id)
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/25'
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <FiBookmark className={`h-5 w-5 group-hover:scale-110 transition-transform ${isInWatchlist(show.id) ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isInWatchlist(show.id) ? 'Watchlisted' : 'Watchlist'}</span>
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
              { id: 'seasons', label: 'Seasons', icon: FiTv },
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
                    {show.overview ? (
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {show.overview}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No synopsis available.</p>
                    )}
                    
                    {/* Additional Info Section */}
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 text-white flex items-center space-x-2">
                        <FiInfo className="h-5 w-5 text-blue-400" />
                        <span>Additional Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {show.homepage && (
                          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiHome className="h-4 w-4 text-green-400" />
                              <span className="text-gray-400 text-sm">Official Website</span>
                            </div>
                            <a 
                              href={show.homepage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                            >
                              {show.homepage}
                            </a>
                          </div>
                        )}
                        
                        {show.in_production !== undefined && (
                          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiTv className="h-4 w-4 text-purple-400" />
                              <span className="text-gray-400 text-sm">Production Status</span>
                            </div>
                            <span className="text-white text-sm">
                              {show.in_production ? 'Currently in Production' : 'Not in Production'}
                            </span>
                          </div>
                        )}
                        
                        {show.original_name && show.name !== show.original_name && (
                          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiGlobe className="h-4 w-4 text-yellow-400" />
                              <span className="text-gray-400 text-sm">Original Name</span>
                            </div>
                            <span className="text-white text-sm">{show.original_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 text-white">Show Info</h3>
                    <div className="space-y-4">
                      {show.first_air_date && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">First Aired</span>
                          <span className="text-white font-medium">
                            {format(new Date(show.first_air_date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Seasons</span>
                        <span className="text-white font-medium">{show.number_of_seasons}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Episodes</span>
                        <span className="text-white font-medium">{show.number_of_episodes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Episode Runtime</span>
                        <span className="text-white font-medium">{formatEpisodeRuntime(show.episode_run_time)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRatingColor(show.vote_average)} flex items-center justify-center text-white font-bold text-sm`}>
                            {show.vote_average?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      {show.networks && show.networks.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Network</span>
                          <span className="text-white font-medium">{show.networks[0].name}</span>
                        </div>
                      )}
                      {show.status && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Status</span>
                          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                            show.status === 'Returning Series' || show.status === 'In Production' 
                              ? 'bg-green-500/20 text-green-400' 
                              : show.status === 'Ended' || show.status === 'Canceled'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {show.status}
                          </span>
                        </div>
                      )}
                      {show.created_by && show.created_by.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Created By</span>
                          <span className="text-white font-medium text-right text-sm">{getCreatorNames(show.created_by)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Production Companies */}
                  {show.production_companies && show.production_companies.length > 0 && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Production Companies</h3>
                      <div className="space-y-3">
                        {show.production_companies.slice(0, 5).map((company) => (
                          <div key={company.id} className="flex items-center space-x-3">
                            {company.logo_path ? (
                              <div className="relative w-8 h-8 flex-shrink-0">
                                <Image
                                  src={getImageUrl(company.logo_path, 'w92')}
                                  alt={company.name}
                                  fill
                                  className="object-contain"
                                  sizes="32px"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 flex-shrink-0 bg-white/10 rounded flex items-center justify-center">
                                <FiHome className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <span className="text-gray-300 text-sm">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Origin Countries */}
                  {show.origin_country && show.origin_country.length > 0 && (
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 text-white">Origin Countries</h3>
                      <div className="flex flex-wrap gap-2">
                        {show.origin_country.map((countryCode, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                          >
                            {countryCode}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === 'cast' && show.credits?.cast && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  Cast & Crew
                </motion.h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {show.credits.cast.slice(0, 18).map((person, index) => (
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

            {/* Seasons Tab */}
            {activeTab === 'seasons' && show.seasons && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  Seasons
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {show.seasons.filter(season => season.season_number >= 0).map((season, index) => (
                    <motion.div
                      key={season.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={getImageUrl(season.poster_path, 'w342')}
                            alt={season.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-white mb-1">{season.name}</h4>
                          <p className="text-sm text-gray-400 mb-1">
                            {season.episode_count} episodes
                          </p>
                          {season.air_date && (
                            <p className="text-sm text-gray-500">
                              {format(new Date(season.air_date), 'yyyy')}
                            </p>
                          )}
                          {season.overview && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                              {season.overview}
                            </p>
                          )}
                          {/* Add season-specific info */}
                          {season.vote_average > 0 && (
                            <div className="flex items-center mt-2">
                              <FiStar className="h-3 w-3 text-yellow-400 mr-1" />
                              <span className="text-xs text-gray-300">{season.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Last Episode Info */}
                {show.last_episode_to_air && (
                  <div className="mt-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                      <FiTv className="h-5 w-5 text-green-400 mr-2" />
                      Last Episode Aired
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative aspect-video md:w-1/3">
                        <Image
                          src={getImageUrl(show.last_episode_to_air.still_path, 'w780')}
                          alt={show.last_episode_to_air.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="text-xl font-semibold text-white">
                          {show.last_episode_to_air.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                          <span>
                            Season {show.last_episode_to_air.season_number}, Episode {show.last_episode_to_air.episode_number}
                          </span>
                          {show.last_episode_to_air.air_date && (
                            <span>
                              {format(new Date(show.last_episode_to_air.air_date), 'MMMM d, yyyy')}
                            </span>
                          )}
                          {show.last_episode_to_air.runtime > 0 && (
                            <span>
                              {show.last_episode_to_air.runtime}m
                            </span>
                          )}
                        </div>
                        {show.last_episode_to_air.vote_average > 0 && (
                          <div className="flex items-center mt-2">
                            <FiStar className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-gray-300">{show.last_episode_to_air.vote_average.toFixed(1)}/10</span>
                            <span className="text-gray-500 ml-2">({show.last_episode_to_air.vote_count} votes)</span>
                          </div>
                        )}
                        <p className="mt-3 text-gray-300">
                          {show.last_episode_to_air.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Similar Shows */}
      {show.similar?.results && show.similar.results.length > 0 && (
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
              {show.similar.results.filter(item => item.vote_count > 25).slice(0, 12).map((similarShow, index) => (
                <motion.div
                  key={similarShow.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MovieCard item={similarShow} type="tv" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}