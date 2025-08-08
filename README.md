# Weather App

A full-stack weather application built with React (frontend) and Spring Boot (backend) that provides real-time weather information with intelligent location search.

## Features

- 🌡️ **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- 🌍 **Smart Location Search**: Intelligent autocomplete using OpenStreetMap
- 📍 **Current Location**: Get weather for your current GPS location
- 🎨 **Modern UI**: Beautiful gradient design with weather icons
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚡ **Real-time**: Live weather data from OpenWeatherMap API

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your OpenWeather API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)

5. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Environment Variables

The application uses environment variables for configuration:

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `OPENWEATHER_API_BASE_URL`: OpenWeatherMap API base URL (optional)

## Security

- API keys are stored in `.env` files (not committed to version control)
- Environment variables can be overridden by system environment variables
- CORS is configured for development (localhost:5173)

## APIs Used

- **OpenWeatherMap API**: Weather data
- **OpenStreetMap Nominatim API**: Location geocoding (free, no API key required)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring WebFlux (reactive HTTP client)
- Maven

### Frontend
- React 19
- TypeScript
- Vite
- Lucide React (icons)

## Development

The application supports hot reloading in development mode. Changes to the frontend will automatically refresh the browser, and backend changes will restart the server automatically with Spring Boot DevTools.
