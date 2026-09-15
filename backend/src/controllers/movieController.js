const {
  discoverMovies,
  searchMovies,
  getMovieDetails,
} = require("../services/tmdbService");

const formatMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title || "Untitled",
    overview: movie.overview || "No description available.",
    poster: movie.poster_path || null,
    backdropPath: movie.backdrop_path || null,
    releaseDate: movie.release_date || null,
    rating: movie.vote_average || 0,
    voteCount: movie.vote_count || 0,
    popularity: movie.popularity || 0,
    genreIds: movie.genre_ids || [],
  };
};

const discover = async (req, res) => {
  try {
    const {
      page = 1,
      sortBy = "popularity.desc",
      genre,
      year,
    } = req.query;

    const params = {
      page,
      sort_by: sortBy,
      include_adult: false,
      include_video: false,
      language: "en-US",
    };

    if (genre) {
      params.with_genres = genre;
    }

    if (year) {
      params.primary_release_year = year;
    }

    const data = await discoverMovies(params);

    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(formatMovie),
    });
  } catch (error) {
    console.error("Discover movies error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch movies",
    });
  }
};

const search = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const data = await searchMovies(query, page);

    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(formatMovie),
    });
  } catch (error) {
    console.error("Search movies error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to search movies",
    });
  }
};

const getDetails = async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Movie details error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch movie details",
    });
  }
};

module.exports = {
  discover,
  search,
  getDetails,
};