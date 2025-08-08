export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherCardProps {
  weatherData: WeatherData;
  temperatureUnit: 'metric' | 'imperial';
}

export interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  onCoordinateSearch?: (lat: number, lon: number, locationName: string) => void;
  loading: boolean;
}

export interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  addresstype: string;
}
