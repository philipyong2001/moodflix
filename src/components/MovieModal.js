import React from 'react';
import './MovieModal.css'; // Optional: Add specific styles for the modal if needed

const MovieModal = ({
  emotion,
  emotionEmoji,
  posterUrl,
  reason,
  onNextSuggestion,
  onRestart,
  hasNextSuggestion,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Recommended Movie</h2>
        <h3>
          Detected Emotion: {emotionEmoji} {emotion}
        </h3>
        <img src={posterUrl} alt="Movie Poster" className="movie-poster" />
        <p>{reason}</p>
        <div className="modal-buttons">
          {hasNextSuggestion && (
            <button onClick={onNextSuggestion}>Next Suggestion</button>
          )}
          <button onClick={onRestart}>Restart</button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;