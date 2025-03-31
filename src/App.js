import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EmotionMovieRecommender from './components/EmotionMovieRecommender'; // New component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/emotion-recommender" element={<EmotionMovieRecommender />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
