import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { fetchTrendingMovies, fetchOpenAIRecommendations } from '../services/api';
import MovieModal from './MovieModal'; // Import the new modal component
import './EmotionMovieRecommender.css';

const EmotionMovieRecommender = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    surprised: '😲',
    neutral: '😐',
    fearful: '😨',
    disgusted: '🤢',
  };

  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          alert('Unable to access the camera. Please check your browser permissions or use a supported browser.');
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
      alert('Your browser does not support camera access. Please use a modern browser that supports getUserMedia.');
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      startVideo();
    };

    loadModels();
  }, []);

  const handleVideoPlay = async () => {
    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const detectedEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setEmotion(detectedEmotion);
        clearInterval(interval); // Stop detection after finding an emotion
        stopVideo(); // Close the camera
        fetchMovieRecommendation(detectedEmotion);
      }
    }, 1000);
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
  };

  const restartProcess = () => {
    const suggestedMovieIds = suggestedMovies.map((movie) => parseInt(movie.id));
    const updatedTrendingMovies = trendingMovies.filter(
      (movie) => !suggestedMovieIds.includes(movie.id)
    );

    setTrendingMovies(updatedTrendingMovies);
    setShowModal(false);
    setEmotion(null);
    setSuggestedMovies([]);
    setCurrentSuggestionIndex(0);
    setPosterUrl('');
    startVideo();
  };

  const fetchMovieRecommendation = async (detectedEmotion) => {
    setLoading(true);
    try {
      const trendingMoviesData = await fetchTrendingMovies();
      setTrendingMovies(trendingMoviesData);

      const movieDetails = trendingMoviesData.map(
        (movie) => `{"id": "${movie.id}", "title": "${movie.title}", "overview": "${movie.overview}"}`
      );

      const data = await fetchOpenAIRecommendations(detectedEmotion, movieDetails);

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No suggestions returned from OpenAI API');
      }

      const rawContent = data.choices[0].message.content.trim();
      const cleanedContent = rawContent.replace(/```json|```/g, '');
      const suggestions = JSON.parse(cleanedContent);

      setSuggestedMovies(suggestions);
      setCurrentSuggestionIndex(0);

      const firstMovie = trendingMoviesData.find((movie) => movie.id === parseInt(suggestions[0].id));
      if (firstMovie) {
        setPosterUrl(`https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching movie recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNextSuggestion = () => {
    const nextIndex = (currentSuggestionIndex + 1) % suggestedMovies.length;
    setCurrentSuggestionIndex(nextIndex);

    const nextMovie = suggestedMovies[nextIndex];
    const movie = trendingMovies.find((movie) => movie.id === parseInt(nextMovie.id));
    if (movie) {
      setPosterUrl(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    }
  };

  return (
    <div className="emotion-recommender">
      <h1>Emotion-Based Movie Recommender</h1>
      {!showModal && (
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={handleVideoPlay}
          className="video-feed"
        />
      )}
      {loading && <p>Detecting emotion and fetching recommendation...</p>}
      {showModal && (
        <MovieModal
          emotion={emotion}
          emotionEmoji={emotionEmojis[emotion]}
          posterUrl={posterUrl}
          reason={suggestedMovies[currentSuggestionIndex]?.reason}
          onNextSuggestion={showNextSuggestion}
          onRestart={restartProcess}
          hasNextSuggestion={currentSuggestionIndex < suggestedMovies.length - 1}
        />
      )}
    </div>
  );
};

export default EmotionMovieRecommender;