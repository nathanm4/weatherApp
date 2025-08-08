import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  MapPin
} from 'lucide-react';
import type { WeatherCardProps } from '../types/weather';
import './WeatherCard.css';

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, temperatureUnit }) => {
  const getTemperatureSymbol = () => temperatureUnit === 'metric' ? 'C' : 'F';
  
  const getWeatherIcon = (weatherMain: string) => {
    const iconSize = 64;
    const iconColor = '#fff';

    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun size={iconSize} color={iconColor} />;
      case 'clouds':
        return <Cloud size={iconSize} color={iconColor} />;
      case 'rain':
        return <CloudRain size={iconSize} color={iconColor} />;
      case 'snow':
        return <CloudSnow size={iconSize} color={iconColor} />;
      case 'thunderstorm':
        return <CloudLightning size={iconSize} color={iconColor} />;
      default:
        return <Cloud size={iconSize} color={iconColor} />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { main, weather, wind, sys, name } = weatherData;
  const currentWeather = weather[0];

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location">
          <MapPin size={20} />
          <h2>{name}, {sys.country}</h2>
        </div>
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(currentWeather.main)}
          </div>
          <div className="temperature">
            <span className="temp-value">{Math.round(main.temp)}°{getTemperatureSymbol()}</span>
            <div className="weather-description">
              <p>{currentWeather.description}</p>
              <p className="feels-like">Feels like {Math.round(main.feels_like)}°{getTemperatureSymbol()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <Thermometer size={20} />
          <div className="detail-content">
            <span className="detail-label">High / Low</span>
            <span className="detail-value">{Math.round(main.temp_max)}°{getTemperatureSymbol()} / {Math.round(main.temp_min)}°{getTemperatureSymbol()}</span>
          </div>
        </div>

        <div className="detail-item">
          <Wind size={20} />
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{Math.round(wind.speed * 3.6)} km/h</span>
          </div>
        </div>

        <div className="detail-item">
          <Droplets size={20} />
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <Gauge size={20} />
          <div className="detail-content">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{main.pressure} hPa</span>
          </div>
        </div>

        <div className="detail-item">
          <Sun size={20} />
          <div className="detail-content">
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{formatTime(sys.sunrise)}</span>
          </div>
        </div>

        <div className="detail-item">
          <Sun size={20} />
          <div className="detail-content">
            <span className="detail-label">Sunset</span>
            <span className="detail-value">{formatTime(sys.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
