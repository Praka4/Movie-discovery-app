import { useEffect, useState } from "react";

import MovieGrid from "../components/MovieGrid";
import { getWishlist } from "../services/movieApi";

function Wishlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlist();

        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  if (loading) {
    return <main>Loading wishlist...</main>;
  }

  return (
    <main>
      <h1>My Wishlist</h1>

      {movies.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </main>
  );
}

export default Wishlist;