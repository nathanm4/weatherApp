import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import type { WeatherData } from './types/weather';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather/city/${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `http://localhost:8080/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
          );
          
          if (!response.ok) {
            throw new Error('Location not found');
          }
          
          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          setWeatherData(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    // Load default city weather on app start
    fetchWeather('London');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
        <p>Get current weather conditions for any city</p>
      </header>

      <main className="app-main">
        <SearchBar 
          onSearch={fetchWeather}
          onLocationSearch={fetchWeatherByLocation}
          loading={loading}
        />

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && (
          <WeatherCard weatherData={weatherData} />
        )}
      </main>
    </div>
  );
}

export default App;
