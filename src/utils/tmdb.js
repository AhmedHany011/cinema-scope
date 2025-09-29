import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

// Create axios instance
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Image helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API functions
export const fetchTrendingMovies = () => tmdbApi.get('/trending/movie/day');
export const fetchTrendingTV = () => tmdbApi.get('/trending/tv/day');
export const fetchPopularMovies = (page = 1) => tmdbApi.get(`/movie/popular?page=${page}`);
export const fetchPopularTV = (page = 1) => tmdbApi.get(`/tv/popular?page=${page}`);
export const fetchMovieDetails = (id) => tmdbApi.get(`/movie/${id}?append_to_response=credits,videos,similar`);
export const fetchTVDetails = (id) => tmdbApi.get(`/tv/${id}?append_to_response=credits,videos,similar`);
export const searchMulti = (query, page = 1) => tmdbApi.get(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);

export default tmdbApi;