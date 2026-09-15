import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

export const getMovies = async (params = {}) => {
  const response = await api.get("/movies/discover", {
    params,
  });

  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await api.get("/movies/search", {
    params: {
      query,
      page,
    },
  });

  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await api.get(`/movies/${id}`);

  return response.data;
};

export default api;

export const getWishlist = async () => {
  const response = await api.get("/wishlist");

  return response.data;
};

export const addToWishlist = async (movie) => {
  const response = await api.post(
    "/wishlist",
    movie
  );

  return response.data;
};

export const removeFromWishlist = async (movieId) => {
  const response = await api.delete(
    `/wishlist/${movieId}`
  );

  return response.data;
};

export const addMovie = async (movieData) => {  
  const response = await api.post("/movies", movieData);
  return response.data;
};