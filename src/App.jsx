import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTopTrendingMovies, updateSearchCount } from "./appwrite";
import MoviePopup from "./components/MoviePopup";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [topTrendingMovies, setTopTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Debounce search input to avoid excessive API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}`,
        API_OPTIONS,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();

      setSelectedMovie(data);
    } catch (error) {
      console.error(`Error fetching movie details: ${error}`);
    }
  };

  useEffect(() => {
    const fetchMovies = async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        setMovieList(data.results || []);

        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage("Error fetching movies. Please try again later.");
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const loadTopTrendingMovies = async () => {
      try {
        const movies = await getTopTrendingMovies();
        setTopTrendingMovies(movies);
      } catch (error) {
        console.error("Error fetching top trending movies:", error);
      }
    };

    loadTopTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Image" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Love!
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {topTrendingMovies.length > 0 && (
          <section className="trending">
            <h2>Top Movies</h2>
            <ul>
              {topTrendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  className="cursor-pointer"
                  onClick={() => fetchMovieDetails(movie.movie_id)}
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={setSelectedMovie}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <MoviePopup
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}

export default App;
