import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getMovieDetails } from "../services/movieApi";
import {
  getMovieDetails,
  addToWishlist,
} from "../services/movieApi";

const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w1280";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);

        const data = await getMovieDetails(id);

        setMovie(data.movie);
      } catch (error) {
        console.error(error);
        setError("Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);
  const handleAddToWishlist = async () => {
  try {
    await addToWishlist({
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
    });

    alert("Movie added to wishlist!");
  } catch (error) {
    if (error.response?.status === 409) {
      alert("Movie is already in your wishlist.");
    } else {
      alert("Unable to add movie.");
    }
  }
};

  if (loading) {
    return <main>Loading movie details...</main>;
  }

  if (error) {
    return <main>{error}</main>;
  }

  if (!movie) {
    return <main>Movie not found.</main>;
  }

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <main className="details-page">
      <Link to="/">← Back to Movies</Link>

      <div className="details-container">
        {poster && (
          <img
            src={poster}
            alt={movie.title}
            className="details-poster"
          />
        )}

        <div className="details-content">
          <h1>{movie.title}</h1>
          <button onClick={handleAddToWishlist}>
  ❤️ Add to Wishlist
</button>

          <p>
            ⭐ {movie.vote_average?.toFixed(1)}
          </p>

          <p>
            Release Date:{" "}
            {movie.release_date || "Unknown"}
          </p>

          <p>
            Runtime:{" "}
            {movie.runtime
              ? `${movie.runtime} minutes`
              : "Unknown"}
          </p>

          <p>
            Genres:{" "}
            {movie.genres
              ?.map((genre) => genre.name)
              .join(", ")}
          </p>

          <h2>Overview</h2>

          <p>{movie.overview || "No overview available."}</p>
        </div>
      </div>
    </main>
  );
}

export default MovieDetails;