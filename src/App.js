import { useEffect, useState, useRef } from 'react';
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import useLocalStorageState from './useLocalStorageState';
import useKey from './useKey';

const API_KEY = process.env.REACT_APP_API_KEY;

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('Interstellar');
  const [selectedId, setSelectedId] = useState();
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const { movies, isLoading, error } = useMovies(
    query,
    API_KEY,
    handleCloseMovie
  );

  function handleSelectMovie(id) {
    setSelectedId(currentId => (currentId === id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddMovie(movie) {
    const updatedWatched = [...watched, movie];
    setWatched(updatedWatched);
    handleCloseMovie();
  }
  function handleDeleteMovie(id) {
    const updatedWatched = watched.filter(movie => movie.imdbID !== id);
    setWatched(updatedWatched);
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

// Correctly destructure the children prop
function ErrorMessage({ children }) {
  return <p className="error">{children}</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  // keybinding enter to focus input
  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) {
      return; // If the input is focused, do nothing
    }
    setQuery('');
    inputEl.current.focus();
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched?.map(movie => (
        <WatchedMovies
          movie={movie}
          key={movie.imdbID}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovies({ movie, onDeleteMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteMovie(movie.imdbID)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen1(open => !open)}>
        {isOpen1 ? '–' : '+'}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.some(movie => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Actors: actors,
    Director: director,
    Plot: plot,
    imdbRating,
  } = movie;

  function handleAdd() {
    if (isWatched) {
      watched.map(movie => {
        if (movie.imdbID === selectedId) {
          movie.userRating = userRating;
        }
      });
      return;
    }
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      Year: movie.Year,
      Poster: poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ')[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddMovie(newWatchedMovie);
  }

  // keybinding esc to close movie details
  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error('Something went wrong with fetching movie details');
        }
        const data = await res.json();

        if (data.Response === 'False') {
          throw new Error('No movie found');
        }
        setMovie(data);
        setError(''); // Reset error state
      } catch (err) {
        console.log(err.message);
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovieDetails();
    return () => {
      controller.abort(); // Cleanup the fetch request
    };
  }, [selectedId]);

  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      {isLoading && <Loader />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                    defaultRating={watchedUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={() => handleAdd()}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
