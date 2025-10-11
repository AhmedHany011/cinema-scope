'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiHeart, FiBookmark } from 'react-icons/fi';
import { getImageUrl } from '../utils/tmdb';
import { useUser } from '../contexts/UserContext';

const MovieCard = ({ item, type = 'movie' }) => {
  const { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, isInFavorites, isInWatchlist } = useUser();
  
  // Ensure we have valid data before rendering
  // Only filter by vote count if it's explicitly required (handled at the parent level)
  if (!item) return null;
  
  const title = item.title || item.name || 'Untitled';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const itemUrl = `/${type}/${item.id}`;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites({ ...item, media_type: type });
    }
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({ ...item, media_type: type });
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={itemUrl}>
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              // Handle image loading errors gracefully
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
            }}
          />
          
          {/* Overlay with rating */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center space-x-1">
            <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isInFavorites(item.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-black/50 text-white hover:bg-red-500'
              }`}
              aria-label={isInFavorites(item.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <FiHeart className="h-4 w-4" />
            </button>
            <button
              onClick={handleWatchlistClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isInWatchlist(item.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-black/50 text-white hover:bg-green-500'
              }`}
              aria-label={isInWatchlist(item.id) ? "Remove from watchlist" : "Add to watchlist"}
            >
              <FiBookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {year}
          </p>
          {item.overview && (
            <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mt-2">
              {item.overview}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;