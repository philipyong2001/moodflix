import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MovieList from '../components/MovieList';
import './HomePage.css'; // Import CSS for styling
import logo from '../assets/logo.png'; // Import the logo image (add your logo file to the assets folder)

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigate = () => {
    navigate('/emotion-recommender'); // Navigate to /emotion-recommender
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <img src={logo} alt="Moodflix Logo" className="homepage-logo" />
        {/* <h1 className="homepage-title">Moodflix</h1> */}
      </header>
      <button className="navigate-button" onClick={handleNavigate}>
        Go to Emotion Recommender
      </button>
      <h2>Trending Movies</h2>
      <MovieList />
    </div>
  );
};

export default HomePage;