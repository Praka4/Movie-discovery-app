import { Link } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const poster = movie.poster 
    ? movie.poster.startsWith('http') 
      ? movie.poster 
      : `${IMAGE_BASE_URL}${movie.poster}`
    : movie.posterPath 
      ? `${IMAGE_BASE_URL}${movie.posterPath}`
      : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img 
  src={poster} 
  alt={movie.title} 
  style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '4px' }}
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = 'https://placehold.co/500x750?text=No+Poster';  
  }}
/>

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p>⭐ {movie.rating.toFixed(1)}</p>

        <span>
          {movie.releaseDate
            ? movie.releaseDate.substring(0, 4)
            : "Unknown"}
        </span>
      </div>
    </Link>
  );
}

export default MovieCard;