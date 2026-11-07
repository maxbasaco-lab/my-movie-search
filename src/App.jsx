import { useState } from 'react';
import MovieCard from './MovieCard';
import './index.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const API_KEY = '59607af7';

  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setStatus('loading');
    setError(null);

    try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${API_KEY}`
    );
      
      if (!res.ok) throw new Error('Ошибка сети');

      const data = await res.json();

      if (data.Error) {
        setMovies([]);
        setStatus('error');
        setError('Ничего не найдено');
        return;
      }

      setMovies(data.Search || []);
      setStatus('success');
    } catch (err) {
      setMovies([]);
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <h1>Поиск фильмов</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Введите название фильма..."
        />
        <button 
          onClick={() => fetchMovies(query)} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      <div className="content">
        {status === 'idle' && (
          <p>Введите название фильма и нажмите «Найти».</p>
        )}

        {status === 'loading' && <p>Загрузка...</p>}

        {status === 'error' && (
          <div className="error">
            <p>Ошибка: {error}</p>
          </div>
        )}

        {status === 'success' && movies.length === 0 && (
          <p>Ничего не найдено по вашему запросу.</p>
        )}

        {status === 'success' && movies.length > 0 && (
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}