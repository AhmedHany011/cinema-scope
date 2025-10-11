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
  if (!path) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Adult content filtering parameters - API level only
const DEFAULT_MOVIE_FILTERS = {
  include_adult: 'false',
  'vote_count.gte': 5,
  'certification.lte': 'R'
};

const DEFAULT_TV_FILTERS = {
  include_adult: 'false',
  'vote_count.gte': 25
};

// Enhanced filters for multi search with additional parameters to reduce adult content
// Based on TMDB community discussions, these parameters help reduce adult content in search results
const DEFAULT_MULTI_FILTERS = {
  include_adult: 'false',
  'vote_count.gte': 25
};

// API functions with enhanced adult content filtering
export const fetchTrendingMovies = () => {
  const params = new URLSearchParams(DEFAULT_MOVIE_FILTERS).toString();
  return tmdbApi.get(`/trending/movie/day?${params}`);
};

export const fetchTrendingTV = () => {
  const params = new URLSearchParams(DEFAULT_TV_FILTERS).toString();
  return tmdbApi.get(`/trending/tv/day?${params}`);
};

export const fetchPopularMovies = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_MOVIE_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/movie/popular?${params}`);
};

export const fetchPopularTV = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_TV_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/tv/popular?${params}`);
};

export const fetchTopRatedMovies = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_MOVIE_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/movie/top_rated?${params}`);
};

export const fetchTopRatedTV = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_TV_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/tv/top_rated?${params}`);
};

export const fetchNowPlayingMovies = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_MOVIE_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/movie/now_playing?${params}`);
};

export const fetchAiringTodayTV = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_TV_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/tv/airing_today?${params}`);
};

export const fetchUpcomingMovies = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_MOVIE_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/movie/upcoming?${params}`);
};

export const fetchOnTheAirTV = (page = 1) => {
  const params = new URLSearchParams({
    ...DEFAULT_TV_FILTERS,
    page: page.toString()
  }).toString();
  return tmdbApi.get(`/tv/on_the_air?${params}`);
};

export const fetchMovieDetails = (id) => {
  // Apply multiple layers of protection for individual movie details
  return tmdbApi.get(`/movie/${id}?append_to_response=credits,videos,similar&include_adult=false`);
};

export const fetchTVDetails = (id) => {
  // Apply multiple layers of protection for individual TV show details
  return tmdbApi.get(`/tv/${id}?append_to_response=credits,videos,similar&include_adult=false`);
};

export const searchMulti = (query, page = 1) => {
  // Based on TMDB API documentation and community discussions
  // These are the parameters available for search/multi endpoint
  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    include_adult: 'false'
  }).toString();
  return tmdbApi.get(`/search/multi?${params}`);
};

export const searchMovies = (query, page = 1) => {
  // Based on TMDB API documentation, these are the parameters available for search/movie endpoint
  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    include_adult: 'false',
    'vote_count.gte': '5',
    'certification.lte': 'R'
  }).toString();
  return tmdbApi.get(`/search/movie?${params}`);
};

export const searchTV = (query, page = 1) => {
  // Based on TMDB API documentation, these are the parameters available for search/tv endpoint
  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    include_adult: 'false',
    'vote_count.gte': '5'
  }).toString();
  return tmdbApi.get(`/search/tv?${params}`);
};

export const fetchMovieGenres = () => tmdbApi.get('/genre/movie/list');
export const fetchTVGenres = () => tmdbApi.get('/genre/tv/list');

export const discoverMovies = (params) => {
  const defaultParams = { 
    ...DEFAULT_MOVIE_FILTERS,
    ...params 
  };
  const queryParams = new URLSearchParams(defaultParams).toString();
  return tmdbApi.get(`/discover/movie?${queryParams}`);
};

export const discoverTV = (params) => {
  const defaultParams = { 
    ...DEFAULT_TV_FILTERS,
    ...params 
  };
  const queryParams = new URLSearchParams(defaultParams).toString();
  return tmdbApi.get(`/discover/tv?${queryParams}`);
};

export default tmdbApi;