import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import type { SearchBarProps, LocationSuggestion } from '../types/weather';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch, onCoordinateSearch, loading }) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (location.trim().length >= 3) {
        searchLocations(location.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    setIsSearching(true);
    try {
      // Using Nominatim API for location search - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=&extratags=1`
      );
      
      if (response.ok) {
        const data: LocationSuggestion[] = await response.json();
        // Filter for cities, towns, villages, states, countries
        const filteredData = data.filter(item => 
          ['city', 'town', 'village', 'municipality', 'county', 'state', 'country'].includes(item.addresstype) ||
          ['place', 'administrative'].includes(item.class)
        );
        setSuggestions(filteredData);
        setShowSuggestions(filteredData.length > 0);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
      setLocation('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Extract city/location name from display_name
    const parts = suggestion.display_name.split(',');
    const locationName = parts[0].trim();
    
    setLocation(locationName);
    
    // Use coordinate search if available for more accurate results
    if (onCoordinateSearch && suggestion.lat && suggestion.lon) {
      onCoordinateSearch(parseFloat(suggestion.lat), parseFloat(suggestion.lon), locationName);
    } else {
      onSearch(locationName);
    }
    
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setLocation('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const formatSuggestion = (suggestion: LocationSuggestion) => {
    const parts = suggestion.display_name.split(',');
    const main = parts[0].trim();
    const secondary = parts.slice(1, 3).map(p => p.trim()).join(', ');
    return { main, secondary };
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter location (city, state, country)..."
            className="search-input"
            disabled={loading}
            autoComplete="off"
          />
          {location && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              disabled={loading}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !location.trim()}
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => {
            const { main, secondary } = formatSuggestion(suggestion);
            return (
              <div
                key={suggestion.place_id}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="suggestion-main">{main}</div>
                <div className="suggestion-secondary">{secondary}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading indicator for suggestions */}
      {isSearching && location.trim().length >= 3 && (
        <div className="suggestions-loading">
          Searching locations...
        </div>
      )}
      
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
