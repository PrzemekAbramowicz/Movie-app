const MoviePopup = ({ movie, onClose }) => {
  if (!movie) {
    return null;
  }

  const {
    title,
    overview,
    poster_path,
    release_date,
    vote_average,
    original_language,
  } = movie;

  return (
    <div className="movie-popup" onClick={onClose}>
      <div
        className="movie-popup__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="movie-popup__close"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="movie-popup__grid">
          <img
            className="movie-popup__poster"
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                : "/no-poster.png"
            }
            alt={title}
          />

          <div>
            <h2 className="movie-popup__title">{title}</h2>

            <div className="movie-popup__meta">
              <span>
                Rating: {vote_average ? vote_average.toFixed(1) : "N/A"}
              </span>
              <span>Language: {original_language}</span>
              <span>
                Year: {release_date ? release_date.split("-")[0] : "N/A"}
              </span>
            </div>

            <p className="movie-popup__description">
              {overview || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePopup;
