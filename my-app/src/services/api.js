import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_THEMOVIEDB_API_KEY}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchOpenAIRecommendations = async (detectedEmotion, movieDetails) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that recommends movies based on emotions. Always respond in JSON format.',
          },
          {
            role: 'user',
            content: `Given the user's emotion "${detectedEmotion}" and the following trending movies: [${movieDetails.join(
              ', '
            )}], suggest three movies in the following JSON format: [{"id": "<movie_id>", "reason": "<reason why this movie suits the emotion>"}, ...]. The reasons should be written in a friendly and conversational tone, as if you are a close friend giving advice. Make them relatable and engaging.`,
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations from OpenAI:', error.response?.data || error.message);
    throw error;
  }
};