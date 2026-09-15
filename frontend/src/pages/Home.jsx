import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting to backend...');
  const [searchTerm, setSearchTerm] = useState('');

  // STATE FOR NEW MOVIE FORM INPUTS
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    year: ''
  });
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    // Explicitly targeting your active backend server port 5000
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        setConnectionStatus('Successfully connected to backend!');
        const movieData = Array.isArray(response.data) ? response.data : (response.data.movies || []);
        setMovies(movieData);
        setLoading(false);
      })
      .catch(error => {
        setConnectionStatus('Failed to connect to backend.');
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      setFormMessage('❌ Title is required!');
      return;
    }

    axios.post('http://localhost:5000/api/movies', formData)
      .then(response => {
        setFormMessage('✅ Movie added successfully!');
        fetchMovies(); // Instantly update view grid array
        setFormData({ title: '', genre: '', description: '', year: '' }); // clear inputs
        setTimeout(() => setFormMessage(''), 3000);
      })
      .catch(error => {
        console.error("Error posting movie:", error);
        setFormMessage('❌ Failed to save movie to database.');
      });
  };

  // FILTERING MOVIES BY TITLE
  const filteredMovies = movies.filter(movie => 
    movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🎬 Movie Discovery App</h1>
        <p style={styles.status}>Status: <strong style={{color: connectionStatus.includes('Successfully') ? '#4CAF50' : '#E50914'}}>{connectionStatus}</strong></p>
      </header>

      <div style={styles.layout}>
        {/* ADD MOVIE FORM SIDEBAR */}
        <aside style={styles.sidebar}>
          <h2 style={{marginTop: 0}}>➕ Add New Movie</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Movie Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={styles.input} placeholder="e.g. Inception" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} style={styles.input} placeholder="e.g. Sci-Fi" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Release Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleInputChange} style={styles.input} placeholder="e.g. 2010" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} style={{...styles.input, height: '80px', resize: 'none'}} placeholder="Brief summary..." />
            </div>
            <button type="submit" style={styles.submitBtn}>Save to MongoDB</button>
            {formMessage && <p style={styles.formFeedback}>{formMessage}</p>}
          </form>
        </aside>

        {/* MAIN VIEW CONTROLS & GRID */}
        <main style={styles.mainContent}>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="🔍 Search movies by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
          </div>

          <h2>Explore Movies</h2>
          
          {loading ? (
            <p>Loading your movie collection...</p>
          ) : movies.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Your database is currently empty! Use the form on the left to add your very first movie.</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No movies match your search: "{searchTerm}"</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredMovies.map(movie => (
                <div key={movie._id} style={styles.card}>
                  <div style={styles.posterPlaceholder}>🎬</div>
                  <div style={styles.cardContent}>
                    <h3 style={styles.movieTitle}>{movie.title}</h3>
                    <span style={styles.badge}>{movie.genre || 'General'}</span>
                    <p style={styles.description}>{movie.description || 'No description provided.'}</p>
                    {movie.year && <p style={styles.year}>Year: {movie.year}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#141414', color: '#fff', minHeight: '100vh', padding: '20px' },
  header: { borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' },
  status: { fontSize: '14px' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap', maxWidth: '1400px', margin: '0 auto' },
  sidebar: { flex: '1', minWidth: '300px', backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '10px', height: 'fit-content', border: '1px solid #333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: '#aaa', fontWeight: 'bold' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', outline: 'none', fontSize: '14px' },
  submitBtn: { padding: '12px', backgroundColor: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' },
  formFeedback: { textAlign: 'center', fontSize: '14px', margin: '5px 0 0 0' },
  mainContent: { flex: '3', minWidth: '350px' },
  searchContainer: { marginBottom: '20px' },
  searchInput: { width: '100%', padding: '12px 20px', fontSize: '16px', borderRadius: '25px', border: '1px solid #444', backgroundColor: '#1f1f1f', color: '#fff', boxSizing: 'border-box', outline: 'none' },
  emptyState: { padding: '40px', textAlign: 'center', backgroundColor: '#1f1f1f', borderRadius: '8px', border: '1px dashed #444' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1f1f1f', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', border: '1px solid #333' },
  posterPlaceholder: { height: '140px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' },
  cardContent: { padding: '15px' },
  movieTitle: { margin: '0 0 8px 0', fontSize: '18px' },
  badge: { backgroundColor: '#444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' },
  description: { color: '#bbb', fontSize: '13px', marginTop: '10px', lineHeight: '1.4' },
  year: { color: '#888', fontSize: '12px', marginTop: '10px' }
};

export default Home;