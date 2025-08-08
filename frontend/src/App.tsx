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
  const [temperatureUnit, setTemperatureUnit] = useState<'metric' | 'imperial'>('metric');
  const [lastSearchQuery, setLastSearchQuery] = useState<{type: 'city', value: string} | {type: 'location', lat: number, lon: number} | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    setLastSearchQuery({type: 'city', value: city});
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather/city/${encodeURIComponent(city)}?units=${temperatureUnit}`);
      
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
          setLastSearchQuery({type: 'location', lat: latitude, lon: longitude});
          const response = await fetch(
            `http://localhost:8080/api/weather/coordinates?lat=${latitude}&lon=${longitude}&units=${temperatureUnit}`
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

  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
    setTemperatureUnit(newUnit);
    
    // Re-fetch weather data with new unit if we have previous search data
    if (lastSearchQuery) {
      if (lastSearchQuery.type === 'city') {
        fetchWeatherWithUnit(lastSearchQuery.value, newUnit);
      } else {
        fetchWeatherByLocationWithUnit(lastSearchQuery.lat, lastSearchQuery.lon, newUnit);
      }
    }
  };

  const fetchWeatherWithUnit = async (city: string, units: 'metric' | 'imperial') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather/city/${encodeURIComponent(city)}?units=${units}`);
      
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

  const fetchWeatherByLocationWithUnit = async (lat: number, lon: number, units: 'metric' | 'imperial') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/weather/coordinates?lat=${lat}&lon=${lon}&units=${units}`
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
  };

  useEffect(() => {
    // Load default city weather on app start
    const loadDefaultWeather = async () => {
      await fetchWeatherWithUnit('London', 'metric');
      setLastSearchQuery({type: 'city', value: 'London'});
    };
    loadDefaultWeather();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
        <p>Get current weather conditions for any city</p>
        <div className="temperature-toggle">
          <button 
            className={`toggle-btn ${temperatureUnit === 'metric' ? 'active' : ''}`}
            onClick={toggleTemperatureUnit}
          >
            °C
          </button>
          <button 
            className={`toggle-btn ${temperatureUnit === 'imperial' ? 'active' : ''}`}
            onClick={toggleTemperatureUnit}
          >
            °F
          </button>
        </div>
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
          <WeatherCard weatherData={weatherData} temperatureUnit={temperatureUnit} />
        )}
      </main>
    </div>
  );
}

export default App;
