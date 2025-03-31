import React from 'react';
import './MovieCard.css'; // Import the CSS file for styling

const MovieCard = ({ movie }) => {
  const { title, poster_path, overview } = movie;
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={title} className="movie-poster" />
      <div className="movie-details">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-description">{overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;