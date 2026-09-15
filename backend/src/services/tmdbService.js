const axios = require("axios");

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
  },
});

const discoverMovies = async (params = {}) => {
  const response = await tmdbClient.get("/discover/movie", {
    params,
  });

  return response.data;
};

const searchMovies = async (query, page = 1) => {
  const response = await tmdbClient.get("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
    },
  });

  return response.data;
};

const getMovieDetails = async (movieId) => {
  const response = await tmdbClient.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "videos,credits",
    },
  });

  return response.data;
};

module.exports = {
  discoverMovies,
  searchMovies,
  getMovieDetails,
};