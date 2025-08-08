import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import type { SearchBarProps } from '../types/weather';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch, loading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !city.trim()}
        >
          Search
        </button>
      </form>
      
      <div className="location-button-container">
        <button 
          onClick={onLocationSearch}
          className="location-button"
          disabled={loading}
          title="Get weather for current location"
        >
          <MapPin size={20} />
          Current Location
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
