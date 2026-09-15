import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const demoMovies = [
  { id: 'demo-1', title: 'Dune: Part Two', genre: 'Sci-Fi', year: 2024, rating: 8.7, popularity: 98, description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
  { id: 'demo-2', title: 'The Wild Robot', genre: 'Animation', year: 2024, rating: 8.5, popularity: 94, description: 'A robot washed ashore on an uninhabited island must learn to adapt to its surroundings.', poster: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg' },
  { id: 'demo-3', title: 'Challengers', genre: 'Drama', year: 2024, rating: 7.2, popularity: 89, description: 'A former tennis prodigy turned coach enters her husband in a challenger event against her former lover.', poster: 'https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9rsv.jpg' },
  { id: 'demo-4', title: 'Past Lives', genre: 'Romance', year: 2023, rating: 7.8, popularity: 80, description: 'Two childhood friends reconnect in New York decades after one family emigrates from South Korea.', poster: 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg' },
  { id: 'demo-5', title: 'Spider-Man: Across the Spider-Verse', genre: 'Animation', year: 2023, rating: 8.6, popularity: 97, description: 'Miles Morales catapults across the multiverse and encounters a team of Spider-People charged with protecting its existence.', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
  { id: 'demo-6', title: 'The Grand Budapest Hotel', genre: 'Comedy', year: 2014, rating: 8.1, popularity: 76, description: 'A legendary concierge and his lobby boy become friends as they race to clear a stolen painting and prove an inheritance.', poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg' },
];

const fallbackPoster = 'https://placehold.co/500x750/17212b/e8d8bd?text=No+Poster';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All genres');
  const [sort, setSort] = useState('popular');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('cine-saved') || '[]'));
  const [showSaved, setShowSaved] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', genre: 'Drama', year: '', description: '', poster: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies?limit=50')
      .then(({ data }) => setMovies(data.movies?.length ? data.movies : demoMovies))
      .catch(() => setMovies(demoMovies))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => localStorage.setItem('cine-saved', JSON.stringify(saved)), [saved]);

  const genres = useMemo(() => ['All genres', ...new Set(movies.map((movie) => movie.genre).filter(Boolean))], [movies]);
  const visibleMovies = useMemo(() => {
    const source = showSaved ? saved : movies;
    return source
      .filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()) && (genre === 'All genres' || movie.genre === genre))
      .sort((a, b) => sort === 'rating' ? (b.rating || 0) - (a.rating || 0) : (b.popularity || 0) - (a.popularity || 0));
  }, [genre, movies, query, saved, showSaved, sort]);

  const toggleSaved = (movie) => setSaved((current) => current.some((item) => (item.id || item._id) === (movie.id || movie._id)) ? current.filter((item) => (item.id || item._id) !== (movie.id || movie._id)) : [...current, movie]);
  const isSaved = (movie) => saved.some((item) => (item.id || item._id) === (movie.id || movie._id));

  const submitMovie = async (event) => {
    event.preventDefault();
    if (!form.title || !form.year) return setMessage('Title and release year are required.');
    const newMovie = { ...form, year: Number(form.year), rating: 0, popularity: 0, id: `local-${Date.now()}` };
    try { await axios.post('http://localhost:5000/api/movies', newMovie); } catch { /* Local creation remains useful when the API is offline. */ }
    setMovies((current) => [newMovie, ...current]);
    setForm({ title: '', genre: 'Drama', year: '', description: '', poster: '' });
    setMessage('Movie added to your library.');
  };

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">C</span><span>Cine<span>scope</span></span></a><nav><button className={!showSaved ? 'nav-active' : ''} onClick={() => setShowSaved(false)}>Discover</button><button className={showSaved ? 'nav-active' : ''} onClick={() => setShowSaved(true)}>Saved <b>{saved.length}</b></button></nav><button className="add-link" onClick={() => setShowAdd(true)}>＋ Add movie</button></header>
    <main id="top">
      {!showSaved && <section className="hero"><div className="hero-copy"><p className="eyebrow">YOUR NEXT FAVORITE FILM</p><h1>Find a story<br /><em>worth staying up for.</em></h1><p className="hero-text">A considered collection of films for curious nights, quiet mornings, and everything in between.</p><div className="hero-stats"><span><strong>{movies.length || '—'}</strong> titles to explore</span><span><strong>{genres.length - 1 || '—'}</strong> genres</span></div></div><div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="film-reel">✦</span><div className="art-caption">Curated<br />for you</div></div></section>}
      <section className="library-head"><div><p className="eyebrow">{showSaved ? 'YOUR COLLECTION' : 'THE LIBRARY'}</p><h2>{showSaved ? 'Saved for later' : 'Explore the library'}</h2></div><p className="result-count">{visibleMovies.length} films</p></section>
      <div className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title..." /></label><div className="filters"><select value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Most popular</option><option value="rating">Highest rated</option></select></div></div>
      {loading ? <div className="empty"><span className="spinner" />Loading your cinema...</div> : visibleMovies.length ? <div className="movie-grid">{visibleMovies.map((movie, index) => <article className="movie-card" key={movie.id || movie._id || index} onClick={() => setSelectedMovie(movie)}><div className="poster-wrap"><img src={movie.poster || fallbackPoster} alt={movie.title} onError={(event) => { event.currentTarget.src = fallbackPoster; }} /><button className={`save-button ${isSaved(movie) ? 'saved' : ''}`} aria-label={isSaved(movie) ? 'Remove from saved' : 'Save movie'} onClick={(event) => { event.stopPropagation(); toggleSaved(movie); }}>{isSaved(movie) ? '♥' : '♡'}</button></div><div className="card-info"><div><h3>{movie.title}</h3><p>{movie.genre || 'Film'} · {movie.year || '—'}</p></div><span className="rating">★ {Number(movie.rating || 0).toFixed(1)}</span></div></article>)}</div> : <div className="empty"><span className="empty-icon">⌕</span><h3>No films found</h3><p>Try a different title or genre.</p></div>}
    </main>
    {selectedMovie && <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}><section className="detail-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedMovie(null)}>×</button><img src={selectedMovie.poster || fallbackPoster} alt="" /><div className="detail-copy"><p className="eyebrow">{selectedMovie.genre || 'FILM'} · {selectedMovie.year}</p><h2>{selectedMovie.title}</h2><p className="detail-rating">★ {Number(selectedMovie.rating || 0).toFixed(1)} <span>audience rating</span></p><p>{selectedMovie.description || 'No synopsis has been added for this title yet.'}</p><button className="primary-button" onClick={() => toggleSaved(selectedMovie)}>{isSaved(selectedMovie) ? '♥ Saved to collection' : '♡ Save to collection'}</button></div></section></div>}
    {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><section className="form-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAdd(false)}>×</button><p className="eyebrow">PERSONAL LIBRARY</p><h2>Add a movie</h2><form onSubmit={submitMovie}><input placeholder="Movie title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><div className="form-row"><input type="number" placeholder="Release year" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} /><select value={form.genre} onChange={(event) => setForm({ ...form, genre: event.target.value })}><option>Drama</option><option>Action</option><option>Comedy</option><option>Sci-Fi</option><option>Romance</option></select></div><input placeholder="Poster URL (optional)" value={form.poster} onChange={(event) => setForm({ ...form, poster: event.target.value })} /><textarea placeholder="A short description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><button className="primary-button" type="submit">Add to library</button>{message && <p className="form-message">{message}</p>}</form></section></div>}
  </div>;
}

export default App;
